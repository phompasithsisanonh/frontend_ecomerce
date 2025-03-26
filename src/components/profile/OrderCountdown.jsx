import { Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const OrderCountdown = ({ orderDate }) => {
  const orderTime = new Date(orderDate).getTime();
  const expiryTime = orderTime + 2 * 60 * 1000; // 30 minutes after order date
  // 30 * 60 * 1000
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = expiryTime - now;
    return difference > 0 ? Math.floor(difference / 1000) : 0; // in seconds
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <Text fontSize={{base:"10px",md:"15px"}} style={{ color: timeLeft <= 60 ? "red" : "black" }}>
      ⏳ ກຸລະນາຊຳລະກ່ອນເວລາ: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </Text>
  );
};

export default OrderCountdown;
