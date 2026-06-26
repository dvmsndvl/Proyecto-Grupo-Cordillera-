package com.grupocordillera.servicio_pedidos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Importación recomendada
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grupocordillera.servicio_pedidos.model.Pedido;
import com.grupocordillera.servicio_pedidos.repository.PedidoRepository;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoRepository repository;


    @GetMapping("/resumen-ventas")
    public ResponseEntity<List<Pedido>> obtenerVentasConsolidadas() {
        List<Pedido> pedidos = repository.findAll();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/todos")
    public List<Pedido> obtenerTodos() {
        return repository.findAll();
    }


    @GetMapping("/sucursal/{nombre}")
    public List<Pedido> obtenerPorSucursal(@PathVariable String nombre) {
        return repository.findBySucursalOrigen(nombre);
    }

    @PostMapping("/crear")
    public Pedido crearPedido(@RequestBody Pedido nuevoPedido) {

        return repository.save(nuevoPedido);
    }

    @GetMapping("/cargar-ejemplos")
    public String cargarDatos() {
        Pedido p1 = new Pedido();
        p1.setSucursalOrigen("Santiago Centro");
        p1.setMontoTotal(150000.0);
        p1.setEstado("Completado");

        Pedido p2 = new Pedido();
        p2.setSucursalOrigen("Concepción");
        p2.setMontoTotal(85000.0);
        p2.setEstado("Pendiente");

        repository.save(p1);
        repository.save(p2);

        return "Pedidos de prueba cargados exitosamente!";
    }

    @PutMapping("/editar/{id}")
    public Pedido actualizarPedido(@PathVariable Long id,
                                   @RequestBody Pedido pedidoActualizado) {

        Pedido pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setSucursalOrigen(pedidoActualizado.getSucursalOrigen());
        pedido.setMontoTotal(pedidoActualizado.getMontoTotal());
        pedido.setEstado(pedidoActualizado.getEstado());

        return repository.save(pedido);
    }

    @DeleteMapping("/eliminar/{id}")
    public String eliminarPedido(@PathVariable Long id) {

        repository.deleteById(id);

        return "Pedido eliminado correctamente";
    }
}