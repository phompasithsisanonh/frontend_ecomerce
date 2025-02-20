import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Button,
  Divider,
  Flex,
  HStack,
  VStack,
  Heading,
  Pagination,
  Stack,
  Image,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { success_paymentI } from "../../store/reducers/paymentReducer";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { success_payment } = useSelector((state) => state.payment);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(success_paymentI({ userId: userInfo._id }));
  }, [dispatch, userInfo]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of orders per page

  // Calculate the current orders to display based on the page
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = success_payment.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p="6" m="4" maxW="xl">
      <Heading as="h3" size="lg" mb="4">
        Order Details
      </Heading>
      {currentOrders.map((i, o) => (
        <Box key={o}>
          <Text mb="4">
            <strong>Order Date:</strong> {new Date(i.date).toLocaleString()}
          </Text>
          <Text mb="4">
            <strong>Payment Status:</strong>{" "}
            <Badge colorScheme={i.payment_status === "ຈ່າຍແລ້ວ" ? "green" : "red"}>
              {i.payment_status}
            </Badge>
          </Text>
          <Text mb="4">
            <strong>Delivery Status:</strong>{" "}
            <Badge colorScheme={i.delivery_status === "ຈັດສົ່ງໄປສາຂາ" ? "blue" : "gray"}>
              {i.delivery_status}
            </Badge>
          </Text>
        </Box>
      ))}

      <Divider mb="4" />

      <Heading as="h4" size="md" mb="2">
        Shipping Information
      </Heading>
      {currentOrders.map((i, o) => (
        <Box key={o}>
          <Text>
            <strong>Name:</strong> {i.shippingInfo.name}
          </Text>
          <Text>
            <strong>Address:</strong> {i.shippingInfo.address}, {i.shippingInfo.city},{" "}
            {i.shippingInfo.province}
          </Text>
          <Text>
            <strong>Phone:</strong> {i.shippingInfo.phone}
          </Text>
          <Text>
            <strong>Branch:</strong> {i.shippingInfo.branch}
          </Text>
          <Text>
            <strong>Transport:</strong> {i.shippingInfo.transport}
          </Text>
        </Box>
      ))}

      <Divider mb="4" />

      <Heading as="h4" size="md" mb="2">
        Products
      </Heading>
      {currentOrders.map((productr) =>
        productr.products.map((product) => (
          <Box key={product._id} mb="4" p="4" borderWidth="1px" borderRadius="md">
            <Flex direction={{ base: "column", md: "row" }} align="center">
              <Image
                src={product.images[0]}
                alt={product.name}
                boxSize="150px"
                objectFit="cover"
                mr={{ base: 0, md: 4 }}
                mb={{ base: 4, md: 0 }}
              />
              <VStack align="start">
                <Text fontWeight="bold" fontSize="xl">
                  {product.name}
                </Text>
                <Text>
                  <strong>Category:</strong> {product.category}
                </Text>
                <Text>
                  <strong>Brand:</strong> {product.brand}
                </Text>
                <Text>
                  <strong>Price:</strong> {product.price.$numberInt} LAK
                </Text>
                <Text>
                  <strong>Discount:</strong> {product.discount.$numberInt}%
                </Text>
                <Text>
                  <strong>Quantity:</strong> {product.quantity.$numberInt}
                </Text>
              </VStack>
            </Flex>
          </Box>
        ))
      )}

      <Divider mb="4" />

      <HStack justify="space-between" mt="4">
        {currentOrders.map((i) => (
          <Text fontWeight="bold" key={i._id}>
            Total Price: {i.price.$numberInt} LAK
          </Text>
        ))}
        <Button colorScheme="blue">Download Receipt</Button>
      </HStack>

      {/* Pagination Controls */}
      <HStack justify="center" spacing={4} mt="6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {Math.ceil(success_payment.length / itemsPerPage)}
        </Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === Math.ceil(success_payment.length / itemsPerPage)}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default OrderHistory;
