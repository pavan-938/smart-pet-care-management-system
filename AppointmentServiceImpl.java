package com.petcare.service.impl;

import com.petcare.dto.AppointmentDto;
import com.petcare.entity.Appointment;
import com.petcare.entity.Doctor;
import com.petcare.entity.Pet;
import com.petcare.entity.User;
import com.petcare.repository.AppointmentRepository;
import com.petcare.repository.DoctorRepository;
import com.petcare.repository.PetRepository;
import com.petcare.repository.UserRepository;
import com.petcare.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.petcare.service.EmailService emailService;

    @Override
    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctorEmail(String email) {
        Doctor doctor = doctorRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return getAppointmentsByDoctor(doctor.getId());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByPet(Long petId) {
        return appointmentRepository.findByPetId(petId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Assuming we want appointments for all pets of the user
        // This is a complex query. Alternatively, find pets first, then appointments.
        // Or add custom query in Repository: findByPetOwnerId(Long ownerId)
        return appointmentRepository.findByPetOwnerId(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AppointmentDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return convertToDto(appointment);
    }

    @Override
    public AppointmentDto bookAppointment(AppointmentDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pet pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        if (!pet.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("You can only book appointments for your own pets");
        }

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPet(pet);
        appointment.setDoctor(doctor);
        appointment.setDateTime(dto.getDateTime());
        appointment.setStatus(Appointment.Status.PENDING);

        Appointment saved = appointmentRepository.save(appointment);

        // Send booking confirmation email
        String subject = "Appointment Booked: " + pet.getName();
        String body = String.format(
                "Dear %s,\n\nYour appointment for %s with Dr. %s has been booked for %s.\nStatus: PENDING\n\nPlease complete the payment if required to confirm your slot.\n\nBest regards,\nSmart Pet Care Team",
                user.getName(), pet.getName(), doctor.getUser().getName(), appointment.getDateTime());
        emailService.sendEmail(user.getEmail(), subject, body);

        return convertToDto(saved);
    }

    @Override
    public AppointmentDto updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Appointment.Status oldStatus = appointment.getStatus();
        Appointment.Status newStatus = Appointment.Status.valueOf(status);
        appointment.setStatus(newStatus);

        Appointment saved = appointmentRepository.save(appointment);

        // Notify user about status change
        if (newStatus != oldStatus) {
            String userEmail = appointment.getPet().getOwner().getEmail();
            String userName = appointment.getPet().getOwner().getName();
            String petName = appointment.getPet().getName();
            String doctorName = appointment.getDoctor().getUser().getName();

            String subject = "Appointment Status Updated: " + petName;
            String body = "";

            if (newStatus == Appointment.Status.CONFIRMED) {
                body = String.format(
                        "Hi %s,\n\nGreat news! Your appointment for %s with Dr. %s on %s has been CONFIRMED.\n\nWe look forward to seeing you!\n\nBest regards,\nSmart Pet Care Team",
                        userName, petName, doctorName, appointment.getDateTime());
            } else if (newStatus == Appointment.Status.COMPLETED) {
                body = String.format(
                        "Hi %s,\n\n🐾 VISIT SUMMARY - Smart Pet Care\n\n" +
                                "Your companion %s completed their session with Dr. %s today.\n\n" +
                                "Summary Notes:\n" +
                                "- Consultation: Routine Wellness Check\n" +
                                "- Status: Healthy & Happy!\n\n" +
                                "Next Steps:\n" +
                                "- Vaccination records have been updated in your Pet's Health Dashboard.\n" +
                                "- If any medication was prescribed, you can view the digital prescription in the app.\n"
                                +
                                "- Please monitor %s's activity level for the next 24 hours.\n\n" +
                                "Clinic Details:\n" +
                                "📍 Smart Pet Care Wellness Center\n" +
                                "📞 Support: +91 999 000 1111\n\n" +
                                "Thank you for trusting us with %s's health! See you at the next checkup.\n\n" +
                                "Best regards,\nSmart Pet Care Team",
                        userName, petName, doctorName, petName, petName);
            } else if (newStatus == Appointment.Status.CANCELLED) {
                body = String.format(
                        "Hi %s,\n\nYour appointment for %s with Dr. %s has been CANCELLED.\n\nIf this was a mistake, please book a new session or contact support.\n\nBest regards,\nSmart Pet Care Team",
                        userName, petName, doctorName);
            }

            if (!body.isEmpty()) {
                emailService.sendEmail(userEmail, subject, body);
            }
        }

        return convertToDto(saved);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    private AppointmentDto convertToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setPetId(appointment.getPet().getId());
        dto.setPetName(appointment.getPet().getName());
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setDoctorName(appointment.getDoctor().getUser().getName());
        dto.setDateTime(appointment.getDateTime());
        dto.setStatus(appointment.getStatus());
        return dto;
    }
}
