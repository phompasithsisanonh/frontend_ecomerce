import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Container,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Image,
  Skeleton,
  Tag,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { success_paymentI } from "../../store/reducers/paymentReducer";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { success_payment } = useSelector((state) => state.payment);
  const { userInfo } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    dispatch(success_paymentI({ userId: userInfo._id }));
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [dispatch, userInfo]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of orders per page

  // Calculate the current orders to display based on the page
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = success_payment.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to format date nicely
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Function to determine badge color based on status
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "ຈັດສົ່ງໄປສາຂາ":
        return "blue";
      case "ກຳລັງຈັດສົ່ງ":
        return "yellow";
      case "ສຳເລັດແລ້ວ":
        return "green";
      default:
        return "gray";
    }
  };

  if (success_payment.length === 0) {
    return (
      <Container maxW="container.lg" py={10}>
        <Card p={6} boxShadow="md" bg={bgColor}>
          <CardBody textAlign="center">
            <Heading size="md" mb={4}>
              No Order History
            </Heading>
            <Text>You haven't placed any orders yet.</Text>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={6}>
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Order History
      </Heading>

      {currentOrders.map((order, index) => (
        <Card
          key={order._id || index}
          mb={6}
          boxShadow="md"
          borderRadius="lg"
          overflow="hidden"
          borderWidth="1px"
          borderColor={borderColor}
          bg={bgColor}
        >
          <CardHeader bg={"blue.900"} py={4}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
              <Box>
                <HStack spacing={3} mb={2}>
                  <Text color={"white"} fontWeight="bold">
                    Order Date:
                  </Text>
                  <Text color={"white"}>{formatDate(order.date)}</Text>
                </HStack>
                <HStack spacing={3} mb={2}>
                  <Text color={"white"} fontWeight="bold">
                    ເລກທີ່ໃບບິນສັ່ງຊື້:
                  </Text>
                  <Badge colorScheme="red"  px={2} py={1}>
                    {" "}
                    {order.code_payment}
                  </Badge>
                </HStack>
                <HStack spacing={3}>
                  <Badge
                    colorScheme={
                      order.payment_status === "ຈ່າຍແລ້ວ" ? "green" : "red"
                    }
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {order.payment_status}
                  </Badge>
                  <Badge
                    colorScheme={getDeliveryStatusColor(order.delivery_status)}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {order.delivery_status}
                  </Badge>
                </HStack>
              </Box>
              <Box>
                <Tag size="md" colorScheme="red" variant="solid">
                  ຄູປອງສ່ວນຫຼຸດ {order.couponCode || 0}% OFF
                </Tag>
                <Text color={"white"} fontWeight="bold" fontSize="lg">
                  ລາຄາລວມຕ້ອງຈ່າຍ: {order.price.toLocaleString()} LAK
                </Text>
              </Box>
            </Flex>
          </CardHeader>

          <CardBody py={4}>
            <Box mb={6}>
              <Heading as="h4" size="sm" mb={3} color={"blue.900"}>
                SHIPPING INFORMATION
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <HStack>
                  <Text fontWeight="semibold" minW="80px">
                    ຊື່ ແລະ ນາມສະກຸນ:
                  </Text>
                  <Text>{order.shippingInfo.name}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold" minW="80px">
                    ເບີໂທລະສັບ:
                  </Text>
                  <Text>{order.shippingInfo.phone}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold" minW="80px">
                    ສາຂາຝາດຂົນສົ່ງ:
                  </Text>
                  <Text>{order.shippingInfo.branch}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold" minW="80px">
                    ຝາກບໍລິສັດ:
                  </Text>
                  <Text>{order.shippingInfo.transport}</Text>
                </HStack>
              </SimpleGrid>
              <Box mt={2}>
                <HStack align="flex-start">
                  <Text fontWeight="semibold" minW="80px">
                   ທີ່ຢູ່:
                  </Text>
                  <Text>
                    {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                    {order.shippingInfo.province}
                  </Text>
                </HStack>
              </Box>
            </Box>

            <Divider mb={4} />

            <Heading as="h4" size="sm" mb={3}>
              ORDERED PRODUCTS
            </Heading>

            <Stack spacing={4}>
              {order.products.map((product) => (
                <Skeleton
                  isLoaded={!isLoading}
                  key={product._id || Math.random()}
                >
                  <Card
                    variant="outline"
                    size="sm"
                    direction={{ base: "column", sm: "row" }}
                    overflow="hidden"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      objectFit="cover"
                      maxW={{ base: "100%", sm: "150px" }}
                      maxH="150px"
                      fallbackSrc="https://via.placeholder.com/150"
                    />
                    <Stack flex="1">
                      <CardBody py={3}>
                        <Text size="md" mb={2}>
                          {product.name}
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
                          <HStack>
                            <Text fontWeight="semibold">Category:</Text>
                            <Text>{product.category}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="semibold">Brand:</Text>
                            <Text>{product.brand}</Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="semibold">Quantity:</Text>
                            <Text>{product.quantity}</Text>
                          </HStack>
                        </SimpleGrid>
                        <Flex mt={2} justify="space-between" align="center">
                          <Tag size="md" colorScheme="red" variant="solid">
                            ສ່ວນຫຼຸດ {product.discount}% OFF
                          </Tag>
                          <Text fontWeight="bold" fontSize="lg">
                            ລາຄາ {product.price.toLocaleString()} LAK
                          </Text>
                        </Flex>
                      </CardBody>
                    </Stack>
                  </Card>
                </Skeleton>
              ))}
            </Stack>
          </CardBody>

          <CardFooter
            bg={"gray.900"}
            borderTop="1px"
            borderColor={borderColor}
            justify="flex-end"
          >
            <Button
              rightIcon={<DownloadIcon />}
              colorScheme="blue"
              variant="solid"
              size="md"
            >
              Download Receipt
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Pagination Controls */}
      <Flex justify="center" mt={8}>
        <HStack spacing={2}>
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            aria-label="Previous page"
            variant="outline"
          />

          <Text px={4} fontWeight="medium">
            Page {currentPage} of{" "}
            {Math.ceil(success_payment.length / itemsPerPage)}
          </Text>

          <IconButton
            icon={<ChevronRightIcon />}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={
              currentPage === Math.ceil(success_payment.length / itemsPerPage)
            }
            aria-label="Next page"
            variant="outline"
          />
        </HStack>
      </Flex>
    </Container>
  );
};

export default OrderHistory;
