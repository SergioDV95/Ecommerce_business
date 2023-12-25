import { useState, useEffect, useContext } from "react";
import Session from "../Session/session";
import axios from "axios";
import searchImage from '../images/icons/search.png';

function ProductsDashboard() {
   const [product, setProduct] = useState([]);
   const [search, setSearch] = useState({
      value: "",
      error: ""
   });
   const [pagination, setPagination] = useState({
      pages: [],
      currentPage: 1
   });
   const server = "http://localhost:3001";
   const limit = 2;
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
   };
   
   useEffect(() => {
      if (!search.value) {
         fetchProducts(1);
      }
   }, [search.value]);

   const validateSearch = () => {
      const regexValue = /^[\w ]+$/;
      if (!search.value) {
         setSearch((prev) => ({...prev, error: "Ingresa un valor para buscar"}));
      } else if (!regexValue.test(search.value)) {
         setSearch((prev) => ({...prev, error: "Búsqueda inválida"}));
      } else {
         setSearch((prev) => ({...prev, error: ""}));
         fetchProducts(1);
      }
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
         <section id="productsDashboard" className="flex w-[90%] items-start gap-[50px] p-[50px]">
            <div className="flex gap-[20px] w-full">
               {product && product.map((product) => (
                  <figure className="flex" key={product._id}>
                     <div className="flex flex-col items-center justify-center">
                        <img className="w-[50px]" src={product.imageURL} alt={product.name} />
                     </div>
                     <div className="flex flex-col">
                        <p>Nombre: {product.name}</p>
                        <p>Categoría: {product.category}</p>
                        <p>Precio: ${product.price}</p>
                        <p>Inventario: {product.stock}</p>
                     </div>
                     <div className="flex flex-col">
                        <input type="image" src="" alt="" />
                        <input type="image" src="" alt="" />
                     </div>
                  </figure>
               ))}
            </div>
         </section>
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

export default ProductsDashboard;