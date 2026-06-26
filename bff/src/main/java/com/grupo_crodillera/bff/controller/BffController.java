package com.grupo_crodillera.bff.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class BffController {

    @GetMapping("/")
    public String home() {
        return "BFF funcionando";
    }
}
