import React from "react";
import Carousel from "react-multi-carousel";
import { Link } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import { Box, Container, Flex } from "@chakra-ui/react";
const Banner = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Box w="full" mt={{ base: 6, md: 0 }}>
      <Container maxW="85%" mx="auto" px={4}>
        <Flex wrap="wrap" gap={{ base: 0, md: 8 }}>
          <Box w="full" my={8}>
            <Carousel
              autoPlay={true}
              infinite={true}
              arrows={true}
              showDots={true}
              responsive={responsive}
            >
              {[1, 2, 3, 4, 5, 6].map((img, i) => (
                <Link key={i} to="#">
                  <img
                    src={`http://localhost:3000/images/banner/${img}.jpg`}
                    alt={`Banner ${img}`}
                  />
                </Link>
              ))}
            </Carousel>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Banner;
