const jwt=require('jsonwebtoken')
const secretkey='1234'

const authMiddleware=(req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }
    try{
        const decoded=jwt.verify(token,secretkey)
        req.user=decoded
        // console.log(req.user)
        next()
    }
    catch(err){
        return res.status(401).json({message:'Unauthorized'})
    }
}
module.exports=authMiddleware