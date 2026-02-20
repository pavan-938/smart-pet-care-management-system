import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await register(formData.name, formData.email, formData.password, formData.role);
            if (result.success) {
                alert('Registration Successful! Please login.');
                navigate('/login');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className="page-container">
            <div className="card auth-card" style={{ margin: '0 auto' }}>
                <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Join Smart Pet Care</h2>
                <p className="text-center mb-4" style={{ color: 'var(--text-muted)' }}>Create an account to get started</p>

                {error && <div className="alert error" style={{ padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fee2e2', color: '#b91c1c', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="John Doe"
                            autoComplete="name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="name@example.com"
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="form-group">
                        <label>You are a:</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="USER">Pet Owner</option>
                            <option value="DOCTOR">Veterinarian</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary btn-block mt-4">Create Account</button>
                </form>

                <div className="text-center mt-4">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Already have an account? </span>
                    <Link to="/login" style={{ fontWeight: 700 }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
