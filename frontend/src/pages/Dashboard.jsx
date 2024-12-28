import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { walletid, logout, doctid } from '../redux/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');

    const username = useSelector((state) => state.authSlice.user);
    const rolename = useSelector((state) => state.authSlice.role);
    const doctid = useSelector((state) => state.authSlice.doct);

    const createWallet = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/wallet/create', {}, { withCredentials: true });
            if (res.data) {
                dispatch(walletid(res.data.wallet.id));
            }
        } catch (error) {
            console.log(error.response.data.message);
        }
    };

    const handleBook = (id) => {
        navigate(`/book/${id}`);
    };

    useEffect(() => {
        if (rolename === 'patient') {
            createWallet();
        }
        getallDoctors();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    const getallDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/doctor/all', { withCredentials: true });
            setDoctors(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const filterDoctor = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.education.toLowerCase().includes(search.toLowerCase())
    );

    const goWallet = () => {
        navigate('/wallet');
    };

    const handleAppointment = () => {
        navigate('/appointment');
    };

    const getbyId = (Id) => {
        navigate(`/allAppointment/${Id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col">

            {/* Header Section */}
            <div className="flex justify-between items-center p-6 bg-white shadow-lg rounded-b-lg">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-semibold text-gray-800">{rolename === 'doctor' ? 'Doctor Dashboard' : 'Patient Dashboard'}</h1>
                </div>
                <div className="flex items-center space-x-6">
                    <span className="text-lg font-medium text-gray-800">Welcome, {username}!</span>
                    <img
                        src="https://via.placeholder.com/40"
                        alt="User Avatar"
                        onClick={() => {
                            if (rolename === 'doctor') {
                                getbyId(doctid);
                            } else {
                                console.log("Access denied: Not a doctor");
                            }
                        }}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer"
                    />
                    {rolename === 'patient' ? (
                        <button
                            onClick={goWallet}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
                        >
                            Wallet
                        </button>
                    ) : (
                        <button
                            onClick={handleAppointment}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
                        >
                            Create Appointment
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Search Box */}
            <div className="p-6">
                <div className="relative max-w-lg mx-auto">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search for doctors..."
                    />
                    <span className="absolute right-6 top-3 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Doctor Cards */}
            {doctors.length > 0 ? (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterDoctor.map((doctor, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
                            <div className="flex items-center space-x-4">
                                <img src="https://via.placeholder.com/50" alt="Doctor Avatar" className="w-16 h-16 rounded-full border-2 border-gray-300" />
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-800">{doctor.name}</h1>
                                    <p className="text-sm text-gray-500">{doctor.education}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                {rolename === 'patient' ? (
                                    <button
                                        onClick={() => handleBook(doctor.id)}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                                    >
                                        Book Appointment
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => getbyId(doctor.id)}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                                    >
                                        Check Slots
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 text-center text-gray-600">
                    <h2 className="text-xl">No doctors available at the moment.</h2>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
