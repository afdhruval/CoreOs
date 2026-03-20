import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const { handleLogin } = useAuth

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (!email || !password) {
                setError('Please fill all fields')
                setLoading(false)
                return
            }

            await handleLogin(email, password)
            // 👉 API call example
            // const res = await fetch('/api/login', {...})

            console.log("Login Data:", { email, password })

        } catch (err) {
            setError('Something went wrong')
        } finally {
            setLoading(false)
        }

        navigate("/")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-red-900/5 to-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-gray-900/80 to-gray-800/70 rounded-2xl shadow-2xl border border-gray-800">
                <div className="h-full flex flex-col">

                    {/* Header */}
                    <div className="h-28 flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-white">
                            Login
                        </h2>
                        <div className="h-1 w-24 mt-4 rounded bg-gradient-to-r from-red-500 to-white" />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="h-16 bg-red-900/20 border border-red-700/50 text-red-300 rounded-lg flex items-center justify-center w-72 mx-auto">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">

                        {/* Email */}
                        <div className="h-24 flex flex-col items-center justify-center">
                            <label className="text-gray-300 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="h-12 w-72 mt-2 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 px-4 text-center"
                            />
                        </div>

                        {/* Password */}
                        <div className="h-24 flex flex-col items-center justify-center">
                            <label className="text-gray-300 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="h-12 w-72 mt-2 bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 px-4 text-center"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-72 mt-4 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 text-white font-bold rounded-lg"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="h-16 flex items-center justify-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <a href="/register" className="text-red-400 hover:text-red-300">
                                Register here
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login