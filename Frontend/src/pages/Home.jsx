import { Link } from "react-router-dom";
import { 
    OrdersIcon, 
    InventoryIcon, 
    LogOutIcon 
} from "../components/Icons";

function Home() {
    return (
        <div>
            {/* Barra de Navegación Superior */}
            <div className="nav-bar">
                <div className="nav-brand">
                    <span>Grupo Cordillera</span>
                </div>
                <div className="nav-user">
                    <span className="user-tag">Usuario: admin</span>
                    <Link to="/" className="back-link">
                        <LogOutIcon size={16} />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </div>

            {/* Contenedor Principal */}
            <div className="container">
                <div style={{ marginBottom: "30px" }}>
                    <h2 style={{ fontFamily: "var(--font-family-title)", fontSize: "1.8rem", fontWeight: "700" }}>
                        Monitoreo Organizacional
                    </h2>
                    <p style={{ color: "var(--text-secondary)", marginTop: "5px", fontSize: "0.95rem" }}>
                        Seleccione el módulo al que desea ingresar para visualizar y gestionar la información.
                    </p>
                </div>

                {/* Grid de Módulos */}
                <div className="dashboard-grid">
                    {/* Módulo Pedidos */}
                    <div className="card">
                        <span className="badge badge-active">Activo</span>
                        <div className="card-icon">
                            <OrdersIcon size={22} />
                        </div>
                        <h3>Gestión de Pedidos</h3>
                        <p>
                            Monitoreo y administración en tiempo real de los pedidos registrados. Registre nuevos pedidos, edite descripciones y gestione estados.
                        </p>
                        <Link to="/pedidos" style={{ textDecoration: "none", width: "100%" }}>
                            <button style={{ width: "100%" }}>
                                Gestionar Pedidos
                            </button>
                        </Link>
                    </div>

                    {/* Módulo Inventario */}
                    <div className="card">
                        <span className="badge badge-active">Activo</span>
                        <div className="card-icon">
                            <InventoryIcon size={22} />
                        </div>
                        <h3>Gestión de Inventario</h3>
                        <p>
                            Administración y control de stock de bodega, productos y precios. Registre nuevos artículos, actualice cantidades y controle precios.
                        </p>
                        <Link to="/inventario" style={{ textDecoration: "none", width: "100%" }}>
                            <button style={{ width: "100%" }}>
                                Gestionar Inventario
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;