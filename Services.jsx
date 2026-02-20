import React from 'react';
import {
    Stethoscope,
    Syringe,
    Scissors,
    HeartPulse,
    Microscope,
    Zap,
    ShieldCheck,
    Utensils,
    Smile,
    Activity,
    ChevronRight
} from 'lucide-react';
import './Services.css';

const services = [
    {
        icon: <Stethoscope size={28} />,
        title: "General Consultation",
        description: "Comprehensive wellness exams and health checkups tailored for your beloved pets' needs."
    },
    {
        icon: <Syringe size={28} />,
        title: "Vaccination",
        description: "Stay up-to-date with essential immunizations to protect your pets from preventable diseases."
    },
    {
        icon: <HeartPulse size={28} />,
        title: "Advanced Surgery",
        description: "State-of-the-art surgical facilities and expert veterinary surgeons for both routine and complex procedures."
    },
    {
        icon: <Smile size={28} />,
        title: "Dental Care",
        description: "Professional cleaning, extractions, and oral health assessments to keep your pet's smile healthy."
    },
    {
        icon: <Scissors size={28} />,
        title: "Grooming",
        description: "Full-service grooming to keep your pets looking their best and maintaining healthy skin and coat."
    },
    {
        icon: <Activity size={28} />,
        title: "Diagnostic Imaging",
        description: "Advanced digital X-ray and ultrasound technology for quick and accurate internal diagnoses."
    },
    {
        icon: <Microscope size={28} />,
        title: "Laboratory",
        description: "In-house lab services for rapid blood work, urinalysis, and other critical diagnostic tests."
    },
    {
        icon: <Zap size={28} />,
        title: "Emergency Care",
        description: "Round-the-clock emergency support for when your pet needs immediate medical attention."
    },
    {
        icon: <ShieldCheck size={28} />,
        title: "Microchipping",
        description: "A permanent, safe way to identify your pet and ensure they can always find their way home."
    },
    {
        icon: <Utensils size={28} />,
        title: "Nutrition Advice",
        description: "Customized dietary plans and nutritional counseling for pets with specific health requirements."
    }
];

const Services = () => {
    return (
        <div className="services-container">
            <div className="services-header">
                <h1>Our Professional Services</h1>
                <p>We provide a wide range of specialized care to ensure your pets live a long, happy, and healthy life.</p>
            </div>

            <div className="services-grid">
                {services.map((service, index) => (
                    <div className="service-card" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="service-icon-wrapper">
                            {service.icon}
                        </div>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <div className="learn-more">
                            Explore Details <ChevronRight size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
