package com.noisync.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        System.setProperty("TNS_ADMIN", 
            new java.io.File("Wallet_NOIZYNC679").getAbsolutePath());
        
        SpringApplication.run(BackendApplication.class, args);
    }


}
