package com.petcare.dto;

import lombok.Data;

@Data
public class PetDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String name;
    private String species;
    private String breed;
    private Integer age;
    private String gender;
    private Double weight;
    private String details;
}
