import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { 
    SearchIcon, 
    EditIcon, 
    TrashIcon, 
    PlusIcon, 
    CheckCircleIcon, 
    AlertCircleIcon,
    DashboardIcon
} from "../components/Icons";

const MOCK_INVENTARIO = [
    { nombre: "Cemento Melón Extra", cantidad: 500, precio: 7500.0 },
    { nombre: "Fierro de Construcción 12mm", cantidad: 120, precio: 12000.0 },
    { nombre: "Ladrillo Fiscal Gradas", cantidad: 1200, precio: 450.0 },
    { nombre: "Pintura Látex Blanca 5G", cantidad: 45, precio: 34990.0 }
];

function Inventario() {
    const [productos, setProductos] = useState([]);
    
    // Form fields
    const [nombre, setNombre] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [precio, setPrecio] = useState("");
    
    const [editando, setEditando] = useState(null);
    const [filtro, setFiltro] = useState("");
    
    // Estado de Alerta Inline
    const [alerta, setAlerta] = useState(null);

    const mostrarAlerta = (message, type = "success") => {
        setAlerta({ message, type });
    };

    useEffect(() => {
        if (alerta) {
            const timer = setTimeout(() => setAlerta(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alerta]);

    const cargarInventario = () => {
        api.get("/inventario")
            .then((response) => {
                // Si retorna datos válidos del microservicio, los cargamos
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setProductos(response.data);
                } else {
                    cargarDeLocalStorage();
                }
            })
            .catch((error) => {
                console.warn("API de Inventario no disponible, utilizando modo Demo Offline (LocalStorage).");
                mostrarAlerta("No se pudo conectar con el servidor de inventario. Modo Offline activado.", "warning");
                cargarDeLocalStorage();
            });
    };

    const cargarDeLocalStorage = () => {
        const guardados = localStorage.getItem("cordillera_inventario");
        if (guardados) {
            setProductos(JSON.parse(guardados));
        } else {
            setProductos(MOCK_INVENTARIO);
            localStorage.setItem("cordillera_inventario", JSON.stringify(MOCK_INVENTARIO));
        }
    };

    const guardarEnLocalStorage = (nuevaLista) => {
        localStorage.setItem("cordillera_inventario", JSON.stringify(nuevaLista));
    };

    useEffect(() => {
        cargarInventario();
    }, []);

    const guardarProducto = (e) => {
        e.preventDefault();

        if (!nombre.trim() || cantidad === "" || precio === "") {
            mostrarAlerta("Por favor, complete todos los campos.", "error");
            return;
        }

        const cantInt = parseInt(cantidad, 10);
        const precDouble = parseFloat(precio);

        if (isNaN(cantInt) || cantInt < 0) {
            mostrarAlerta("La cantidad debe ser un número entero válido (mayor o igual a 0).", "error");
            return;
        }

        if (isNaN(precDouble) || precDouble < 0) {
            mostrarAlerta("El precio debe ser un número decimal válido (mayor o igual a 0).", "error");
            return;
        }

        let copia = [...productos];

        if (editando !== null) {
            copia[editando] = {
                ...copia[editando],
                nombre: nombre.trim(),
                cantidad: cantInt,
                precio: precDouble
            };
            setProductos(copia);
            setEditando(null);
            mostrarAlerta("Producto actualizado correctamente.", "success");
        } else {
            const nuevoProd = {
                nombre: nombre.trim(),
                cantidad: cantInt,
                precio: precDouble
            };
            copia = [...productos, nuevoProd];
            setProductos(copia);
            mostrarAlerta("Producto registrado correctamente.", "success");
        }

        guardarEnLocalStorage(copia);
        limpiarFormulario();
    };

    const editarProducto = (index) => {
        const prod = productos[index];
        setNombre(prod.nombre || "");
        setCantidad(prod.cantidad !== undefined ? prod.cantidad : "");
        setPrecio(prod.precio !== undefined ? prod.precio : "");
        setEditando(index);
    };

    const eliminarProducto = (index) => {
        const copia = [...productos];
        copia.splice(index, 1);
        setProductos(copia);
        guardarEnLocalStorage(copia);
        mostrarAlerta("Producto eliminado del stock correctamente.", "success");
        
        if (editando === index) {
            limpiarFormulario();
        }
    };

    const limpiarFormulario = () => {
        setNombre("");
        setCantidad("");
        setPrecio("");
        setEditando(null);
    };

    const productosFiltrados = productos.filter((prod) => {
        const name = (prod.nombre || "").toLowerCase();
        return name.includes(filtro.toLowerCase());
    });

    return (
        <div>
            {/* Barra de Navegación */}
            <div className="nav-bar">
                <div className="nav-brand">
                    <span>Grupo Cordillera</span>
                </div>
                <div className="nav-user">
                    <span className="user-tag">Módulo: Inventario</span>
                    <Link to="/home" className="back-link">
                        <DashboardIcon size={16} />
                        <span>Dashboard</span>
                    </Link>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="container">
                <div style={{ marginBottom: "20px" }}>
                    <Link to="/home" className="back-link" style={{ marginBottom: "10px" }}>
                        &larr; Volver al Panel
                    </Link>
                    <h1 style={{ fontFamily: "var(--font-family-title)", fontSize: "1.8rem", fontWeight: "700", marginTop: "5px" }}>
                        Gestión de Inventario
                    </h1>
                </div>

                {/* Banner de Alerta Inline */}
                {alerta && (
                    <div className={`alert alert-${alerta.type}`} style={{ marginBottom: "20px" }}>
                        {alerta.type === "success" && <CheckCircleIcon className="alert-icon" />}
                        {alerta.type === "error" && <AlertCircleIcon className="alert-icon" />}
                        {alerta.type === "warning" && <AlertCircleIcon className="alert-icon" />}
                        <span>{alerta.message}</span>
                    </div>
                )}

                <div className="pedidos-layout">
                    {/* Columna Izquierda: Formulario */}
                    <div className="glass-panel" style={{ height: "fit-content" }}>
                        <h2>
                            {editando !== null ? "Editar Artículo" : "Registrar Artículo"}
                        </h2>
                        
                        <form onSubmit={guardarProducto}>
                            <div className="form-group">
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Nombre del Producto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Cemento Melón Extra"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    style={{ paddingLeft: "12px" }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Cantidad en Stock
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ej: 500"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    style={{ paddingLeft: "12px" }}
                                    min="0"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "10px" }}>
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Precio Unitario ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej: 7500.00"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    style={{ paddingLeft: "12px" }}
                                    min="0"
                                />
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button type="submit" style={{ flexGrow: 1 }}>
                                    {editando !== null ? (
                                        <span>Actualizar Stock</span>
                                    ) : (
                                        <>
                                            <PlusIcon size={16} />
                                            <span>Registrar</span>
                                        </>
                                    )}
                                </button>
                                {editando !== null && (
                                    <button 
                                        type="button"
                                        className="btn-secondary" 
                                        onClick={limpiarFormulario}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Columna Derecha: Tabla de Stock */}
                    <div className="glass-panel">
                        <div className="section-actions">
                            <h2 style={{ marginBottom: 0 }}>
                                Stock en Bodega
                            </h2>
                            <div className="search-container">
                                <SearchIcon className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Buscar producto..."
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: "8%" }}>#</th>
                                        <th>Producto</th>
                                        <th style={{ width: "20%" }}>Cantidad</th>
                                        <th style={{ width: "20%" }}>Precio Unit.</th>
                                        <th style={{ width: "25%", textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosFiltrados.length > 0 ? (
                                        productosFiltrados.map((prod, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td style={{ fontWeight: "500" }}>{prod.nombre}</td>
                                                <td>
                                                    <span style={{ 
                                                        fontWeight: "600",
                                                        color: prod.cantidad < 50 ? "var(--danger)" : "var(--text-primary)"
                                                    }}>
                                                        {prod.cantidad}
                                                    </span>
                                                    {prod.cantidad < 50 && (
                                                        <span style={{ 
                                                            fontSize: "0.72rem", 
                                                            marginLeft: "6px", 
                                                            backgroundColor: "var(--danger-bg)", 
                                                            color: "var(--danger)",
                                                            padding: "2px 4px",
                                                            borderRadius: "3px",
                                                            border: "1px solid var(--danger-border)",
                                                            fontWeight: "600"
                                                        }}>
                                                            Bajo Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ color: "var(--text-secondary)" }}>
                                                    ${parseFloat(prod.precio || 0).toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                                </td>
                                                <td>
                                                    <div className="action-buttons" style={{ justifyContent: "center" }}>
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => editarProducto(index)}
                                                            title="Editar producto"
                                                        >
                                                            <EditIcon size={13} />
                                                            <span>Editar</span>
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => eliminarProducto(index)}
                                                            title="Eliminar producto"
                                                        >
                                                            <TrashIcon size={13} />
                                                            <span>Borrar</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                                {filtro ? "No se encontraron productos coincidentes." : "No hay stock de productos en inventario."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inventario;
