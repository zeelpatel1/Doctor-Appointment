import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Book() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState([]);

    // Function to format date
    const formatDate = (date) => {
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = new Date(date).toLocaleDateString(undefined, options);
            const time = new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            return { formattedDate, time };
        } catch (error) {
            console.error('Error formatting date:', error);
            return { formattedDate: 'Invalid date', time: 'Invalid time' };
        }
    };

    // Fetch appointment details
    const getDoctor = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/patient/book/${id}`, { withCredentials: true });
            setAppointment(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDoctor();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Section */}
            <header className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">
                <h1 className="text-2xl font-semibold">Book an Appointment</h1>
            </header>

            {/* Appointment Cards */}
            <main className="p-6 space-y-6">
                {appointment && appointment.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointment.map((x, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                                <div className="space-y-4 text-gray-700">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-blue-600">
                                            {formatDate(x.date).formattedDate}
                                        </h2>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(x.startTime).time} - {formatDate(x.endTime).time}
                                        </span>
                                    </div>
                                    <p>
                                        <strong>Max Patients:</strong> {x.maxPatient}
                                    </p>
                                    <p>
                                        <strong>Current Patients:</strong> {x.currentPatient}
                                    </p>
                                </div>
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => {
                                        navigate(`/book-appointment/${x.id}`, {
                                            state: {
                                                startTime: formatDate(x.startTime).time,
                                                endTime: formatDate(x.endTime).time,
                                                date: formatDate(x.date).formattedDate,
                                                doctid: id,
                                            },
                                        });
                                    }}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600">
                        <h2 className="text-xl">No Appointments Available</h2>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Book;
