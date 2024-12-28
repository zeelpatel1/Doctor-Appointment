import React from 'react'
import { useNavigate } from 'react-router-dom'

function Welcome() {

    const navigate = useNavigate()

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm mx-auto">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Welcome!</h2>
                <p className="text-center text-gray-600 mb-6">Please select your role or log in.</p>

                <div className="space-y-4">
                    {/* Patient Button */}
                    <button
                        onClick={() => navigate('/register/patient')}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition duration-300 hover:scale-105"
                    >
                        I am a Patient
                    </button>

                    {/* Doctor Button */}
                    <button
                        onClick={() => navigate('/register/doctor')}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transform transition duration-300 hover:scale-105"
                    >
                        I am a Doctor
                    </button>

                    {/* Login Button */}
                    <button
                    onClick={()=>navigate('/login')}
                        className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transform transition duration-300 hover:scale-105"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Welcome
