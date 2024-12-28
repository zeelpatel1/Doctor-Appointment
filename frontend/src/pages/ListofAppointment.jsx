import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ListofAppointment() {

    const { Id } = useParams()
    const [appointments, setAppointments] = useState([])

    const getbyId = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/appointment/${Id}`, { withCredentials: true });
            // console.log(res.data)
            setAppointments(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    // Function to format the date and time
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(date).toLocaleString(undefined, options);
    }

    // Delete appointment
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/appointment/delete/${id}`, { withCredentials: true })
            getbyId();
            alert('Appointment deleted successfully');
        } catch (error) {
            console.log(error)
            alert('Error deleting appointment');
        }
    }

    useEffect(() => {
        getbyId()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 bg-blue-600 text-white shadow-md">
                <h1 className="text-3xl font-semibold">List of Appointments</h1>
            </div>
            <div className="p-6">
                {
                    appointments.length > 0 ? (
                        <div className="space-y-6">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className={`px-4 py-2 text-white rounded-lg ${appointment.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleDelete(appointment.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                                        <p><strong>Start Time:</strong> {formatDate(appointment.startTime)}</p>
                                        <p><strong>End Time:</strong> {formatDate(appointment.endTime)}</p>
                                        <p><strong>Max Patients:</strong> {appointment.maxPatient}</p>
                                        <p><strong>Current Patients:</strong> {appointment.currentPatient}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-xl text-gray-500">No appointments found</div>
                    )
                }
            </div>
        </div>
    )
}

export default ListofAppointment
