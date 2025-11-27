package com.lostfound.mapper;

import com.lostfound.dto.UserResponseDTO;
import com.lostfound.model.User;


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