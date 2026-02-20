package com.petcare.service.impl;

import com.petcare.dto.HealthRecordDto;
import com.petcare.entity.HealthRecord;
import com.petcare.entity.Pet;
import com.petcare.repository.HealthRecordRepository;
import com.petcare.repository.PetRepository;
import com.petcare.service.HealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthRecordServiceImpl implements HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PetRepository petRepository;

    @Override
    public List<HealthRecordDto> getHealthRecordsByPet(Long petId) {
        return healthRecordRepository.findByPetIdOrderByDateDesc(petId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public HealthRecordDto addHealthRecord(HealthRecordDto dto) {
        Pet pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        HealthRecord record = new HealthRecord();
        record.setPet(pet);
        record.setRecordType(dto.getRecordType());
        record.setDescription(dto.getDescription());
        record.setDate(dto.getDate());
        record.setProvider(dto.getProvider());
        record.setWeight(dto.getWeight());
        record.setActivityLevel(dto.getActivityLevel());
        record.setCalories(dto.getCalories());
        record.setVaccineName(dto.getVaccineName());
        record.setNextDueDate(dto.getNextDueDate());

        HealthRecord saved = healthRecordRepository.save(record);
        return convertToDto(saved);
    }

    @Override
    public void deleteHealthRecord(Long id) {
        healthRecordRepository.deleteById(id);
    }

    private HealthRecordDto convertToDto(HealthRecord record) {
        HealthRecordDto dto = new HealthRecordDto();
        dto.setId(record.getId());
        dto.setPetId(record.getPet().getId());
        dto.setRecordType(record.getRecordType());
        dto.setDescription(record.getDescription());
        dto.setDate(record.getDate());
        dto.setProvider(record.getProvider());
        dto.setWeight(record.getWeight());
        dto.setActivityLevel(record.getActivityLevel());
        dto.setCalories(record.getCalories());
        dto.setVaccineName(record.getVaccineName());
        dto.setNextDueDate(record.getNextDueDate());
        return dto;
    }
}
