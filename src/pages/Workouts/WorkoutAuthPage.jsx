import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BACKEND_URL } from "../../utils/config";
import useAuth from '../../hooks/useAuth';  
import axios from 'axios';

const WorkoutAuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your workout token...');
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const { login, storeAuthData } = useAuth();

    useEffect(() => {
        const verifyToken = async () => {
        if (!token) {
            setMessage('Error: No token found in the URL.');
            setTimeout(() => navigate('/login'), 3000); 
            return;
        }
            try {
                const response = await axios.post(`${BACKEND_URL}/api/verify-workout-token`, { token });
                
                const { jwt, user } = response.data; 

                if (jwt && user) {
                    storeAuthData(jwt, user); 
                    setMessage('Success! Redirecting you to your account...');

                    setTimeout(() => {
                        if (user.mustChangePassword) {
                            navigate("/change-password-first-login");
                        } else {
                            navigate("/profile"); 
                        }
                    }, 1500); 
                } else {
                    setMessage('Token verified, but authentication failed. Please log in.');
                    setTimeout(() => navigate('/login'), 3000);
                }

            } catch (error) {
                console.error('Token verification error:', error);
                setMessage('Error: Token verification failed. This link may be invalid or expired.');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        verifyToken();
    }, [token, navigate, login, storeAuthData]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-limeGreen text-white">
                <h1 className="text-3xl font-bold text-center text-brightYellow mb-6 font-higherJump">
                    Workout Link Authentication
                </h1>
                <p className="text-center text-logoGray mb-6">
                    {message}
                </p>
               {message.includes("Success!") && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brightYellow"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutAuthPage;