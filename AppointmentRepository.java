package com.petcare.repository;

import com.petcare.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPetId(Long petId);

    List<Appointment> findByPetOwnerId(Long ownerId);

    List<Appointment> findByStatusAndDateTimeBetween(Appointment.Status status, java.time.LocalDateTime start,
            java.time.LocalDateTime end);
}
