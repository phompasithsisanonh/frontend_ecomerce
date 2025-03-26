import {
  Box,
  Container,
  Flex,
  Grid,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import Rating from "../Rating";
import { useEffect, useState } from "react";
import { FaCartShopping, FaEye, FaHeart, FaRegHeart } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  add_to_card,
  get_card_products,
  get_wishlist,
  messageClear,
  wishlist,
} from "../../store/reducers/cardReducer";
import toast from "react-hot-toast";

const FeatureProducts = () => {
  const [isHovered, setIsHovered] = useState(null);
  const dispatch = useDispatch();
  const { products, reviews } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage, wishlists } = useSelector(
    (state) => state.card
  );
  const navigate = useNavigate();
  const [localWishlist, setLocalWishlist] = useState([]);

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

  useEffect(() => {
    setLocalWishlist(wishlists.map((item) => item.productId?._id));
  }, [wishlists]);

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
    <Container maxW={{ base: "95%", md: "85%" }} mx="auto">
      <Flex direction="column" align="center" textAlign="center" pb={6}>
        <Text
          fontSize={{ base: "32px", md: "45px" }}
          fontWeight="bold"
          color="gray.600"
        >
          ສິນຄ້າ
        </Text>
        <Box w="80px" h="2px" bg="#059473" mt={2}></Box>
      </Flex>

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={4}
      >
        {products.map((p, i) => (
          <Box
            key={i}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-8px)", shadow: "lg" }}
            onMouseEnter={() => setIsHovered(i)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <Box position="relative">
              <Image
                src={p.images[0]}
                alt={p.name}
                w="full"
                h="200px"
                objectFit="cover"
              />
              {p.stock === 1 ? (
                <Box 
                position="absolute" 
                top={0} 
                left={0} 
                right={0} 
                bottom={0} 
                bg="rgba(255,0,0,0.2)" 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                zIndex={10}
              >
                <Text
                  position="absolute"
                  bottom={2}
                  left={2}
                  fontSize="md"
                  color="red.600"
                  fontWeight="bold"
                  bg="red.100"
                  px={2}
                  py={1}
                  borderRadius="md"
                  boxShadow="sm"
                >
                  ສິນຄ້າໝົດສະຕ໋ອກ
                </Text>
              </Box>

              ) : (
                ""
              )}
              <Flex
                position="absolute"
                top={2}
                left={2}
                bg="red.500"
                color="white"
                px={2}
                py={1}
                rounded="md"
                fontSize="sm"
                fontWeight="bold"
              >
                {p.discount}% OFF
              </Flex>

              {isHovered === i && (
                <Flex
                  justify="center"
                  gap={2}
                  p={2}
                  position="absolute"
                  bottom={2}
                  w="full"
                >
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
                      onClick={() => navigate(`/details/products/${p._id}`)}
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
              )}
            </Box>

            <Box p={4} textAlign={{ base: "left", md: "left" }}>
              <Text fontWeight="bold" fontSize="lg" isTruncated>
                {p.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                ໝວດສິນຄ້າ: {p.category}
              </Text>
              <Text fontSize="sm" color="gray.500">
                ຂາຍແລ້ວ: {p.sale}
              </Text>
              <Text fontSize="md" color="teal.500" fontWeight="bold">
                ລາຄາ: {p.price.toLocaleString()} ກີບ
              </Text>
              <Flex justify="left" mt={2}>
                <Box display="flex" alignItems="center">
                  <Rating ratings={p.rating} />
                  <Text fontSize="sm" color="gray.500">
                    ({reviews.length})
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Box>
        ))}
      </Grid>
    </Container>
  );
};

export default FeatureProducts;
