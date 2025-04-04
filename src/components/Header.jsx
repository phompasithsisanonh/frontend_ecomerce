import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaFacebookF,
  FaHeart,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaUser,
  FaLock,
  FaCartShopping,
  FaBars,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoMdPhonePortrait, IoMdLogOut } from "react-icons/io";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_wishlist } from "../store/reducers/cardReducer";
import { motion } from "framer-motion";

// Create motion components with Chakra UI
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionIconButton = motion(IconButton);

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Check for scroll position to create sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (userInfo) {
      dispatch(get_wishlist({ id: userInfo._id }));
    }
  }, [dispatch, userInfo]);

  const menuItems = [
    { label: "ໜ້າຫຼັກ", path: "/" },
    { label: "ສິນຄ້າ", path: "/shop" },
    { label: "Blog", path: "/blog" },
    { label: "ກ່ຽວກັບພວກເຮົາ", path: "/about" },
    { label: "ຕິດຕໍ່ພວກເຮົາ", path: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("customerToken");
    navigate("/login");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  // const logoVariants = {
  //   hover: {
  //     scale: 1.05,
  //     rotate: 5,
  //     transition: { duration: 0.3 },
  //   },
  // };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <MotionBox
      w="full"
      bg="white"
      boxShadow={scrolled ? "md" : "sm"}
      position={scrolled ? "relative" : "relative"}
      top={0}
      zIndex={1000}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Box
        bg={useColorModeValue("blue.50", "gray.900")}
        display={{ base: "none", md: "block" }}
      >
        <Container maxW="85%" mx="auto">
          <MotionFlex
            justify="space-between"
            align="center"
            h="50px"
            color="gray.600"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <HStack spacing={8}>
              <MotionFlex
                align="center"
                gap={2}
                variants={itemVariants}
                whileHover={{ color: "blue.500" }}
              >
                <MdEmail />
                <Text>phompasit2323@gmail.com</Text>
              </MotionFlex>
              <MotionFlex
                align="center"
                gap={2}
                variants={itemVariants}
                whileHover={{ color: "blue.500" }}
              >
                <IoMdPhonePortrait />
                <Text>+856 02096947226</Text>
              </MotionFlex>
            </HStack>

            <HStack spacing={10}>
              <HStack spacing={6}>
                {[
                  { icon: <FaFacebookF />, color: "#4267B2" },
                  { icon: <FaTwitter />, color: "#1DA1F2" },
                  { icon: <FaLinkedin />, color: "#0077B5" },
                  { icon: <FaGithub />, color: "#333333" },
                ].map((social, index) => (
                  <MotionBox
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.2,
                      color: social.color,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Link href="#">{social.icon}</Link>
                  </MotionBox>
                ))}
              </HStack>

              {userInfo ? (
                <RouterLink to="/dashboard">
                  <MotionFlex
                    align="center"
                    gap={2}
                    variants={itemVariants}
                    whileHover={{ color: "blue.500" }}
                  >
                    <FaUser />
                    <Text>{userInfo.name}</Text>
                    <MotionIconButton
                      aria-label="Logout"
                      onClick={() => handleLogout()}
                      icon={<IoMdLogOut />}
                      colorScheme="red"
                      size="sm"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    />
                  </MotionFlex>
                </RouterLink>
              ) : (
                <RouterLink to="/login">
                  <MotionFlex
                    align="center"
                    gap={2}
                    variants={itemVariants}
                    whileHover={{ color: "blue.500" }}
                  >
                    <FaLock />
                    <Text>Login</Text>
                  </MotionFlex>
                </RouterLink>
              )}
            </HStack>
          </MotionFlex>
        </Container>
      </Box>

      <Container maxW="85%" mx="auto">
        <MotionFlex
          justify="space-between"
          align="center"
          py={4}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <RouterLink to="/">
            <MotionText
              fontSize="3xl"
              fontWeight="bold"
              color="gray.800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Easyshop
            </MotionText>
            {/* <MotionBox
              variants={logoVariants}
              whileHover="hover"
              position="relative"
              width="100px"
              height="100px"
            >
              <MotionBox
                position="absolute"
                borderRadius="full"
                width="full"
                height="full"
                bgGradient="linear(to-r, purple.400, purple.600)"
                initial={{ opacity: 0.7 }}
                whileHover={{ 
                  opacity: 0.9,
                  boxShadow: "0 0 15px rgba(128, 90, 213, 0.6)",
                }}
              />
              <Image
                alt="Shop Logo"
                borderRadius="full"
                boxSize="100px"
                objectFit="cover"
                src={logocompany}
                zIndex={1}
              />
            </MotionBox> */}
          </RouterLink>

          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {menuItems.map((item, index) => (
              <RouterLink key={item.label} to={item.path}>
                <MotionText
                  fontSize="lg"
                  fontWeight="medium"
                  variants={itemVariants}
                  whileHover={{
                    color: "purple.500",
                    y: -2,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  position="relative"
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    width: "0%",
                    height: "2px",
                    bg: "purple.500",
                    transition: "width 0.3s ease",
                  }}
                  _hover={{
                    _after: {
                      width: "100%",
                    },
                  }}
                >
                  {item.label}
                </MotionText>
              </RouterLink>
            ))}
          </HStack>

          <MotionFlex align="center" gap={5} variants={containerVariants}>
            <MotionBox position="relative" variants={itemVariants}>
              <MotionIconButton
                aria-label="Wishlist"
                icon={<FaHeart />}
                onClick={() => navigate(userInfo ? "/dashboard" : "/login")}
                colorScheme="gray"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                size="md"
              />
              {wishlist_count > 0 && (
                <MotionBox
                  position="absolute"
                  bg="red.500"
                  rounded="full"
                  w="20px"
                  h="20px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  color="white"
                  fontSize="xs"
                  top="-5px"
                  right="-5px"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {wishlist_count}
                </MotionBox>
              )}
            </MotionBox>

            <MotionBox position="relative" variants={itemVariants}>
              <MotionIconButton
                aria-label="Cart"
                icon={<FaCartShopping />}
                onClick={() => navigate("/card")}
                colorScheme="gray"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                size="md"
              />
              {card_product_count > 0 && (
                <MotionBox
                  position="absolute"
                  bg="red.500"
                  rounded="full"
                  w="20px"
                  h="20px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  color="white"
                  fontSize="xs"
                  top="-5px"
                  right="-5px"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {card_product_count}
                </MotionBox>
              )}
            </MotionBox>

            <MotionIconButton
              aria-label="Open Sidebar"
              icon={<FaBars />}
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
              colorScheme="gray"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              size="md"
            />
          </MotionFlex>
        </MotionFlex>
      </Container>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={5}>
            <MotionFlex
              direction="column"
              gap={6}
              mt={8}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {menuItems.map((item) => (
                <RouterLink key={item.label} to={item.path} onClick={onClose}>
                  <MotionText
                    fontSize="lg"
                    fontWeight="medium"
                    variants={itemVariants}
                    whileHover={{
                      x: 5,
                      color: "purple.500",
                      transition: { type: "spring", stiffness: 300 },
                    }}
                  >
                    {item.label}
                  </MotionText>
                </RouterLink>
              ))}

              <Divider my={3} />

              {userInfo ? (
                <MotionFlex direction="column" gap={4} variants={itemVariants}>
                  <RouterLink to="/dashboard" onClick={onClose}>
                    <Flex align="center" gap={2}>
                      <Box p={2} borderRadius="full" bg="purple.100">
                        <FaUser color="purple" />
                      </Box>
                      <Text fontWeight="medium">{userInfo.name}</Text>
                    </Flex>
                  </RouterLink>

                  <Button
                    leftIcon={<IoMdLogOut />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    size="sm"
                    mt={2}
                  >
                    Logout
                  </Button>
                </MotionFlex>
              ) : (
                <RouterLink to="/login" onClick={onClose}>
                  <MotionFlex
                    align="center"
                    gap={2}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <Box p={2} borderRadius="full" bg="blue.100">
                      <FaLock color="blue" />
                    </Box>
                    <Text fontWeight="medium">Login</Text>
                  </MotionFlex>
                </RouterLink>
              )}
            </MotionFlex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionBox>
  );
};

export default Header;
