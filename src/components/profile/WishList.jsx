import React from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  Stack,
  Button,
  Badge,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
const WishList = () => {
  const { wishlists } = useSelector((state) => state.card);
  console.log(wishlists); // Check the data structure
  const navigate = useNavigate();
  return (
    <Box p={4} bg="gray.50" borderRadius="md" shadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        ລາຍການໂປຣດ
      </Text>

      <Stack spacing={4}>
        {wishlists.length > 0 ? (
          wishlists.map((item) => (
            <Flex
              key={item._id}
              p={3}
              bg="white"
              borderRadius="md"
              shadow="sm"
              align="center"
              direction={{ base: "column", md: "row" }}
              justify="space-between"
            >
      
              <Flex align="center">
                <Image
                  src={item.productId?.images[0]}
                  alt={item.productId?.name}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                  mr={4}
                />
                <Box>
                  <Text fontWeight="bold" fontSize="m">
                    {item.productId.name}
                  </Text>
                  <Text color="gray.500">
                    {item.productId.brand} - {item.productId.category}
                  </Text>
                  <Badge
                    colorScheme={item.productId.stock > 1 ? "green" : "red"}
                  >
                    {item.productId.stock > 1
                      ? "ສິນຄ້າມີໃນສະຕ໋ອກ"
                      : "ສິນຄ້າໝົດສະຕ໋ອກ"}
                  </Badge>
                  <Text fontWeight="semibold" color="teal.500">
                    {item.productId.price.toLocaleString()} ₭
                  </Text>
                </Box>
              </Flex>
              <ButtonGroup>
              <IconButton
                fontSize="20px"
                colorScheme="red"
                  size="sm"
                aria-label="Delete"
                icon={<MdDeleteForever />}
              />
                <Button
                  colorScheme="teal"
                  size="sm"
                  onClick={() =>
                    navigate(`/details/products/${item.productId._id}`)
                  }
                >
                  ເບິ່ງສິນຄ້າ
                </Button>
                <Button colorScheme="red" size="sm">
                  ເພີ່ມຕະກ້າ
                </Button>
              </ButtonGroup>
            </Flex>
          ))
        ) : (
          <Text color="gray.500">No items in your wishlist.</Text>
        )}
      </Stack>
    </Box>
  );
};

export default WishList;
