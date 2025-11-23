package com.lostfound.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "diannkf5c",
                "api_key", "448772871668922",
                "api_secret", "l-U-8haKILkBovUVjil1n5wC6UE",
                "secure", true
        ));
    }
}
