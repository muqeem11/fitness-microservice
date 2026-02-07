package com.fitness.userservice.services;

import com.fitness.userservice.UserRepository;
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
            User existingUser=repository.findByEmail(request.getEmail());
            UserResponse Response =new UserResponse();
            Response.setId(existingUser.getId());
            Response.setEmail(existingUser.getEmail());
            Response.setFirstname(existingUser.getFirstname());
            Response.setLastname(existingUser.getLastname());
            Response.setPassword(existingUser.getPassword());
            Response.setUpdatedAT(existingUser.getUpdatedAT());
            Response.setCreatedAt(existingUser.getCreatedAt());
            return Response;

        }

        User user=new User();
        user.setEmail(request.getEmail());
        user.setKeyCloakId(request.getKeycloakId());
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
        userResponse.setPassword(user.getPassword());
        userResponse.setKeyCloakId(user.getKeyCloakId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstname(user.getFirstname());
        userResponse.setLastname(user.getLastname());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAT(user.getUpdatedAT());
        return userResponse;
    }

    public Boolean existByUserId(String userId) {

        return repository.existsByKeyCloakId(userId);

    }
}
