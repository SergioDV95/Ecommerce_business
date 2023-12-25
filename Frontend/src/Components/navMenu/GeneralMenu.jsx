import { home, box, log_in, signup } from "../exports"
import { Link } from "react-router-dom";

function GeneralMenu() {
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
         <Link to="/login" className="navbutton">
            <img className="w-[22px]" src={log_in} alt="login" />
            <p>Iniciar Sesión</p>
         </Link>
         <Link to="/signup" className="navbutton [border-bottom-left-radius:25px]">
            <img className="w-[22px]" src={signup} alt="signup" />
            <p>Registrarse</p>
         </Link>
      </nav>
   );
}
export default GeneralMenu;