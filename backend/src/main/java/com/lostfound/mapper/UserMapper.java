package com.lostfound.mapper;

import com.lostfound.dto.UserResponseDTO;
import com.lostfound.model.User;

// A simple static utility class for mapping
public class UserMapper {

    public static UserResponseDTO toUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.isAdmin()
        );
    }
}