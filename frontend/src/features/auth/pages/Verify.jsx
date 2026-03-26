import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { verifyEmail } from '../service/auth.api'
import './auth.scss'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying') 
    const [message, setMessage] = useState('Verifying your email...')
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')
        if (token) {
            handleVerify(token)
        } else {
            setStatus('error')
            setMessage('Invalid verification link')
        }
    }, [searchParams])

    const handleVerify = async (token) => {
        try {
            await verifyEmail(token)
            setStatus('success')
        } catch (err) {
            setStatus('error')
            setMessage(err.response?.data?.message || 'Verification failed. The link might be expired.')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                
                <div className="auth-header">
                    <div className="icon-box"></div>
                    <h2>Verify your email</h2>
                    <p>
                        Welcome to <span style={{ color: '#fff', fontWeight: 'bold' }}>Perplexity</span>. Please click below to verify your account.
                    </p>
                </div>

                {status === 'verifying' && (
                     <div style={{ padding: '2rem' }}>
                        <svg className="animate-spin h-8 w-8 text-[#22d3ee]" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(153, 27, 27, 0.1)', border: '1px solid rgba(153, 27, 27, 0.3)', color: '#f87171', borderRadius: '12px', fontSize: '14px', textAlign: 'center', width: '100%' }}>
                        {message}
                    </div>
                )}

                <button
                    onClick={() => status === 'success' ? navigate('/login') : status === 'error' ? navigate('/register') : null}
                    disabled={status === 'verifying'}
                    className="submit-btn"
                    style={{ backgroundColor: status === 'error' ? '#333' : '#22d3ee', color: status === 'error' ? '#fff' : '#000' }}
                >
                    {status === 'verifying' ? 'Verifying...' : status === 'error' ? 'Try again' : 'Verify Email Address'}
                </button>
                
                {status === 'success' && (
                    <p style={{ marginTop: '1rem', color: '#22c55e', fontSize: '14px', fontWeight: '500' }}>Verified successfully! Redirecting to login...</p>
                )}

                <div className="auth-footer">
                    <p style={{ color: '#444', fontSize: '11px', marginBottom: '1rem' }}>If you didn't create an account, you can safely ignore this email.</p>
                    <p style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>The Perplexity Team</p>
                </div>
            </div>
        </div>
    )
}

export default Verify
