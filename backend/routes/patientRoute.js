const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')

const prisma = require('../config/db')
const router = express.Router()


router.get('/book/:id', authMiddleware, async (req, res) => {
    const id = req.params.id
    // console.log(id)
    try {
        const doctorTiming = await prisma.appointment.findMany({
            where: { doctorId: Number(id) }
        })
        return res.json(doctorTiming)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.post('/confirm/:id', authMiddleware, async (req, res) => {
    const appointmentId = Number(req.params.id);
    console.log(appointmentId)
    const { doctid, userName, amount } = req.body;

    try {
        // Find the appointment
        const appointment = await prisma.appointment.findFirst({
            where: { id: appointmentId },
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Fetch the patient
        const patient = await prisma.patient.findFirst({
            where: { username: userName },
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check if the patient already has a confirmed appointment
        const existingAppointment = await prisma.appointment.findFirst({
            where: { patientId: patient.id, status: 'booked', id: appointmentId },
        });
        console.log(existingAppointment)

        if (existingAppointment) {
            return res.status(400).json({ message: 'You already have a confirmed appointment.' });
        }

        // Fetch the patient's wallet
        const wallet = await prisma.wallet.findFirst({
            where: { patient: { id: patient.id } },
        });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for patient' });
        }

        // Check if the wallet has enough balance
        if (wallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance in wallet' });
        }

        // Deduct the specified amount from the wallet
        await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: wallet.balance - amount }, // Deduct amount
        });

        // Create a debit transaction record
        const transaction = await prisma.transaction.create({
            data: {
                amount,
                type: 'debit',
                walletId: wallet.id,
            },
        });

        if (appointment.currentPatient >= appointment.maxPatient) {
            return res.status(400).json({ message: 'Cannot confirm appointment. Max patient limit reached.' });
        }

        // Check if it's the patient's first visit to the doctor to apply the discount
        const visited = await prisma.visitedDoctor.findFirst({
            where: {
                patientId: patient.id,
                doctorId: Number(doctid),
            },
        });
        console.log(visited)

        let discountApplied = false;
        let finalPrice = appointment.price;

        // Apply a discount if it's the first visit
        if (!visited) {
            discountApplied = true;
            finalPrice = appointment.price * 0.9; // Apply 10% discount
        }

        // Record the patient's visit to the doctor
        const updateVisite = await prisma.visitedDoctor.create({
            data: {
                patientId: patient.id,
                doctorId: Number(doctid),
                fistVisit: true,
            },
        });

        // Update the appointment details and set it as booked
        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointment.id },
            data: {
                patientId: patient.id,
                currentPatient: appointment.currentPatient + 1,
                maxPatient: appointment.maxPatient - 1,
                status: 'booked', // Mark the appointment as booked
            },
        });

        return res.status(200).json({
            message: 'Appointment confirmed successfully',
            appointment: updatedAppointment,
            deductedAmount: amount,
            finalPrice, // Return the final price after discount
            remainingBalance: wallet.balance - amount, // Return remaining balance after deduction
            transaction, // Include transaction data in the response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while processing the request' });
    }
});


router.post('/book/:id', authMiddleware, async (req, res) => {
    const appointmentId = Number(req.params.id);
    const { doctid, userName } = req.body;

    try {
        // Fetch the appointment details
        const appointment = await prisma.appointment.findFirst({
            where: { id: appointmentId },
        });

        console.log(appointmentId)


        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Fetch the patient by username
        const patient = await prisma.patient.findFirst({
            where: { username: userName },
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check if the patient has visited the doctor before
        const visited = await prisma.visitedDoctor.findFirst({
            where: {
                patientId: patient.id,
                doctorId: Number(doctid),
            },
        });
        // console.log(visited)

        let discountApplied = false;
        let finalPrice = appointment.price;

        // Apply discount if it's the first visit
        if (!visited) {
            discountApplied = true;
            finalPrice = appointment.price * 0.9; // 10% discount
            // Record the visit to the doctor
            // await prisma.visitedDoctor.create({
            //     data: {
            //         patientId: patient.id,
            //         doctorId: Number(doctid),
            //         fistVisit: true,
            //     },
            // });
        }

        // Check if the patient already has an appointment with this doctor
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                doctorId: Number(doctid),
                patientId: patient.id,
                id: appointmentId
            },
        });
        // console.log(existingAppointment)

        if (existingAppointment) {
            return res.status(400).json({
                message: 'Appointment already exists with this doctor.',
                appointment: existingAppointment,
            });
        }

        return res.status(200).json({
            message: 'Price calculation successful',
            discountApplied,
            finalPrice,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Something went wrong while processing the request',
        });
    }
});





router.get('/', authMiddleware, async (req, res) => {
    const role = req.user.role
    const patientId = req.user.id
    try {
        if (role !== 'patient') {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const patient = await prisma.patient.findUnique({
            where: {
                id: patientId
            }
        })
        return res.status(200).json({ patient })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/appointments/:id', authMiddleware, async (req, res) => {
    const role = req.user.role
    const patientId = req.user.id
    const { id } = req.params
    try {
        if (role !== 'patient') {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: id,
            }
        })
        if (prisma.appointment.currentPatient >= prisma.appointment.maxPatient) {
            return res.status(400).json({ error: 'Fully booked' })
        }
        const updateAppointment = await prisma.appointment.update({
            where: {
                id: id
            },
            data: {
                currentPatient: prisma.appointment.currentPatient + 1,
                patient: {
                    connect: {
                        id: patientId
                    }
                }
            }
        })
        return res.status(200).json({ appointments })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router