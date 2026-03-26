import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './auth.scss';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email is required');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/forgot-password', { email });
            toast.success('OTP sent to your email');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            toast.error('OTP and New Password are required');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/reset-password', { email, otp, newPassword });
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
                    <p>{step === 1 ? 'Enter your email to receive an OTP.' : 'Enter the OTP sent to your email and your new password.'}</p>
                </div>

                <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="auth-form">
                    {step === 1 ? (
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>OTP</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Reset Password'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Remembered your password?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
