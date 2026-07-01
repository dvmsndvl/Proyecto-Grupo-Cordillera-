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

const MOCK_PEDIDOS = [
    { producto: "Cemento Melón Extra", cantidad: 20, sucursalOrigen: "Santiago Centro", montoTotal: 150000, estado: "Completado", fechaCreacion: "2026-06-04T18:49:06" },
    { producto: "Fierro de Construcción 12mm", cantidad: 5, sucursalOrigen: "Concepción", montoTotal: 60000, estado: "Pendiente", fechaCreacion: "2026-06-04T18:51:59" }
];

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    
    // Campos del Formulario
    const [producto, setProducto] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [sucursalOrigen, setSucursalOrigen] = useState("");
    const [montoTotal, setMontoTotal] = useState("");
    const [estado, setEstado] = useState("Pendiente");
    
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

    const cargarPedidos = () => {
        api.get("/pedidos")
            .then((response) => {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setPedidos(response.data);
                } else {
                    cargarDeLocalStorage();
                }
            })
            .catch((error) => {
                console.warn("API de Pedidos no disponible, utilizando modo Demo Offline (LocalStorage).");
                mostrarAlerta("No se pudo conectar con el servidor. Modo Offline activado.", "warning");
                cargarDeLocalStorage();
            });
    };

    const cargarDeLocalStorage = () => {
        const guardados = localStorage.getItem("cordillera_pedidos");
        if (guardados) {
            setPedidos(JSON.parse(guardados));
        } else {
            setPedidos(MOCK_PEDIDOS);
            localStorage.setItem("cordillera_pedidos", JSON.stringify(MOCK_PEDIDOS));
        }
    };

    const guardarEnLocalStorage = (nuevaLista) => {
        localStorage.setItem("cordillera_pedidos", JSON.stringify(nuevaLista));
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const guardarPedido = (e) => {
        e.preventDefault();

        if (!producto.trim() || cantidad === "" || !sucursalOrigen.trim() || montoTotal === "") {
            mostrarAlerta("Por favor, complete todos los campos.", "error");
            return;
        }

        const cantVal = parseInt(cantidad, 10);
        const montoVal = parseFloat(montoTotal);

        if (isNaN(cantVal) || cantVal <= 0) {
            mostrarAlerta("La cantidad debe ser un número entero positivo.", "error");
            return;
        }

        if (isNaN(montoVal) || montoVal <= 0) {
            mostrarAlerta("El monto total debe ser un número positivo.", "error");
            return;
        }

        let copia = [...pedidos];

        if (editando !== null) {
            copia[editando] = {
                ...copia[editando],
                producto: producto.trim(),
                cantidad: cantVal,
                sucursalOrigen: sucursalOrigen.trim(),
                montoTotal: montoVal,
                estado: estado
            };
            setPedidos(copia);
            setEditando(null);
            mostrarAlerta("Pedido actualizado correctamente.", "success");
        } else {
            const nuevoPedidoObj = {
                producto: producto.trim(),
                cantidad: cantVal,
                sucursalOrigen: sucursalOrigen.trim(),
                montoTotal: montoVal,
                estado: estado,
                fechaCreacion: new Date().toISOString()
            };
            copia = [...pedidos, nuevoPedidoObj];
            setPedidos(copia);
            mostrarAlerta("Pedido registrado correctamente.", "success");
        }

        guardarEnLocalStorage(copia);
        limpiarFormulario();
    };

    const editarPedido = (index) => {
        const ped = pedidos[index];
        setProducto(ped.producto || "");
        setCantidad(ped.cantidad !== undefined ? ped.cantidad : "");
        setSucursalOrigen(ped.sucursalOrigen || "");
        setMontoTotal(ped.montoTotal !== undefined ? ped.montoTotal : "");
        setEstado(ped.estado || "Pendiente");
        setEditando(index);
    };

    const eliminarPedido = (index) => {
        const copia = [...pedidos];
        copia.splice(index, 1);
        setPedidos(copia);
        guardarEnLocalStorage(copia);
        mostrarAlerta("Pedido eliminado correctamente.", "success");
        
        if (editando === index) {
            limpiarFormulario();
        }
    };

    const limpiarFormulario = () => {
        setProducto("");
        setCantidad("");
        setSucursalOrigen("");
        setMontoTotal("");
        setEstado("Pendiente");
        setEditando(null);
    };

    const pedidosFiltrados = pedidos.filter((pedido) => {
        const searchStr = `${pedido.producto || ""} ${pedido.sucursalOrigen || ""}`.toLowerCase();
        return searchStr.includes(filtro.toLowerCase());
    });

    return (
        <div>
            {/* Barra de Navegación */}
            <div className="nav-bar">
                <div className="nav-brand">
                    <span>Grupo Cordillera</span>
                </div>
                <div className="nav-user">
                    <span className="user-tag">Módulo: Pedidos</span>
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
                        Gestión de Pedidos
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
                            {editando !== null ? "Editar Pedido" : "Nuevo Pedido"}
                        </h2>
                        
                        <form onSubmit={guardarPedido}>
                            <div className="form-group">
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Producto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Cemento Melón Extra"
                                    value={producto}
                                    onChange={(e) => setProducto(e.target.value)}
                                    style={{ paddingLeft: "12px" }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Cantidad
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ej: 10"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    style={{ paddingLeft: "12px" }}
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Sucursal de Origen
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Santiago Centro"
                                    value={sucursalOrigen}
                                    onChange={(e) => setSucursalOrigen(e.target.value)}
                                    style={{ paddingLeft: "12px" }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Monto Total ($)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Ej: 150000"
                                    value={montoTotal}
                                    onChange={(e) => setMontoTotal(e.target.value)}
                                    style={{ paddingLeft: "12px" }}
                                    min="0"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "10px" }}>
                                <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", alignSelf: "flex-start" }}>
                                    Estado
                                </label>
                                <select
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        backgroundColor: "var(--bg-secondary)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "var(--border-radius-sm)",
                                        fontSize: "0.9rem",
                                        color: "var(--text-primary)"
                                    }}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Completado">Completado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button type="submit" style={{ flexGrow: 1 }}>
                                    {editando !== null ? (
                                        <span>Actualizar Pedido</span>
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

                    {/* Columna Derecha: Tabla */}
                    <div className="glass-panel">
                        <div className="section-actions">
                            <h2 style={{ marginBottom: 0 }}>
                                Lista de Pedidos
                            </h2>
                            <div className="search-container">
                                <SearchIcon className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Filtrar por sucursal o producto..."
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: "6%" }}>#</th>
                                        <th>Producto</th>
                                        <th style={{ width: "10%" }}>Cant.</th>
                                        <th>Sucursal</th>
                                        <th>Monto Total</th>
                                        <th>Estado</th>
                                        <th style={{ width: "25%", textAlign: "center" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosFiltrados.length > 0 ? (
                                        pedidosFiltrados.map((pedido, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td style={{ fontWeight: "600" }}>{pedido.producto || "N/A"}</td>
                                                <td>{pedido.cantidad || 0}</td>
                                                <td style={{ fontWeight: "500" }}>{pedido.sucursalOrigen}</td>
                                                <td>
                                                    ${parseFloat(pedido.montoTotal || 0).toLocaleString("es-CL", { minimumFractionDigits: 0 })}
                                                </td>
                                                <td>
                                                    <span style={{
                                                        fontWeight: "600",
                                                        color: pedido.estado === "Completado" ? "var(--success)" : 
                                                               pedido.estado === "Cancelado" ? "var(--danger)" : "var(--warning)"
                                                    }}>
                                                        {pedido.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons" style={{ justifyContent: "center" }}>
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => editarPedido(index)}
                                                            title="Editar pedido"
                                                        >
                                                            <EditIcon size={13} />
                                                            <span>Editar</span>
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => eliminarPedido(index)}
                                                            title="Eliminar pedido"
                                                        >
                                                            <TrashIcon size={13} />
                                                            <span>Eliminar</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                                {filtro ? "No se encontraron pedidos coincidentes." : "No hay pedidos registrados."}
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

export default Pedidos;