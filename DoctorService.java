package com.petcare.service;

import com.petcare.dto.DoctorDto;
import com.petcare.entity.Doctor;
import java.util.List;

public interface DoctorService {
    List<DoctorDto> getAllDoctors();

    DoctorDto getDoctorById(Long id);

    Doctor saveDoctor(Doctor doctor);

    void deleteDoctor(Long id);
}
