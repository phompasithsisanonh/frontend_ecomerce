import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Card from "./pages/Card";
import Shipping from "./pages/Shipping";
import Details from "./pages/Details";
import LoginCustomer from "./pages/LoginCustomer";
import RegisterCustomer from "./pages/RegisterCustomer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { get_category } from "./store/reducers/homeReducers";
import SearchProducts from "./pages/SearchProducts";

import Payment from "./pages/Payment";
import Dashbord from "./pages/Dashbord";
import { useLocation } from "react-router-dom";
import SellerProfile from "./pages/SellerProfile";
// import Fint from "./Fint";
function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginCustomer />} />
      <Route path="/register" element={<RegisterCustomer />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/card" element={<Card />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/dashboard" element={<Dashbord />} />
      <Route path="/seller_profile/:id" element={<SellerProfile />} />
      <Route path="/details/products/:id" element={<Details />} />
      <Route path="/products/search?" element={<SearchProducts />} />
      {/* <Route path="/" element={<Fint />} /> */}
    </Routes>
  );
}

export default App;
