const express = require('express')
const router = express.Router()
const prisma = require('../config/db')

const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, async (req, res) => {
    const user = req.user.id
    console.log(user)
    if (req.user.role !== 'patient') {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const walletExists = await prisma.wallet.findFirst({
            where: { patient: { id: user } }
        })
        console.log(walletExists)
        if (walletExists) {
            return res.status(400).json({ message: 'Wallet already exists', walletExists })
        }

        const wallet = await prisma.wallet.create({
            data: {
                balance: 0,
                patient: {
                    connect: { id: user }
                }
            }
        })
        await prisma.patient.update({
            where: {
                id: user
            },
            data: {
                walletId: wallet.id
            }
        })
        return res.json({ message: 'Wallet created successfully', wallet })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

router.get('/', authMiddleware, async (req, res) => {
    const patientId = req.user.id
    console.log(patientId)
    try {
        const wallet = await prisma.wallet.findFirst({
            where: {
                patient: {
                    id: patientId
                }
            }
        })
        return res.json(wallet)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/top-up', authMiddleware, async (req, res) => {
    try {
        let { amount } = req.body

        amount = Number(amount)

        if (isNaN(amount)) {
            return res.status(400).json({ message: 'Invalid amount, must be a number' });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid top-up amount' });
        }
        if (req.user.role !== 'patient') {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        // console.log(`user id: ${req.user.id}`)
        const wallet = await prisma.patient.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                walletId: true
            }
        })
        console.log(wallet)
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' })
        }
        await prisma.wallet.update({
            where: {
                id: wallet.walletId
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        })

        const transaction = await prisma.transaction.create({
            data: {
                amount,
                type: 'credit',
                walletId: wallet.walletId
            }
        })
        return res.json({ message: 'Top-up successful', transaction })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

// router.post('/deduct', authMiddleware, async (req, res) => {
//     try {
//         const { amount } = req.body
//         const user = req.user.id
//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: 'Invalid deduction amount' });
//         }
//         if (req.user.role !== 'patient') {
//             return res.status(401).json({ message: 'Unauthorized' })
//         }
//         const wallet = await prisma.patient.findUnique({
//             where: {
//                 id: user
//             },
//             select: {
//                 walletId: true
//             }
//         })
//         if (!wallet) {
//             return res.status(404).json({ message: 'Wallet not found' })
//         }
//         const walletData = await prisma.wallet.findUnique({
//             where: {
//                 id: wallet.walletId
//             }
//         })
//         if (walletData.balance < amount) {
//             return res.status(400).json({ message: 'Insufficient balance' })
//         }
//         await prisma.wallet.update({
//             where: {
//                 id: wallet.walletId
//             },
//             data: {
//                 balance: {
//                     decrement: amount
//                 }
//             }
//         })
//         const transaction = await prisma.transaction.create({
//             data: {
//                 amount,
//                 type: 'debit',
//                 walletId: wallet.walletId
//             }
//         })
//         return res.json({ message: 'Deduction successful', transaction })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ message: 'Internal server error' })
//     }
// })

router.post('/history', authMiddleware, async (req, res) => {
    try {
        const wallet = await prisma.patient.findUnique({
            where: {
                id: req.user.id, // Assuming you store the user ID in `req.user.id`
            },
            select: {
                walletId: true, // Fetch the walletId associated with the user
            }
        });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found for user' });
        }

        // Fetch transactions for the logged-in user
        const transactions = await prisma.transaction.findMany({
            where: {
                walletId: wallet.walletId, // Filter transactions by walletId
            },
            orderBy: {
                date: 'desc', // Sort by date (most recent first)
            },
        });

        return res.json(transactions); // Return the user's transactions
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router