import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

function Cart() {
   const navigate = useNavigate();
   const [product, setProduct] = useState([]);
   const [order, setOrder] = useState({});
   const [input, setInput] = useState({});
   const server = "http://localhost:3001";
   const location = useLocation();
   
   useEffect(() => {
      if (localStorage.getItem('order') && localStorage.getItem('input')) {
         setOrder(JSON.parse(localStorage.getItem('order')));
         setInput(JSON.parse(localStorage.getItem('input')));
      }
   }, [location]);
   useEffect(() => {
      if (input && input.products && input.products.length > 0) {
         const bringProducts = async () => {
            try {
               const response = await axios.post(`${server}/products/cart`, input, {
                  headers: {
                     'Content-Type': 'application/json'
                  }
               });
               if (response.data) {
                  setProduct([...response.data]);
               }
            } catch ({name, message}) {
               console.error(`${name}: ${message}`);
            }
         };
         bringProducts();
      }
   }, [input]);
   const handleSubmit = async (event) => {
      event.preventDefault();
      const sale = {...order, products: input.products};
      try {
         const response = await axios.post(`${server}/sales`, sale, {
            headers: {
               'Content-Type': 'application/json'
            }
         });
         if (response.status === 201) {
            alert("Comprado con éxito");
            localStorage.removeItem('order');
            localStorage.removeItem('input');
            navigate("/");
         }
      } catch ({name, message}) {
         console.error(`${name}: ${message}`);
      }
   };
   return (
      <>
         <form id="orderForm" className="flex w-[90%] items-start gap-[50px]">
            <div className="flex gap-[50px] w-full">
               {product.map((product) => (
                  <div key={product._id}>
                     <img className="" src={product.imageURL} alt={product.name} />
                     <p>Producto: {product.name}</p>
                     <p>Precio: {product.price}$</p>
                     <p>Disponible: {product.stock}</p>
                     <p>Categoría: {product.category}</p>
                  </div>
               ))}
            </div>
            <div className="flex flex-col gap-[15px] w-[140px]">
               <div className="flex justify-between items-end h-[20px]">
                  <p className="text-[#9098B1] text-[0.8em]">Subtotal:</p><p>{order.subtotal ? "$" + order.subtotal.toFixed(2) : ""}</p>
               </div>
               <div className="flex justify-between items-end h-[20px]">
                  <p className="text-[#9098B1] text-[0.8em]">IVA 16%:</p><p>{order.tax ? "$" + order.tax.toFixed(2) : ""}</p>
               </div>
               <div className="flex justify-between items-end h-[20px]">
                  <p className="text-[#9098B1] text-[0.8em]">Total:</p><p>{order.total ? "$" + order.total.toFixed(2) : ""}</p>
               </div>
            </div>
            <button className="btn bg-[#000000] border-x-indigo-700 border-y-indigo-500 border-2 border-solid"
               type="submit"
               onClick={handleSubmit}>Comprar
            </button>
         </form>
      </>
   );
};

export default Cart;