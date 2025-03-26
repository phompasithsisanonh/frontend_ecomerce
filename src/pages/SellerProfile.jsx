import {
  Box,
  Avatar,
  Text,
  Button,
  HStack,
  VStack,
  TabPanel,
  TabPanels,
  Tab,
  TabList,
  Tabs,
  Image,
  Grid,
  GridItem,
  Divider,
  Container,
  Badge,
  Icon,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiMessageSquare,
  FiHeart,
  FiSearch,
} from "react-icons/fi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { get_profile_seller } from "../store/reducers/homeReducers";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaRegStar, FaStar } from "react-icons/fa6";
import {
  following_get,
  followingAdd,
  messageClear,
  unfollowing,
} from "../store/reducers/followingReducer";
import toast from "react-hot-toast";

const SellerProfile = () => {
  const { id } = useParams();
  const { products_seller, reviwes_seller1 } = useSelector(
    (state) => state.home
  );
  const {
    errorMessage,
    successMessage,
    following_data,
    countfollowing,
  } = useSelector((state) => state.following);
  const { userInfo } = useSelector((state) => state.auth);
  const [select, setSelect] = useState("popular");
  const [selectCatory, setSelectCatory] = useState("");
  const dispatch = useDispatch();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();
  /// show more less more
  const [showMore, setShowMore] = useState(false);
  const reviewsToShow = showMore
    ? reviwes_seller1
    : reviwes_seller1.slice(0, 5);
  // Responsive values
  const avatarSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const statColumns = useBreakpointValue({ base: 2, md: 4 });
  useEffect(() => {
    dispatch(
      get_profile_seller({
        sellerId: id,
      })
    );
  }, [products_seller, dispatch, id]);
  const sortedProducts = [...products_seller].sort((a, b) => {
    if (select === "popular") return b.sale - a.sale; // เรียงตามยอดขายสูงสุด
    if (select === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt); // เรียงตามวันที่ใหม่ล่าสุด
    if (select === "price") return a.price - b.price; // เรียงจากราคาต่ำ -> สูง
    return 0;
  });
  const catogy = [...products_seller].filter(
    (product) => product.category === selectCatory
  );

  const handleClick = (category) => {
    // ดำเนินการเมื่อคลิกปุ่ม Category
    setSelectCatory(category);
  };
  ///ເລືອດຕາມໝວດໝູ່
  // .slice(0, 5); // ดึงมาแค่ 5 อันดับแรก
  const isFollowing = following_data?.some((seller) => seller._id === id);
  const averageRating =
    products_seller.reduce((sum, product) => sum + product.rating, 0) /
      products_seller.length || 0;
  const handleClickFollowing = () => {
    if (!userInfo) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      if (isFollowing) {
        // Unfollow if already following
        dispatch(
          unfollowing({ userId: userInfo._id, unfollowSellerId: id })
        ).then(() => dispatch(following_get({ userId: userInfo._id })));
      } else {
        // Follow if not already following
        dispatch(
          followingAdd({ userId: userInfo._id, followSellerId: id })
        ).then(() => dispatch(following_get({ userId: userInfo._id })));
      }
    }
  };
  useEffect(() => {
    dispatch(
      following_get({
        userId: userInfo._id,
        followSellerId: id,
      })
    );
  }, [dispatch, userInfo._id, id]);
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
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Header />

      <Container maxW="6xl" py={containerPadding} px={containerPadding}>
        {/* Seller Info Section */}
        <Box
          bg={bgColor}
          p={{ base: 4, md: 6 }}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 4, md: 8 }}
            align={{ base: "center", md: "start" }}
          >
            <Avatar
              size={avatarSize}
              src=""
              name=""
              borderWidth={2}
              borderColor="blue.400"
            />
            <VStack
              align={{ base: "center", md: "start" }}
              spacing={3}
              flex={1}
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                w="full"
                align={{ base: "center", md: "start" }}
                spacing={4}
              >
                <VStack align={{ base: "center", md: "start" }} spacing={1}>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign={{ base: "center", md: "left" }}
                  >
                    Store Name
                  </Text>
                  <HStack>
                    {[...Array(5)].map((_, j) => (
                      <Icon
                        key={j}
                        as={j < Math.round(averageRating) ? FaStar : FaRegStar}
                        color="yellow.400"
                        boxSize="5"
                      />
                    ))}
                    <Text>{averageRating}</Text>
                    <Text color="gray.500">
                      ({reviwes_seller1.length} Reviews)
                    </Text>
                  </HStack>
                </VStack>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  spacing={2}
                  w={{ base: "full", md: "auto" }}
                >
                  <Button
                    leftIcon={<FiMessageSquare />}
                    colorScheme="blue"
                    size={buttonSize}
                    w={{ base: "full", md: "auto" }}
                  >
                    ແຊດ
                  </Button>
                  {/* following_data */}
                  <Button
                    leftIcon={<FiHeart />}
                    variant={isFollowing ? "solid" : "outline"}
                    colorScheme={isFollowing ? "red" : "outline"}
                    onClick={() => handleClickFollowing()}
                    size={buttonSize}
                    w={{ base: "full", md: "auto" }}
                  >
                    {isFollowing ? "ກຳລັງຕິດຕາມ" : "ຕິດຕາມ"}
                  </Button>
                </Stack>
              </Stack>

              <SimpleGrid
                columns={statColumns}
                spacing={4}
                w="full"
                mt={{ base: 4, md: 0 }}
              >
                <Stat textAlign={{ base: "center", md: "left" }}>
                  <StatLabel>Products</StatLabel>
                  <StatNumber>{products_seller.length}</StatNumber>
                </Stat>
                <Stat textAlign={{ base: "center", md: "left" }}>
                  <StatLabel>Followers</StatLabel>
                  <StatNumber>{countfollowing}</StatNumber>
                </Stat>
                <Stat textAlign={{ base: "center", md: "left" }}>
                  <StatLabel>Response Rate</StatLabel>
                  <StatNumber>{averageRating}</StatNumber>
                </Stat>
                <Stat textAlign={{ base: "center", md: "left" }}>
                  <StatLabel>Ship On Time</StatLabel>
                  <StatNumber>95%</StatNumber>
                </Stat>
              </SimpleGrid>
            </VStack>
          </Stack>
        </Box>

        {/* Tabs Section */}
        <Box
          mt={8}
          bg={bgColor}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Tabs colorScheme="blue">
            <TabList
              px={{ base: 2, md: 6 }}
              pt={4}
              overflowX="auto"
              css={{
                scrollbarWidth: "none",
                "::-webkit-scrollbar": { display: "none" },
              }}
            >
              <Tab fontWeight="semibold" minW="max-content">
                ສິນຄ້າ ({products_seller.length})
              </Tab>
              <Tab fontWeight="semibold" minW="max-content">
                ໝວດໝູສິນຄ້າ
              </Tab>
              <Tab fontWeight="semibold" minW="max-content">
                ລີວິວ ({reviwes_seller1.length})
              </Tab>
            </TabList>

            <TabPanels>
              {/* Products Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {/* Search and Filter */}
                  <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input placeholder="Search products..." />
                    </InputGroup>
                    <Select
                      placeholder="Sort by"
                      value={select}
                      onChange={(e) => setSelect(e.target.value)}
                      w={{ base: "full", md: "200px" }}
                    >
                      <option value="popular">ຍອດຂາຍສູງສຸດ</option>
                      <option value="newest">ລ່າສຸດ</option>
                      <option value="price">ລາຄາ</option>
                    </Select>
                  </Stack>

                  {/* Products Grid */}
                  <Grid
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    }}
                    gap={6}
                  >
                    {sortedProducts.map((product, index) => (
                      <GridItem
                        key={index}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        transition="all 0.2s"
                        _hover={{ transform: "translateY(-4px)", shadow: "md" }}
                      >
                        <Image
                          src={product?.images[0]}
                          alt={product?.name}
                          h="200px"
                          w="full"
                          objectFit="cover"
                        />
                        <Box p={4}>
                          <Text fontWeight="semibold" noOfLines={2}>
                            {product.name}
                          </Text>
                          {[...Array(5)].map((_, j) => (
                            <Icon
                              key={j}
                              as={j < product.rating ? FaStar : FaRegStar}
                              color="yellow.400"
                              boxSize="5"
                            />
                          ))}
                          <Stack
                            direction={{ base: "column", sm: "row" }}
                            justify="space-between"
                            align={{ base: "start", sm: "center" }}
                            mt={2}
                            spacing={2}
                          >
                            <Text
                              color="blue.600"
                              fontSize="lg"
                              fontWeight="bold"
                            >
                              ລາຄາ {product.price.toLocaleString()}ກີບ
                            </Text>
                          </Stack>
                          <Badge colorScheme="orange">
                            ຂາຍແລ້ວ {product.sale}
                          </Badge>
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>
                </VStack>
              </TabPanel>

              {/* Categories Tab */}
              <TabPanel spacing={4}>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  spacing={4}
                  paddingBottom={"30px"}
                >
                  {products_seller.map((category, index) => (
                    <Button
                      key={index}
                      onClick={() => handleClick(category.category)}
                      size="lg"
                      variant="outline"
                      h="60px"
                      whiteSpace="normal"
                      textAlign="center"
                    >
                      {category.category}
                    </Button>
                  ))}
                </SimpleGrid>
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  }}
                  gap={6}
                >
                  {catogy.map((product, index) => (
                    <GridItem
                      key={index}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      transition="all 0.2s"
                      _hover={{ transform: "translateY(-4px)", shadow: "md" }}
                    >
                      <Image
                        src={product?.images[0]}
                        alt={product?.name}
                        h="200px"
                        w="full"
                        objectFit="cover"
                      />
                      <Box p={4}>
                        <Text fontWeight="semibold" noOfLines={2}>
                          {product.name}
                        </Text>
                        <Text color="blue.600" fontSize="lg" fontWeight="bold">
                          {product.category}
                        </Text>
                        {[...Array(5)].map((_, j) => (
                          <Icon
                            key={j}
                            as={j < product.rating ? FaStar : FaRegStar}
                            color="yellow.400"
                            boxSize="5"
                          />
                        ))}
                        <Stack
                          direction={{ base: "column", sm: "row" }}
                          justify="space-between"
                          align={{ base: "start", sm: "center" }}
                          mt={2}
                          spacing={2}
                        >
                          <Text
                            color="blue.600"
                            fontSize="lg"
                            fontWeight="bold"
                          >
                            ລາຄາ {product.price.toLocaleString()}ກີບ
                          </Text>
                        </Stack>
                        <Badge colorScheme="orange">
                          ຂາຍແລ້ວ {product.sale}
                        </Badge>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </TabPanel>

              {/* Reviews Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {reviewsToShow?.map((review, index) => (
                    <Box key={index}>
                      <Stack
                        direction={{ base: "column", sm: "row" }}
                        spacing={4}
                        align="start"
                      >
                        <Avatar
                          size="md"
                          src={review?.avatar}
                          name={review?.user}
                        />
                        <VStack align="start" spacing={2} flex={1}>
                          <Stack
                            direction={{ base: "column", sm: "row" }}
                            justify="space-between"
                            w="full"
                            align={{ base: "start", sm: "center" }}
                          >
                            <Text fontWeight="bold">{review.name}</Text>
                            <Text color="gray.500">{review.date}</Text>
                          </Stack>
                          <HStack>
                            {Array(5)
                              .fill("")
                              .map((_, i) => (
                                <Icon
                                  key={i}
                                  as={i < review.rating ? FaStar : FaRegStar}
                                  color="yellow.400"
                                />
                              ))}
                          </HStack>
                          <Text>{review?.review}</Text>
                        </VStack>
                      </Stack>
                      <Divider my={4} />
                    </Box>
                  ))}
                  <Button
                    colorScheme="blue"
                    variant="link"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Show Less" : "Show More"}
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default SellerProfile;
