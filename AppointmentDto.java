package com.petcare.dto;

import com.petcare.entity.Appointment.Status;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private Long id;
    private Long petId;
    private String petName;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime dateTime;
    private Status status;
}
