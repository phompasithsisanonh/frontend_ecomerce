import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaHeart,
  FaCartShopping,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  Box,
  Flex,
  Text,
  Image,
  Input,
  Button,
  IconButton,
  Stack,
  Link,
} from "@chakra-ui/react";

const ContactInfo = () => (
  <Box>
    <Image
      w="190px"
      h="70px"
      src="http://localhost:3000/images/logo.png"
      alt="Logo"
    />
    <Stack spacing={2} color="gray.600">
      <Text fontSize={{ base: "sm", md: "md" }}>
        Address: 2504 Ivins Avenue, Egg Harbor Township, NJ 08234
      </Text>
      <Text fontSize={{ base: "sm", md: "md" }}>Phone: 4343434344</Text>
      <Text fontSize={{ base: "sm", md: "md" }}>Email: support@easylearningbd.com</Text>
    </Stack>
  </Box>
);

const UsefulLinks = () => (
  <Box>
    <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }} mb={2}>
      Useful Links
    </Text>
    <Flex wrap="wrap" justify="space-between" gap={10}>
      <Stack spacing={2} color="gray.600" fontSize="sm" fontWeight="semibold">
        {[
          "About Us",
          "About Our Shop",
          "Delivery Information",
          "Privacy Policy",
          "Blogs",
        ].map((link, index) => (
          <Link as={RouterLink} to="#" key={index}>
            {link}
          </Link>
        ))}
      </Stack>
      <Stack spacing={2} color="gray.600" fontSize="sm" fontWeight="semibold">
        {[
          "Our Service",
          "Company Profile",
          "Delivery Information",
          "Privacy Policy",
          "Blogs",
        ].map((link, index) => (
          <Link as={RouterLink} to="#" key={index}>
            {link}
          </Link>
        ))}
      </Stack>
    </Flex>
  </Box>
);

const NewsletterSubscription = () => (
  <Box>
    <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }} mb={2}>
      Join Our Shop
    </Text>
    <Text fontSize={{ base: "sm", lg: "md" }}>
      Get email updates about our latest and special offers
    </Text>
    <Flex
      mt={3}
      align="center"
      border="1px solid"
      borderColor="gray.300"
      bg="white"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Input
        placeholder="Enter Your Email"
        variant="unstyled"
        px={3}
        mb={{ base: 3, md: 0 }}
      />
      <Button
        colorScheme="teal"
        px={4}
        fontWeight="bold"
        textTransform="uppercase"
      >
        Subscribe
      </Button>
    </Flex>
  </Box>
);

const SocialLinks = () => (
  <Flex wrap="wrap" gap={3}>
    {[
      { Icon: FaFacebookF, href: "#" },
      { Icon: FaTwitter, href: "#" },
      { Icon: FaLinkedin, href: "#" },
      { Icon: FaGithub, href: "#" },
    ].map(({ Icon, href }, index) => (
      <IconButton
        key={index}
        as="a"
        href={href}
        icon={<Icon />}
        aria-label="social-link"
        size="lg"
        bg="white"
        rounded="full"
        _hover={{ bg: "teal.500", color: "white" }}
      />
    ))}
  </Flex>
);

const FloatingIcons = ({
  userInfo,
  cardProductCount,
  wishlistCount,
  navigate,
}) => (
  <Flex
    direction="column"
    position="fixed"
    bottom={3}
    right={2}
    rounded="full"
    p={2}
    w="50px"
    h="110px"
    gap={3}
    justify="center"
    align="center"
    display={{ base: "flex", md: "block" }}
  >
    {[
      {
        icon: FaCartShopping,
        count: cardProductCount,
        link: userInfo ? "/card" : "/login",
      },
      {
        icon: FaHeart,
        count: wishlistCount,
        link: userInfo ? "/dashboard" : "/login",
      },
    ].map(({ icon: Icon, count, link }, index) => (
      <Box
      key={index}
      position="relative"
      bg="gray.200"
      w="35px"
      h="35px"
      rounded="full"
      cursor="pointer"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={() => navigate(link)}
    >
      <Icon as={Icon} fontSize="xl" color="green.500" />
      {count !== 0 && (
        <Flex
          position="absolute"
          top="-3px"
          right="-5px"
          bg="red.500"
          rounded="full"
          w="20px"
          h="20px"
          justify="center"
          align="center"
          color="white"
          fontSize="xs"
        >
          {count}
        </Flex>
      )}
    </Box>
    ))}
  </Flex>
);

const Footer = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );

  return (
    <Box as="footer" bg="gray.100">
      <Flex
        wrap="wrap"
        w="90%"
        mx="auto"
        borderBottom="1px"
        borderColor="gray.200"
        py={16}
        gap={6}
        direction={{ base: "column", md: "row" }}
      >
        <Box flex="1" minW="250px">
          <ContactInfo />
        </Box>
        <Box flex="2" minW="250px">
          <UsefulLinks />
        </Box>
        <Box flex="1" minW="250px">
          <NewsletterSubscription />
          <SocialLinks />
        </Box>
      </Flex>
      <Box w="90%" mx="auto" textAlign="center" py={5} color="gray.600">
        <Text fontSize={{ base: "sm", md: "md" }}>Copyright © 2024 All Rights Reserved</Text>
      </Box>
      <FloatingIcons
      
        userInfo={userInfo}
        cardProductCount={card_product_count}
        wishlistCount={wishlist_count}
        navigate={navigate}
      /> 
    </Box>
  );
};

export default Footer;
