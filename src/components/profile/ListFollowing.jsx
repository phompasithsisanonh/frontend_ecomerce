import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { following_get } from "../../store/reducers/followingReducer";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { FaUserFriends } from "react-icons/fa";
import { BellIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListFollowing = () => {
  const { following_data, loading } = useSelector((state) => state.following);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
const navigate = useNavigate();
  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  // Filter function
  const filteredFollowing = following_data?.filter((seller) =>
    seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(
      following_get({
        userId: userInfo._id,
      })
    );
  }, [dispatch, userInfo._id]);

  // Loading skeletons
  const renderSkeletons = () => {
    return Array(3)
      .fill("")
      .map((_, i) => (
        <Flex key={i} align="center" w="100%" p={3}>
          <Skeleton borderRadius="full" height="40px" width="40px" mr={3} />
          <Skeleton height="20px" width="70%" />
        </Flex>
      ));
  };

  return (
    <Card
      maxW="500px"
      mx="auto"
      mt={5}
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      boxShadow="lg"
      borderRadius="xl"
      overflow="hidden"
    >
      <CardHeader pb={0}>
        <Flex justify="space-between" align="center" mb={3}>
          <Flex align="center">
            <Icon as={FaUserFriends} color={accentColor} fontSize="xl" mr={2} />
            <Heading size="md">ຕິດຕາມຜູ້ຂາຍ</Heading>
          </Flex>
          <Button
            size="sm"
            colorScheme="blue"
            variant="ghost"
            leftIcon={<BellIcon />}
            borderRadius="full"
          >
            ແຈ້ງເຕືອນ
          </Button>
        </Flex>
        <InputGroup mb={4} size="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="ຄົ້ນຫາຜູ້ຂາຍ"
            borderRadius="full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px " + accentColor }}
          />
        </InputGroup>
        <Divider borderColor={borderColor} />
      </CardHeader>

      <CardBody pt={3}>
        <VStack spacing={2} align="stretch" maxH="350px" overflowY="auto" pr={2}>
          {loading ? (
            renderSkeletons()
          ) : filteredFollowing?.length > 0 ? (
            filteredFollowing.map((seller) => (
              <Flex
                key={seller._id}
                align="center"
                justify="space-between"
                p={3}
                borderWidth="1px"
                borderRadius="lg"
                transition="all 0.2s"
                _hover={{ bg: hoverBg, transform: "translateY(-2px)", boxShadow: "sm" }}
                cursor="pointer"
              >
                <Flex align="center" flex={1}>
                  <Avatar
                    size="md"
                    src={seller?.image}
                    mr={3}
                    name={seller?.shopInfo.shopName}
                    bg={accentColor}
                    border="2px solid"
                    borderColor={borderColor}
                  />
                  <Box>
                    <Text fontSize="md" fontWeight="semibold">
                      {seller?.shopInfo.shopName}
                    </Text>
                    <Text fontSize="sm" color={subtleText}>
                      {seller?.shopInfo.shopName || "@" + seller?.shopInfo.shopName?.toLowerCase().replace(/\s/g, "_")}
                    </Text>
                  </Box>
                </Flex>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="full"
                  fontSize="xs"
                  px={3}
                  onClick={()=>navigate(`/seller_profile/${seller._id}`)}
                >
                  ເບີ່ງໂປລໄຟລ
                </Button>
              </Flex>
            ))
          ) : searchTerm ? (
            <Flex direction="column" align="center" justify="center" py={6}>
              <Text color="gray.500" fontSize="md" textAlign="center">
                ไม่พบผู้ที่คุณติดตามตามคำค้นหา "{searchTerm}"
              </Text>
              <Button
                mt={2}
                variant="link"
                colorScheme="blue"
                onClick={() => setSearchTerm("")}
              >
                ລ້າງຄົ້ນຫາ
              </Button>
            </Flex>
          ) : (
            <Flex direction="column" align="center" justify="center" py={6}>
              <Text color="gray.500" fontSize="md" mb={2}>
                ຍັງບໍ່ໄດ້ຕິດຕາມໃຫ້ຜູ້ຂາຍ
              </Text>
              <Button colorScheme="blue" size="sm">
                ຄົ້ນຫາຜູ້ໃຊ້ງານ
              </Button>
            </Flex>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ListFollowing;