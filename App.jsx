import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyPets from './pages/MyPets'
import BookAppointment from './pages/BookAppointment'
import Doctors from './pages/Doctors'
import Services from './pages/Services'
import Payments from './pages/Payments'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import PetHealth from './pages/PetHealth'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <div className="app">
                <Navbar />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/doctors" element={<Doctors />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/my-pets" element={<MyPets />} />
                            <Route path="/pet-health/:id" element={<PetHealth />} />
                            <Route path="/book-appointment" element={<BookAppointment />} />
                            <Route path="/payments" element={<Payments />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* Add more protected routes here */}
                        </Route>
                    </Routes>
                </div>
            </div>
        </AuthProvider>
    )
}

export default App
