package com.grupocordillera.servicio_pedidos;

import com.grupocordillera.servicio_pedidos.controller.PedidoController;
import com.grupocordillera.servicio_pedidos.model.Pedido;
import com.grupocordillera.servicio_pedidos.repository.PedidoRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoControllerTest {

    @Mock
    private PedidoRepository repository;

    @InjectMocks
    private PedidoController controller;

    @Test
    void obtenerTodosDebeRetornarListaDePedidos() {

        Pedido p1 = new Pedido();
        Pedido p2 = new Pedido();

        when(repository.findAll())
                .thenReturn(Arrays.asList(p1, p2));

        List<Pedido> resultado = controller.obtenerTodos();

        assertEquals(2, resultado.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void obtenerVentasConsolidadasDebeRetornarResponseEntityOk() {

        Pedido pedido = new Pedido();

        when(repository.findAll())
                .thenReturn(List.of(pedido));

        ResponseEntity<List<Pedido>> response =
                controller.obtenerVentasConsolidadas();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void obtenerPorSucursalDebeRetornarPedidosFiltrados() {

        Pedido pedido = new Pedido();
        pedido.setSucursalOrigen("Santiago");

        when(repository.findBySucursalOrigen("Santiago"))
                .thenReturn(List.of(pedido));

        List<Pedido> resultado =
                controller.obtenerPorSucursal("Santiago");

        assertEquals(1, resultado.size());
        assertEquals(
                "Santiago",
                resultado.get(0).getSucursalOrigen()
        );
    }

    @Test
    void crearPedidoDebeGuardarPedido() {

        Pedido pedido = new Pedido();
        pedido.setSucursalOrigen("Santiago");
        pedido.setMontoTotal(100000.0);
        pedido.setEstado("Pendiente");

        when(repository.save(any(Pedido.class)))
                .thenReturn(pedido);

        Pedido resultado = controller.crearPedido(pedido);

        assertNotNull(resultado);
        assertEquals("Santiago", resultado.getSucursalOrigen());

        verify(repository).save(pedido);
    }

    @Test
    void actualizarPedidoDebeModificarDatos() {

        Pedido existente = new Pedido();
        existente.setSucursalOrigen("Concepcion");
        existente.setMontoTotal(50000.0);
        existente.setEstado("Pendiente");

        Pedido actualizado = new Pedido();
        actualizado.setSucursalOrigen("Santiago");
        actualizado.setMontoTotal(100000.0);
        actualizado.setEstado("Completado");

        when(repository.findById(1L))
                .thenReturn(Optional.of(existente));

        when(repository.save(any(Pedido.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Pedido resultado =
                controller.actualizarPedido(1L, actualizado);

        assertEquals("Santiago", resultado.getSucursalOrigen());
        assertEquals(100000.0, resultado.getMontoTotal());
        assertEquals("Completado", resultado.getEstado());

        verify(repository).findById(1L);
        verify(repository).save(existente);
    }

    @Test
    void eliminarPedidoDebeEliminarPorId() {

        String resultado = controller.eliminarPedido(1L);

        verify(repository).deleteById(1L);

        assertEquals(
                "Pedido eliminado correctamente",
                resultado
        );
    }
}