import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/doctors');
                setDoctors(res.data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <h2 className="page-title">Meet Our Experts</h2>
            <p className="text-center mb-4" style={{ color: 'var(--text-muted)', marginTop: '-1rem', maxWidth: '600px', marginInline: 'auto' }}>
                Highly qualified veterinarians dedicated to your pet's wellness.
            </p>

            <div className="doctors-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2.5rem',
                marginTop: '3rem'
            }}>
                {doctors.map(doc => (
                    <div key={doc.id} className="card" style={{
                        padding: '2.5rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'transform 0.3s ease'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'var(--bg-main)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '2rem',
                            marginBottom: '1.5rem',
                            border: '1px solid var(--border)'
                        }}>
                            👨‍⚕️
                        </div>
                        <h3 style={{ marginBottom: '0.25rem', fontFamily: 'Outfit' }}>Dr. {doc.name}</h3>
                        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {doc.specialization}
                        </p>

                        <div style={{ width: '100%', borderTop: '1px solid var(--border)', margin: '1.5rem 0', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Experience:</span>
                                <span style={{ fontWeight: 600 }}>{doc.experienceYears || '5+'} Years</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Consultation Fee:</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-dark)' }}>₹{doc.consultationFee || '500'}</span>
                            </div>
                        </div>

                        <Link
                            to="/book-appointment"
                            state={{ docId: doc.id }}
                            className="btn-primary"
                            style={{ width: '100%', textDecoration: 'none' }}
                        >
                            Book Appointment
                        </Link>
                    </div>
                ))}
            </div>

            {doctors.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Our medical team is currently being updated. Please check back shortly.</p>
                </div>
            )}
        </div>
    );
};

export default Doctors;
