import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Button,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
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
import { IoMdPhonePortrait, IoMdArrowDropdown } from "react-icons/io";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_wishlist } from "../store/reducers/cardReducer";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      dispatch(get_wishlist({ id: userInfo._id }));
    }
  }, [dispatch, userInfo]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const menuItems = [
    { label: "ໜ້າຫຼັກ", path: "/" },
    { label: "ສິນຄ້າ", path: "/shop" },
    { label: "Blog", path: "/blog" },
    { label: "ກ່ຽວກັບພວກເຮົາ", path: "/about" },
    { label: "ຕິດຕໍ່ພວກເຮົາ", path: "/contact" },
  ];

  return (
    <Box w="full" bg="white" boxShadow="sm">
      <Box
        bg={useColorModeValue("blue.100", "gray.900")}
        display={{ base: "none", md: "block" }}
      >
        <Container maxW="85%" mx="auto">
          <Flex justify="space-between" align="center" h="50px" color="gray.500">
            <HStack spacing={8}>
              <Flex align="center" gap={2}>
                <MdEmail />
                <Text>support@gmail.com</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <IoMdPhonePortrait />
                <Text>042422323</Text>
              </Flex>
            </HStack>

            <HStack spacing={10}>
              <HStack spacing={4}>
                <Link href="#">
                  <FaFacebookF />
                </Link>
                <Link href="#">
                  <FaTwitter />
                </Link>
                <Link href="#">
                  <FaLinkedin />
                </Link>
                <Link href="#">
                  <FaGithub />
                </Link>
              </HStack>
              <Menu>
                <MenuButton as={Button} rightIcon={<IoMdArrowDropdown />}>
                  Language
                </MenuButton>
                <MenuList>
                  <MenuItem>Hindi</MenuItem>
                  <MenuItem>English</MenuItem>
                </MenuList>
              </Menu>
              {userInfo ? (
                <RouterLink to="/dashboard">
                  <Flex align="center" gap={2}>
                    <FaUser />
                    <Text>{userInfo.name}</Text>
                  </Flex>
                </RouterLink>
              ) : (
                <RouterLink to="/login">
                  <Flex align="center" gap={2}>
                    <FaLock />
                    <Text>Login</Text>
                  </Flex>
                </RouterLink>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="85%" mx="auto">
        <Flex justify="space-between" align="center" py={4}>
          <Box>
            <RouterLink to="/">
              <Text fontSize="xl" fontWeight="bold">
                LOGO
              </Text>
            </RouterLink>
          </Box>

          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {menuItems.map((item) => (
              <RouterLink key={item.label} to={item.path}>
                <Text>{item.label}</Text>
              </RouterLink>
            ))}
          </HStack>

          <Flex align="center" gap={5} position="relative">
            <IconButton
              aria-label="Wishlist"
              icon={<FaHeart />}
              onClick={() => navigate(userInfo ? "/dashboard" : "/login")}
              position="relative"
            />
            {wishlist_count > 0 && (
              <Box
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
                top={0}
                right={0}
                left={0}
                bottom={0}
              >
                {wishlist_count}
              </Box>
            )}

            <IconButton
              aria-label="Cart"
              icon={<FaCartShopping />}
              onClick={() => navigate("/card")}
              position="relative"
            />
            {card_product_count > 0 && (
              <Box
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
                top={0}
                right={0}
              >
                {card_product_count}
              </Box>
            )}

            <IconButton
              aria-label="Open Sidebar"
              icon={<FaBars />}
              display={{ base: "flex", md: "none" }}
              onClick={toggleSidebar}
            />
          </Flex>
        </Flex>
      </Container>

      {/* ✅ Sidebar Drawer */}
      <Drawer isOpen={isSidebarOpen} placement="left" onClose={toggleSidebar}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={5}>
            <Flex direction="column" gap={4}>
              {menuItems.map((item) => (
                <RouterLink
                  key={item.label}
                  to={item.path}
                  onClick={toggleSidebar}
                >
                  <Text
                    fontSize="lg"
                    fontWeight="medium"
                    _hover={{ color: "blue.500" }}
                  >
                    {item.label}
                  </Text>
                </RouterLink>
              ))}
              {userInfo ? (
                <RouterLink to="/dashboard" onClick={toggleSidebar}>
                  <Flex align="center" gap={2}>
                    <FaUser />
                    <Text>{userInfo.name}</Text>
                  </Flex>
                </RouterLink>
              ) : (
                <RouterLink to="/login" onClick={toggleSidebar}>
                  <Flex align="center" gap={2}>
                    <FaLock />
                    <Text>Login</Text>
                  </Flex>
                </RouterLink>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
