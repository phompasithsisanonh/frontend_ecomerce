import React, { useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Badge,
  Stack,
  Button,
  Image,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { get_payment } from "../../store/reducers/paymentReducer";

const WaitPayment = () => {
  const dispatch = useDispatch();
  const { payments } = useSelector((state) => state.payment);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(get_payment({ userId: userInfo._id }));
  }, [dispatch, userInfo]);

  return (
    <Box p={4} bg="gray.50" borderRadius="md" shadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Pending Payments
      </Text>
      {payments.map((payment, index) => (
        <Box key={index} mb={6} borderWidth="1px" borderRadius="lg" p={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Order Date: {new Date(payment.date).toLocaleString()}
          </Text>
          <Text>Status: 
            <Badge colorScheme="orange">{payment.payment_status}</Badge>
          </Text>

          <Divider my={4} />

          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Customer: {payment.shippingInfo.name}
          </Text>
          <Text>Address: {payment.shippingInfo.address}, {payment.shippingInfo.city}</Text>
          <Text>Phone: {payment.shippingInfo.phone}</Text>
          
          <Divider my={4} />

          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Products:
          </Text>
          <Stack spacing={3}>
            {payment.products.map((product, i) => (
              <Box key={i} p={4} borderWidth="1px" borderRadius="md">
                <Flex>
                  <Image
                    boxSize="50px"
                    src={product.images[0]}
                    alt={product.name}
                    borderRadius="md"
                  />
                  <Box ml={3}>
                    <Text fontWeight="semibold">{product.name}</Text>
                    <Text>Price: {product.price} LAK</Text>
                    <Text>Quantity: {product.quantity}</Text>
                    <Text>Brand: {product.brand}</Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Stack>

          <Divider my={4} />

          <Flex justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Total Price: {payment.price} LAK
            </Text>
            <Button colorScheme="red" size="sm">
              Pay Now
            </Button>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};

export default WaitPayment;
