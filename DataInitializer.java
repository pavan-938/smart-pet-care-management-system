package com.petcare.util;

import com.petcare.entity.Doctor;
import com.petcare.entity.User;
import com.petcare.repository.DoctorRepository;
import com.petcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (doctorRepository.count() == 0) {
            seedDoctor("Sarah Jenkins", "sarah.jenkins@petcare.com", "Senior Surgeon", "Mon - Fri, 9:00 AM - 5:00 PM",
                    800.0);
            seedDoctor("Michael Chen", "michael.chen@petcare.com", "Dental Specialist", "Tue - Sat, 10:00 AM - 6:00 PM",
                    650.0);
            seedDoctor("Emily Rodriguez", "emily.r@petcare.com", "Dermatologist", "Mon - Thu, 8:00 AM - 4:00 PM",
                    700.0);

            System.out.println("Database seeded with sample doctors.");
        }

        // Seed default Pet Owner
        seedUser("Pavan", "pavan@gmail.com", "password123", User.Role.USER);
        System.out.println("Default user 'Pavan' checked/seeded.");
    }

    private void seedUser(String name, String email, String password, User.Role role) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
        }
    }

    private void seedDoctor(String name, String email, String specialization, String availability, Double fee) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole(User.Role.DOCTOR);
            user = userRepository.save(user);
        }

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialization(specialization);
        doctor.setAvailability(availability);
        doctor.setConsultationFee(fee);
        doctorRepository.save(doctor);
    }
}
