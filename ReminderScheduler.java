package com.petcare.scheduler;

import com.petcare.entity.Appointment;
import com.petcare.repository.AppointmentRepository;
import com.petcare.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class ReminderScheduler {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    // Run every hour to check for upcoming appointments (24h ahead)
    @Scheduled(fixedRate = 3600000)
    public void sendAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime targetStart = now.plusHours(23).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime targetEnd = now.plusHours(25).withMinute(59).withSecond(59).withNano(999999999);

        System.out.println("Scheduler: Checking for appointments between " + targetStart + " and " + targetEnd);

        List<Appointment> upcoming = appointmentRepository.findByStatusAndDateTimeBetween(
                Appointment.Status.CONFIRMED, targetStart, targetEnd);

        for (Appointment apt : upcoming) {
            String userEmail = apt.getPet().getOwner().getEmail();
            String userName = apt.getPet().getOwner().getName();
            String petName = apt.getPet().getName();
            String doctorName = apt.getDoctor().getUser().getName();
            String time = apt.getDateTime().format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));

            String subject = "Reminder: Appointment for " + petName + " Tomorrow!";
            String body = String.format(
                    "Hi %s,\n\nThis is a friendly reminder that you have an appointment scheduled for %s with Dr. %s tomorrow, %s.\n\n"
                            +
                            "Location: Smart Pet Care Clinic\n\nPlease arrive 10 minutes early. We look forward to seeing you and %s!\n\n"
                            +
                            "Best regards,\nSmart Pet Care Team",
                    userName, petName, doctorName, time, petName);

            emailService.sendEmail(userEmail, subject, body);
        }

        if (!upcoming.isEmpty()) {
            System.out.println("Scheduler: Sent " + upcoming.size() + " reminder(s).");
        }
    }
}
