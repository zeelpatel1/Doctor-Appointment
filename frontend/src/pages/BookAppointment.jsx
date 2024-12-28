import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
    const userName = useSelector((state) => state.authSlice.user);
    const location = useLocation();
    const [confirm, setConfirm] = useState(false);
    const { startTime, endTime, date, doctid } = location.state || {};
    const [price, setPrice] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchDiscount = async (appointmentId) => {
        try {
            const res = await axios.post(
                `http://localhost:3000/api/patient/book/${appointmentId}`,
                { doctid, userName },
                { withCredentials: true }
            );
            setPrice(res.data.finalPrice);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while fetching the discount.");
            console.error(error);
        }
    };

    const handleConfirm = async (appointmentId) => {
        try {
            const res = await axios.post(
                `http://localhost:3000/api/patient/confirm/${appointmentId}`,
                { doctid, userName, amount: price },
                { withCredentials: true }
            );
            if (res.data) {
                setConfirm(true);
                alert('Appointment Booked')
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while confirming the appointment.");
            console.error(error);
        }
    };

    useEffect(() => {
        if (!confirm) {
            fetchDiscount(id);
        }
    }, [id, confirm]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 max-w-md bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Appointment Details</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-gray-700 font-medium">Username:</label>
                        <p className="text-gray-900">{userName}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-gray-700 font-medium">Start Time:</label>
                        <p className="text-gray-900">{startTime}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-gray-700 font-medium">End Time:</label>
                        <p className="text-gray-900">{endTime}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-gray-700 font-medium">Date:</label>
                        <p className="text-gray-900">{date}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-gray-700 font-medium">Payment:</label>
                        <p className="text-green-600 font-semibold">${price}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        onClick={() => window.history.back()}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handleConfirm(id)}
                        className={`px-4 py-2 rounded-lg text-white transition ${confirm ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        disabled={confirm}
                    >
                        {confirm ? 'Appointment Confirmed' : 'Confirm Appointment'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookAppointment;
