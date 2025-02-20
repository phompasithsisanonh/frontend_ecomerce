import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Flex, Box, Text, Button, Icon, Img, Badge } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Products = ({ title, products }) => {
  const { discount_product, topRated_product, latest_product } = useSelector(
    (state) => state.home
  );

  console.log(products);
  const ButtonGroup = ({ next, previous }) => (
    <Flex justify="space-between" align="center" mb={4} px={4}>
      <Text
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        color="gray.700"
      >
        {title}
      </Text>
      {/* <Flex gap={3}>
        <Button
          onClick={previous}
          w={{ base: "30px", md: "40px" }}
          h={{ base: "30px", md: "40px" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="gray.300"
          borderRadius="full"
          _hover={{ bg: "gray.400" }}
        >
          <Icon as={IoIosArrowBack} />
        </Button>
        <Button
          onClick={next}
          w={{ base: "30px", md: "40px" }}
          h={{ base: "30px", md: "40px" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="gray.300"
          borderRadius="full"
          _hover={{ bg: "gray.400" }}
        >
          <Icon as={IoIosArrowForward} />
        </Button>
      </Flex> */}
    </Flex>
  );

  return (
    <Flex paddingTop={"40px"} direction="column" gap={6}>
      <ButtonGroup />
      <Flex  wrap="wrap" justify="space-between">
        {products?.map((p1, i1) =>
          p1.map((p, i) => (
            <Box
              key={i}
            
              maxW={{ base: "150px", md: "200px" }}
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
                h={{ base: "120px", md: "150px" }}
                src={p.images[0]}
                alt={p.name}
              />
              <Box mt={2} color="gray.700">
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="bold"
                  noOfLines={1}
                >
                  {p.name}
                </Text>
                <Badge color={"red"}> {p.discount}%</Badge>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="teal.500"
                  fontWeight="semibold"
                >
                  {p.price.toLocaleString()} ₭
                </Text>
              </Box>
            </Box>
          ))
        )}
      </Flex>
    </Flex>
  );
};

export default Products;
