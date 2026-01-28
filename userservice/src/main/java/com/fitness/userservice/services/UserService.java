package com.fitness.userservice.services;

import com.fitness.userservice.UserRepository;
import com.fitness.userservice.controller.UserController;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;

import com.fitness.userservice.models.User;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository repository;
    public UserResponse register(RegisterRequest request) {


        if(repository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");

        }

        User user=new User();
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setPassword(request.getPassword());


        User savedUser=repository.save(user);
        return getUserResponse(savedUser);


    }

    public UserResponse getUserProfile(String userId) {
        User user=repository.findById(userId).orElseThrow(()->new RuntimeException("User Not found"));

        return getUserResponse(user);

    }

    @NonNull
    private UserResponse getUserResponse(User user) {
        UserResponse userResponse =new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstname(user.getFirstname());
        userResponse.setLastname(user.getLastname());
        userResponse.setPassword(user.getPassword());
        userResponse.setUpdatedAT(user.getUpdatedAT());
        userResponse.setCreatedAt(user.getCreatedAt());
        return userResponse;
    }

    public Boolean existByUserId(String userId) {
        return repository.existsById(userId);

    }
}
