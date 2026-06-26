package com.grupocordillera.servicio_inventario.controller;

import com.grupocordillera.servicio_inventario.model.Producto;
import com.grupocordillera.servicio_inventario.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventario")
public class InventarioController {

    @Autowired
    private InventarioRepository repository;

    @GetMapping("/stock")
    public List<Producto> obtenerTodoElStock() {
        return repository.findAll();
    }

    @GetMapping("/alertas-criticas")
    public List<Producto> obtenerAlertas() {
        return repository.findByCantidadLessThan(50);
    }

    @GetMapping("/cargar-ejemplos")
    public String cargarDatos() {
        Producto p1 = new Producto();
        p1.setNombre("Cemento Melón Extra");
        p1.setCantidad(500);
        p1.setPrecio(7500.0);

        Producto p2 = new Producto();
        p2.setNombre("Fierro de Construcción 12mm");
        p2.setCantidad(120);
        p2.setPrecio(12000.0);

        repository.save(p1);
        repository.save(p2);

        return "Datos de Grupo Cordillera cargados exitosamente!";
    }


}