import './App.css'
import { BrowserRouter, Route, Routes} from "react-router-dom";
import {Products} from "./routes/Products.jsx";
import {ProductsCreate} from "./routes/ProductCreate.jsx";
import Order from "./routes/Order.jsx";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Products/>} />
            <Route path = "/create" element={<ProductsCreate/>} />
            <Route path= "/order" element={<Order/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
