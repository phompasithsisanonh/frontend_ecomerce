import { Box, Button, Icon, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import a from "./imgaefin/a.jpg";
import b from "./imgaefin/b.jpg";
import "./index.css";
import {
  FaHome,
  FaShoppingCart,
  FaBlog,
  FaInfoCircle,
  FaPhone,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const Fint = () => {
  const [selected, setSelected] = React.useState(null);
  const [bar, setBar] = useState(false);

  const data = [
    { id: 1, name: "blue", image: b },
    { id: 2, name: "white", image: a },
  ];
  const menuItems = [
    { label: "ໜ້າຫຼັກ", icon: FaHome },
    { label: "ສິນຄ້າ", icon: FaShoppingCart },
    { label: "Blog", icon: FaBlog },
    { label: "ກ່ຽວກັບພວກເຮົາ", icon: FaInfoCircle },
    { label: "ຕິດຕໍ່ພວກເຮົາ", icon: FaPhone },
  ];

  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      controls.start({
        opacity: scrollY > 100 ? 1 : 0,
        y: scrollY > 100 ? 0 : 20,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);
  const toogle = () => setBar(!bar);
  return (
    <Box display={"flex"}>
      <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}

      >
        <Box
          className="menu"
          height="100vh"
          bg="rgba(99, 99, 102, 0.7)"
          color="white"
          display="flex"
          boxShadow="lg"
          flexDirection="column"
          cursor="pointer"
          overflow="hidden"
          transition="width 0.3s ease"
          position="relative"
        >
          {menuItems.map((item) => (
            <Link key={item.label} to={item.path}>
              <Box 
                display="flex" 
                alignItems="center"
                position="relative"
                overflow="hidden"
              >
                <Icon 
                  as={item.icon} 
                  fontSize="2xl" 
                  m={2}
                />
                <Text
                  className="menu-text"
                  fontSize="sm"
                  fontWeight="medium"
                  _hover={{ color: "blue.500" }}
                  p={4}
                  position="absolute"
                  left="50px"
                  opacity="0"
                  transition="opacity 0.3s ease"
                >
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
        </Box>
      </motion.div>
    </AnimatePresence>
      {/* Background SVG */}
      <Box position="relative" top={0} left={0} width="100%" zIndex={-1}>
        <Box position="relative" top={0} left={0} width="100%" zIndex={-1}>
          <Box className="custom-shape-divider-top-1743050597">
            <svg
              viewBox="0 0 1440 320"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className="shape-fill"
              ></path>
            </svg>
          </Box>
        </Box>

        <Box p={4} borderRadius="20px" display="inline-block">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div>
                <motion.img
                  key={selected.id}
                  src={selected.image}
                  alt={selected.name}
                  width={200}
                  height={200}
                  style={{ borderRadius: "30px" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.2, rotate: 10 }} // ขยายภาพเมื่อ hover
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box display="flex" justifyContent="center" gap={4} mt={4}>
          {data.map((item) => (
            <motion.div
              animate={controls}
              key={item.id}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelected(item)}
              style={{ cursor: "pointer" }}
            >
              <Image
                width={"100px"}
                height={"100px"}
                borderRadius={"20px"}
                src={item.image}
                alt={item.name}
              />
            </motion.div>
          ))}
        </Box>

        {/* ใช้ AnimatePresence เพื่อให้ exit animation ทำงาน */}

        <Button onClick={toogle}>Menu</Button>
      </Box>
    </Box>
  );
};

export default Fint;
