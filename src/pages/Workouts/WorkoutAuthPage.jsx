import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BACKEND_URL } from "../../utils/config";
import useAuth from '../../hooks/useAuth';  
import api from '../../utils/api';
import DynamicHeading from '../../components/Shared/DynamicHeading';

const WorkoutAuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your workout token...');
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const { storeAuthData } = useAuth();
    const verificationAttempted = useRef(false);

    useEffect(() => {
        if (!token) {
            setMessage('Error: No token found in the URL.');
            setTimeout(() => navigate('/login'), 9000); 
            return;
        }

        if (verificationAttempted.current) {
            return;
        }

        verificationAttempted.current = true;

        // console.log('Token from URL:', token);

            const verifyToken = async () => {
            try {
                const response = await api.post(`${BACKEND_URL}/api/verify-workout-token`, { token });
                
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
                    }, 1000); 
                } else {
                    setMessage('Token verified, but authentication failed. Please log in.');
                    setTimeout(() => navigate('/login'), 1000);
                }
            } catch (error) {
                console.error('Token verification error:', error);
                setMessage('Error: Token verification failed. This link may be invalid or expired.');
                setTimeout(() => navigate('/login'), 1000);
            }
        };

        verifyToken();
        
    }, [token, navigate, storeAuthData]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-customGray/30 to-white"
        >
            <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
                <DynamicHeading
                    text="Workout Link"
                    className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest"
                />
                <p className="text-lg text-customWhite mb-6">
                    {message}
                </p>
               {message.includes("Success!") && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brightYellow"></div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default WorkoutAuthPage;