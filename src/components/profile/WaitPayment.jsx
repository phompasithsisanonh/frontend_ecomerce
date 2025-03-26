import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Badge,
  Stack,
  Button,
  Image,
  HStack,
  ButtonGroup,
  Icon,
} from "@chakra-ui/react";
import { CiNoWaitingSign } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { get_payment } from "../../store/reducers/paymentReducer";
import OrderCountdown from "./OrderCountdown";
import { useNavigate } from "react-router-dom";
import {
  delete_customer_order,
  get_found,
  messageClear,
} from "../../store/reducers/orderReducer";
import toast from "react-hot-toast";

const WaitPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { payments } = useSelector((state) => state.payment);
  const { userInfo } = useSelector((state) => state.auth);
  const { successMessage, errorMessage } = useSelector((state) => state.order);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // Number of payments per page

  useEffect(() => {
    dispatch(get_payment({ userId: userInfo._id }));
  }, [dispatch, userInfo]);

  // Pagination logic
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handle = async (pro) => {
    try {
      const get_id = pro.products.map((item) => item._id);

      // Dispatch and wait for the response
      const response = await dispatch(get_found({ get_id: get_id }));
      console.log(response);
      // Check if there's an error before navigating
      if (response?.payload.message === "ສິນຄ້າບາງລາຍການໝົດສະຕ໋ອກ") {
        return navigate(`/`);
      } else {
        navigate(`/payment`, {
          state: {
            orderId: pro._id,
            price: pro.price,
            items: pro.products.length,
            shippingInfo: pro.shippingInfo,
          },
        });
      }

      // Navigate only if no error
    } catch (error) {
      console.error("Error in handle function:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  const handle_delete = (id) => {
    dispatch(
      delete_customer_order({
        id: id,
      })
    ).then(() => dispatch(get_payment({ userId: userInfo._id })));
  };
  console.log(currentPayments);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (!userInfo) {
      return navigate("/login");
    }
  }, [successMessage, errorMessage, dispatch, navigate, userInfo]);
  return (
    <Box p={4} bg="gray.50" borderRadius="md" shadow="md">
      <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" mb={4}>
        ລໍຖ້າຊຳລະເງິນ
      </Text>
      {currentPayments.length > 0 ? (
        currentPayments.map((payment, index) => (
          <Box key={index} mb={6} borderWidth="1px" borderRadius="lg" p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              ສິນຄ້າ:
            </Text>
            <Stack spacing={3}>
              {payment.products.map((product, i) => (
                <Box
                  fontSize={{ base: "10px", md: "15px" }}
                  key={i}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "left", md: "center" }}
                  >
                    <Image
                      objectFit="cover"
                      boxSize="50px"
                      src={product.images[0]}
                      alt={product.name}
                      borderRadius="md"
                      mb={{ base: 2, md: 0 }}
                    />
                    <Box ml={{ md: 3 }} mt={{ base: 2, md: 0 }}>
                      <Text fontWeight="semibold">
                        ຊື່ສິນຄ້າ: {product.name}
                      </Text>
                      <Text>ລາຄາ: {product.price.toLocaleString()} ກີບ</Text>
                      <Text>ຈຳນວນ: {product.quantity} ລາຍການ</Text>
                      <Text>ແບຣນ: {product.brand}</Text>
                    </Box>
                  </Flex>
                  <Flex display="flex" justifyContent="flex-end" mt={2}>
                    <Text
                      color="red"
                      fontSize={{ base: "10px", md: "lg" }}
                      fontWeight="bold"
                    >
                      ລາຄາລວມ: {payment.price.toLocaleString()} ກີບ
                    </Text>
                  </Flex>
                </Box>
              ))}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                {payment.payment_status === "ລໍຖ້າ" && (
                  <ButtonGroup>
                    <Button
                      colorScheme="orange"
                      size="sm"
                      width={{ base: "full", sm: "150px" }}
                      onClick={() => handle_delete(payment._id)}
                    >
                      ຍົກເລີກສັ່ງຊື້
                    </Button>

                    <Button
                      width={{ base: "full", sm: "150px" }}
                      onClick={() => handle(payment)}
                      colorScheme="red"
                      size="sm"
                    >
                      Pay Now
                    </Button>
                  </ButtonGroup>
                )}
              </Box>
              {payment.payment_status === "unpaid" && (
                <OrderCountdown orderDate={payment.date} />
              )}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Box
                  flexDirection="column"
                  textAlign={{ base: "center", md: "right" }}
                >
                  <Text
                    fontSize={{ base: "10px", md: "lg" }}
                    fontWeight="bold"
                    mb={2}
                  >
                    Order Date: {new Date(payment.date).toLocaleString()}
                  </Text>
                  <Text fontSize={{ base: "10px", md: "lg" }}>
                    Status:{" "}
                    <Badge
                      fontSize={{ base: "10px", md: "lg" }}
                      colorScheme="orange"
                    >
                      {payment.payment_status}
                    </Badge>
                  </Text>
                </Box>
              </Box>
            </Stack>
            {/* Pagination Controls */}
            <HStack justifyContent="center" mt={4} spacing={4}>
              <Button
                onClick={handlePrevPage}
                isDisabled={currentPage === 1}
                colorScheme="teal"
                size="sm"
              >
                Previous
              </Button>
              <Text fontSize={{ base: "10px", md: "lg" }}>
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
                colorScheme="teal"
                size="sm"
              >
                Next
              </Button>
            </HStack>
          </Box>
        ))
      ) : (
        <Box>
          <Flex direction="column" align="center" justify="center" p={6}>
            <Icon as={CiNoWaitingSign} fontSize="5xl" color="gray.400" mb={4} />
            <Text color="gray.500" fontSize="lg" textAlign="center">
              ບໍ່ມີລາຍການລໍຖ້າໍຊຳລະເງິນ
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default WaitPayment;
