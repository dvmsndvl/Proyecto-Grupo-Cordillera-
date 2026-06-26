# Informe Ejecutivo: Plataforma Grupo Cordillera

**Integrantes:**
*   Angel Soto
*   Damian Sandoval
*   Samuel Urzua

---

## 1. Introducción y Problema

Actualmente, las empresas del sector retail administran grandes volúmenes de información (ventas, inventario, pedidos) distribuidos en sistemas independientes. En **Grupo Cordillera**, esta dispersión dificulta la consolidación de datos y la toma de decisiones estratégicas por parte de la gerencia.

**Problema identificado:**
*   Información aislada y dispersa en múltiples plataformas.
*   Dificultad de acceso a datos consolidados en tiempo real.
*   Escasa escalabilidad y alta dependencia entre los sistemas actuales.

---

## 2. Objetivos del Proyecto

### Objetivo General
Desarrollar una plataforma web centralizada bajo una arquitectura de microservicios que optimice e integre la gestión de inventario y pedidos de Grupo Cordillera.

### Objetivos Específicos
*   Diseñar una interfaz web intuitiva en **React**.
*   Implementar un **Backend For Frontend (BFF)** que centralice y canalice las peticiones del cliente.
*   Desarrollar microservicios independientes para **Pedidos** e **Inventario**.
*   Conectar todos los componentes mediante servicios **REST API**.
*   Validar la integración mediante pruebas de sistema.

---

## 3. Arquitectura de la Solución

Se implementó una arquitectura desacoplada para garantizar escalabilidad, modularidad y fácil mantenimiento:

```
[ Frontend (React + Vite) ]
          │ (HTTPS / REST)
          ▼
[ BFF API Gateway (Spring Boot) ]
          │ (REST API / JSON)
          ├──► [ Microservicio Pedidos (Spring Boot) ] ──► [ BD Pedidos (H2) ]
          └──► [ Microservicio Inventario (Spring Boot) ] ─► [ BD Inventario (H2) ]
```

*   **Frontend (Presentación):** Interfaz limpia que consume la información del BFF.
*   **BFF Gateway (Orquestación):** Recibe las solicitudes del frontend, las enruta al microservicio correspondiente y unifica las respuestas.
*   **Microservicios (Lógica de Negocio):** Componentes autónomos encargados de sus respectivas bases de datos relacionales (H2/MySQL).

---

## 4. Tecnologías Utilizadas

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | React + Vite + Axios | Construcción de interfaz ágil y consumo de servicios REST |
| **Backend / BFF** | Spring Boot | Framework Java para creación de microservicios |
| **Gestión** | Maven | Administración de dependencias y construcción Java |
| **Base de Datos** | MySQL / H2 | Motores de almacenamiento relacional para persistencia |
| **Pruebas** | Postman + JUnit | Validación de endpoints e integración |

---

## 5. Funcionalidades del MVP (Fase 1)

1.  **Seguridad Básica:** Control de acceso mediante pantalla de inicio de sesión.
2.  **Dashboard Principal:** Acceso centralizado y directo a los módulos activos del sistema.
3.  **Gestión de Pedidos (CRUD):** Registro, visualización, edición y eliminación de pedidos en tiempo real.
4.  **Gestión de Inventario (CRUD):** Control de stock de artículos, cantidades y precios con detección automática de alertas de bajo stock.

---

## 6. Pruebas y Conclusiones

*   **Pruebas unitarias y de integración:** Se validó el correcto funcionamiento de los endpoints con Postman (operaciones GET, POST, PUT, DELETE) y pruebas automatizadas en los controladores.
*   **Conclusión:** La solución adoptada cumple con los requerimientos de modularidad y desacoplamiento. La separación de responsabilidades a través de microservicios permite que el sistema crezca orgánicamente en el futuro sin comprometer las operaciones actuales.
