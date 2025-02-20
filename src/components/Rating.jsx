import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { Flex } from "@chakra-ui/react";

const StarRating = ({ ratings }) => {
  // Ensure the ratings are within a valid range (0 to 5)
  const validRatings = Math.min(Math.max(ratings, 0), 5);

  const getStarIcon = (index) => {
    if (validRatings >= index + 1) {
      return <FaStar  color="yellow" />; // Full yellow star
    }
    if (validRatings >= index + 0.5) {
      return <FaStarHalfAlt   color="yellow" />; // Half yellow star
    }
    return <CiStar  />; // Empty gray star
  };

  return (
    <Flex  display="flex">
      {[0, 1, 2, 3, 4].map((index) => (
        <span  key={index}>{getStarIcon(index)}</span>
      ))}
    </Flex>
  );
};

export default StarRating;
