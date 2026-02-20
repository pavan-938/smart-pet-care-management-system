import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const BookAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { docId, petId } = location.state || {};

    const [doctors, setDoctors] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(docId || '');
    const [selectedPet, setSelectedPet] = useState(petId || '');
    const [dateTime, setDateTime] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/doctors');
                setDoctors(res.data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            }
        };
        const fetchPets = async () => {
            try {
                const res = await api.get('/pets/my-pets');
                setPets(res.data);
            } catch (err) {
                console.error("Error fetching pets:", err);
            }
        };
        fetchDoctors();
        fetchPets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                doctorId: selectedDoctor,
                petId: selectedPet,
                dateTime: dateTime
            };

            await api.post('/appointments/book', payload);
            alert('Appointment Booked Successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Booking failed. Please try again.');
        }
    };

    return (
        <div className="page-container">
            <div className="card">
                <h2 className="page-title">Book an Appointment</h2>
                <p className="text-center mb-4" style={{ color: 'var(--text-muted)', marginTop: '-1rem' }}>
                    Schedule a visit with our expert veterinarians.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Doctor</label>
                        <select
                            value={selectedDoctor}
                            onChange={e => setSelectedDoctor(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a Veterinarian --</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    Dr. {doc.name} ({doc.specialization})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Pet</label>
                        <select
                            value={selectedPet}
                            onChange={e => setSelectedPet(e.target.value)}
                            required
                        >
                            <option value="">-- Choose your Pet --</option>
                            {pets.map(pet => (
                                <option key={pet.id} value={pet.id}>{pet.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date & Time</label>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={e => setDateTime(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary btn-block mt-4">
                        Confirm Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
