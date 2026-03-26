import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Verify from "../features/auth/pages/Verify";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import Protected from "../features/auth/components/Protected";
import { Toaster } from 'react-hot-toast';

function AppRouter() {
    return (
        <BrowserRouter>
            <Toaster 
                position="bottom-right" 
                reverseOrder={false} 
                toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid #2a2a2a',
                        borderRadius: '12px',
                        padding: '12px'
                    }
                }}
            />
            <Routes>
                <Route path="/chat" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/" element={<Navigate to="/chat" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;