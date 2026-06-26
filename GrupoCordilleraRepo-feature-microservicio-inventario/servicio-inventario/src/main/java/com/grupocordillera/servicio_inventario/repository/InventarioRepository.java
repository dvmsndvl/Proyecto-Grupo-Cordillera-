package com.grupocordillera.servicio_inventario.repository;

import com.grupocordillera.servicio_inventario.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCantidadLessThan(int limite);
}