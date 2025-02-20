import {
  Step,
  StepDescription,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button as ChakraButton,
  ButtonGroup,
  VStack,
  Divider,
  HStack,
  useBreakpointValue,
  Badge,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { get_statusgpayment } from "../../store/reducers/paymentReducer";
import { useReactToPrint } from "react-to-print";
const StatusShipping = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { statusgpayment } = useSelector((state) => state.payment);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 1;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);

  //receipt pdf
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: "ໃບບິນສັ່ງຊື້",
    removeAfterPrint: true,
  });

  // Handle modal open/close and setting the selected order
  const handleOpenModal1 = (order) => {
    console.log(order);
    setReceipt(order);
    setIsModalOpen1(true);
  };

  const handleCloseModal1 = () => {
    setIsModalOpen1(false);
    setReceipt(null);
  };

  // Default steps for shipping status
  const steps = [
    {
      title: "ກຳລັງຮັບຄຳສັ່ງຊື້",//pendding
      description: "",
    },
    {
      title: "ກຳລັງຈັດສົ່ງໄປສາຂາ",///send_to_branch
      description: "",
    },
    {
      title: "ກຳລັງຈັດສົ່ງ", //shipping
      description: "",
    },
    {
      title: "ຈັດສົ່ງສຳເລັດ",//success
      description: "",
    },
  ];

  // Pagination logic
  const filteredOrders = statusgpayment.filter(
    (order) => order.delivery_status !== "cancelled"
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    dispatch(get_statusgpayment({ userId: userInfo._id }));
  }, [dispatch, userInfo]);

  // Handle modal open/close and setting the selected order
  const handleOpenModal = (order) => {
    console.log(order);
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
console.log(currentOrders)
  // Determine product shipping status step based on product status
  const getProductStep = (status) => {
    console.log(status);
    switch (status) {
      case "pendding":
        return 0; // Pending Payment
      case "ຈັດສົ່ງໄປສາຂາ":
        return 1; // Shipped
      case "ກຳລັງຈັດສົ່ງ":
        return 2; // In Transit
      case "ຈັດສົ່ງສຳເລັດ":
        return 3; // Delivered
      default:
        return 0; // Default to Pending Payment if status is unknown
    }
  };

  return (
    <Box p={4} bg="gray.50" borderRadius="md" shadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        ສະຖານະສິນຄ້າ
      </Text>

      {/* Display order details */}
      {currentOrders.length > 0 ? (
        <Box mt={6}>
          <Text fontSize="xl" fontWeight="bold">
            ລາຍລະອຽດສະຖານະຈັດສົ່ງສິນຄ້າ
          </Text>
          {currentOrders.map((order, idx) => (
            <Box key={idx} p={4} borderWidth="1px" borderRadius="md">
              {order.payment_status==="unpaid" ?(
                    "not have item"
              ):(
                order.products.map((product, productIdx) => {
                  const productStep = getProductStep(order.delivery_status);
                  return (
                    <Box
                      key={productIdx}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      orientation={{ base: "vertical", md: "horizontal" }}
                    >
                      {/* Shipping status step for each product */}
                      <Stepper
                        size={{ base: "xs", md: "sm" }}
                        colorScheme="yellow"
                        index={productStep}
                        gap={4} // เพิ่มระยะห่างระหว่าง Step
                      >
                        {steps.map((step, index) => (
                          <Step
                            key={index}
                            flex="1"
                            minW="120px"
                            textAlign="center"
                          >
                            <StepIndicator>
                              <StepStatus
                                complete="✅"
                                incomplete="😅"
                                active="📍"
                              />
                            </StepIndicator>
  
                            <Box>
                              <StepTitle fontSize={{ base: "sm", md: "md" }}>
                                {step.title}
                              </StepTitle>
                              <StepDescription>
                                {step.description}
                              </StepDescription>
                            </Box>
  
                            {index !== steps.length - 1 && <StepSeparator />}
                          </Step>
                        ))}
                      </Stepper>
  
                      <Box paddingTop={"30px"}>
                        <Text>ລະຫັດສິນຄ້າ: {product.code_products}</Text>
                        <Text>ເລກທີ່ໃບບິນສັ່ງຊື້:<Badge colorScheme="red"> {order.code_payment}</Badge></Text>
                        <Text fontWeight="bold">ຊື່ສິນຄ້າ: {product.name}</Text>
                        <Text fontWeight="bold">
                          ປະເພດສິນຄ້າ: {product.category}
                        </Text>
                        <Text>ຈຳນວນສິນຄ້າ: {product.quantity} ລາຍການ</Text>
                        <Text>ລາຄາ: {product.price.toLocaleString()} ກີບ</Text>
                        <Text>ລາຄາ: {product.discount.toLocaleString()}%</Text>
                        <Text color="red">
                          ລາຄາລວມ: {order.price.toLocaleString()} ກີບ
                        </Text>
                        <Badge colorScheme="red">ສະຖານະຊຳລະ:{order.payment_status}</Badge>
                      </Box>
  
                      {/* Button to open the modal */}
                      <ButtonGroup display={"flex"} justifyContent={"flex-end"}>
                        <Button
                          colorScheme="red"
                          onClick={() => handleOpenModal1(order)}
                        >
                          ໃບບິນສັ່ງຊື້
                        </Button>
                        <Button
                          colorScheme="orange"
                          onClick={() => handleOpenModal(order)}
                        >
                          ເບີ່ງທີ່ຢູ່
                        </Button>
                      </ButtonGroup>
                    </Box>
                  );
                })
              )}
              
              
            </Box>
          ))}

          {/* Pagination Controls */}
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              onClick={() => paginate(currentPage - 1)}
              isDisabled={currentPage === 1}
              mr={2}
            >
              ກ່ອນໜ້າ
            </Button>
            <Button
              onClick={() => paginate(currentPage + 1)}
              isDisabled={currentPage * ordersPerPage >= filteredOrders.length}
            >
              ຖັດໄປ
            </Button>
          </Box>
        </Box>
      ) : (
        <Text mt={6}>No orders to display.</Text>
      )}

      {/* Modal to display order details */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ລາຍລະອຽດທີ່ຢູ່ຈັດສົ່ງສິນຄ້າ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <Text>ຊື່ລູດຄ້າ: {selectedOrder?.shippingInfo?.name}</Text>
              <Text>ທີ່ຢູ່ຈັດສົ່ງ: {selectedOrder?.shippingInfo?.address}</Text>
              <Text>ເບີໂທລະສັບ: {selectedOrder?.shippingInfo?.phone}</Text>
              <Text>ສາຂາ: {selectedOrder?.shippingInfo?.branch}</Text>
              <Text>ແຂວງ: {selectedOrder?.shippingInfo?.province}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <ChakraButton colorScheme="blue" onClick={handleCloseModal}>
              Close
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal to receipt*/}
      <Modal isCentered isOpen={isModalOpen1} onClose={handleCloseModal1}>
        <ModalOverlay />
        <ModalContent>
          {" "}
          {/* ✅ ย้าย ref มาที่นี่ */}
          <ModalHeader>ໃບບິນສັ່ງຊື້</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              ref={receiptRef}
              p={6}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="md"
            >
              <VStack align="start" spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">
                  Receipt
                </Text>
                <Divider />

                <Box>
                  <Text>
                    <strong>Order ID:</strong> <Badge colorScheme="red">{receipt?.code_payment}</Badge>
                  </Text>
                  <Text>
                    <strong>Date:</strong>{" "}
                    {new Date(receipt?.date).toLocaleDateString()}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">ຂໍ້ມູນລູກຄ້າ:</Text>
                  <Text>{receipt?.shippingInfo?.name}</Text>
                  <Text>{receipt?.shippingInfo?.address}</Text>
                  <Text>{receipt?.shippingInfo?.phone}</Text>
                </Box>

                <Box w="full">
                  <Text fontWeight="bold">ສິນຄ້າ:</Text>
                  {receipt?.products.map((product, index) => (
                    <Box key={index}>
                      <HStack justify="space-between">
                        <Text>ຊື່ສິນຄ້າ:</Text>
                        <Text>{product.name}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>ຈຳນວນສິນຄ້າ:</Text>
                        <Text>{product.quantity} ລາຍການ</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>ລາຄາ:</Text>
                        <Text>{product.price.toLocaleString()} ກີບ</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>ສ່ວນຫຼຸດ:</Text>
                        <Text>{product.discount.toLocaleString()} %</Text>
                      </HStack>
                    </Box>
                  ))}
                </Box>

                <Divider />
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold">ລາຄາລວມຕ້ອງຈ່າຍ:</Text>
                  <Text fontWeight="bold">
                    {receipt?.price.toLocaleString()} ກີບ
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => handlePrint}>
              Download PDF
            </Button>
            <ChakraButton ml={2} onClick={handleCloseModal1}>
              Close
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StatusShipping;
