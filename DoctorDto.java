package com.petcare.dto;

import lombok.Data;

@Data
public class DoctorDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String specialization;
    private String availability;
    private Double consultationFee;
}
