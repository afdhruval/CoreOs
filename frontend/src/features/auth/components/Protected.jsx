import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({ children }) => {

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return <div className="w-screen h-screen bg-black flex items-center justify-center text-white">loading...........</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected