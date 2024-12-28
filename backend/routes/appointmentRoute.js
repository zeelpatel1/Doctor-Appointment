const express = require('express')
const router = express.Router()
const prisma = require('../config/db')
const authMiddleware = require('../middleware/authMiddleware')

const parseTime = (date, time) => {

    if (!time) {
        return new Date(`${date}T00:00:00Z`).toISOString();
    }

    const combine = `${date} ${time} UTC`
    const parsedDate = new Date(combine);
    if (isNaN(parsedDate)) {
        console.error("Invalid time format");
    }
    return parsedDate.toISOString();
}

router.post('/create', authMiddleware, async (req, res) => {
    const role = req.user.role;
    try {
        if (role !== 'doctor') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { startTime, endTime, date, status = 'available', currentPatient = 0,priceString} = req.body;
        let price=Number(priceString)
        let { maxPatient } = req.body;

        maxPatient = Number(maxPatient);

        const doctorId = req.user.id;

        console.log(doctorId);
        if (!doctorId) return res.status(400).json({ error: 'Doctor not found' });

        const parsedDate = parseTime(date);
        const parsedStartTime = parseTime(date, startTime);
        const parsedEndTime = parseTime(date, endTime);

        const appointment = await prisma.appointment.create({
            data: {
                startTime: parsedStartTime,
                endTime: parsedEndTime,
                date: parsedDate,
                status: status,
                maxPatient,
                currentPatient,
                price,
                // patientId: null, // Initially no patient is assigned
                doctor: {
                    connect: {
                        id: doctorId,
                    },
                },
            },
        });
        return res.status(200).json({ appointment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/all', authMiddleware, async (req, res) => {
    const role = req.user.role;
    try {
        if (role !== 'doctor') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: req.user.id,
            },
        });

        return res.status(200).json({ appointments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/:Id', authMiddleware, async (req, res) => {
    const doctorId = req.params.Id;
    try {
        // Make sure the doctor can view their own appointments only
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: Number(doctorId),
            },
        });

        return res.json(appointments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const role = req.user.role;
    const doctorId = req.user.id;

    try {
        const { id } = req.params;

        if (role !== 'doctor') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Only the doctor who created the appointment can delete it
        await prisma.appointment.delete({
            where: {
                id: Number(id),
                doctorId: doctorId, // Only the doctor can delete their own appointment
            },
        });

        return res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router