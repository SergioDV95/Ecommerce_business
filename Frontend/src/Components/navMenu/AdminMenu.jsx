import { home, box, log_out, settings, shopping_bag, userIco } from "../exports"
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "../exports";

function GeneralMenu() {
   const { setUser } = useContext(Session);
   const navigate = useNavigate();
   const logout = () => {
      setUser(null);
      navigate("/");
   }
   return (
      <nav className="absolute flex flex-col right-0 top-[73px] w-[170px] bg-white [border-bottom-left-radius:25px]">
         <Link to="/" className="navbutton">
            <img className="w-[22px]" src={home} alt="home" />
            <p>Inicio</p>
         </Link>
         <Link to="/clients" className="navbutton">
            <img className="w-[22px]" src={userIco} alt="user" />
            <p>Clientes</p>
         </Link>
         <Link to="/vendors" className="navbutton">
            <img className="w-[22px]" src={userIco} alt="user" />
            <p>Vendedores</p>
         </Link>
         <Link to="/products_dashboard" className="navbutton">
            <img className="w-[22px]" src={box} alt="box" />
            <p>Inventario</p>
         </Link>
         <Link to="/sales" className="navbutton">
            <img className="w-[22px]" src={box} alt="box" />
            <p>Ventas</p>
         </Link>
         <Link to="/reports" className="navbutton">
            <img className="w-[22px]" src={shopping_bag} alt="box" />
            <p>Reportes</p>
         </Link>
         <Link to="/settings" className="navbutton">
            <img className="w-[22px]" src={settings} alt="box" />
            <p>Ajustes</p>
         </Link>
         <button className="navbutton [border-bottom-left-radius:25px]" type="button" onClick={logout}>
            <img className="w-[22px]" src={log_out} alt="signup" />
            <p>Cerrar Sesión</p>
         </button>
      </nav>
   );
}
export default GeneralMenu;