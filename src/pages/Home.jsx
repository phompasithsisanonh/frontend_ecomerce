import React, { useEffect } from "react";
import Header from "../components/Header";
import { Box, Container, Grid } from "@chakra-ui/react";
import Categorys from "../components/Categorys";
import Banner from "../components/Banner";
import FeatureProducts from "../components/products/FeatureProducts";
import Products from "../components/products/Products";
import Footer from "../components/Footer";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../store/reducers/homeReducers";
const Home = () => {
  const dispatch = useDispatch();
  const {
    categorys,
    latest_product,
    topRated_product,
    discount_product,
  } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(get_products());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Search categorys={categorys} />
      <Banner />
      <Categorys categorys={categorys} />

      <FeatureProducts />

      <Container maxW="85%">
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(1, 1fr)",
            lg: "repeat(1, 1fr)",
          }}
          gap={3}
        >
          <Box overflow="hidden">
            <Products  products={latest_product} title="ສິນຄ້າໃໝ່ລ່າສຸດ" />
          </Box>

          <Box overflow="hidden">
            <Products title="ສິນຄ້າຍອດນິຍົມ" products={topRated_product} />
          </Box>

          <Box overflow="hidden">
            <Products title="ສິນຄ້າຫຼຸດລາຄາ" products={discount_product} />
          </Box>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
