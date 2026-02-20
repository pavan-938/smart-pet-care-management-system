import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                setName(res.data.name);
                setEmail(res.data.email);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                if (err.response?.status === 401) {
                    setMessage({ type: 'error', text: 'Session expired. Please login again.' });
                }
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.put('/users/profile', { name });
            // Update local context - keep token and existing fields
            const updatedUser = { ...user, name: res.data.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile. Please ensure you are logged in.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="page-title">Personal Profile</h2>
                <p className="text-center mb-4" style={{ color: 'var(--text-muted)', marginTop: '-1rem' }}>
                    Manage your account details and preferences.
                </p>

                {message.text && (
                    <div className={`alert ${message.type}`} style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: message.type === 'success' ? '#166534' : '#b91c1c',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '3rem',
                        color: 'white',
                        marginBottom: '1rem',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="glass" style={{
                        padding: '4px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--bg-main)',
                        color: 'var(--primary)',
                        border: '1px solid var(--border)'
                    }}>
                        Role: {user?.role?.replace('ROLE_', '')}
                    </span>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled // Email update usually needs verification, keeping it disabled for now
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary btn-block mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
