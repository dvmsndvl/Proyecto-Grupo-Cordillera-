package com.grupo_crodillera.bff.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class InventarioController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/inventario")
    public String obtenerInventario() {

        String url = "http://localhost:8082/inventario/stock";

        return restTemplate.getForObject(url, String.class);
    }
}
