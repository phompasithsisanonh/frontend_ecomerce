import {
  Box,
  Center,
  Flex,
  Img,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Stack,
  Text,
  Select,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Image,
  Grid,
  Input,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { FaCartShopping, FaEye, FaRegHeart, FaStar } from "react-icons/fa6";
import { FaHeart} from "react-icons/fa";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  get_products,
  price_range_product,
  query_products,
} from "../store/reducers/homeReducers";
import { Range } from "react-range";
import "../components/css/Header.css";
import Pagination from "../components/Pagination";
import Search from "./Search";

import {
  add_to_card,
  get_card_products,
  get_wishlist,
  messageClear,
  wishlist,
} from "../store/reducers/cardReducer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Shop = () => {
  const dispatch = useDispatch();
  const {
    products,
    categorys,
    priceRange,
    totalProducts,
    parPage,
  } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(price_range_product());
  }, [dispatch]);
  const [sliderValue, setSliderValue] = useState([0, 1000]); // Initial value range
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state for filters
  useEffect(() => {
    setState({
      values: [priceRange.low, priceRange.high],
    });
  }, [priceRange]);
  const [state, setState] = useState({
    values: [priceRange.low, priceRange.high],
  });
  const [category, setCategory] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [rating, setRating] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const ratings = [1, 2, 3, 4, 5];

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [localWishlist, setLocalWishlist] = useState([]);
  const { errorMessage, successMessage, wishlists } = useSelector(
    (state) => state.card
  );
  const queryCategory = (e, value) => {
    e.preventDefault();
    if (e.target.checked) {
      setCategory(value);
    } else {
      setCategory("");
    }
  };
  const Rating = ({ value }) => {
    return (
      <Box>
        <Flex>
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              color={index < value ? "yellow.400" : "gray.300"}
            />
          ))}
        </Flex>
      </Box>
    );
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(get_wishlist({ id: userInfo._id }));
      dispatch(get_card_products(userInfo._id));
    }
  }, [dispatch, userInfo]);

  const handleAddToCart = (product) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (product.stock === 1) {
      toast.error(" ❌ ສິນຄ້າໝົດ ❌");
    } else {
      if (userInfo) {
        dispatch(
          add_to_card({
            userId: userInfo._id,
            productId: product._id,
            quantity: 1,
          })
        ).then(() => {
          dispatch(get_card_products(userInfo._id)); // ดึงข้อมูลใหม่หลังการเพิ่ม
        });
      }
    }
  };

  const handleWishlist = (productId) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    dispatch(wishlist({ id: userInfo._id, productId })).then(() => {
      dispatch(get_wishlist({ id: userInfo._id }));
    });
    setLocalWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((item) => item !== productId)
        : [...prev, productId]
    );
  };
  const clearfilter = () => {
    setCategory("");
    setSortPrice("");
    setRating("");
    setPageNumber(1); // Ensure pagination resets to the first page
    setState((prevState) => ({
      ...prevState,
      values: [priceRange?.low ?? 0, priceRange?.high ?? 1000], // Default values if undefined
    }));
  };

  useEffect(() => {
    setLocalWishlist(wishlists.map((item) => item.productId?._id));
  }, [wishlists]);

  useEffect(() => {
    dispatch(
      query_products({
        low: state.values[0],
        high: state.values[1],
        sortPrice,
        category,
        rating,
        pageNumber,
      })
    );
  }, [
    sortPrice,
    category,
    parPage,
    dispatch,
    pageNumber,
    rating,
    priceRange,
    state.values[0],
    state.values[1],
  ]);
  useEffect(() => {
    dispatch(get_products());
    dispatch(price_range_product());
  }, [dispatch]);
  useEffect(() => {
    if (priceRange.low && priceRange.high) {
      setState({ values: [priceRange.low, priceRange.high] });
    }
  }, [priceRange]);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <Box w="full" mt={{ base: 6, md: 0 }}>
      <Header />
      <Search />
      {/* Banner Section */}
      <Center>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection={{ base: "column", md: "row" }}
          position={"absolute"}
          zIndex={1}
          mb={{ base: 4, md: 0 }}
        >
          <Text fontSize={{ base: "sm", md: "xl" }} fontWeight="bold" mr={4}>
            Shop
          </Text>
          <Text fontSize={{ base: "sm", md: "lg" }} color="gray.600">
            Shop / Products
          </Text>
        </Box>
        <Img
          width={{ base: "auto", md: "100%" }}
          height={{ base: "auto", md: "200px" }}
          objectFit="cover"
          opacity={1}
          backgroundRepeat="no-repeat"
          bg="black"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          src="http://localhost:3000/images/banner/1.jpg"
          alt="Shop Banner"
        />
      </Center>

      {/* Main Content Section */}
      <Box paddingTop={"20px"} w="full" mt={{ base: 6, md: 0 }}>
        <Center w="full" px={4}>
          <Flex w="full" direction={{ base: "column", md: "row" }}>
            {/* Filter Sidebar */}
            <Box
              borderWidth="1px"
              borderRadius="15px"
              overflow="hidden"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              // _hover={{
              //   transform: "translateY(-8px)",
              //   boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
              // }}
              position="relative"
              bg="white"
              w={{ base: "full", md: "45%" }}
              p={4}
            >
              {/* Filters - Categories */}
              <Flex mb={4}>
                <RadioGroup>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Category
                  </Text>
                  <Stack direction="column">
                    {categorys.map((category, index) => (
                      <Radio
                        checked={category === categorys.name ? true : false}
                        key={index}
                        value={category.name}
                        onChange={(e) => queryCategory(e, category.name)}
                      >
                        {category.name}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Flex>

              {/* Price Range Filter */}
              <Box mb={4}>
                <Text fontSize="lg" mb={2}>
                  Price: {state.values[0]} - {state.values[1]}
                </Text>
                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={state.values}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <div {...props} className="range-track">
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div {...props} className="range-thumb" />
                  )}
                />
              </Box>
              {/* Ratings Filter */}
              <Box mb={4}>
                <Text fontSize="xl" mb={4}>
                  Ratings:
                </Text>

                <Flex cursor={"pointer"} onClick={() => setRating(5)} mb={4}>
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                </Flex>
                <Flex cursor={"pointer"} onClick={() => setRating(4)} mb={4}>
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                </Flex>
                <Flex cursor={"pointer"} onClick={() => setRating(3)} mb={4}>
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                </Flex>
                <Flex cursor={"pointer"} onClick={() => setRating(2)} mb={4}>
                  <FaStar color="#EDBB0E" />
                  <FaStar color="#EDBB0E" />
                </Flex>
                <Flex cursor={"pointer"} onClick={() => setRating(1)} mb={4}>
                  <FaStar color="#EDBB0E" />
                </Flex>
              </Box>
              {/* <Products title="Latest Products" /> */}
            </Box>

            {/* Sorting and Product List */}
            <Box
              borderWidth="1px"
              borderRadius="15px"
              overflow="hidden"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              // _hover={{
              //   transform: "translateY(-8px)",
              //   boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
              // }}
              position="relative"
              bg="white"
              p={4}
            >
              {/* Sorting */}
              <Box mb={4}>
                <Flex>
                  <Box>
                    <Text fontSize={{ base: "10px", md: "lg" }} mb={2}>
                      ລ້າງຄຳຄົ້ນຫາ
                    </Text>
                    <Button colorScheme="red" onClick={() => clearfilter()}>
                      ລ້າງຄຳຄົນຫາ
                    </Button>
                  </Box>
                  <Box paddingLeft={"15px"}>
                    <Text fontSize={{ base: "10px", md: "lg" }} mb={2}>
                      ຄົ້ນຫາສິນຄ້າ
                    </Text>
                    <Input />
                  </Box>
                  <Box paddingLeft={"15px"}>
                    <Text fontSize={{ base: "10px", md: "lg" }} mb={2}>
                      Sort Products:
                    </Text>
                    <Select
                      value={sortPrice}
                      onChange={(e) => setSortPrice(e.target.value)}
                    >
                      <option value="">Sort By</option>
                      <option value="low-to-high">Low to High Price</option>
                      <option value="high-to-low">High to Low Price </option>
                    </Select>
                  </Box>
                </Flex>
              </Box>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={4}
              >
                {products.map((p, i) => (
                  <Box
                    key={i}
                    borderWidth="1px"
                    borderRadius="15px"
                    overflow="hidden"
                    transition="transform 0.3s ease, box-shadow 0.3s ease"
                    _hover={{
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                    }}
                    position="relative"
                    bg="white"
                  >
                    <Image
                      w="450px"
                      h="220px"
                      objectFit="cover"
                      src={p.images[0]}
                      alt={`Product ${i + 1}`}
                      transition="transform 0.3s ease"
                      _hover={{ transform: "scale(1.05)" }}
                    />

                    <Box p={4}>
                      <Text fontSize="md" fontWeight="bold" noOfLines={1}>
                        {p.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Category: {p.category}
                      </Text>
                      <Text fontSize="sm" color="blue.500" fontWeight="bold">
                        {p.price.toLocaleString()} LAK
                      </Text>
                      {p.stock === 1 ? (
                        <Text
                          textAlign={"center"}
                          fontSize="md"
                          color="red"
                          fontWeight="bold"
                        >
                          ສິນຄ້າໝົດສະຕ໋ອກ
                        </Text>
                      ) : (
                        ""
                      )}
                      <Flex mt={2} justify="space-between">
                        <Tooltip label="ເພີ່ມຕະກ້າ">
                          <IconButton
                            icon={<FaCartShopping />}
                            onClick={() => handleAddToCart(p)}
                            colorScheme="teal"
                            size="sm"
                            aria-label="Add to Cart"
                          />
                        </Tooltip>
                        <Tooltip label="ລາຍລະອຽດສິນຄ້າ">
                          <IconButton
                            icon={<FaEye />}
                            onClick={() =>
                              navigate(`/details/products/${p._id}`)
                            }
                            colorScheme="teal"
                            size="sm"
                            aria-label="View Product"
                          />
                        </Tooltip>
                        <Tooltip label="ເພີ່ມສິນຄ້າໂປຣດ">
                          <IconButton
                            icon={
                              localWishlist.includes(p._id) ? (
                                <FaHeart />
                              ) : (
                                <FaRegHeart />
                              )
                            }
                            onClick={() => handleWishlist(p._id)}
                            colorScheme={
                              localWishlist.includes(p._id) ? "red" : "teal"
                            }
                            size="sm"
                            aria-label="Add to Wishlist"
                          />
                        </Tooltip>
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </Grid>
              {/* Featured Products */}
            </Box>
          </Flex>
        </Center>
        <Box paddingBottom={"30px"}>
          <Pagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalItem={totalProducts}
            parPage={parPage}
            showItem={Math.floor(totalProducts / parPage)}
          />
        </Box>
      </Box>

      {/* Drawer for Filters (Mobile-Friendly) */}
      {/* <IconButton
        aria-label="Open Filters"
        icon={<FaThList />}
        variant="solid"
        onClick={() => setIsDrawerOpen(true)}
        display={{ base: "block", md: "none" }}
        position="fixed"
        bottom={4}
        right={4}
      /> */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody>
            <RadioGroup>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Category
              </Text>
              <Stack direction="column">
                <Radio value="1">Mobiles</Radio>
                <Radio value="2">iPhone</Radio>
                <Radio value="3">Nokia</Radio>
                <Radio value="4">Books</Radio>
                <Radio value="5">None</Radio>
              </Stack>
            </RadioGroup>
            <Box mb={4}>
              <Text fontSize="lg" mb={2}>
                Price: {sliderValue[0]} - {sliderValue[1]}
              </Text>
              <RangeSlider
                min={0}
                max={100}
                step={1}
                value={sliderValue}
                onChange={setSliderValue}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>
            <Box>
              <Text fontSize="xl" mb={4}>
                Ratings:
              </Text>
              {ratings.map((value) => (
                <Box mb={4} key={value}>
                  <Rating value={value} />
                </Box>
              ))}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Footer />
    </Box>
  );
};

export default Shop;
