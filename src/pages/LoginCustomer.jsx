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
  Link as ChakraLink,
  Image,
  Divider,
} from "@chakra-ui/react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login, messageClear } from "../store/reducers/authReducer";
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
  });
  return (
    <Box>
      {loader && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          w="full"
          h="full"
          justify="center"
          align="center"
          bg="rgba(56, 48, 48, 0.2)"
          zIndex="999"
        >
          <FadeLoader />
        </Flex>
      )}
      <Header />
      <Box bg="slate.200" mt="4">
        <Center p="10">
          <Flex
            direction={{ base: "column", md: "row" }}
            w={{ base: "90%", md: "60%" }}
            bg="white"
            rounded="md"
          >
            <Box p="8">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="slate.600"
                textAlign="center"
              >
                Login
              </Text>
              <form className="text-slate-600">
                <FormControl mb="2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                  onChange={inputHandle}
                  value={state.email}
                    required
                    borderColor="slate.200"
                    _focus={{ borderColor: "green.500" }}
                  />
                </FormControl>

                <FormControl mb="2">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={inputHandle}
                    value={state.password}
                    required
                    borderColor="slate.200"
                    _focus={{ borderColor: "green.500" }}
                  />
                </FormControl>

                <Button
                onClick={loginCustomer}
                  w="full"
                  mt="4"
                  bg="#059473"
                  color="white"
                  _hover={{ shadow: "lg" }}
                  type="submit"
                >
                  Login
                </Button>
              </form>

              <Flex align="center" py="2">
                <Divider />
                <Text px="3" color="slate.600">
                  Or
                </Text>
                <Divider />
              </Flex>

              <Button
                w="full"
                bg="blue.400"
                color="white"
                _hover={{ shadow: "lg" }}
                leftIcon={<FaFacebookF />}
                mb="3"
              >
                Login With Facebook
              </Button>

              <Button
                w="full"
                bg="red"
                color="white"
                _hover={{ shadow: "lg" }}
                leftIcon={<FaGoogle />}
                mb="3"
              >
                Login With Google
              </Button>

              <Text textAlign="center" color="slate.600" pt="1">
                Don't Have An Account?{" "}
                <ChakraLink as={Link} to="/register" color="blue.500">
                  Register
                </ChakraLink>
              </Text>

              <ChakraLink href="http://localhost:3001/login" target="_blank">
                <Button
                  w="full"
                  bg="#02e3e0"
                  color="white"
                  _hover={{ shadow: "lg" }}
                  mb="3"
                >
                  Login As a Seller
                </Button>
              </ChakraLink>

              <ChakraLink href="http://localhost:3001/register" target="_blank">
                <Button
                  w="full"
                  bg="#ad2cc4"
                  color="white"
                  _hover={{ shadow: "lg" }}
                  mb="3"
                >
                  Register As a Seller
                </Button>
              </ChakraLink>
            </Box>

            <Box>
              <Image
                src="http://localhost:3000/images/login.jpg"
                alt="Login"
                w="full"
                h="full"
                borderRadius={"20px"}
                objectFit="cover"
              />
            </Box>
          </Flex>
        </Center>
      </Box>
      <Footer />
    </Box>
  );
};
export default LoginCustomer;
