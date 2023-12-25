import { useState, useEffect } from "react";

const useFetch = (URL, method) => {
	const [res, setRes] = useState([]);
	switch (method) {
		case "GET":
         const bringProducts = async () => {
            try {
               const response = await axios.get("http://localhost:4000/api/products");
               if (response.data) {
                  setRes([...response.data]);
               }
            } catch ({name, message}) {
               console.error(`${name}: ${message}`);
            }
         };
         bringProducts();
         break;
	}
	try {
		return res;
	} catch (e) {
		console.log(e);
	}
};

export default useFetch;