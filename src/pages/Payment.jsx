import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Image,
  VStack,
  HStack,
  Text,
  Divider,
  Container,
  Center,
  Badge,
  Input,
  Stack,
  Card,
  CardBody,
} from "@chakra-ui/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BsBank } from "react-icons/bs";
import { CiBarcode } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  payment_success,
} from "../store/reducers/paymentReducer";
import toast from "react-hot-toast";
import FadeLoader from "react-spinners/FadeLoader";

const Payment = () => {
  const {
    state: { orderId, price, items, shippingInfo, buy_product_item },
  } = useLocation();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.payment
  );
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePayment = async () => {
    if (!image) {
      toast.error("Please upload a payment image.");
      return;
    }

    const formData = new FormData();
    formData.append("images", image);
    dispatch(
      payment_success({
        id: orderId,
        formData: formData,
        sellerId: userInfo._id,
      })
    );
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
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
    <Box bg="gray.50" minH="100vh">
      <Header />
      {loader && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          w="full"
          h="full"
          justify="center"
          align="center"
          bg="rgba(0, 0, 0, 0.4)"
          zIndex="999"
        >
          <FadeLoader color="#4A90E2" />
        </Flex>
      )}

      <Container maxW="6xl" py={10}>
        <Flex direction={{ base: "column", md: "row" }} gap={6}>
          {/* Payment Method */}
          <Box flex={1}>
            <HStack spacing={4} mb={6} justify="center">
              {[
                {
                  method: "COD",
                  icon: <CiBarcode size={40} />,
                  label: "Cash on Delivery",
                },
                { method: "QR", icon: <BsBank size={40} />, label: "BCEL QR" },
              ].map(({ method, icon, label }) => (
                <Card
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  cursor="pointer"
                  bg={paymentMethod === method ? "white" : "gray.100"}
                  boxShadow={paymentMethod === method ? "md" : "sm"}
                  transition="0.3s"
                  _hover={{ boxShadow: "lg", bg: "white" }}
                  w="full"
                  p={4}
                >
                  <Center flexDirection="column">
                    {icon}
                    <Text mt={2} fontWeight="medium">
                      {label}
                    </Text>
                  </Center>
                </Card>
              ))}
            </HStack>

            {/* Payment Details */}
            {paymentMethod === "COD" ? (
              <Card shadow="md" p={6}>
                <CardBody>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Shipping Information
                  </Text>
                  {Object.entries(shippingInfo).map(([key, value]) => (
                    <Text key={key} mb={1}>
                      <strong>{key.replace(/([A-Z])/g, " $1")}: </strong>{" "}
                      {value}
                    </Text>
                  ))}
                  {/* <Button
                    mt={4}
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => navigate("/card")}
                  >
                    Edit Address
                  </Button> */}
                </CardBody>
              </Card>
            ) : (
              <Card shadow="md" p={6} textAlign="center">
                <VStack spacing={4}>
                  <Text>ສະແກນຊຳລະເງິນ</Text>
                  <Image
                    src="http://localhost:3000/images/BCEL.jpeg"
                    boxSize="300px"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  <Text color={"red"}>
                    ແຈ້ງຫຼັກຖານການຊໍາລະເງິນ & ສະລິບໂອນເງິນ
                  </Text>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button colorScheme="green" onClick={handlePayment} w="full">
                    Pay Now
                  </Button>
                </VStack>
              </Card>
            )}
          </Box>

          {/* Order Summary */}
          <Box flex={0.8}>
            <Card shadow="lg" p={5}>
              <CardBody>
                <Text fontSize="lg" fontWeight="bold">
                  Order Summary
                </Text>
                <Divider my={3} />
                <Text>
                  ຈຳນວນສິນຄ້າລວມຄ່າຈັດສົ່ງ {items || buy_product_item} ລາຍການ
                </Text>
                <Flex justify="space-between" mb={2}>
                  <Text>Items + Shipping:</Text>
                  <Text>{Number(price).toLocaleString()} LAK</Text>
                </Flex>
                <Flex
                  justify="space-between"
                  fontWeight="bold"
                  color="green.600"
                >
                  <Text>Total Amount:</Text>
                  <Text>{Number(price).toLocaleString()} LAK</Text>
                </Flex>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>

      <Footer />
    </Box>
  );
};

export default Payment;
