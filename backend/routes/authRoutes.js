const express = require('express')
const prisma = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretkey = '1234'
const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body
        const userExist = await prisma.patient.findUnique({
            where: {
                email
            }
        });
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashPatientPassword = await bcrypt.hash(password, 10);

        if (role !== 'doctor') {
            const user = await prisma.patient.create({
                data: {
                    username,
                    email,
                    password: hashPatientPassword,
                    role: role || 'patient', // Default to patient if role is not provided
                    doctorId: null, // Initially no doctor
                    walletId: null, // Initially no wallet
                }
            });

            return res.json({ message: 'Patient created successfully' });
        }
        const { name, education, experience, qualification, contact } = req.body;
        const doctorExist = await prisma.doctor.findUnique({
            where: {
                email
            }
        });
        if (doctorExist) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }
        console.log(name, education, experience, qualification, contact)
        const hashDoctorPassword = await bcrypt.hash(password, 10);
        const doctor = await prisma.doctor.create({
            data: {
                name,
                education,
                experience,
                qualification,
                contact,
                username,
                email,
                password: hashDoctorPassword,
                role: 'doctor',
            }
        });
        return res.json({ message: 'Doctor created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/login', async (req, res) => {
    const { email, password, rolename } = req.body;
    // console.log(req.body)
    try {
        console.log({ email, password, rolename});
        const user = rolename === 'doctor' ? await prisma.doctor.findUnique({
            where: {
                email
            }
        }) : await prisma.patient.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, secretkey, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({ message: 'Login successful', token ,user:{username:user.username,email:user.email,role:user.rolename,id:user.id},walletId:user.walletId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });

    }
})

module.exports = router
