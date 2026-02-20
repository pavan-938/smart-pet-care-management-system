import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Activity, ShieldCheck, Clock, Plus, Trash2, CheckCircle } from 'lucide-react';

const PetHealth = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [records, setRecords] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history');

    // Form states
    const [showRecordForm, setShowRecordForm] = useState(false);
    const [showReminderForm, setShowReminderForm] = useState(false);
    const [newRecord, setNewRecord] = useState({
        recordType: 'CHECKUP',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        provider: '',
        weight: '',
        activityLevel: 5,
        calories: '',
        vaccineName: '',
        nextDueDate: ''
    });
    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        reminderDate: format(new Date(), "yyyy-MM-dd'T'HH:mm")
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [petRes, recordsRes, remindersRes] = await Promise.all([
                api.get(`/pets/id/${id}`),
                api.get(`/health-records/pet/${id}`),
                api.get(`/reminders/pet/${id}`)
            ]);
            setPet(petRes.data);
            setRecords(recordsRes.data);
            setReminders(remindersRes.data);
        } catch (err) {
            console.error("Error fetching health data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        try {
            await api.post('/health-records/add', {
                ...newRecord,
                petId: id,
                weight: newRecord.weight ? parseFloat(newRecord.weight) : null,
                activityLevel: parseInt(newRecord.activityLevel),
                calories: newRecord.calories ? parseInt(newRecord.calories) : null
            });
            setShowRecordForm(false);
            setNewRecord({
                recordType: 'CHECKUP',
                description: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                provider: '',
                weight: '',
                activityLevel: 5,
                calories: '',
                vaccineName: '',
                nextDueDate: ''
            });
            fetchData();
        } catch (err) {
            alert("Failed to add record");
        }
    };

    const handleAddReminder = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reminders/add', {
                ...newReminder,
                petId: id
            });
            setShowReminderForm(false);
            setNewReminder({
                title: '',
                description: '',
                reminderDate: format(new Date(), "yyyy-MM-dd'T'HH:mm")
            });
            fetchData();
        } catch (err) {
            alert("Failed to add reminder");
        }
    };

    const toggleReminder = async (reminderId) => {
        try {
            await api.put(`/reminders/${reminderId}/complete`);
            fetchData();
        } catch (err) {
            alert("Failed to update reminder");
        }
    };

    const deleteRecord = async (recordId) => {
        if (!window.confirm("Delete this record?")) return;
        try {
            await api.delete(`/health-records/${recordId}`);
            fetchData();
        } catch (err) {
            alert("Failed to delete record");
        }
    };

    const chartData = records
        .map(r => ({
            date: format(new Date(r.date), 'MMM d, yy'),
            weight: r.weight,
            activity: r.activityLevel,
            calories: r.calories
        }))
        .reverse();

    if (loading) return <div className="container text-center" style={{ padding: '100px' }}>Loading health data...</div>;
    if (!pet) return <div className="container text-center" style={{ padding: '100px' }}>Pet not found</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <Link to="/my-pets" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                        ← Back to My Pets
                    </Link>
                    <h2 style={{ margin: 0, fontFamily: 'Outfit', fontSize: '2rem' }}>Health Dashboard: {pet.name}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{pet.species} • {pet.breed} • {pet.age} Years Old</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" onClick={() => setShowRecordForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add Record
                    </button>
                    <button className="btn-secondary" onClick={() => setShowReminderForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} /> New Reminder
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div className="main-health-content">
                    {/* Weight Analytics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontFamily: 'Outfit', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                <Activity size={20} color="var(--primary)" /> Weight Analytics
                            </h3>
                            {chartData.filter(d => d.weight).length > 1 ? (
                                <div style={{ height: '200px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData.filter(d => d.weight)}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="date" fontSize={10} tickMargin={10} />
                                            <YAxis fontSize={10} unit="kg" />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                            <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-center py-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>More data needed.</p>
                            )}
                        </div>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontFamily: 'Outfit', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                                <Activity size={20} color="#10b981" /> Activity Level
                            </h3>
                            {chartData.filter(d => d.activity).length > 1 ? (
                                <div style={{ height: '200px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData.filter(d => d.activity)}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="date" fontSize={10} tickMargin={10} />
                                            <YAxis domain={[0, 10]} fontSize={10} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                            <Line type="step" dataKey="activity" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="text-center py-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>More data needed.</p>
                            )}
                        </div>
                    </div>

                    <div className="card mb-4" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Outfit', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                            <Activity size={20} color="#f59e0b" /> Daily Calorie Intake
                        </h3>
                        {chartData.filter(d => d.calories).length > 1 ? (
                            <div style={{ height: '200px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData.filter(d => d.calories)}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="date" fontSize={10} tickMargin={10} />
                                        <YAxis fontSize={10} unit=" kcal" />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-center py-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Add records with calorie data to see the trend.</p>
                        )}
                    </div>

                    {/* Tabs for Records */}
                    <div className="card" style={{ padding: 0 }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                            <button
                                onClick={() => setActiveTab('history')}
                                style={{
                                    flex: 1, padding: '1rem', border: 'none', background: 'none', cursor: 'pointer',
                                    fontWeight: 600, color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent'
                                }}
                            >
                                Medical History
                            </button>
                            <button
                                onClick={() => setActiveTab('vax')}
                                style={{
                                    flex: 1, padding: '1rem', border: 'none', background: 'none', cursor: 'pointer',
                                    fontWeight: 600, color: activeTab === 'vax' ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: activeTab === 'vax' ? '2px solid var(--primary)' : '2px solid transparent'
                                }}
                            >
                                Vaccinations
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {activeTab === 'history' ? (
                                records.filter(r => r.recordType !== 'VACCINATION').length === 0 ? (
                                    <p className="text-center py-4">No medical records found.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {records.filter(r => r.recordType !== 'VACCINATION').map(record => (
                                            <div key={record.id} className="glass" style={{ padding: '1rem', borderRadius: '12px', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{record.recordType}</span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{format(new Date(record.date), 'MMM dd, yyyy')}</span>
                                                </div>
                                                <p style={{ margin: '5px 0' }}>{record.description}</p>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                                    <span>Clinic: {record.provider || 'N/A'}</span>
                                                    {record.weight && <span>Weight: {record.weight} kg</span>}
                                                    {record.activityLevel && <span>Activity: {record.activityLevel}/10</span>}
                                                    {record.calories && <span>Calories: {record.calories} kcal</span>}
                                                </div>
                                                <button
                                                    onClick={() => deleteRecord(record.id)}
                                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                records.filter(r => r.recordType === 'VACCINATION').length === 0 ? (
                                    <p className="text-center py-4">No vaccination records found.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {records.filter(r => r.recordType === 'VACCINATION').map(record => (
                                            <div key={record.id} className="glass" style={{ padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #4caf50', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 600 }}>{record.vaccineName}</span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Adm: {format(new Date(record.date), 'MMM dd, yyyy')}</span>
                                                </div>
                                                {record.nextDueDate && (
                                                    <div style={{ fontSize: '0.85rem', color: '#e67e22', fontWeight: 600 }}>
                                                        Boost Due: {format(new Date(record.nextDueDate), 'MMM dd, yyyy')}
                                                    </div>
                                                )}
                                                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>{record.description}</p>
                                                <button
                                                    onClick={() => deleteRecord(record.id)}
                                                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Reminders */}
                <div className="health-sidebar">
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontFamily: 'Outfit', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShieldCheck size={20} color="#f59e0b" /> Reminders
                        </h3>
                        {reminders.length === 0 ? (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No upcoming reminders.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {reminders.map(rem => (
                                    <div key={rem.id} style={{
                                        padding: '12px', borderRadius: '10px',
                                        backgroundColor: rem.completed ? '#f0fdf4' : '#fff9f2',
                                        border: rem.completed ? '1px solid #dcfce7' : '1px solid #ffedd5',
                                        opacity: rem.completed ? 0.7 : 1
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <button
                                                onClick={() => !rem.completed && toggleReminder(rem.id)}
                                                style={{ padding: 0, background: 'none', border: 'none', color: rem.completed ? '#22c55e' : '#cbd5e1', cursor: rem.completed ? 'default' : 'pointer' }}
                                            >
                                                <CheckCircle size={20} fill={rem.completed ? '#22c55e' : 'none'} />
                                            </button>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: rem.completed ? 'line-through' : 'none' }}>{rem.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {format(new Date(rem.reminderDate), 'MMM dd, h:mm a')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card glass" style={{ padding: '1.5rem' }}>
                        <h4 style={{ margin: 0 }}>Health Tip</h4>
                        <p style={{ fontSize: '0.85rem', marginTop: '10px', color: 'var(--text-secondary)' }}>
                            Regular check-ups and weight monitoring can help detect potential health issues early.
                            Keep your pet active and maintain a balanced diet!
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal for Record */}
            {showRecordForm && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ fontFamily: 'Outfit' }}>Add Health Record</h3>
                        <form onSubmit={handleAddRecord} className="mt-4">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Record Type</label>
                                    <select
                                        value={newRecord.recordType}
                                        onChange={e => setNewRecord({ ...newRecord, recordType: e.target.value })}
                                        className="form-control"
                                    >
                                        <option value="CHECKUP">General Checkup</option>
                                        <option value="VACCINATION">Vaccination</option>
                                        <option value="SURGERY">Surgery</option>
                                        <option value="TREATMENT">Treatment</option>
                                        <option value="LAB_TEST">Laboratory Test</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" value={newRecord.date} onChange={e => setNewRecord({ ...newRecord, date: e.target.value })} required />
                                </div>
                            </div>

                            {newRecord.recordType === 'VACCINATION' && (
                                <div className="form-group">
                                    <label>Vaccine Name</label>
                                    <input placeholder="e.g. Rabies, DHPP" value={newRecord.vaccineName} onChange={e => setNewRecord({ ...newRecord, vaccineName: e.target.value })} required={newRecord.recordType === 'VACCINATION'} />
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Weight (kg)</label>
                                    <input type="number" step="0.1" value={newRecord.weight} onChange={e => setNewRecord({ ...newRecord, weight: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Activity (1-10)</label>
                                    <input type="number" min="1" max="10" value={newRecord.activityLevel} onChange={e => setNewRecord({ ...newRecord, activityLevel: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Calories (kcal)</label>
                                    <input type="number" value={newRecord.calories} onChange={e => setNewRecord({ ...newRecord, calories: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Provider / Clinic</label>
                                <input placeholder="e.g. City Pet Hospital" value={newRecord.provider} onChange={e => setNewRecord({ ...newRecord, provider: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Description / Notes</label>
                                <textarea rows="3" value={newRecord.description} onChange={e => setNewRecord({ ...newRecord, description: e.target.value })} required />
                            </div>

                            {newRecord.recordType === 'VACCINATION' && (
                                <div className="form-group">
                                    <label>Next Due Date (Optional)</label>
                                    <input type="date" value={newRecord.nextDueDate} onChange={e => setNewRecord({ ...newRecord, nextDueDate: e.target.value })} />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Record</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowRecordForm(false)} style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Reminder */}
            {showReminderForm && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '400px', maxWidth: '95%' }}>
                        <h3 style={{ fontFamily: 'Outfit' }}>Set New Reminder</h3>
                        <form onSubmit={handleAddReminder} className="mt-4">
                            <div className="form-group">
                                <label>Title</label>
                                <input placeholder="e.g. Give Heartworm Pill" value={newReminder.title} onChange={e => setNewReminder({ ...newReminder, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Date & Time</label>
                                <input type="datetime-local" value={newReminder.reminderDate} onChange={e => setNewReminder({ ...newReminder, reminderDate: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Notes (Optional)</label>
                                <textarea rows="2" value={newReminder.description} onChange={e => setNewReminder({ ...newReminder, description: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Set Reminder</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowReminderForm(false)} style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetHealth;
