import { useContext } from "react";
import { Link } from "react-router-dom";
import { ProductsDisplay, Session } from "./exports";

function Home() {
   const {user} = useContext(Session);
   if (!user) {
      return (
         <section>

         </section>
      );
   } else {
      return (
         <section className="w-full flex flex-col gap-[30px] items-center">
            
         </section>
      );
   }
}

export default Home;