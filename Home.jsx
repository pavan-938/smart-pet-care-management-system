import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-hero" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '80px 20px',
            textAlign: 'center',
            background: 'radial-gradient(circle at top right, #eef2ff, #f8fafc)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40vw', height: '40vw', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30vw', height: '30vw', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: '#e0e7ff',
                    color: 'var(--primary)',
                    borderRadius: '30px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    Smart Pet Care Management
                </span>

                <h1 style={{
                    fontSize: '4.5rem',
                    maxWidth: '900px',
                    margin: '0 auto 1.5rem',
                    lineHeight: '1.1',
                    background: 'linear-gradient(135deg, var(--text-main) 30%, var(--primary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    The Future of Pet Healthcare is Here.
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-muted)',
                    maxWidth: '600px',
                    margin: '0 auto 3rem',
                    lineHeight: '1.7'
                }}>
                    Empowering pet owners and veterinarians with a seamless, smart platform for consultations, medical records, and expert care.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/register" className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '40px' }}>
                        Start Free Account
                    </Link>
                    <Link to="/doctors" className="glass" style={{
                        padding: '1.25rem 2.5rem',
                        fontSize: '1.1rem',
                        borderRadius: '40px',
                        color: 'var(--text-main)',
                        fontWeight: 700,
                        border: '1px solid var(--border)'
                    }}>
                        Meet Our Vets
                    </Link>
                </div>

                <div style={{
                    marginTop: '8rem',
                    width: '100%',
                    maxWidth: '1200px',
                    textAlign: 'left'
                }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Tailored Care for Every Pet</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {[
                            { title: "Specialized Vets", desc: "Expert care from certified professionals in various fields." },
                            { title: "Smart Scheduling", desc: "Book and manage appointments with a single click." },
                            { title: "Digital Records", desc: "All your pet's medical history in one secure place." },
                            { title: "24/7 Support", desc: "Emergency assistance whenever your pet needs it." }
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: '2rem', transition: 'var(--transition)' }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', width: '100%', maxWidth: '900px', marginInline: 'auto' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>10k+</h4>
                        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Pets Cared For</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>500+</h4>
                        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Expert Doctors</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>24/7</h4>
                        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Urgent Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
