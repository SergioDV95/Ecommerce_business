import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import Session from "../Session/session";
import { polar, menuIco } from "./exports";
import GeneralMenu from "./navMenu/GeneralMenu";
import ClientMenu from "./navMenu/ClientMenu";
import VendorMenu from "./navMenu/VendorMenu";
import AdminMenu from "./navMenu/AdminMenu";

function Layout() {
   const [open, setOpen] = useState(false);
   const { user } = useContext(Session);
   let menu;
   if (open) {
      if (!user) {
         menu = <GeneralMenu />;
      } else {
         switch (user.role) {
            case "client":
               menu =<ClientMenu />
               break;
            case "vendor":
               menu = <VendorMenu />
               break;
            case "admin":
               menu = <AdminMenu />
         }
      }
   }
   return(
      <>
         <header className="fixed z-20 flex justify-between p-[25px] items-center w-full box-border h-[73px] bg-[#f1f6f9]">
            <img
            className="w-[141px] h-[47px] top-[13px] left-[28px] object-cover"
            alt="Empresaspolar" src={polar}/>
            <input 
            className="w-[30px] h-[30px] relative right-[35px]"
            type="image" src={menuIco} alt="menu"
            onClick={() => setOpen(!open)}/>
            {menu}
         </header>
         <Outlet />
      </>
   )
}

export default Layout;