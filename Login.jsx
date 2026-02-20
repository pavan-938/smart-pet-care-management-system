import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: "demo.google.user@example.com",
                    name: "Demo Google User",
                    role: "user"
                })
            });
            const data = await response.json();
            if (response.ok) {
                const userData = data;
                if (userData.role && userData.role.startsWith('ROLE_')) {
                    userData.role = userData.role.replace('ROLE_', '');
                }
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                navigate('/dashboard');
                window.location.reload();
            } else {
                setError("Google Login Failed");
            }
        } catch (err) {
            setError("Google Login Error");
        }
    };

    return (
        <div className="page-container">
            <div className="card auth-card" style={{ margin: '0 auto' }}>
                <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p className="text-center mb-4" style={{ color: 'var(--text-muted)' }}>Login to manage your pets</p>

                {error && <div className="alert error" style={{ padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fee2e2', color: '#b91c1c', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Min 8 characters"
                            autoComplete="current-password"
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Forgot Password?</Link>
                    </div>

                    <button type="submit" className="btn-primary btn-block">Sign In</button>
                </form>

                <div className="divider" style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
                </div>

                <button className="glass" onClick={handleGoogleLogin} style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'white',
                    color: 'var(--text-main)',
                    fontWeight: 600
                }}>
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" style={{ width: '20px' }} />
                    Continue with Google
                </button>

                <div className="text-center mt-4">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Don't have an account? </span>
                    <Link to="/register" style={{ fontWeight: 700 }}>Create one</Link>
                </div>
            </div >
        </div >
    );
};

export default Login;
