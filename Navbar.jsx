import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // We will create this

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Smart Pet Care</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/services">Services</Link>
                <Link to="/doctors">Doctors</Link>

                {user && (
                    <>
                        {user.role === 'USER' && (
                            <>
                                <Link to="/book-appointment">Book Appointment</Link>
                                <Link to="/my-pets">My Pets</Link>
                            </>
                        )}
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem' }}>
                                {user.name?.[0]?.toUpperCase()}
                            </div>
                            Profile
                        </Link>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                )}

                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
