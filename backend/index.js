const express = require('express');
const app = express();
const cors=require('cors')
const cookieParser = require('cookie-parser');

const authRoute=require('./routes/authRoutes')
const walletRoute=require('./routes/walletRoute');
const doctorRouter=require('./routes/doctorRoute')
const appointmentRouter=require('./routes/appointmentRoute')
const patientRouter=require('./routes/patientRoute')

app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/wallet',walletRoute)
app.use('/api/doctor',doctorRouter)
app.use('/api/appointment',appointmentRouter)
app.use('/api/patient',patientRouter)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})