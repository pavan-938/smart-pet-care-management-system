package com.petcare.service;

import com.petcare.dto.ReminderDto;
import java.util.List;

public interface ReminderService {
    List<ReminderDto> getRemindersByPet(Long petId);

    List<ReminderDto> getPendingRemindersByPet(Long petId);

    ReminderDto addReminder(ReminderDto reminderDto);

    ReminderDto markAsCompleted(Long id);

    void deleteReminder(Long id);
}
