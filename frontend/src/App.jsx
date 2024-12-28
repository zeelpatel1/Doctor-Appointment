import React from 'react'
import RegisterPatient from './pages/RegisterPatient'
import RegisterDoctor from './pages/RegisterDoctor'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Wallet from './pages/Wallet'
import Appointment from './pages/Appointment'
import ListofAppointment from './pages/ListofAppointment'
import Book from './pages/Book'
import BookAppointment from './pages/BookAppointment'
import { useSelector } from 'react-redux'

function App() {

  const authenticated = useSelector((state) => state.authSlice.isAuthenticated)
  const userRole = useSelector((state) => state.authSlice.role);

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register/patient" element={<RegisterPatient />} />
        <Route path="/register/doctor" element={<RegisterDoctor />} />
        <Route path='/login' element={< Login />} />


        <Route
          path="/dashboard"
          element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/wallet"
          element={authenticated ? (userRole === 'patient' ? <Wallet /> : <Navigate to="/dashboard" />): <Navigate to='/login'/>}
        />
        <Route
          path="/appointment"
          element={authenticated ? (userRole === 'doctor' ? <Appointment /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />}
        />
        <Route
          path="/allAppointment/:Id"
          element={authenticated ? (userRole === 'doctor' ? <ListofAppointment /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />}
        />
        <Route
          path="/book/:id"
          element={authenticated ? (userRole === 'patient' ? <Book /> : <Navigate to="/dashboard" />) : <Navigate to='/login'/> }
        />
        <Route
          path="/book-appointment/:id"
          element={authenticated ? (userRole === 'patient' ? <BookAppointment /> : <Navigate to="/dashboard" />) : <Navigate to='/login'/>}
        />
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
