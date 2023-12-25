import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Session from "../Session/session";
import axios from "axios";
import searchImage from '../images/icons/search.png';

function ProductsDisplay() {
   const {user} = useContext(Session);
   const server = "http://localhost:3001";
   const [search, setSearch] = useState({
      value: "",
      error: ""
   });
   const [product, setProduct] = useState([]);
   const [pagination, setPagination] = useState({
      pages: [],
      currentPage: 1
   });
   const limit = 2;
   const navigate = useNavigate();
   const [order, setOrder] = useState(JSON.parse(localStorage.getItem("order")) || {
      client: user._id,
      subtotal: 0,
      tax: 0,
      total: 0
   });
   const [input, setInput] = useState(JSON.parse(localStorage.getItem("input")) || {
      products: [],
      value: {},
      checked: {}
   });
   useEffect(() => {
      localStorage.setItem('order', JSON.stringify(order));
      localStorage.setItem('input', JSON.stringify(input));
   }, [order, input])
   useEffect(() => {
      if (!search.value) {
         fetchProducts(1);
      }
   }, [search.value]);
   useEffect(() => {
      const calculateTotal = () => {
         let addition = 0;
         for (let id in input.value) {
            addition += Number(input.value[id]);
         }
         let tribute = addition * 0.16;
         setOrder((prev) => ({...prev, subtotal: addition, tax: tribute, total: addition + tribute}));
      }
      calculateTotal();
   }, [input]);
   const handleChange = (event) => {
      const { id, checked, value } = event.target;
      if (checked) {
         setInput((input) => ({...input, products: [...input.products, id], value: {...input.value, [id]: value}, checked: {...input.checked, [id]: checked}}));
      } else {
         setInput((input) => {
            delete input.value[id];
            return {
               ...input,
               products: input.products.filter((Id) => Id !== id),
               value: {...input.value},
               checked: {...input.checked, [id]: checked}
            }
         })
      }
   }
   const fetchProducts = async (page) => {
      const searchParam = search.value ? `search=${search.value}&` : "";
      try {
         const response = await axios.get(`${server}/products?${searchParam}page=${page}&limit=${limit}`);
         if (response.status === 200) {
            const { docs, totalPages } = response.data;
            setProduct([...docs]);
            let pagesCount = [];
            for (let i = 1; i <= totalPages; i++) {
               pagesCount.push(i);
            }
            setPagination({pages: pagesCount, currentPage: page});
         }
      } catch ({name, message}) {
         console.error(`${name}: ${message}`);
      }
   }
   
   const validateSearch = () => {
      const regexValue = /^[\w ]+$/;
      if (!search.value) {
         setSearch((prev) => ({...prev, error: ""}));
      } else if (!regexValue.test(search.value)) {
         setSearch((prev) => ({...prev, error: "Búsqueda inválida"}));
      } else {
         setSearch((prev) => ({...prev, error: ""}));
         fetchProducts(1);
      }
   }

   const handleClick= () => {
      navigate("/shopping_cart", {state: {order, input}});
   }
   return (
      <>
         <div className="flex justify-center bg-[#F1F6F9] h-[41px] rounded-[35px]">
            <div className="flex flex-col justify-center items-center">
               <input
                  type="text"
                  placeholder="¿Qué necesitas?"
                  id="search"
                  onChange={(event) => setSearch((prev) => ({...prev, value: event.target.value}))}
                  onKeyDown={(event) => {
                     if (event.key === "Enter") {
                        validateSearch();
                     }
                  }}
               />
               <div className="relative w-full top-[13px]">
                  <span className="error">{search.error}</span>
               </div>
            </div>
            <div className="flex justify-center items-center bg-[#14274E] rounded-[35px] w-[41px] h-[41px] cursor-pointer" onClick={validateSearch}>
               <input
                  type="image"
                  alt="buscar"
                  src={searchImage}
                  className="w-[20px]"
               />
            </div>
         </div>
         <form id="ProductsDisplay" className="flex w-[90%] items-start gap-[50px] p-[50px]">
            <div className="flex gap-[20px] w-full">
               {product && product.map((product) => (
                  <div key={product._id}>
                     <img className="" src={product.imageURL} alt={product.name} />
                     <input className="w-min h-min"
                        type="checkbox" 
                        form="ProductsDisplay"
                        checked={input.checked && (input.checked[product._id] || false)}
                        onChange={handleChange}
                        id={product._id}
                        value={product.price}
                     />
                     <label htmlFor={product._id}>Añadir al carrito</label>
                     <p>Producto: {product.name}</p>
                     <p>Precio: ${product.price}</p>
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
            <button className={input.products.length === 0 ? "btn text-[#FFFFFF80] bg-[#00000080] border-x-[#4237C780] border-y-[#6366F180]" : "btn bg-[#000000] text-[#FFFFFF] border-x-[#4237C7] border-y-[#6366F1] border-2 border-solid"} 
               disabled={input.products.length === 0}
               type="button"
               onClick={handleClick}>Ir al carrito
            </button>
         </form>
         <div className="flex justify-center items-center border-[#EDEFF1] border-[1px] w-[310px] rounded-[25px] ">
            {pagination.pages && pagination.pages.map((page, index) => (
               <input
                  className={`border-[1px] rounded-[25px] w-[27.5px] cursor-pointer ${page === pagination.currentPage ? "bg-[#3056D3] text-white border-[#3056D3] " : "text-[#637381] border-[#EDEFF1]"}`}
                  type="button"
                  value={page}
                  key={index}
                  onClick={() => {fetchProducts(page);}}
               />
            ))}
         </div>
      </>
   );
};

export default ProductsDisplay;