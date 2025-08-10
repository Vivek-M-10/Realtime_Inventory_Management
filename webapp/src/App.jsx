// import './App.css'
import { BrowserRouter, Route, Routes} from "react-router-dom";
import {Products} from "./routes/Products.jsx";
import {ProductsCreate} from "./routes/ProductCreate.jsx";
import Order from "./routes/Order.jsx";
import Registration from "./routes/Registeration.jsx";
import { Login } from "./routes/Login.jsx";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<Registration/>} />
            <Route path="/Login" element={<Login/>} />
            <Route path="/product" element={<Products/>} /> */}
            <Route path="/" element={<Products/>} />
            <Route path="/register" element={<Registration/>} />
            <Route path="/login" element={<Login/>} />
            
            <Route path = "/create" element={<ProductsCreate/>} />
            <Route path= "/order" element={<Order/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
