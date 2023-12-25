import { home, box, cart, log_out, settings } from "../exports"
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
         <Link to="/products" className="navbutton">
            <img className="w-[22px]" src={box} alt="products" />
            <p>Productos</p>
         </Link>
         <Link to="/shopping_cart" className="navbutton">
            <img className="w-[22px]" src={cart} alt="login" />
            <p>Carrito</p>
         </Link>
         <Link to="/settings" className="navbutton">
            <img className="w-[22px]" src={settings} alt="signup" />
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