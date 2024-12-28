import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loading, token, error, isAuthenticated, role, user, walletid, doctid } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rolename, setRolename] = useState('patient');
    const [errorMessage, setErrorMessage] = useState(''); // Error state to display error message
    const [isSubmitting, setIsSubmitting] = useState(false); // Handle loading state

    const login = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!email || !password) {
            setErrorMessage('Please fill in both fields');
            return;
        }

        setIsSubmitting(true);
        dispatch(loading(true));

        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', { email, password, rolename }, { withCredentials: true });

            if (res.data) {
                dispatch(token(res.data.token));  // Store the token
                dispatch(isAuthenticated(true));  // Set user as authenticated
                dispatch(user(res.data.user.username));  // Store the username
                dispatch(role(rolename));  // Store the user role
                dispatch(doctid(res.data.user.id));

                // Dispatch walletId if role is patient
                if (rolename === 'patient' && res.data.walletId) {
                    dispatch(walletid(res.data.walletId));  // Store walletId
                }

                dispatch(error(null));  // Reset error state
                navigate('/dashboard');
            } else {
                setErrorMessage('Invalid credentials or unexpected error');
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            dispatch(loading(false));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h2>

                {/* Display error message if any */}
                {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

                <form onSubmit={login} className="space-y-4">

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm text-gray-700">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Email"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm text-gray-700">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Password"
                        />
                    </div>

                    {/* Role Select */}
                    <div>
                        <label className="block text-sm text-gray-700">Role</label>
                        <select
                            value={rolename}
                            onChange={(e) => setRolename(e.target.value)}
                            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Role"
                        >
                            <option value="doctor">Doctor</option>
                            <option value="patient">Patient</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 text-white rounded-lg font-semibold ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                        <a href="#" className="text-blue-600 text-sm">Forgot your password?</a>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;
