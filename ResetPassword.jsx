import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    if (!token) {
        return (
            <div className="page-container">
                <div className="card auth-card" style={{ textAlign: 'center' }}>
                    <div className="alert error" style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '12px' }}>
                        Invalid or missing security token.
                    </div>
                    <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="card auth-card" style={{ margin: '0 auto' }}>
                <h2 className="page-title">Set New Password</h2>
                <p className="text-center mb-4" style={{ color: 'var(--text-muted)' }}>Choose a secure password for your account.</p>

                {message && <div className="alert success" style={{ padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#dcfce7', color: '#166534', textAlign: 'center' }}>{message}</div>}
                {error && <div className="alert error" style={{ padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fee2e2', color: '#b91c1c', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="At least 8 characters"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Repeat new password"
                        />
                    </div>
                    <button type="submit" className="btn-primary btn-block mt-4">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
