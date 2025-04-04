import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  InputGroup,
  InputRightElement,
  Link as ChakraLink,
  Divider,
  useColorModeValue,
  Icon,
  Container,
} from "@chakra-ui/react";
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login, messageClear } from "../store/reducers/authReducer";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Wrap Chakra components with motion
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionButton = motion(Button);

const LoginCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage, userInfo } = useSelector(
    (state) => state?.auth
  );
  
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const primaryColor = "#059473";
  
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  
  const loginCustomer = (e) => {
    e.preventDefault();
    dispatch(login(state));
  };
  
  const togglePassword = () => setShowPassword(!showPassword);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate("/");
    }
  }, [successMessage, errorMessage, userInfo, navigate, dispatch]);
  
  // Custom loading component
  const LoadingOverlay = () => (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="full"
      h="full"
      justify="center"
      align="center"
      bg="rgba(0, 0, 0, 0.6)"
      zIndex="modal"
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MotionBox
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360] 
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        bg={primaryColor}
        w="80px"
        h="80px"
        borderRadius="full"
        opacity="0.8"
      />
    </Flex>
  );

  return (
    <Box>
      {loader && <LoadingOverlay />}
      
      <Header />
      
      <Box py="16" bg={useColorModeValue("gray.50", "gray.900")}>
        <Container maxW="6xl">
          <MotionFlex
            direction={{ base: "column", md: "row" }}
            overflow="hidden"
            bg={bgColor}
            rounded="xl"
            shadow="xl"
            borderWidth="1px"
            borderColor={borderColor}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Login Form Section */}
            <MotionBox 
              w={{ base: "full", md: "50%" }} 
              p={{ base: 6, md: 10 }}
              variants={itemVariants}
            >
              <MotionBox mb="8" variants={itemVariants}>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={primaryColor}
                  textAlign="center"
                  mb="2"
                >
                  Welcome Back
                </Text>
                <Text 
                  fontSize="sm" 
                  color={textColor} 
                  textAlign="center"
                >
                  Sign in to your account to continue
                </Text>
              </MotionBox>
              
              <form onSubmit={loginCustomer}>
                <MotionBox variants={itemVariants}>
                  <FormControl mb="4">
                    <FormLabel 
                      htmlFor="email" 
                      color={textColor}
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Email Address
                    </FormLabel>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      onChange={inputHandle}
                      value={state.email}
                      required
                      size="lg"
                      borderRadius="md"
                      borderColor={borderColor}
                      _focus={{ 
                        borderColor: primaryColor,
                        boxShadow: `0 0 0 1px ${primaryColor}`
                      }}
                      _hover={{ borderColor: "gray.300" }}
                    />
                  </FormControl>
                </MotionBox>

                <MotionBox variants={itemVariants}>
                  <FormControl mb="4">
                    <FormLabel 
                      htmlFor="password" 
                      color={textColor}
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Password
                    </FormLabel>
                    <InputGroup size="lg">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        onChange={inputHandle}
                        value={state.password}
                        required
                        borderRadius="md"
                        borderColor={borderColor}
                        _focus={{ 
                          borderColor: primaryColor,
                          boxShadow: `0 0 0 1px ${primaryColor}`
                        }}
                        _hover={{ borderColor: "gray.300" }}
                      />
                      <InputRightElement width="4.5rem">
                        <Icon
                          as={showPassword ? FaEyeSlash : FaEye}
                          color="gray.500"
                          cursor="pointer"
                          onClick={togglePassword}
                          _hover={{ color: primaryColor }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </MotionBox>
                
                <MotionBox 
                  textAlign="right" 
                  mb="4"
                  variants={itemVariants}
                >
                  <ChakraLink 
                    as={Link} 
                    to="/forgot-password" 
                    color={primaryColor}
                    fontSize="sm"
                    fontWeight="medium"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Forgot password?
                  </ChakraLink>
                </MotionBox>

                <MotionBox variants={itemVariants}>
                  <MotionButton
                    type="submit"
                    w="full"
                    bg={primaryColor}
                    color="white"
                    size="lg"
                    _hover={{ 
                      bg: `${primaryColor}CC`,
                      transform: "translateY(-2px)"
                    }}
                    _active={{ 
                      bg: `${primaryColor}`,
                      transform: "translateY(0)"
                    }}
                    fontWeight="medium"
                    rounded="md"
                    shadow="md"
                    transition="all 0.2s ease"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </MotionButton>
                </MotionBox>
              </form>

              <MotionBox my="6" variants={itemVariants}>
                <Flex align="center">
                  <Divider flex="1" borderColor={borderColor} />
                  <Text px="4" color={textColor} fontSize="sm">
                    Or continue with
                  </Text>
                  <Divider flex="1" borderColor={borderColor} />
                </Flex>
              </MotionBox>

              <MotionFlex 
                gap="4" 
                direction={{ base: "column", sm: "row" }}
                variants={itemVariants}
              >
                <MotionButton
                  flex="1"
                  bg="#4267B2"
                  color="white"
                  leftIcon={<FaFacebookF />}
                  _hover={{ 
                    bg: "#365899",
                    transform: "translateY(-2px)"
                  }}
                  _active={{ 
                    bg: "#4267B2",
                    transform: "translateY(0)"
                  }}
                  shadow="md"
                  transition="all 0.2s ease"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Facebook
                </MotionButton>
                
                <MotionButton
                  flex="1"
                  bg="#DB4437"
                  color="white"
                  leftIcon={<FaGoogle />}
                  _hover={{ 
                    bg: "#C53929",
                    transform: "translateY(-2px)"
                  }}
                  _active={{ 
                    bg: "#DB4437",
                    transform: "translateY(0)"
                  }}
                  shadow="md"
                  transition="all 0.2s ease"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Google
                </MotionButton>
              </MotionFlex>

              <MotionBox 
                textAlign="center" 
                mt="8"
                variants={itemVariants}
              >
                <Text color={textColor} fontSize="sm">
                  Don't have an account?{" "}
                  <ChakraLink 
                    as={Link} 
                    to="/register" 
                    color={primaryColor}
                    fontWeight="medium"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Sign Up
                  </ChakraLink>
                </Text>
              </MotionBox>
            </MotionBox>
            
            {/* Image Section for desktop */}
            <MotionBox 
              display={{ base: "none", md: "block" }}
              w="50%" 
              bgGradient={`linear(to-br, ${primaryColor}, #2C7A7B)`}
              position="relative"
              overflow="hidden"
              variants={itemVariants}
            >
              <Center 
                h="full" 
                p="8" 
                color="white"
                flexDirection="column"
                textAlign="center"
              >
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <Text 
                    fontSize="3xl" 
                    fontWeight="bold" 
                    mb="4"
                  >
                    Discover Amazing Products
                  </Text>
                  <Text fontSize="md" maxW="sm">
                    Sign in to explore our exclusive collection and enjoy personalized recommendations.
                  </Text>
                </MotionBox>
                
                {/* Decorative elements */}
                <MotionBox
                  position="absolute"
                  bottom="-20px"
                  right="-20px"
                  w="200px"
                  h="200px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.1)"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ 
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                
                <MotionBox
                  position="absolute"
                  top="-30px"
                  left="-30px"
                  w="150px"
                  h="150px"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.1)"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0]
                  }}
                  transition={{ 
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </Center>
            </MotionBox>
          </MotionFlex>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default LoginCustomer;