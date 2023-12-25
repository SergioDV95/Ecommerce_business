import { useState, useContext, useEffect } from "react";
import Session from "../Session/session";
import axios from "axios";

function Profile() {
   const server = "http://localhost:3001";
	const {user, setUser} = useContext(Session);
	const [newData, setNewData] = useState({
		id: user._id,
      phone: "",
		email: "",
      address: "",
		password: ""
	});
	const [error, setError] = useState({
      phone: "",
      email: "",
      address: "",
      password: "",
      repPassword: ""
   });
	const [input, setInput] = useState({
      phone: "",
      email: "",
      address: "",
      password: "",
      repPassword: ""
   });
	useEffect(() => {
		const handleSubmit = async () => {
			try {
				const response = await axios.patch(`${server}/users`, newData, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (response.status === 202) {
					alert("Datos actualizados con éxito");
					setUser(response.data);
               let keys = ["phone", "email", "address", "password", "repPassword"];
               for (let i = 0; i < 5; i++) {
                  setNewData((prev) => ({...prev, [keys[i]]: "" }));
                  setInput((prev) => ({...prev, [keys[i]]: "" }));
               }
				}
			} catch ({response, request, message, config}) {
            if (response.data) {
               const errors = response.data;
               console.log(response.status);
               console.log(response.headers);
               let errorList = {};
               for (let err in errors) {
                  if (errors[err]) {
                     errorList = {...errorList, [err]: errors[err]};
                  }
               }
               if (Object.keys(errorList).length > 0) {
                  setError((prev) => ({...prev, ...errorList}));
               }
               if (errors.name && errors.message) {
                  console.log(`${errors.name}: ${errors.message}`);
               }
            } else if (request) {
					console.log(request);
				} else {
					console.log("Error", message);
				}
				console.log(config);
			}
		}
		if (newData.phone || newData.email || newData.address || newData.password) {
			handleSubmit();
		} //eslint-disable-next-line
	}, [newData]);
	const handleChange = (event) => {
		const { name, value } = event.target;
		setInput((prev) => ({...prev, [name]: value }));
	}
   const handleValidation = (event) => {
      event.preventDefault();
      const { password, repPassword } = input;
      const regexList = { 
         phone: /^(\+[\d]{2})?\d{3,4}\d{3}\d{2}\d{2}$/, 
         email: /^[a-z0-9.-]+@[a-z0-9-]+(\.[a-z]{2,4}){1,3}$/i, 
         password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&.*/])[^<>{}:;'"?,]{8,16}$/,
         address: /^[a-z0-9-,. áéíóúñÁÉÍÓÚÑ]+$/i
      };
      let user = {};
      let errors = {};
      const message = {
         phone: "El teléfono es inválido", 
         email: "El correo es inválido", 
         address: "La dirección es inválida", 
         password: "La contraseña es inválida"
      };
      for (let field in input) {
         if (input[field]) {
            if (regexList[field] && !regexList[field].test(input[field])) {
               errors = {...errors, [field]: message[field]};
               user = {...user, [field]: ""};
            } else {
               errors = {...errors, [field]: ""};
               user = {...user, [field]: input[field]};
            }
         } else {
            errors = {...errors, [field]: ""};
            user = {...user, [field]: ""};
         }
      }
      if (password && regexList.password.test(password)) {
         if (!repPassword) {
            errors = {...errors, repPassword: "Repite la contraseña"};
            user = {...user, password: ""};
         } else if (password !== repPassword) {
            errors = {...errors, repPassword: "La contraseña no coincide"};
            user = {...user, password: ""};
         } else {
            errors = {...errors, repPassword: ""};
            user = {...user, password};
         }
      }
      setError((prev) => ({...prev, ...errors}));
      setNewData((prev) => ({...prev, ...user}));
   }
	return (
		<div>
			<form>
            <h1>{error.user && error.user}</h1>
            <label htmlFor="phone">Número de teléfono:</label>
            <input
               id="phone"
               type="tel"
               name="phone"
               value={input.phone}
               onChange={handleChange}
            />
            <div className="relative">
               <span className="error">{error.phone}</span>
            </div>
				<label htmlFor="email">Correo electrónico:</label>
				<input
					id="email"
					type="email"
					name="email"
					value={input.email}
					onChange={handleChange}
				/>
				<div className="relative">
               <span className="error">{error.email}</span>
            </div>
            <label htmlFor="address">Dirección:</label>
            <input
               id="address"
               type="text"
               name="address"
               value={input.address}
               onChange={handleChange}
            />
            <div className="relative">
               <span className="error">{error.address}</span>
            </div>
				<label htmlFor="password">Nueva contraseña:</label>
				<input
					id="password"
					type="password"
					name="password"
					value={input.password}
					onChange={handleChange}
					title={"La contraseña debe contener entre 8 y 16 caracteres y al menos uno de los siguientes:\n- Mayúscula\n- Minúcula\n- Dígito\n- Un caracter especial entre !@#$%^&*/"}
				/>
				<div className="relative">
               <span className="error">{error.password}</span>
            </div>
				<label htmlFor="repPassword">Confirmar contraseña:</label>
				<input
				id="repPassword"
				type="password"
				name="repPassword"
				value={input.repPassword}
				onChange={handleChange}
				/>
				<div className="relative">
				   <span className="error">{error.repPassword}</span>
				</div>
				<button className="btn border-x-indigo-700 border-y-indigo-500 border-2 border-solid"
					id="submit" 
					onClick={handleValidation} 
					type="button">Actualizar
				</button>
			</form>
		</div>
	);
};

export default Profile;