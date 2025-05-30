import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { messageClear, place_order } from "../store/reducers/orderReducer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { get_profile_customer } from "../store/reducers/authReducer";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { userInfo ,get_customer} = useSelector((state) => state.auth);
  const { errorMessage, successMessage } = useSelector((state) => state.order);
  const {
    state: {
      couponCode,
      card_products,
      price,
      price_,
      buy_product_item,
      items,
    },
  } = useLocation();
  const [formData, setFormData] = useState({
    name:  "",
    address:  "",
    phone:  "",
    branch: "",
    province:"",
    city: "",
    transport:  "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value) return `${name} is required`;
    if (name === "phone" && !/^\d{8,}$/.test(value)) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      dispatch(
        place_order({
          price: Number.isNaN(price_) || price_ == null ? price : price_,
          products: card_products,
          items: buy_product_item || items,
          shippingInfo: formData,
          userId: userInfo._id,
          couponCode: couponCode,
          navigate,
        })
      );
    } else {
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
    if (!userInfo) {
      navigate("/login");
    }
  }, [successMessage, errorMessage, dispatch, navigate, userInfo, toast]);
  useEffect(() => {
    if (userInfo) {
      dispatch(
        get_profile_customer({
          id: userInfo._id,
        })
      );
    }
  }, [userInfo, dispatch]);
   useEffect(() => {
      if (get_customer) {
        setFormData({
          name: get_customer.name || "",
          email: get_customer.email || "",
          phone: get_customer.phone || 0,
          method: get_customer.method || "",
          address: get_customer.address || "",
          province: get_customer.province || "",
          city: get_customer.city || "",
          transport: get_customer.transport || "",
          branch: get_customer.branch || "",
          images: get_customer.images || "",
        });
      }
      
    },[get_customer])
     
    
  return (
    <Container maxW="container.xl" py={8}>
      <Header />
      <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={8}>
        {/* Shipping Form */}
        <GridItem>
          <Card shadow="lg">
            <CardHeader>
              <Heading size="md">🚚 Shipping Information</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* Personal Information Section */}
                  <Box w="full">
                    <Text fontSize="lg" fontWeight="medium" mb={4}>
                      Personal Information
                    </Text>
                    <Stack spacing={4}>
                      <FormControl isInvalid={touched.name && errors.name}>
                        <FormLabel>Full Name *</FormLabel>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          focusBorderColor={
                            touched.name && !errors.name
                              ? "green.400"
                              : "blue.400"
                          }
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={touched.phone && errors.phone}>
                        <FormLabel>Phone Number *</FormLabel>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          focusBorderColor={
                            touched.phone && !errors.phone
                              ? "green.400"
                              : "blue.400"
                          }
                        />
                        <FormErrorMessage>{errors.phone}</FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Address Section */}
                  <Box w="full">
                    <Text fontSize="lg" fontWeight="medium" mb={4}>
                      Address Information
                    </Text>
                    <Stack spacing={4}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={4}
                      >
                        <FormControl
                          isInvalid={touched.province && errors.province}
                        >
                          <FormLabel>Province *</FormLabel>
                          <Input
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            focusBorderColor={
                              touched.province && !errors.province
                                ? "green.400"
                                : "blue.400"
                            }
                          />
                          <FormErrorMessage>{errors.province}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={touched.city && errors.city}>
                          <FormLabel>City *</FormLabel>
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            focusBorderColor={
                              touched.city && !errors.city
                                ? "green.400"
                                : "blue.400"
                            }
                          />
                          <FormErrorMessage>{errors.city}</FormErrorMessage>
                        </FormControl>
                      </Grid>

                      <FormControl
                        isInvalid={touched.address && errors.address}
                      >
                        <FormLabel>Detailed Address *</FormLabel>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          focusBorderColor={
                            touched.address && !errors.address
                              ? "green.400"
                              : "blue.400"
                          }
                        />
                        <FormErrorMessage>{errors.address}</FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Shipping Method Section */}
                  <Box w="full">
                    <Text fontSize="lg" fontWeight="medium" mb={4}>
                      Shipping Method
                    </Text>
                    <Stack spacing={4}>
                      <FormControl
                        isInvalid={touched.transport && errors.transport}
                      >
                        <FormLabel>Transport Company *</FormLabel>
                        <Select
                          name="transport"
                          value={formData.transport}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          focusBorderColor={
                            touched.transport && !errors.transport
                              ? "green.400"
                              : "blue.400"
                          }
                        >
                          <option value="">Select Transport</option>
                          <option value="ອານຸສິດ">ອານຸສິດ</option>
                          <option value="ຮຸ່ງອາລຸນ">ຮຸ່ງອາລຸນ</option>
                        </Select>
                        <FormErrorMessage>{errors.transport}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={touched.branch && errors.branch}>
                        <FormLabel>Branch Location *</FormLabel>
                        <Input
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          focusBorderColor={
                            touched.branch && !errors.branch
                              ? "green.400"
                              : "blue.400"
                          }
                        />
                        <FormErrorMessage>{errors.branch}</FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </Box>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    mt={6}
                  >
                    Continue to Payment
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </GridItem>

        {/* Order Summary */}
        <GridItem>
          <Card shadow="lg" position="sticky" top="4">
            <CardHeader>
              <Heading size="md">🛍️ Order Summary</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Box>
                  <Text>ຈຳນວນ: {buy_product_item || items} ລາຍການ</Text>
                  <Text>
                    ລາຄາລວມ:{" "}
                    {isNaN(price_)
                      ? price?.toLocaleString()
                      : price_?.toLocaleString()}{" "}
                    ກີບ
                  </Text>
                  {/* <Text>Shipping Fee: {shipping_fee?.toLocaleString()} KIP</Text> */}
                </Box>
                <Divider />
                <Box>
                  <Badge colorScheme="red">
                    ໝາຍເຫດ:
                    ຄ່າຂົນສົ່ງລູກຄ້າຕ້ອງຈ່າຍເອງຈະບໍ່ມີການບວກເຂົ້າກັບສິນຄ້າ{" "}
                  </Badge>
                  <Badge colorScheme="red">
                    ຫຼັງຈາກຊຳລະຄ່າສິນຄ້າແລ້ວຈະໄດ້ຮັບໃບບິນ ແລະ
                    ໃບຂົນສົ່ງສິນຄ້າພາຍຫຼັງ
                  </Badge>
                </Box>
                <Divider />
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  Total:{" "}
                  {isNaN(price_)
                    ? price?.toLocaleString()
                    : price_?.toLocaleString()}{" "}
                  KIP
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      <Footer />
    </Container>
  );
};

export default Shipping;
