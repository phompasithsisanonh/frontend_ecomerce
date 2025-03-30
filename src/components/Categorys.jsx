import React from "react";
import Carousel from "react-multi-carousel";
import { Link, useNavigate } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { Box, Text, Image, Container, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
const Categorys = ({ categorys, controls }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
    smmobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
    },
    xsmobile: {
      breakpoint: { max: 440, min: 0 },
      items: 1,
    },
  };
  const navigate = useNavigate();
  return (
    <Container maxW="87%" mx="auto" position="relative">
      <motion.div animate={controls}>
        <Text
          fontSize={{ base: "20px", md: "45px" }}
          as="h2"
          size="xl"
          color="gray.600"
          fontWeight="bold"
        >
          ໝວດໝູ່ສິນຄ້າ
        </Text>
        <Carousel
          autoPlay={true}
          infinite={true}
          arrows={true}
          responsive={responsive}
          transitionDuration={500}
        >
          {categorys.map((c, i) => (
            <Link href="" key={i}>
              <Box
                onClick={() =>
                  navigate(`/products/search?category=${c.name}&&value=`)
                }
                cursor="pointer"
                h="185px"
                borderWidth="1px"
                p={3}
              >
                <Image
                  src={c.image}
                  alt={`Category ${c}`}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
                <Flex
                  position="absolute"
                  bottom={6}
                  w="full"
                  justifyContent="center"
                  alignItems="center"
                  fontWeight="bold"
                >
                  <Text
                    py="2px"
                    px={6}
                    bg="rgba(51, 48, 48, 0.36)"
                    color="white"
                  >
                    {c.name}
                  </Text>
                </Flex>
              </Box>
            </Link>
          ))}
        </Carousel>
      </motion.div>
    </Container>
  );
};

export default Categorys;
