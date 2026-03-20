import React, { useState } from 'react'

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (!username || !email || !password) {
                setError('Please fill in all fields')
                return
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters')
                return
            }

            // API call will be done here
            console.log('Register attempt:', { username, email, password })

            // Clear form on success
            setUsername('')
            setEmail('')
            setPassword('')
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-red-900/5 to-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-gray-900/80 to-gray-800/70 rounded-2xl shadow-2xl border border-gray-800">
                <div className="h-full flex flex-col">
                    <div className="h-28 flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-white">Register</h2>
                        <div className="h-1 w-24 mt-4 rounded bg-gradient-to-r from-red-500 to-white" />
                    </div>

                    <div className="flex-1 flex flex-col w-full">
                        {error && (
                            <div className="h-16 bg-red-900/20 border border-red-700/50 text-red-300 rounded-lg flex items-center justify-center w-72 mx-auto">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col items-center w-full">
                            <div className="h-24 w-full flex flex-col items-center justify-center">
                                <label htmlFor="username" className="text-gray-300 font-medium h-6 text-center">
                                    Username
                                </label>
                                <div className="h-2" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="h-12 w-72 mx-auto bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 px-4 text-center placeholder-gray-500 transition duration-200"
                                />
                            </div>

                            <div className="h-2" />

                            <div className="h-24 w-full flex flex-col items-center justify-center">
                                <label htmlFor="email" className="text-gray-300 font-medium h-6 text-center">
                                    Email
                                </label>
                                <div className="h-2" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="h-12 w-72 mx-auto bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 px-4 text-center placeholder-gray-500 transition duration-200"
                                />
                            </div>

                            <div className="h-2" />

                            <div className="h-24 w-full flex flex-col items-center justify-center">
                                <label htmlFor="password" className="text-gray-300 font-medium h-6 text-center">
                                    Password
                                </label>
                                <div className="h-2" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="h-12 w-72 mx-auto bg-gray-800/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 px-4 text-center placeholder-gray-500 transition duration-200"
                                />
                            </div>

                            <div className="h-6" />

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-12 w-72 mx-auto bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition duration-200 shadow-lg hover:shadow-red-500/30"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>

                        <div className="h-6" />

                        <div className="h-12 flex items-center justify-center">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <a href="/login" className="text-red-400 hover:text-red-300 font-medium transition duration-200">
                                    Login here
                                </a>
                            </p>
                        </div>

                        <div className="h-6" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register