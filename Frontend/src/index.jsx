import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Session, SignUp, ProductForm, ProductsDashboard, LogIn, Layout, Home, Cart, Profile, ProductsDisplay } from './Components/exports';

function App() {
   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
   useEffect(() => {
      localStorage.setItem('user', JSON.stringify(user));
   }, [user]);
   return (
      <BrowserRouter>
         <Session.Provider value={{user, setUser}}>
            <Routes>
               <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<LogIn />} />
                  <Route path="signup" element={<SignUp />} />
                  <Route path="new_product" element={<ProductForm />} />
                  <Route path="shopping_cart" element={<Cart />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="products_dashboard" element={<ProductsDashboard />} />
                  <Route path="products" element={<ProductsDisplay />} />
               </Route>
            </Routes>
         </Session.Provider>
      </BrowserRouter>
   );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
);
