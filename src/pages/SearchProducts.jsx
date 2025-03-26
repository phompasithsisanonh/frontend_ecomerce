import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  price_range_product,
  query_products,
} from "../store/reducers/homeReducers";
import {
  Box,
  Flex,
  Stack,
  Text,
  Select,
  IconButton,
  Image,
  Grid,
  HStack,
  Heading,
  Container,
  Button,
  VStack,
} from "@chakra-ui/react";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import Products from "../components/products/Products";
import { Range } from "react-range";
import { IoIosArrowForward } from "react-icons/io";
import Header from "../components/Header";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import Search from "../pages/Search";
import { FaCartShopping, FaEye, FaHeart, FaRegHeart } from "react-icons/fa6";
import {
  add_to_card,
  get_card_products,
  get_wishlist,
  messageClear,
  wishlist,
} from "../store/reducers/cardReducer";
import toast from "react-hot-toast";

const SearchProducts = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const searchValue = searchParams.get("value");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localWishlist, setLocalWishlist] = useState([]);

  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage, wishlists } = useSelector(
    (state) => state.card
  );
  const {
    priceRange,
    latest_product,
    totalProducts,
    parPage,
    products,
  } = useSelector((state) => state.home);
  useEffect(() => {
    dispatch(price_range_product());
  }, [dispatch]);
  useEffect(() => {
    setState({
      values: [priceRange.low, priceRange.high],
    });
  }, [priceRange]);
  ///filter
  const [filter, setFilter] = useState(true);
  ///price-range
  const [state, setState] = useState({
    values: [priceRange.low, priceRange.high],
  });
  //rating
  const [rating, setRating] = useState("");
  //pagination
  const [pageNumber, setPageNumber] = useState(1);
  ///sort-price
  const [sortPrice, setSortPrice] = useState("");
  const handleClearFilter = () => {
    setSortPrice(""); // Clear sort option
    setRating(""); // Clear rating
    setPageNumber(1); // Reset to first page
    setState({
      // Reset price range to default
      values: [priceRange.low, priceRange.high],
    });
    setSearchParams({}); // Clear URL search params (optional)
  };

  /////////////////////////////////////
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
  useEffect(() => {
    if (userInfo) {
      dispatch(get_wishlist({ id: userInfo._id }));
      dispatch(get_card_products(userInfo._id));
    }
  }, [dispatch, userInfo]);
  useEffect(() => {
    setLocalWishlist(wishlists.map((item) => item.productId?._id));
  }, [wishlists]);

  ////////////
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
  useEffect(() => {
    dispatch(
      query_products({
        low: state.values[0] || "",
        high: state.values[1] || "",
        category,
        rating,
        sortPrice,
        pageNumber,
        searchValue,
      })
    );
  }, [
    state.values, // เปลี่ยนจาก state.values[0], state.values[1] เป็น state.values
    category,
    rating,
    sortPrice,
    searchValue,
    pageNumber,
    dispatch,
  ]); // eslint-disable-line
  return (
    <Box>
      <Header />
      <Search />
      {/* Banner Section */}
      <Box
        bgImage="url('http://localhost:3000/images/banner/shop.png')"
        bgPosition="left"
        bgRepeat="no-repeat"
        bgSize="cover"
        h="220px"
        mt={6}
        position="relative"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bg="rgba(36,34,34,0.54)"
        >
          <Container
            maxW="85%"
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <VStack spacing={2} color="white">
              <Heading as="h2" size="lg" fontWeight="bold">
                Category Page
              </Heading>
              <HStack spacing={2} fontSize="xl">
                <Link href="/">Home</Link>
                <IoIosArrowForward />
                <Text>Category</Text>
              </HStack>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Main Content Section */}
      <Box py={16}>
        <Container maxW="85%">
          {/* Filter Button (Mobile View) */}
          <Box display={{ base: "block", md: "none" }} mb={filter ? 0 : 6}>
            <Button
              w="full"
              colorScheme="indigo"
              onClick={() => setFilter(!filter)}
            >
              Filter Product
            </Button>
          </Box>

          <Flex flexWrap="wrap">
            {/* Sidebar (Filters) */}
            <Box
              w={{ base: "full", md: "25%" }}
              pr={{ base: 0, md: 8 }}
              overflow={{ base: filter ? "hidden" : "auto", md: "visible" }}
              h={{ base: filter ? "0" : "auto", md: "auto" }}
              mb={{ base: filter ? 6 : 0, md: 0 }}
            >
              {/* Price Filter */}
              <Stack spacing={5} py={2}>
                <Heading size="md" color="gray.600">
                  Price
                </Heading>
                <Range
                  step={5}
                  min={priceRange.low}
                  max={priceRange.high}
                  values={state.values}
                  onChange={(values) => setState({ values })}
                  renderTrack={({ props, children }) => (
                    <Box
                      {...props}
                      h="6px"
                      bg="gray.200"
                      rounded="full"
                      cursor="pointer"
                    >
                      {children}
                    </Box>
                  )}
                  renderThumb={({ props }) => (
                    <Box
                      {...props}
                      w="15px"
                      h="15px"
                      bg="green.500"
                      rounded="full"
                    />
                  )}
                />
                <Text fontWeight="bold" color="gray.800">
                  ${Math.floor(state.values[0])} - $
                  {Math.floor(state.values[1])}
                </Text>
              </Stack>

              {/* Rating Filter */}
              <Stack spacing={4} py={3}>
                <Heading size="md" color="gray.600">
                  Rating
                </Heading>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <HStack
                    key={rating}
                    spacing={2}
                    cursor="pointer"
                    onClick={() => setRating(rating)}
                    color="orange.500"
                  >
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < rating ? <AiFillStar key={i} /> : <CiStar key={i} />
                    )}
                  </HStack>
                ))}
              </Stack>

              {/* Latest Products */}
              <Box py={5} display={{ base: "block", md: "none" }}>
                <Products title="Latest Product" products={latest_product} />
              </Box>
            </Box>

            {/* Product Listing Section */}
            <Box w={{ base: "full", md: "75%" }} pl={{ base: 0, md: 8 }}>
              {/* Header */}
              <Flex
                py={4}
                bg="white"
                mb={10}
                px={3}
                rounded="md"
                justifyContent="space-between"
                alignItems="center"
                borderWidth="1px"
              >
                <Text fontSize="lg" fontWeight="medium" color="gray.600">
                  ({totalProducts}) Products
                </Text>
                <HStack spacing={4}>
                  <Button onClick={() => handleClearFilter()}>
                    clear Filter
                  </Button>
                </HStack>
                <HStack spacing={4}>
                  <Select
                    onChange={(e) => setSortPrice(e.target.value)}
                    placeholder="Sort By"
                  >
                    <option value="low-to-high">Low to High Price</option>
                    <option value="high-to-low">High to Low Price</option>
                  </Select>
                  <HStack
                    spacing={4}
                    display={{ base: "none", lg: "flex" }}
                  ></HStack>
                </HStack>
              </Flex>

              {/* Products */}

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
                        ໝວດສິນຄ້າ: {p.category}
                      </Text>
                      <Text fontSize="sm" color="blue.500" fontWeight="bold">
                        ລາຄາ {p.price.toLocaleString()} LAK
                      </Text>
                      <Flex mt={2} justify="space-between">
                        <IconButton
                          aria-label="Add to Cart"
                          icon={<FaCartShopping />}
                          onClick={() => handleAddToCart(p)}
                          variant="ghost"
                          colorScheme="blue"
                        />
                        <IconButton
                          aria-label="View"
                          icon={<FaEye />}
                          onClick={() => navigate(`/details/products/${p._id}`)}
                          variant="ghost"
                          colorScheme="blue"
                        />
                        <IconButton
                          aria-label="Wishlist"
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
                          variant="ghost"
                        />
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </Grid>

              {/* Pagination */}
              {totalProducts > parPage && (
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalItem={totalProducts}
                  parPage={parPage}
                  showItem={Math.ceil(totalProducts / parPage)}
                />
              )}
            </Box>
          </Flex>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default SearchProducts;
