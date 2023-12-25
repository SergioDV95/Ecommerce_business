import { useState, useEffect, useRef } from "react";
import axios from "axios";

function ProductForm() {
   const server = "http://localhost:3001";
   const [product, setProduct] = useState({});
   const [error, setError] = useState({});
   const [input, setInput] = useState({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      image: ""
   });
   const button = useRef();
   const inputFile = useRef();
   const handleSubmit = async () => {
      try {
         const formdata = new FormData();
         for (const prop in product) {
            formdata.append(prop, product[prop]);
         }
         const response = await axios.post(`${server}/products`, formdata, {
            headers: {
               "Content-Type": "multipart/form-data"
            }
         });
         if (response.status === 201) {
            alert("Producto creado con éxito");
            const keys = ["name", "price", "stock", "description", "category"];
            for (let i = 0; i < keys.length; i++) {
               setProduct((prev) => ({...prev, [keys[i]]: "" }));
               setInput((prev) => ({...prev, [keys[i]]: "" }));
            }
         }
      } catch ({name, message}) {
         console.error(`Ha ocurrido un error: ${name}. Con el mensaje: ${message}.`);
      }
   }
   const handleChange = (event) => {
      const { name, value } = event.target;
      setInput((prev) => ({...prev, [name]: value }));
   }
   const handleValidation = () => {
      const regexList = {
         name: /^[a-z0-9áéíóúñÁÉÍÓÚÑ' &:\-.]+$/i,
         price: /^([1-9]\d{0,3}(\.\d{1,2})?|0\.\d?[1-9])$/,
         stock: /^[1-9]\d{0,6}$/,
         description: /^[a-z0-9\-áéíóúñÁÉÍÓÚÑ,.:\s]+$/i
      };
   
      const message = {
         name: "Nombre inválido",
         price: "Precio inválido",
         stock: "Número de existencias inválido",
         description: "Descripción inválida",
         image: "Sólo archivos en formato: png, jpg, jpeg"
      };
      let product = {};
      let errors = {};
      let isValid = true;
      for (let field in input) {
         if (input[field]) {
            if (regexList[field] && !regexList[field].test(input[field])) {
               errors = {...errors, [field]: message[field]};
               product = {...product, [field]: ""};
               isValid = false;
            } else {
               errors = {...errors, [field]: ""};
               product = {...product, [field]: input[field]};
            }
         } else if (field === "image") {
            if (inputFile.current.files.length > 0) {
               const file = inputFile.current.files[0];
               switch (file.type) {
                  case "image/jpeg":
                  case "image/png":
                     product = {...product, image: file };
                     errors = {...errors, image: "" };
                     break;
                  default:
                     errors = {...errors, [field]: message[field]};
                     product = {...product, image: null};
                     isValid = false;
               }
            } else {
               isValid = false;
            }
         } else if (field === "category") {
            if (input[field] === "") {
               product = {...product, [field]: ""};
               isValid = false;
            } else {
               errors = {...errors, [field]: ""};
               product = {...product, [field]: input[field]};
            }
         }
         else {
            isValid = false;
         }
      }
      button.current.disabled = !isValid;
      setError(errors);
      setProduct(product);
   }
   
   useEffect(() => {
      handleValidation();
      //eslint-disable-next-line
   }, [input]);
   return (
      <div className="h-screen flex justify-center">
         <form>
            <label htmlFor="image">Imagen del producto:</label>
            <input
               ref={inputFile}
               id="image"
               type="file"
               name="image"
               accept="image/jpeg, image/png"
               onChange={handleValidation}
            />
            <div className="relative">
               <span className="error">{error.image}</span>
            </div>
            <label htmlFor="name">Nombre:</label>
            <input
               id="name"
               type="text"
               name="name"
               value={input.name}
               onChange={handleChange}
               title={"Letras, números, espacios y caracteres entre:\n:&'"}
            />
            <div className="relative">
               <span className="error">{error.name}</span>
            </div>
            <label htmlFor="price">Precio:</label>
            <input
               id="price"
               type="text"
               min="0"
               step="0.01"
               name="price"
               value={input.price}
               onChange={handleChange}
               onInput={(event) => {event.target.value = event.target.value.replace(/[^\d.]/, "");}}
               title="Solo números enteros o con hasta dos decimales"
            />
            <div className="relative">
               <span className="error">{error.price}</span>
            </div>
            <label htmlFor="stock">Inventario:</label>
            <input
               id="stock"
               type="text"
               min="0"
               name="stock"
               value={input.stock}
               onChange={handleChange}
               onInput={(event) => {event.target.value = event.target.value.replace(/[^\d]/, "");}}
               title="Solo números enteros mayores que 0"
            />
            <div className="relative">
               <span className="error">{error.stock}</span>
            </div>
            <label htmlFor="description">Descripción:</label>
            <textarea
               id="description"
               name="description"
               value={input.description}
               onChange={handleChange}
               title={"Letras, números, espacios y caracteres entre:\n:-,.:"}
            />
            <div className="relative">
               <span className="error">{error.description}</span>
            </div>
            <label htmlFor="category">Categoría:</label>
            <select
               id="category"
               name="category"
               value={input.category}
               onChange={handleChange}
            >
               <option className="text-[#9BA4B4]" value="">--Selecciona una categoría--</option>
               <option value="Alimentos">Alimentos</option>
               <option value="Bebidas">Bebidas</option>
               <option value="Mascotas">Mascotas</option>
               <option value="Limpieza">Limpieza</option>
            </select>
            <div className="relative">
               <span className="error">{error.category}</span>
            </div>
            <button className={button.current && button.current.disabled === true ? "btn text-[#ffffff41] bg-[#00000042] border-x-[#372da14d] border-y-[#5759d33d]" : "btn bg-[#000000] text-[#FFFFFF] border-x-[#4237C7] border-y-[#6366F1] border-2 border-solid"}
               ref={button}
               id="submit"
               onClick={handleSubmit} 
               type="button">Crear producto
            </button>
         </form>
      </div>
   );
};

export default ProductForm;