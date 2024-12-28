import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function RegisterPatient() {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('patient')

    const registerHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', { email, username, password, role }, { withCredentials: true })
            if (res.data) {
                console.log(res.data)
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm mx-auto">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Register for Patient</h2>
                <form className="space-y-6" onSubmit={registerHandler}>

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            readOnly
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPatient
