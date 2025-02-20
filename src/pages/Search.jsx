import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Button,
  Image,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Search = () => {
  const { categorys } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("");

  const search = () => {
    navigate(`/products/search?category=${category}&&value=${searchValue}`);
  };

  const buttonWidth = useBreakpointValue({ base: "100%", md: "160px" });

  return (
    <Container maxW="85%" mx="auto" p={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        gap={4}
      >
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Box as="span" paddingLeft="10px">▼</Box>}
            width={{ base: "100%", md: "auto" }}
          >
            {category === "" ? "Category" : category}
          </MenuButton>
          <MenuList maxH="200px" overflowY="auto">
            {categorys.map((data, index) => (
              <MenuItem
                onClick={() => setCategory(data.name)}
                key={index}
                value={data.name}
              >
                <Flex align="center">
                  <Image
                    src={data.image}
                    alt={data.name}
                    boxSize="20px"
                    borderRadius="full"
                    mr={2}
                  />
                  {data.name}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Input
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
          width={{ base: "100%", md: "auto" }}
        />

        <Button
          onClick={search}
          width={buttonWidth}
          colorScheme="teal"
        >
          Search
        </Button>
      </Flex>
    </Container>
  );
};

export default Search;