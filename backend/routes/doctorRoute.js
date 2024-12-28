const express=require('express')
const router=express.Router()
const prisma=require('../config/db')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/',authMiddleware,async(req,res)=>{
    try {
        const doctorId=req.user.id
        if(!doctorId) return res.status(400).json({error:'Doctor not found'})
        const doctor=await prisma.doctor.findUnique({
            where:{
                id:doctorId
            }
        })
        if(!doctor) return res.status(400).json({error:'Doctor not found'})
        return res.status(200).json(doctor)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal server error'})
    }
})

router.get('/all',authMiddleware,async(req,res)=>{
    try {
        
        const role=req.user.role
        console.log(role)
        if(role==='doctor'){
            const doctorId=req.user.id
            // console.log(doctorId)
            const doctor=await prisma.doctor.findMany({
                where:{
                    id:{
                        not:doctorId
                    }
                },
            })
            return res.status(200).json(doctor)
        }

        const doctors=await prisma.doctor.findMany()
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:'Internal server error'})
    }
})



module.exports=router