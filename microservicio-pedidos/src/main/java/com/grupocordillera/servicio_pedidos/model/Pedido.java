package com.grupocordillera.servicio_pedidos.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "pedidos")
@Data // Genera getters, setters y constructores con Lombok
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String producto; // Nombre del producto solicitado
    private Integer cantidad; // Cantidad del producto
    private String sucursalOrigen; // Ciudad o sucursal [cite: 5]
    private Double montoTotal;
    private String estado; // Pendiente, Completado, Cancelado
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}