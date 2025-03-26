import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Progress,
  Icon,
  Center,
  Textarea,
  FormControl,
  Button,
  Input,
} from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import ReactStars from "react-stars";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  add_reviews,
  get_products,
  get_reviews,
} from "../store/reducers/homeReducers";
import toast from "react-hot-toast";

const Reviews = ({ slugId, ratingid }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    successMessage,
    messageClear,
    errorMessage,
    reviews,
  } = useSelector((state) => state.home);
  const { userInfo } = useSelector((state) => state.auth);
  const [state, setState] = useState({ name: "", rating: 0, review: "" });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const ratingChanged = (newRating) => {
    setState((prev) => ({ ...prev, rating: newRating }));
  };

  const handleAddReviews = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (!state.name || !state.review || state.rating === 0) {
      toast.error("Please fill all fields.");
      return;
    }
    if (userInfo) {
      dispatch(
        add_reviews({
          productId: slugId,
          name: state.name,
          rating: state.rating,
          review: state.review,
        })
      ).then(() => {
        dispatch(get_reviews({ productId: slugId }));
      });
      setState({ name: "", rating: 0, review: "" });
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    dispatch(get_reviews({ productId: slugId }));
  }, [dispatch, slugId]);
  useEffect(() => {
    dispatch(get_products());
  }, [dispatch]);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, messageClear]);

  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );
  // const averageRating =
  //   totalReviews > 0
  //     ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(
  //         1
  //       )
  //     : 0;
  return (
    <Box p={{ base: "2", md: "5" }}>
      <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
        ລີວິວສິນຄ້າ
      </Text>

      <Flex flexDirection={{ base: "column", md: "row" }}>
        <Center flexDirection="column" p={{ base: "2", md: "4" }}>
          <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
            {ratingid}/5
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }}>
            {totalReviews} ລີວິວທັງໝົດ
          </Text>
        </Center>
        <Box p={{ base: "2", md: "4" }}>
          {[5, 4, 3, 2, 1].map((star, index) => (
            <Flex key={index} align="center" mt="2" w="full">
              <Flex fontWeight="bold">
                {[...Array(5)].map((_, index) => (
                  <Icon
                    key={index}
                    as={index < star ? FaStar : FaRegStar} // ถ้า index น้อยกว่าคะแนน star ให้แสดง FaStar (ดาวเต็ม)
                    color="yellow.400"
                    boxSize="5"
                  />
                ))}
              </Flex>
              <Progress
                value={(ratingCounts[5 - star] / totalReviews) * 100 || 0}
                width={{ base: "150px", md: "200px" }}
                colorScheme="yellow"
                borderRadius="md"
                ml={2}
              />
              <Text w="10%" textAlign="center">
                {ratingCounts[5 - star]}
              </Text>
            </Flex>
          ))}
        </Box>
      </Flex>

      <Box mt="4">
        {reviews.map((review, i) => (
          <Box key={i} p="3" borderBottom="1px solid #ccc">
            <Flex align="center">
              {[...Array(5)].map((_, j) => (
                <Icon
                  key={j}
                  as={j < review.rating ? FaStar : FaRegStar}
                  color="yellow.400"
                  boxSize="5"
                />
              ))}
              <Text ml="3" fontSize="sm" color="gray.500">
                {review.date}
              </Text>
            </Flex>
            <Text fontWeight="bold">{review.name}</Text>
            <Text mt="2" fontSize="sm">
              {review.review}
            </Text>
          </Box>
        ))}
      </Box>

      <Box width={{ base: "100%", md: "650px" }} pt="30px">
        <ReactStars
          count={5}
          onChange={ratingChanged}
          value={state.rating}
          size={24}
          color2="#ffd700"
        />
        <FormControl display="flex" flexDirection="column">
          <Input
            value={state.name}
            name="name"
            onChange={handleChange}
            placeholder="Your Name"
          />
          <Textarea
            name="review"
            value={state.review}
            onChange={handleChange}
            placeholder="Write a review..."
          />
          <Button
            mt={4}
            colorScheme="blue"
            onClick={handleAddReviews}
            leftIcon={<IoMdSend />}
          >
            Submit
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Reviews;
