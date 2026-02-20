import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null); // Appointments
    const [myPets, setMyPets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.role === 'USER') {
                    const res = await api.get('/appointments/my-appointments');
                    setData(res.data);
                    const petsRes = await api.get('/pets/my-pets');
                    setMyPets(petsRes.data);
                } else if (user.role === 'DOCTOR') {
                    const res = await api.get('/appointments/my-appointments-doctor');
                    setData(res.data);
                } else if (user.role === 'ADMIN') {
                    // Admin could see stats or all data
                    const res = await api.get('/appointments');
                    setData(res.data);
                    const docRes = await api.get('/doctors');
                    setMyPets(docRes.data); // Reusing state for simplicity in demo
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user]);

    const handlePayment = async (appointmentId, amount) => {
        try {
            const orderRes = await api.post(`/payments/create-order?amount=${amount}`);
            const { orderId } = orderRes.data;

            const options = {
                key: "YOUR_KEY_ID",
                amount: amount * 100,
                currency: "INR",
                name: "Smart Pet Care",
                description: "Consultation Fee",
                order_id: orderId,
                handler: async function (response) {
                    await api.post('/payments/verify', {
                        appointmentId: appointmentId,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        amount: amount
                    });
                    alert("Payment Successful!");
                    window.location.reload();
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#6366f1"
                }
            };

            if (window.Razorpay) {
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                alert("Simulating Payment success...");
                await api.post('/payments/verify', {
                    appointmentId: appointmentId,
                    razorpayOrderId: "mock_order_" + Date.now(),
                    razorpayPaymentId: "mock_pay_" + Date.now(),
                    amount: amount
                });
                alert("Payment Successful!");
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{user.name}</span>! {
                        user.role === 'USER' ? "Here's what's happening with your pets." :
                            user.role === 'DOCTOR' ? "Here's your schedule for today." :
                                "Here's the system overview."
                    }
                </p>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Appointments Section */}
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontFamily: 'Outfit' }}>
                            {user.role === 'DOCTOR' ? 'My Appointments' : user.role === 'ADMIN' ? 'All System Appointments' : 'Upcoming Appointments'}
                        </h3>
                        {user.role === 'USER' && (
                            <Link to="/book-appointment" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>+ Book New</Link>
                        )}
                    </div>

                    {data && data.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {data.map(apt => (
                                <div key={apt.id} style={{
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: '#fcfcfc'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontWeight: 700, margin: 0 }}>
                                                {user.role === 'DOCTOR' ? `Patient: ${apt.petName}` : `Dr. ${apt.doctorName}`}
                                            </p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(apt.dateTime).toLocaleDateString()} at {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <span className="glass" style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            backgroundColor:
                                                apt.status === 'COMPLETED' ? '#dcfce7' :
                                                    apt.status === 'CONFIRMED' ? '#dbeafe' :
                                                        apt.status === 'PENDING' ? '#fef9c3' : '#fee2e2',
                                            color:
                                                apt.status === 'COMPLETED' ? '#166534' :
                                                    apt.status === 'CONFIRMED' ? '#1e40af' :
                                                        apt.status === 'PENDING' ? '#854d0e' : '#991b1b',
                                            border: 'none'
                                        }}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    {user.role === 'USER' && apt.status === 'PENDING' && (
                                        <button
                                            onClick={() => handlePayment(apt.id, apt.consultationFee || 500)}
                                            className="btn-primary"
                                            style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.9rem' }}
                                        >
                                            Pay ₹{apt.consultationFee || 500} & Confirm
                                        </button>
                                    )}

                                    {user.role === 'DOCTOR' && apt.status === 'PENDING' && (
                                        <button
                                            onClick={async () => {
                                                await api.put(`/appointments/${apt.id}/status?status=CONFIRMED`);
                                                window.location.reload();
                                            }}
                                            className="btn-primary"
                                            style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.9rem' }}
                                        >
                                            Confirm Appointment
                                        </button>
                                    )}

                                    {user.role === 'DOCTOR' && apt.status === 'CONFIRMED' && (
                                        <button
                                            onClick={async () => {
                                                await api.put(`/appointments/${apt.id}/status?status=COMPLETED`);
                                                window.location.reload();
                                            }}
                                            className="btn-success"
                                            style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.9rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px' }}
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            <p>No appointments found.</p>
                        </div>
                    )}
                </div>

                {/* Quick Info Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white' }}>
                        <h3 style={{ margin: 0, fontFamily: 'Outfit', color: 'white', marginBottom: '1rem' }}>Quick Actions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {user.role === 'USER' ? (
                                <>
                                    <Link to="/my-pets" className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center', fontWeight: 600 }}>Manage Pets</Link>
                                    <Link to="/doctors" className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center', fontWeight: 600 }}>Find Doctors</Link>
                                </>
                            ) : user.role === 'DOCTOR' ? (
                                <>
                                    <Link to="/profile" className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center', fontWeight: 600 }}>My Profile</Link>
                                    <Link to="/appointments" className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center', fontWeight: 600 }}>All Schedules</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/admin/users" className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center', fontWeight: 600 }}>Manage Users</Link>
                                    <Link to="/admin/doctors" className="glass" style={{ padding: '1rem', borderRadius: '12px', color: 'white', textAlign: 'center', fontWeight: 600 }}>Manage Doctors</Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ margin: 0, fontFamily: 'Outfit', marginBottom: '1.5rem' }}>
                            {user.role === 'ADMIN' ? 'System Overview' : user.role === 'DOCTOR' ? 'Doctor Statistics' : 'My Pet Family'}
                        </h3>
                        {user.role === 'USER' ? (
                            myPets.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                    {myPets.map(pet => (
                                        <div key={pet.id} className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem' }}>
                                            🐾 {pet.name}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No pets added yet. <Link to="/my-pets" style={{ fontWeight: 700 }}>Add your pet!</Link></p>
                            )
                        ) : user.role === 'ADMIN' ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Total Doctors:</span>
                                    <span style={{ fontWeight: 700 }}>{myPets.length}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Active Appointments:</span>
                                    <span style={{ fontWeight: 700 }}>{data?.length || 0}</span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Total Consultations:</span>
                                    <span style={{ fontWeight: 700 }}>{data?.length || 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Earnings (Est):</span>
                                    <span style={{ fontWeight: 700, color: 'var(--accent-dark)' }}>₹{(data?.filter(a => a.status === 'PAID').length || 0) * 800}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', gridColumn: 'span 2' }}>
                    <h3 style={{ fontFamily: 'Outfit', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        📋 Recent Health Activity
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {myPets.length > 0 ? (
                            myPets.map(pet => (
                                <div key={pet.id} style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{pet.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '5px 0' }}>Latest: Routine Checkup</p>
                                    <Link to={`/pet-health/${pet.id}`} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>View Full History →</Link>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Healthy pets, happy owners! No recent fluctuations detected.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
