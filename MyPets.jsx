import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const MyPets = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [newPet, setNewPet] = useState({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        weight: '',
        details: ''
    });

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const res = await api.get('/pets/my-pets');
            setPets(res.data);
        } catch (err) {
            console.error("Error fetching pets:", err);
        }
    };

    const handleAddPet = async (e) => {
        e.preventDefault();
        const petData = {
            ...newPet,
            age: newPet.age ? parseInt(newPet.age) : null,
            weight: newPet.weight ? parseFloat(newPet.weight) : null
        };
        try {
            await api.post('/pets/add', petData);
            setNewPet({ name: '', species: 'Dog', breed: '', age: '', gender: 'Male', weight: '', details: '' });
            fetchPets();
            alert('Pet added successfully!');
        } catch (err) {
            console.error("Error adding pet:", err);
            const msg = err.response?.data?.message || "Failed to add pet";
            alert(msg);
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px' }}>
            <h2 className="page-title">My Companion Family</h2>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div className="pets-list">
                    <h3 className="mb-4" style={{ fontFamily: 'Outfit' }}>Your Pets</h3>
                    {pets.length === 0 ? (
                        <div className="card glass text-center" style={{ padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No pets added yet. Add your first companion to start tracking their health!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {pets.map(pet => (
                                <div key={pet.id} className="card pet-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--primary)' }}>{pet.name}</h4>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{pet.species} • {pet.breed || 'Unknown Breed'}</span>
                                        </div>
                                        <div className="badge" style={{ backgroundColor: pet.gender === 'Male' ? '#e3f2fd' : '#fce4ec', color: pet.gender === 'Male' ? '#1976d2' : '#c2185b', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {pet.gender}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                                        <div className="glass" style={{ padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Age</div>
                                            <div style={{ fontWeight: 600 }}>{pet.age || '?'} Years</div>
                                        </div>
                                        <div className="glass" style={{ padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Weight</div>
                                            <div style={{ fontWeight: 600 }}>{pet.weight || '?'} Kg</div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>
                                        {pet.details || 'No additional details provided.'}
                                    </p>

                                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <Link to={`/pet-health/${pet.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>
                                            Track Health & Records
                                        </Link>
                                        <button
                                            onClick={() => navigate('/book-appointment', { state: { petId: pet.id } })}
                                            className="btn-secondary"
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}
                                        >
                                            Schedule Appointment
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="add-pet-form">
                    <div className="card" style={{ position: 'sticky', top: '100px' }}>
                        <h3 className="mb-4" style={{ fontFamily: 'Outfit' }}>Add New Pet</h3>
                        <form onSubmit={handleAddPet}>
                            <div className="form-group">
                                <label>Pet Name</label>
                                <input
                                    placeholder="e.g. Buddy"
                                    value={newPet.name}
                                    onChange={e => setNewPet({ ...newPet, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Species</label>
                                    <select
                                        value={newPet.species}
                                        onChange={e => setNewPet({ ...newPet, species: e.target.value })}
                                        className="form-control"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    >
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        value={newPet.gender}
                                        onChange={e => setNewPet({ ...newPet, gender: e.target.value })}
                                        className="form-control"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Breed</label>
                                <input
                                    placeholder="e.g. Golden Retriever"
                                    value={newPet.breed}
                                    onChange={e => setNewPet({ ...newPet, breed: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="form-group">
                                    <label>Age (Years)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={newPet.age}
                                        onChange={e => setNewPet({ ...newPet, age: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Weight (Kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        value={newPet.weight}
                                        onChange={e => setNewPet({ ...newPet, weight: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Additional Details</label>
                                <textarea
                                    placeholder="Allergies, chronic conditions, etc."
                                    rows="3"
                                    value={newPet.details}
                                    onChange={e => setNewPet({ ...newPet, details: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-primary btn-block mt-2">Add to Dashboard</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPets;
