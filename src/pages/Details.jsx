import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useColorModeValue,
  Heading,
  Tag,
  Tooltip,
  useBreakpointValue,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { FaHeart, FaRegHeart, FaStore } from "react-icons/fa6";
import Rating from "../components/Rating";
import { FaFacebookF, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import Reviws from "../components/Reviws";
import Footer from "../components/Footer";
import { product_details } from "../store/reducers/homeReducers";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  add_to_card,
  get_wishlist,
  messageClear,
  wishlist,
} from "../store/reducers/cardReducer";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionImage = motion(Image);
const MotionButton = motion(Button);

const Details = () => {
  const { id: slugId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, relatedProducts } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const { errorMessage, successMessage, wishlists } = useSelector(
    (state) => state.card
  );

  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const cardBg = useColorModeValue("white", "gray.700");
  
  useEffect(() => {
    dispatch(product_details(slugId));
  }, [slugId, dispatch]);

  const [image, setImage] = useState("");
  
  const responsive1 = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    mobile: { breakpoint: { max: 767, min: 464 }, items: 2 },
  };

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  
  const inc = () => {
    if (quantity >= product.stock) {
      toast.error("ສິນຄ້າໝົດ");
    } else {
      setQuantity(quantity + 1);
    }
  };

  const dec = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
        );
      }
    }
  };

  const buynow = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (product.stock === 1) {
      toast.error(" ❌ ສິນຄ້າໝົດ ❌");
    } else {
      let price = 0;
      if (product.discount !== 0) {
        price =
          product.price - Math.floor((product.price * product.discount) / 100);
      } else {
        price = product.price;
      }
      const obj = [
        {
          sellerId: product.sellerId,
          shopName: product.shopName,
          price: quantity * (price - Math.floor((price * 5) / 100)),
          products: [
            {
              quantity,
              productInfo: product,
            },
          ],
        },
      ];

      navigate("/shipping", {
        state: {
          card_products: obj,
          price: price * quantity,
          items: quantity,
        },
      });
    }
  };

  const [localWishlist, setLocalWishlist] = useState([]);
  useEffect(() => {
    if (userInfo) {
      dispatch(get_wishlist({ id: userInfo._id }));
    }
  }, [dispatch, userInfo]);

  const handleWishlist = (productId) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(wishlist({ id: userInfo._id, productId }));

    setLocalWishlist((prev) => {
      const isInWishlist = prev.includes(productId);
      if (isInWishlist) {
        return prev.filter((item) => item !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  useEffect(() => {
    setLocalWishlist(wishlists.map((item) => item.productId._id));
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
  
  const shareUrl = "details/products/67a1ff8f384227dfdaf7de74";
  const socialLinks = [
    {
      icon: FaFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      icon: FaLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      icon: FaGithub,
      url: `htts://github.co/share?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  
  return (
    <MotionBox 
      w="full" 
      mt={{ base: 6, md: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      
      <Container maxW="container.xl" mt={8} p={4}>
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          mb={6}
        >
          <Divider mb={8} />
        </MotionBox>

        <MotionFlex 
          flexDirection={{ base: "column", md: "row" }}
          boxShadow="xl"
          borderRadius="xl" 
          overflow="hidden" 
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Product Images */}
          <Box flex={{ base: 1, md: 1 }} p={4}>
            <MotionImage
              src={image || product.images?.[0] || "/placeholder.jpg"}
              alt={product.name}
              w="100%"
              h="400px"
              objectFit="cover"
              borderRadius="lg"
              mb={4}
              boxShadow="md"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            />
            
            {product.images?.length > 0 && (
              <Box>
                <Carousel
                  responsive={responsive1}
                  autoPlay
                  swipeable
                  draggable
                  showDots
                  infinite
                  dotListClass="custom-dot-list-style"
                  containerClass="carousel-container"
                  itemClass="carousel-item"
                >
                  {product.images.map((img, idx) => (
                    <MotionBox
                      key={idx}
                      onClick={() => setImage(img)}
                      cursor="pointer"
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={borderColor}
                      p={1}
                      mx={2}
                      h="100px"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ 
                        scale: 1.05, 
                        opacity: 1,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" 
                      }}
                    >
                      <Image
                        borderRadius="md"
                        src={img}
                        alt={`Image ${idx}`}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </MotionBox>
                  ))}
                </Carousel>
              </Box>
            )}
          </Box>

          {/* Product Details */}
          <MotionBox 
            flex={{ base: 1, md: 1 }}
            p={6}
            bg={useColorModeValue("gray.50", "gray.900")}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <VStack align="flex-start" spacing={4}>
              <HStack>
                {product.discount > 0 && (
                  <Tag size="md" variant="solid" colorScheme="red" borderRadius="full">
                    {product.discount}% OFF
                  </Tag>
                )}
                <Badge colorScheme={product.stock > 1 ? "green" : "red"} px={2} py={1} borderRadius="md">
                  {product.stock > 1 ? "In Stock" : "Out of Stock"}
                </Badge>
              </HStack>

              <Text fontSize={'55px'} as="h2" size="lg" color={textColor}>
                {product.name}
              </Text>
              
              <HStack spacing={4} align="center">
                <Rating ratings={product.rating} size="md" />
                <Text color="gray.500">({product.rating ? product.rating.toFixed(1) : "0"} reviews)</Text>
              </HStack>
              
              <Stack direction={{ base: "column", sm: "row" }} align="baseline" spacing={2}>
                {product.discount > 0 && (
                  <Text textDecoration="line-through" color="gray.500">
                    {product?.price?.toLocaleString()} ກີບ
                  </Text>
                )}
                <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                  {product.discount > 0 
                    ? (product.price - (product.price * product.discount / 100)).toLocaleString() 
                    : product?.price?.toLocaleString()} ກີບ
                </Text>
              </Stack>
              
              <Divider />
              
              <Box>
                <Text fontWeight="medium" mb={2}>ລາຍລະອຽດສິນຄ້າ:</Text>
                <Text color="gray.600">{product.description}</Text>
              </Box>
              
              <Flex direction="column" w="full" gap={4}>
                <HStack spacing={4}>
                  <MotionFlex 
                    align="center" 
                    bg={useColorModeValue("gray.100", "gray.700")} 
                    borderRadius="md" 
                    p={1}
                    whileHover={{ scale: 1.05 }}
                  >
                    <IconButton 
                      isDisabled={quantity === 1} 
                      size="sm" 
                      onClick={dec}
                      colorScheme="blue"
                      variant="ghost"
                      icon={<Text fontSize="xl">-</Text>}
                    />
                    <Text fontSize="lg" fontWeight="bold" px={4}>{quantity}</Text>
                    <IconButton 
                      isDisabled={quantity >= product.stock - 1} 
                      size="sm" 
                      onClick={inc}
                      colorScheme="blue"
                      variant="ghost"
                      icon={<Text fontSize="xl">+</Text>}
                    />
                  </MotionFlex>
                  
                  <MotionButton
                    
                    onClick={() => handleAddToCart(product)}
                    size={buttonSize}
                    colorScheme="blue"
                    flexGrow={1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ເພີ່ມຕະກ້າ
                  </MotionButton>
                  
                  <Tooltip label={localWishlist.some((item) => item === product._id) ? "Remove from Wishlist" : "Add to Wishlist"}>
                    <MotionBox
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        aria-label="Add to Wishlist"
                        icon={
                          localWishlist.some((item) => item === product._id) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )
                        }
                        onClick={() => handleWishlist(product._id)}
                        size={buttonSize}
                        colorScheme={
                          localWishlist.some((item) => item === product._id)
                            ? "red"
                            : "gray"
                        }
                        variant={
                          localWishlist.some((item) => item === product._id)
                            ? "solid"
                            : "outline"
                        }
                        borderRadius="lg"
                      />
                    </MotionBox>
                  </Tooltip>
                </HStack>
                
                <HStack spacing={4}>
                  <MotionButton 
                    onClick={buynow} 
                    colorScheme="red" 
                    size={buttonSize}
                    flexGrow={1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    fontWeight="bold"
                  >
                    ຊື້ດຽວນີ້
                  </MotionButton>
                  
                  <MotionButton 
                    colorScheme="green" 
                    size={buttonSize}
                    flexGrow={1}
                    leftIcon={<FaStore />}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ສົນທະນາເຈົ້າຂອງຮ້ານ
                  </MotionButton>
                </HStack>
              </Flex>
              
              <Divider />
              
              <Flex mt={2} alignItems="center" gap={3}>
                <Text fontSize={{ base: "sm", md: "md" }}>Share on:</Text>
                <HStack spacing={2}>
                  {socialLinks.map((link, idx) => (
                    <MotionBox
                      key={idx}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        size="sm"
                        bg={accentColor}
                        color="white"
                        icon={<link.icon />}
                        _hover={{ bg: "blue.600" }}
                        onClick={() => window.open(link.url, "_blank")}
                        borderRadius="full"
                      />
                    </MotionBox>
                  ))}
                </HStack>
              </Flex>
            </VStack>
          </MotionBox>
        </MotionFlex>

        {/* Seller Profile Section */}
        <MotionBox
          boxShadow="md" 
          borderRadius="xl" 
          p={6} 
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          mb={8}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onClick={() => navigate(`/seller_profile/${product.sellerId?._id}`)} 
          cursor="pointer"
          _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
        
        >
          <Heading as="h3" size="md" mb={4}>
            Seller Information
          </Heading>
          
          <HStack spacing={6} align="flex-start">
            <MotionImage
              src={product?.sellerId?.image}
              alt={product?.sellerId?.name}
              boxSize={{ base: "60px", md: "80px" }}
              objectFit="cover"
              borderRadius="full"
              border="3px solid"
              borderColor={accentColor}
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
            
            <VStack align="flex-start" spacing={2}>
              <Heading as="h4" size="md">
                {product?.shopName}
              </Heading>
              
              <HStack spacing={4} flexWrap="wrap">
                <Tag size="sm" colorScheme="blue" variant="solid">
                  {product?.sellerId?.status}
                </Tag>
                <Tag size="sm" colorScheme="purple">
                  300 ຜູ້ຕິດຕາມ
                </Tag>
                <Tag size="sm" colorScheme="orange">
                  300 ຄະແນນນິຍົມ
                </Tag>
              </HStack>
            </VStack>
          </HStack>
        </MotionBox>

        {/* Tabs Section */}
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Flex justifyContent="center" mb={6} gap={4}>
            <MotionButton
              variant={activeTab === "reviews" ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setActiveTab("reviews")}
              size={buttonSize}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              borderRadius="full"
            >
              ລິວິວສິນຄ້າ
            </MotionButton>
            <MotionButton
              variant={activeTab === "description" ? "solid" : "outline"}
              colorScheme="orange"
              onClick={() => setActiveTab("description")}
              size={buttonSize}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              borderRadius="full"
            >
              Description
            </MotionButton>
          </Flex>
          
          <MotionBox
            p={6}
            borderRadius="xl"
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="md"
            mb={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "reviews" ? (
              <Reviws ratingid={product.rating} slugId={slugId} />
            ) : (
              <Text>{product.description}</Text>
            )}
          </MotionBox>
        </MotionBox>

        {/* Related Products */}
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          mb={10}
        >
          <Heading as="h2" size="lg" mb={6}>
            Related Products
          </Heading>
          
          <Carousel
            responsive={responsive1}
            swipeable
            draggable
            showDots
            infinite
            containerClass="related-products-carousel"
          >
            {relatedProducts.map((prod, idx) => (
              <MotionBox 
                key={idx} 
                m={2}
                p={4} 
                borderWidth="1px" 
                borderRadius="lg"
                borderColor={borderColor}
                bg={cardBg}
                boxShadow="md"
                overflow="hidden"
                onClick={() => navigate(`/details/${prod._id}`)}
                cursor="pointer"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <MotionImage
                  src={prod.images?.[0] || "/placeholder.jpg"}
                  alt={prod.name}
                  w="full"
                  h="180px"
                  objectFit="cover"
                  borderRadius="md"
                  mb={3}
                />
                <Text fontWeight="bold" noOfLines={2} textAlign="center" mb={2}>
                  {prod.name}
                </Text>
                <Text color={accentColor} fontWeight="semibold" textAlign="center">
                  {prod?.price?.toLocaleString()} ກີບ
                </Text>
              </MotionBox>
            ))}
          </Carousel>
        </MotionBox>
      </Container>
      
      <Footer />
    </MotionBox>
  );
};

export default Details;