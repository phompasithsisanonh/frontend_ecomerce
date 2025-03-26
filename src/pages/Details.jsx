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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
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
const Details = () => {
  const { id: slugId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, relatedProducts} = useSelector(
    (state) => state.home
  );
  const { userInfo } = useSelector((state) => state.auth);
  const {
    errorMessage,
    successMessage,
    wishlists,
  } = useSelector((state) => state.card);
  useEffect(() => {
    dispatch(product_details(slugId));
  }, [slugId, dispatch]);

  const [image, setImage] = useState("");
  //comment rating reviews
  console.log(relatedProducts);
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
  console.log(product);
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
  console.log(product);
  ///ກົດໃຈ
  const [localWishlist, setLocalWishlist] = useState([]); // ✅ สร้าง state เก็บ wishlist
  // ✅ ดึง Wishlist เมื่อ Component โหลด
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

    // Dispatch to update the wishlist in the backend
    dispatch(wishlist({ id: userInfo._id, productId }));

    // Update the localWishlist state immediately to reflect the change in the UI
    setLocalWishlist((prev) => {
      const isInWishlist = prev.includes(productId); // Check if product is already in the wishlist
      if (isInWishlist) {
        return prev.filter((item) => item !== productId); // Remove the product if already in wishlist
      } else {
        return [...prev, productId]; // Add the product if not in wishlist
      }
    });
  };

  useEffect(() => {
    // Sync localWishlist state with the redux wishlist state
    setLocalWishlist(wishlists.map((item) => item.productId._id)); // Assuming wishlists contain objects with productId._id
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
  return (
    <Box w="full" mt={{ base: 6, md: 0 }}>
      <Header />
      <Box mt={8} p={4}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
          Product Details
        </Text>
        <Box borderWidth="1px" borderRadius="xl" overflow="hidden" p={4} mb={3}>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            {/* Product Images */}
            <Container maxW={{ base: "100%", md: "40%" }} position="relative">
              <Image
                src={image || product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                w="100%"
                h="50%"
                objectFit="cover"
                borderRadius="lg"
              />
              {product.images?.length > 0 && (
                <Carousel
                  responsive={responsive1}
                  autoPlay
                  swipeable
                  draggable
                  showDots
                  infinite
                  dotListClass="custom-dot-list-style"
                >
                  {product.images.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setImage(img)}
                      cursor="pointer"
                      borderWidth="1px"
                      borderRadius="md"
                      p={1}
                      h="185px"
                    >
                      <Image
                        borderRadius={"10px"}
                        src={img}
                        alt={`Image ${idx}`}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </Carousel>
              )}
            </Container>

            {/* Product Details */}
            <Box w={{ base: "100%", md: "50%" }} p={4}>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {product.name}
              </Text>
              <Text fontSize="xl" color="blue.600" fontWeight="bold" mb={2}>
                ລາຄາ: {product?.price?.toLocaleString()} ກີບ
              </Text>
              <Rating ratings={product.rating} />
              <Text mt={4} color="gray.600">
                ລາຍລະອຽດສິນຄ້າ:{product.description}
              </Text>
              <Flex direction={{ base: "column", md: "row" }} mt={4}>
                <HStack spacing={4}>
                  <Flex gap={2}>
                    <Button isDisabled={quantity === 1} size="sm" onClick={dec}>
                      -
                    </Button>
                    <Text fontSize="lg">{quantity}</Text>
                    <Button
                      isDisabled={quantity >= product.stock - 1}
                      size="sm"
                      onClick={inc}
                    >
                      +
                    </Button>
                  </Flex>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    w={"150px"}
                    size="sm"
                    colorScheme="blue"
                  >
                    ເພີ່ມຕະກ້າ
                  </Button>

                  <Box>
                    <IconButton
                      borderRadius="10px"
                      colorScheme={
                        localWishlist.some((item) => item === product._id)
                          ? "red"
                          : ""
                      }
                      _hover={{ bg: "red.500" }}
                      boxShadow="1px 2px 3px 0px rgba(0, 0, 0, 0.3)"
                      aria-label="Add to Wishlist"
                      icon={
                        localWishlist.some((item) => item === product._id) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart color="black" />
                        )
                      }
                      onClick={() => handleWishlist(product._id)}
                      size="sm"
                      boxSize={"40px"}
                    />
                  </Box>
                </HStack>
              </Flex>
              <Box mt={4}>
                <Text fontWeight="medium">Availability:</Text>
                <Text>
                  ມີໃນສະຕ໋ອກ
                  <Badge ml={2} colorScheme={product.inStock ? "green" : "red"}>
                    {product.stock === 1 ? "Out of Stock" : " Available"}
                  </Badge>
                </Text>
              </Box>
              <Flex mt={4} alignItems="center" gap={3}>
                <Text fontSize={{ base: "10px", md: "20px" }}>Share on:</Text>
                {socialLinks.map((link, idx) => (
                  <IconButton
                    key={idx}
                    size="sm"
                    bg="blue.500"
                    color="white"
                    icon={<link.icon />}
                    _hover={{ bg: "blue.600" }}
                    onClick={() => window.open(link.url, "_blank")}
                  />
                ))}
              </Flex>
              <Flex mt={4} gap={3}>
                <Button onClick={() => buynow()} colorScheme="red">
                  ຊື້ດຽວນີ້
                </Button>
                <Button colorScheme="green">ສົນທະນາເຈົ້າຂອງຮ້ານ</Button>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Tabs Section */}
        <Flex justifyContent="center" mb={8} gap={4}>
          <Button
            variant={activeTab === "reviews" ? "solid" : "outline"}
            colorScheme="teal"
            onClick={() => setActiveTab("reviews")}
          >
            ລິວິວສິນຄ້າ
          </Button>
          <Button
            variant={activeTab === "description" ? "solid" : "outline"}
            colorScheme="orange"
            onClick={() => setActiveTab("description")}
          >
            Description
          </Button>
        </Flex>
        {activeTab === "reviews" ? (
          <Reviws ratingid={product.rating} slugId={slugId} />
        ) : (
          <Text>{product.description}</Text>
        )}
        <Box paddingTop={'10px'} onClick={()=>navigate(`/seller_profile/${product.sellerId._id}`)} cursor={'pointer'} padding={4} maxW="1200px" margin="auto">
          {/* Single Product Detail Section */}
          <Flex direction={{ base: "column", lg: "row" }} spacing={8}>
            {/* Product Image and Details */}
            <Box flex={2}>
              <VStack align="flex-start" spacing={4}>
                {/* Seller Profile Section */}
                <Box
                 
                >
                  <HStack spacing={4}>
                    <Image
                      src={product?.sellerId?.image}
                      alt={product?.sellerId?.name}
                      w="10%"
                      h="10%"
                      objectFit="cover"
                      borderRadius="lg"
                    />
                    <VStack align="flex-start">
                      <Text fontSize="lg" fontWeight="bold">
                        ຊື່ຮ້ານ {product?.shopName}
                      </Text>

                      <HStack align="flex-start">
                        <Text color="gray.500">
                          {" "}
                          ສະຖານະ: {product?.sellerId?.status}
                        </Text>
                        <Text color="gray.500"> ຜູ້ຕິດຕາມ: 300 ຄົນ</Text>
                        <Text color="gray.500"> ຄະແນນນິຍົມ: 300 ຄະແນນ</Text>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </Box>
        <Divider/>
        {/* Related Products */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Related Products
          </Text>
          <Carousel
            responsive={responsive1}
            swipeable
            draggable
            showDots
            infinite
          >
            {relatedProducts.map((prod, idx) => (
              <Box key={idx} p={4} borderWidth="1px" borderRadius="lg">
                <Image
                  src={prod.images?.[0] || "/placeholder.jpg"}
                  alt={prod.name}
                  w="full"
                  h="150px"
                  objectFit="cover"
                />
                <Text fontWeight="bold" textAlign="center">
                  {prod.name}
                </Text>
              </Box>
            ))}
          </Carousel>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Details;
