import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHistory, FaShippingFast } from "react-icons/fa";
import { MdFavorite, MdPayments } from "react-icons/md";
import Header from "../components/Header";
import Profile from "../components/profile/Profile";
import WishList from "../components/profile/WishList";
import StatusShipping from "../components/profile/StatusShipping";
import OrderHistory from "../components/profile/OrderHistory";
import WaitPayment from "../components/profile/WaitPayment";
import { useDispatch, useSelector } from "react-redux";
import { get_payment } from "../store/reducers/paymentReducer";

const Dashboard = () => {
  const { wishlist_count } = useSelector((state) => state.card);
  const { payment_count } = useSelector((state) => state.payment);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const menuItems = [
    { key: "profile", icon: <CgProfile />, label: "ຂໍ້ມູນສ່ວນຕົວ" },
    {
      key: "favorites",
      icon: <MdFavorite />,
      label: "ລາຍການໂປຣດ",
      data: wishlist_count,
    },
    {
      key: "history",
      icon: <FaHistory />,
      label: "ປະຫວັດສັ່ງສິນຄ້າ",
      data: "",
    }, // ตัวอย่างข้อมูลใหม่
    {
      key: "pending",
      icon: <FaShippingFast />,
      label: "ສະຖານະຈັດສົ່ງສິນຄ້າ",
      data: "",
    },
    {
      key: "payments",
      icon: <MdPayments />,
      label: "ລໍຖ້າຊຳລະເງິນ",
      data: payment_count,
    },
  ];
  const [active, setActive] = useState("profile");

  const renderContent = () => {
    switch (active) {
      case "profile":
        return <Profile />;
      case "favorites":
        return <WishList />;
      case "history":
        return <OrderHistory />;
      case "pending":
        return <StatusShipping />;
      case "payments":
        return <WaitPayment />;
      default:
        return <Profile />;
    }
  };
  useEffect(() => {
    dispatch(get_payment({ userId: userInfo._id }));
  }, []);
  return (
    <Box bg="gray.50" minH="100vh" p={4}>
      <Header />
      <Flex flexDirection={{ base: "column", md: "row" }} gap={4}>
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="lg"
          w={{ base: "full", md: "20%" }}
          display="flex"
          flexDirection="column"
          gap="4"
        >
          {menuItems.map((item) => (
            <Flex
              key={item.key}
              align="center"
              p="2"
              bg={active === item.key ? "blue.100" : "transparent"}
              borderRadius="md"
              cursor="pointer"
              onClick={() => setActive(item.key)}
              _hover={{ bg: "blue.50" }}
              transition="background 0.3s"
            >
              <IconButton
                icon={item.icon}
                aria-label={item.label}
                variant="ghost"
                isRound
              />
              <Text
                pl="10px"
                fontWeight={active === item.key ? "bold" : "normal"}
              >
                {item.label}
              </Text>

              {item?.data ? (
                <Box
                  bg="red.500"
                  w="20px"
                  h="20px"
                  rounded="full"
                  color="white"
                  top="-10px"
                  right="-10px"
                  fontSize="xs"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {item?.data}
                </Box>
              ) : (
                ""
              )}
            </Flex>
          ))}
        </Box>

        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          shadow="lg"
          w={{ base: "full", md: "80%" }}
        >
          {renderContent()}
        </Box>
      </Flex>
    </Box>
  );
};

export default Dashboard;
