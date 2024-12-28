import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterDoctor() {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('doctor');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('');
    const [qualification, setQualification] = useState('');
    const [contact, setContact] = useState('');

    const registerDoctor = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', { email, username, password, role, name, education, experience, qualification, contact }, { withCredentials: true });
            if(res.data) {
                console.log(res.data);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg mx-auto">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Register as Doctor</h2>

                <form className="space-y-6" onSubmit={registerDoctor}>

                    {/* Username and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Password and Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700">Role</label>
                            <input
                                type="text"
                                value="Doctor"
                                readOnly
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                            />
                        </div>
                    </div>

                    {/* Name, Education, Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700">Education</label>
                            <input
                                type="text"
                                value={education}
                                onChange={(e) => setEducation(e.target.value)}
                                placeholder="Enter your education"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Qualification and Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Qualification</label>
                            <input
                                type="text"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                placeholder="Enter your qualification"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700">Contact</label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Enter your contact number"
                                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default RegisterDoctor;
