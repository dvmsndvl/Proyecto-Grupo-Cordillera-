# Proyecto Grupo Cordillera

Plataforma de monitoreo y gestión organizacional para retail, estructurada bajo una arquitectura desacoplada de microservicios. Permite centralizar y administrar de forma independiente el inventario de productos y los pedidos de las sucursales.

---

## 👥 Integrantes
*   **Angel Soto**
*   **Damian Sandoval**
*   **Samuel Urzua**

---

## 🏗️ Arquitectura de la Solución

El sistema está compuesto por cuatro componentes autónomos:
1.  **Frontend:** Interfaz de usuario intuitiva desarrollada en **React** y construida con **Vite**.
2.  **BFF (Backend For Frontend):** Gateway desarrollado en **Spring Boot** que centraliza y orquesta las peticiones del cliente hacia los distintos microservicios.
3.  **Microservicio de Pedidos:** Servicio independiente en **Spring Boot** para el registro y gestión de pedidos (CRUD).
4.  **Microservicio de Inventario:** Servicio independiente en **Spring Boot** para el control de stock de bodega y alertas de bajo stock (CRUD).

---

## 🛠️ Tecnologías Utilizadas
*   **Frontend:** React, Vite, Axios, CSS Vanilla (Light Mode).
*   **Backend & BFF:** Java 17, Spring Boot, Spring Data JPA, Maven.
*   **Base de Datos:** H2 (Base de datos en memoria para pruebas rápidas).
*   **Pruebas:** Postman, JUnit.

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Requisitos Previos
*   Node.js (versión 16 o superior).
*   Java Development Kit (JDK) 17.
*   Maven instalado en el sistema.

### 2. Levantar el Frontend (React)
1.  Navega al directorio del frontend:
    ```bash
    cd Frontend/grupo-cordillera
    ```
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    *La aplicación se abrirá en `http://localhost:5173`*.

### 3. Levantar el BFF (Backend For Frontend)
1.  Navega al directorio del BFF:
    ```bash
    cd bff
    ```
2.  Ejecuta la aplicación Spring Boot:
    ```bash
    mvn spring-boot:run
    ```
    *El BFF correrá en el puerto `8080`*.

### 4. Levantar el Microservicio de Pedidos
1.  Navega al directorio del servicio:
    ```bash
    cd servicio-pedidos/servicio-pedidos
    ```
2.  Ejecuta la aplicación:
    ```bash
    mvn spring-boot:run
    ```
    *El servicio de pedidos correrá en el puerto `8081`*.

### 5. Levantar el Microservicio de Inventario
1.  Navega al directorio del servicio:
    ```bash
    cd GrupoCordilleraRepo-feature-microservicio-inventario/servicio-inventario
    ```
2.  Ejecuta la aplicación:
    ```bash
    mvn spring-boot:run
    ```
    *El servicio de inventario correrá en el puerto `8082`*.
