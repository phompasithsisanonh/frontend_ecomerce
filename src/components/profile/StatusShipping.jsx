import {
  Step,
  StepDescription,
  StepIndicator,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonGroup,
  VStack,
  Divider,
  HStack,
  Badge,
  Flex,
  Container,
  useDisclosure,
  Icon,
  Skeleton,
  useToast,
  useColorModeValue,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { get_statusgpayment } from "../../store/reducers/paymentReducer";
import { useReactToPrint } from "react-to-print";
import {
  FaBox,
  FaTruck,
  FaCheck,
  FaMapMarkerAlt,
  FaReceipt,
  FaShippingFast,
} from "react-icons/fa";

const StatusShipping = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { statusgpayment, loading } = useSelector((state) => state.payment);
  const toast = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 1;

  // Modals
  const {
    isOpen: isAddressModalOpen,
    onOpen: openAddressModal,
    onClose: closeAddressModal,
  } = useDisclosure();

  const {
    isOpen: isReceiptModalOpen,
    onOpen: openReceiptModal,
    onClose: closeReceiptModal,
  } = useDisclosure();
  ////statusshpiing
  const {
    isOpen: shippingModalOpen,
    onOpen: openshipping,
    onClose: closeshipping,
  } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [shipping, setShipping] = useState(null);

  // Receipt PDF reference
  const receiptRef = useRef();

  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.700");
  const headerBg = useColorModeValue("orange.50", "gray.800");
  const headerColor = useColorModeValue("orange.500", "orange.300");

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: "ໃບບິນສັ່ງຊື້",
    removeAfterPrint: true,
    onAfterPrint: () => {
      toast({
        title: "PDF ພ້ອມດາວໂຫລດແລ້ວ",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Handle modals
  const handleOpenAddressModal = (order) => {
    setSelectedOrder(order);
    openAddressModal();
  };

  const handleOpenReceiptModal = (order) => {
    setReceipt(order);
    openReceiptModal();
  };

  const handleOpenShippingModal = (order) => {
    setShipping(order);
    openshipping();
  };
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  // Ensure statusgpayment is an array before slicing
  const currentOrders = Array.isArray(statusgpayment)
    ? statusgpayment.slice(indexOfFirstOrder, indexOfLastOrder)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      dispatch(get_statusgpayment({ userId: userInfo._id }));
    }
  }, [dispatch, userInfo,shipping]);

  // Steps for shipping status with icons
  const steps = [
    {
      title: "ກຳລັງຮັບຄຳສັ່ງຊື້",
      description: "",
      icon: FaBox,
    },
    {
      title: "ກຳລັງຈັດສົ່ງໄປສາຂາ",
      description: "",
      icon: FaShippingFast,
    },
    {
      title: "ກຳລັງຈັດສົ່ງ",
      description: "",
      icon: FaTruck,
    },
    {
      title: "ຈັດສົ່ງສຳເລັດ",
      description: "",
      icon: FaCheck,
    },
  ];

  // Determine product shipping status step based on product status
  const getProductStep = (status) => {
    switch (status) {
      case "pendding":
        return 0;
      case "ຈັດສົ່ງໄປສາຂາ":
        return 1;
      case "ກຳລັງຈັດສົ່ງ":
        return 2;
      case "ຈັດສົ່ງສຳເລັດ":
        return 3;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" p={4}>
        <Skeleton height="60px" mb={4} />
        <Skeleton height="200px" mb={4} />
        <Skeleton height="100px" />
      </Container>
    );
  }
  const ordered = (order) => {
    const productStep = getProductStep(order.delivery_status);
    return (
      <Box
        p={{ base: 3, md: 5 }}
        borderWidth="1px"
        borderRadius="lg"
        mb={4}
        bg={cardBg}
        transition="transform 0.3s ease"
        _hover={{ boxShadow: "lg" }}
      >
        <Button onClick={handleOpenShippingModal}>ກວດເບີ່ງສະຖານະ</Button>
        <Modal isOpen={shippingModalOpen} onClose={closeshipping}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ສະຖານະສິນຄ້າ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mb={6}>
                <Stepper
                  size={{ base: "xs", md: "md" }}
                  colorScheme="orange"
                  index={productStep}
                  gap={{ base: 2, md: 4 }}
                  orientation="vertical"

                  // display={'flex'} flexDirection={"column"}
                >
                  {steps.map((step, index) => (
                    <Step key={index} flex="1">
                      <StepIndicator>
                        <StepStatus
                          complete={<Icon as={step.icon} color="green.500" />}
                          incomplete={<Icon as={step.icon} color="gray.400" />}
                          active={<Icon as={step.icon} color="orange.500" />}
                        />
                      </StepIndicator>

                      <Box>
                        <StepTitle
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="medium"
                        >
                          {step.title}
                        </StepTitle>
                        {step.description && (
                          <StepDescription fontSize={{ base: "2xs", md: "xs" }}>
                            {step.description}
                          </StepDescription>
                        )}
                      </Box>

                      {index !== steps.length - 1 && <StepSeparator />}
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={4}>
          <GridItem>
            <Flex direction="column" spacing={2}>
              <Flex align="center" mb={2}>
                <Text fontWeight="bold" mr={2}>
                  ເລກທີ່ໃບບິນສັ່ງຊື້:
                </Text>
                <Badge colorScheme="red" fontSize="md" px={2} py={1}>
                  {order.code_payment}
                </Badge>
              </Flex>

              <HStack mb={2}>
                <Text fontWeight="bold">ລະຫັດສິນຄ້າ:</Text>
                <Text>{order.products[0]?.code_products}</Text>
              </HStack>

              <HStack mb={2}>
                <Text fontWeight="bold">ຊື່ສິນຄ້າ:</Text>
                <Text>{order.products[0]?.name}</Text>
              </HStack>

              <HStack mb={2}>
                <Text fontWeight="bold">ປະເພດສິນຄ້າ:</Text>
                <Text>{order.products[0]?.category}</Text>
              </HStack>

              <HStack mb={2}>
                <Text fontWeight="bold">ຈຳນວນສິນຄ້າ:</Text>
                <Text>{order.products[0]?.quantity} ລາຍການ</Text>
              </HStack>

              <HStack mb={2}>
                <Text fontWeight="bold">ລາຄາ:</Text>
                <Text>
                  {typeof order.products[0]?.price === "number"
                    ? order.products[0]?.price.toLocaleString()
                    : parseInt(
                        order.products[0]?.price?.$numberInt || 0
                      ).toLocaleString()}{" "}
                  ກີບ
                </Text>
              </HStack>

              <HStack mb={2}>
                <Text fontWeight="bold">ສ່ວນຫຼຸດ:</Text>
                <Text>
                  {typeof order.products[0]?.discount === "number"
                    ? order.products[0]?.discount.toLocaleString()
                    : parseInt(
                        order.products[0]?.discount?.$numberInt || 0
                      ).toLocaleString()}
                  %
                </Text>
              </HStack>
              <HStack mb={2}>
                <Text fontWeight="bold">ຄູປອງສ່ວນຫຼຸດສ່ວນຫຼຸດ:</Text>
                <Text>{order.couponCode}</Text>
              </HStack>
              <HStack mb={3}>
                <Text fontWeight="bold" color="red.500">
                  ລາຄາລວມ:
                </Text>
                <Text fontWeight="bold" color="red.500">
                  {typeof order.price === "number"
                    ? order.price.toLocaleString()
                    : parseInt(
                        order.price?.$numberInt || 0
                      ).toLocaleString()}{" "}
                  ກີບ
                </Text>
              </HStack>

              <Badge
                alignSelf="flex-start"
                colorScheme={
                  order.payment_status === "ຈ່າຍແລ້ວ" ? "green" : "red"
                }
                px={2}
                py={1}
                borderRadius="md"
                mb={3}
              >
                ສະຖານະຊຳລະ: <strong>{order.payment_status} </strong>
              </Badge>
            </Flex>
            {order.payment_status === "check_unpaid" ? (
              <Badge colorScheme={"red"}>
                ໝາຍເຫດ: ຢູ່ໃນລະຫວ່າງກວດສອບສະລິບການໂອນເງິນ
              </Badge>
            ) : (
              <Badge colorScheme="green">ກຳລັງຈັດສົ່ງ</Badge>
            )}
          </GridItem>

          <GridItem>
            <Flex
              direction="column"
              justify="center"
              h="full"
              align={{ base: "flex-start", md: "flex-end" }}
            >
              <ButtonGroup
                spacing={3}
                mb={4}
                width={{ base: "full", md: "auto" }}
                flexDirection={{ base: "row", sm: "row" }}
              >
                <Button
                  colorScheme="red"
                  leftIcon={<FaReceipt />}
                  onClick={() => handleOpenReceiptModal(order)}
                  size={{ base: "md", md: "md" }}
                  width={{ base: "full", sm: "auto" }}
                >
                  ໃບບິນສັ່ງຊື້
                </Button>
                <Button
                  colorScheme="orange"
                  leftIcon={<FaMapMarkerAlt />}
                  onClick={() => handleOpenAddressModal(order)}
                  size={{ base: "md", md: "md" }}
                  width={{ base: "full", sm: "auto" }}
                >
                  ເບີ່ງທີ່ຢູ່
                </Button>
              </ButtonGroup>

              {/* Tracking status badges */}
              <Badge
                colorScheme={
                  productStep === 3
                    ? "green"
                    : productStep === 0
                    ? "yellow"
                    : "orange"
                }
                p={2}
                borderRadius="md"
                fontSize="sm"
                width={{ base: "full", md: "auto" }}
                textAlign="center"
              >
                {steps[productStep].title}
              </Badge>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    );
  };
  return (
    <Container maxW="container.lg" p={{ base: 2, md: 4 }}>
      <Box p={4} bg={headerBg} borderRadius="xl" mb={6} boxShadow="md">
        <Flex align="center">
          <Icon as={FaTruck} fontSize="3xl" color={headerColor} mr={3} />
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color={headerColor}
          >
            ສະຖານະສິນຄ້າ
          </Text>
        </Flex>
      </Box>

      {/* Display order details */}
      {currentOrders && currentOrders.length > 0 ? (
        <Box>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={4}>
            ລາຍລະອຽດສະຖານະຈັດສົ່ງສິນຄ້າ
          </Text>

          {currentOrders.map((order, idx) => (
            <Box
              key={idx}
              p={{ base: 3, md: 5 }}
              borderWidth="1px"
              borderRadius="lg"
              bg={bgColor}
              borderColor={borderColor}
              boxShadow="sm"
              mb={4}
            >
              {order.payment_status === "ລໍຖ້າ" ? (
                <Flex direction="column" align="center" justify="center" p={6}>
                  <Icon as={FaBox} fontSize="5xl" color="gray.400" mb={4} />
                  <Text color="gray.500" fontSize="lg" textAlign="center">
                    ບໍ່ມີລາຍການສິນຄ້າທີ່ສັ່ງຊື້
                  </Text>
                </Flex>
              ) : (
                Array.isArray(order.products) && ordered(order)
              )}
            </Box>
          ))}

          {/* Pagination Controls */}
          <Flex mt={6} justify="center" mb={6}>
            <ButtonGroup isAttached variant="outline">
              <Button
                onClick={() => paginate(currentPage - 1)}
                isDisabled={currentPage === 1}
                leftIcon={<Text>◀</Text>}
                colorScheme="orange"
              >
                ກ່ອນໜ້າ
              </Button>
              <Button
                onClick={() => paginate(currentPage + 1)}
                isDisabled={
                  currentPage * ordersPerPage >=
                  (Array.isArray(statusgpayment) ? statusgpayment.length : 0)
                }
                rightIcon={<Text>▶</Text>}
                colorScheme="orange"
              >
                ຖັດໄປ
              </Button>
            </ButtonGroup>
          </Flex>

          <Text fontSize="sm" textAlign="center" color="gray.500">
            ສະແດງລາຍການທີ {indexOfFirstOrder + 1} -{" "}
            {Math.min(
              indexOfLastOrder,
              Array.isArray(statusgpayment) ? statusgpayment.length : 0
            )}{" "}
            ຈາກທັງໝົດ{" "}
            {Array.isArray(statusgpayment) ? statusgpayment.length : 0} ລາຍການ
          </Text>
        </Box>
      ) : (
        <Box
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          bg={bgColor}
          textAlign="center"
        >
          <Icon as={FaBox} fontSize="6xl" color="gray.400" mb={4} />
          <Text fontSize="xl" color="gray.500">
            ບໍ່ມີຄຳສັ່ງຊື້ທີ່ຈະສະແດງ.
          </Text>
        </Box>
      )}

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={closeAddressModal}
        isCentered
        size="md"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader bg={headerBg} color={headerColor} borderTopRadius="xl">
            <Flex align="center">
              <Icon as={FaMapMarkerAlt} mr={2} />
              ລາຍລະອຽດທີ່ຢູ່ຈັດສົ່ງສິນຄ້າ
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>
            <VStack align="stretch" spacing={3}>
              <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                <HStack mb={2}>
                  <Text fontWeight="bold" minW="100px">
                    ຊື່ລູກຄ້າ:
                  </Text>
                  <Text>{selectedOrder?.shippingInfo?.name || "-"}</Text>
                </HStack>
                <HStack mb={2}>
                  <Text fontWeight="bold" minW="100px">
                    ທີ່ຢູ່ຈັດສົ່ງ:
                  </Text>
                  <Text>{selectedOrder?.shippingInfo?.address || "-"}</Text>
                </HStack>
                <HStack mb={2}>
                  <Text fontWeight="bold" minW="100px">
                    ເບີໂທລະສັບ:
                  </Text>
                  <Text>{selectedOrder?.shippingInfo?.phone || "-"}</Text>
                </HStack>
                <HStack mb={2}>
                  <Text fontWeight="bold" minW="100px">
                    ສາຂາ:
                  </Text>
                  <Text>{selectedOrder?.shippingInfo?.branch || "-"}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" minW="100px">
                    ແຂວງ:
                  </Text>
                  <Text>{selectedOrder?.shippingInfo?.province || "-"}</Text>
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeAddressModal}>
              ປິດ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isCentered
        isOpen={isReceiptModalOpen}
        onClose={closeReceiptModal}
        size="md"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader bg={headerBg} color={headerColor} borderTopRadius="xl">
            <Flex align="center">
              <Icon as={FaReceipt} mr={2} />
              ໃບບິນສັ່ງຊື້
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              ref={receiptRef}
              p={6}
              borderWidth={1}
              borderRadius="lg"
              bg="white"
            >
              <VStack align="start" spacing={4}>
                <Flex w="full" justify="space-between" align="center">
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    Receipt
                  </Text>
                  <Image
                    src="/logo.png"
                    fallbackSrc="https://via.placeholder.com/100x50?text=LOGO"
                    alt="Company Logo"
                    h="50px"
                    objectFit="contain"
                  />
                </Flex>
                <Divider />

                <Box>
                  <HStack mb={1}>
                    <Text fontWeight="bold">Order ID:</Text>
                    <Badge colorScheme="red">
                      {receipt?.code_payment || "-"}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold">Date:</Text>
                    <Text>
                      {receipt?.date
                        ? new Date(receipt.date).toLocaleDateString()
                        : "-"}
                    </Text>
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    ຂໍ້ມູນລູກຄ້າ:
                  </Text>
                  <Text>{receipt?.shippingInfo?.name || "-"}</Text>
                  <Text>{receipt?.shippingInfo?.address || "-"}</Text>
                  <Text>{receipt?.shippingInfo?.phone || "-"}</Text>
                </Box>

                <Box w="full">
                  <Text fontWeight="bold" mb={2}>
                    ສິນຄ້າ:
                  </Text>
                  {Array.isArray(receipt?.products) ? (
                    receipt.products.map((product, index) => (
                      <Box  key={index} p={3} borderWidth="1px" borderRadius="md" mb={2}>
                        <HStack p={'1'}  borderRadius={'20px'} bg={'black'} justify="space-between" mb={1}>
                          <Text color={'white'} fontWeight="medium">ຮ້ານຄ້າ:</Text>
                          <Badge colorScheme="yellow">{product.shopName || "-"}</Badge>
                        </HStack>
                        <Box
                          key={index}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          mb={2}
                        >
                          <HStack justify="space-between" mb={1}>
                            <Text fontWeight="medium">ຊື່ສິນຄ້າ:</Text>
                            <Text>{product.name || "-"}</Text>
                          </HStack>
                          <HStack justify="space-between" mb={1}>
                            <Text>ຈຳນວນສິນຄ້າ:</Text>
                            <Text>{product.quantity || "-"} ລາຍການ</Text>
                          </HStack>
                          <HStack justify="space-between" mb={1}>
                            <Text>ລາຄາ:</Text>
                            <Text>
                              {typeof product.price === "number"
                                ? product.price.toLocaleString()
                                : parseInt(
                                    product.price || 0
                                  ).toLocaleString()}{" "}
                              ກີບ
                            </Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text>ສ່ວນຫຼຸດ:</Text>
                            <Text>
                              {typeof product.discount === "number"
                                ? product.discount.toLocaleString()
                                : parseInt(
                                    product.discount || 0
                                  ).toLocaleString()}{" "}
                              %
                            </Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text>ລະຫັດຄູປອງສ່ວນຫຼຸດ:</Text>
                            <Text>{receipt.couponCode}</Text>
                          </HStack>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Text color="gray.500">ບໍ່ມີຂໍ້ມູນສິນຄ້າ</Text>
                  )}
                </Box>

                <Divider />
                <HStack
                  justify="space-between"
                  w="full"
                  p={2}
                  bg="gray.100"
                  borderRadius="md"
                >
                  <Text fontWeight="bold">ລາຄາລວມຕ້ອງຈ່າຍ:</Text>
                  <Text fontWeight="bold" fontSize="lg" color="red.500">
                    {typeof receipt?.price === "number"
                      ? receipt.price.toLocaleString()
                      : parseInt(
                          receipt?.price?.$numberInt || 0
                        ).toLocaleString()}{" "}
                    ກີບ
                  </Text>
                </HStack>

                <Box w="full" textAlign="center" mt={4}>
                  <Text fontSize="sm" color="gray.500">
                    ຂອບໃຈສຳລັບການສັ່ງຊື້
                  </Text>
                </Box>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<FaReceipt />}
              onClick={handlePrint}
              mr={2}
            >
              ດາວໂຫລດ PDF
            </Button>
            <Button variant="outline" onClick={closeReceiptModal}>
              ປິດ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default StatusShipping;
