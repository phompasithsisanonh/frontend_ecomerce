import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  Flex,
  Grid,
  Box,
  Text,
  Button,
  Icon,
  Img,
  Badge,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const Products = ({ title, products }) => {
  const [currentPage, setCurrentPage] = useState(0);
 const  navigate =useNavigate()
  // Ensure products is a 2D array, if not already
  const productsArray = Array.isArray(products[0]) ? products : [products];

  // for (let i = 0; i < products.length; i ++) {
  //   d.push(products.slice(i, i + 4));
  // }
  // const products = [
  //   [product1, product2, product3],  // หน้าแรก (currentPage = 0)
  //   [product4, product5, product6],  // หน้าที่สอง (currentPage = 1)
  //   [product7, product8, product9]   // หน้าที่สาม (currentPage = 2)
  // ];ຈະຢູ່ໃນຮູບແບບນີ້ ເມື່ອມີການຄິກ  0,1,2,3,4,5,6,7,8,9 ເພື່ອສະແດງຜົນຂອງສິນຄ້າທີ່ມີຢູ່ໃນຮູບແບບນີ້
  // Calculate total number of pages
  const totalPages = productsArray.length;

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages - 1 ? prevPage + 1 : prevPage
    );
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  };

  const ButtonGroup = () => (
    <Flex justify="space-between" align="center" mb={4} px={4}>
      <Text
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        color="gray.700"
      >
        {title}
      </Text>
      <Flex gap={2}>
        <Button
          size="sm"
          colorScheme="teal"
          variant="outline"
          onClick={handlePrevious}
          isDisabled={currentPage === 0}
        >
          <Icon as={IoIosArrowBack} />
        </Button>
        <Button
          size="sm"
          colorScheme="teal"
          variant="outline"
          onClick={handleNext}
          isDisabled={currentPage === totalPages - 1}
        >
          <Icon as={IoIosArrowForward} />
        </Button>
      </Flex>
    </Flex>
  );

  return (
    <Flex paddingTop="40px" direction="column" gap={6}>
      <ButtonGroup />
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)", // 2 columns on mobile
          md: "repeat(3, 1fr)", // 3 columns on medium screens
          lg: "repeat(4, 1fr)", // 4 columns on large screens
        }}
        gap={4}
        justifyContent="center"
      >
        {productsArray[currentPage]?.map((p, i) => (
          <Box
            key={i}
          
            w="100%"
            p={3}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}
          >
            <Img
              borderRadius="lg"
              objectFit="cover"
              w="100%"
              cursor={"pointer"}  
              onClick={() => navigate(`/details/products/${p._id}`)}
              h={{ base: "120px", md: "150px", lg: "200px" }}
              src={p.images[0]}
              alt={p.name}
            />
            <Box mt={2} color="gray.700" textAlign="left">
            <Badge
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                fontWeight="bold"
                noOfLines={1}
                colorScheme={'red'}
                width={'85px'}
                borderRadius={'2px'}
              >
                {p.discount}% OFF
              </Badge>
              <Text
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                fontWeight="bold"
                noOfLines={1}
              >
                {p.name}
              </Text>
              
             
              <Text
                fontSize={{ base: "xs", md: "sm", lg: "md" }}
                color="teal.500"
                fontWeight="semibold"
                mt={1}
              >
                ລາຄາ {p.price.toLocaleString()} ກີບ
              </Text>
            </Box>
          </Box>
        ))}
      </Grid>
      {/* Page indicator */}
      {/* <Flex justify="center" align="center" mt={4}>
        <Text color="gray.500">
          Page {currentPage + 1} of {totalPages}
        </Text>
      </Flex> */}
    </Flex>
  );
};

export default Products;
