package com.fitness.activityservice.service;


import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.dto.ActivityResquest;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    public ActivityResponse trackActivity(ActivityResquest request) {
        Activity activity =Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();
        Activity savedActivity = activityRepository.save(activity);
        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity savedActivity) {
        ActivityResponse response = new ActivityResponse();
         response.setId(savedActivity.getId());
         response.setUserId(savedActivity.getUserId());
         response.setType(savedActivity.getType());
         response.setDuration(savedActivity.getDuration());
         response.setCaloriesBurned(savedActivity.getCaloriesBurned());
         response.setStartTime(savedActivity.getStartTime());
         response.setAdditionalMetrics(savedActivity.getAdditionalMetrics());
         response.setStartTime(savedActivity.getStartTime());
         response.setUpdatedAt(savedActivity.getUpdatedAt());
         return response;

    }
}
