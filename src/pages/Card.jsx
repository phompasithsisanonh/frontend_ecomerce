import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  VStack,
  Input,
  Button,
  Divider,
  Image,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsPlus } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  deleteCard,
  get_card_products,
  quanlity_mius,
  quanlity_plus,
} from "../store/reducers/cardReducer";
import Header from '../components/Header';
import Footer from '../components/Footer';

const Card = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Chakra UI color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const { card_products, price, shipping_fee, buy_product_item } = useSelector(
    (state) => state.card
  );
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(get_card_products(userInfo._id));
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate]);

  const handleQuantityChange = useCallback(async (productId, condition, stock) => {
    try {
      setIsLoading(true);
      if (condition === 'plus' && stock > 0) {
        await dispatch(quanlity_plus(productId));
      } else if (condition === 'minus') {
        await dispatch(quanlity_mius(productId));
      }
      await dispatch(get_card_products(userInfo._id));
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userInfo._id]);

  const handleDeleteProduct = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      setIsLoading(true);
      await dispatch(deleteCard(itemToDelete));
      await dispatch(get_card_products(userInfo._id));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsLoading(false);
      setItemToDelete(null);
      onClose();
    }
  }, [dispatch, itemToDelete, userInfo._id, onClose]);

  const handleOrderConfirmation = useCallback(() => {
    navigate('/shipping', {
      state: { card_products, price, shipping_fee, buy_product_item },
    });
    toast.success('Order placed successfully');
  }, [card_products, price, shipping_fee, buy_product_item, navigate]);

  const ProductCard = ({ product }) => (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      _hover={{ bg: hoverBg }}
      transition="background 0.2s"
    >
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} alignItems="center">
        <Image
          src={product.productInfo.images[0]}
          alt={product.productInfo.name}
          boxSize={{ base: '100px', md: '70px' }}
          objectFit="cover"
          borderRadius="md"
          mx={{ base: 'auto', md: 0 }}
        />
        
        <Box>
          <Text fontWeight="medium" noOfLines={2}>{product.productInfo.name}</Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            ${product.productInfo.price.toFixed(2)}
          </Text>
          {product.productInfo.discount > 0 && (
            <Badge colorScheme="green" mt={1}>
              Save ${product.productInfo.discount.toFixed(2)}
            </Badge>
          )}
        </Box>

        <Flex justify="center" align="center" gap={2}>
          <IconButton
            icon={<FaMinus />}
            size="sm"
            isDisabled={product.quantity <= 1 || isLoading}
            onClick={() => handleQuantityChange(
              product._id,
              'minus',
              product.productInfo.stock
            )}
            aria-label="Decrease quantity"
            variant="outline"
          />
          <Text fontWeight="medium" minW="40px" textAlign="center">
            {product.quantity}
          </Text>
          <IconButton
            icon={<BsPlus />}
            size="sm"
            isDisabled={product.quantity >= product.productInfo.stock - 1 || isLoading}
            onClick={() => handleQuantityChange(
              product._id,
              'plus',
              product.productInfo.stock
            )}
            aria-label="Increase quantity"
            variant="outline"
          />
        </Flex>

        <Flex justify="flex-end">
          <IconButton
            icon={<MdDeleteForever size="20px" />}
            colorScheme="red"
            variant="ghost"
            onClick={() => {
              setItemToDelete(product._id);
              onOpen();
            }}
            aria-label="Delete item"
          />
        </Flex>
      </SimpleGrid>
    </Box>
  );

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Header />
      
      <Container maxW="container.xl" py={8}>
        <Box 
          bg={bgColor} 
          borderRadius="xl" 
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Box p={6} borderBottomWidth="1px">
            <Heading size="lg" textAlign="center">Shopping Cart</Heading>
          </Box>

          <Box p={6}>
            <VStack spacing={6} align="stretch">
              {card_products.length === 0 ? (
                <Flex direction="column" align="center" py={10} gap={4}>
                  <Text fontSize="lg" color="gray.500">Your cart is empty</Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                </Flex>
              ) : (
                card_products.map((seller) => (
                  <Box key={seller.sellerId}>
                    <Flex align="center" mb={4}>
                      <Text fontSize="lg" fontWeight="bold">{seller.shopName}</Text>
                      <Badge ml={2} colorScheme="blue">
                        {seller.products.length} items
                      </Badge>
                    </Flex>
                    <VStack spacing={4}>
                      {seller.products.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                        />
                      ))}
                    </VStack>
                  </Box>
                ))
              )}
            </VStack>

            {card_products.length > 0 && (
              <>
                <Divider my={6} />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Text mb={4}>Have a coupon code?</Text>
                    <Flex gap={4}>
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        isDisabled={isLoading || !couponCode}
                        onClick={() => toast.info('Coupon functionality coming soon')}
                      >
                        Apply
                      </Button>
                    </Flex>
                  </Box>

                  <Box>
                    <VStack spacing={3} align="stretch">
                      <Flex justify="space-between">
                        <Text color="gray.600">Subtotal</Text>
                        <Text>{(price - shipping_fee)?.toLocaleString()} ກີບ</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color="gray.600">Shipping Fee</Text>
                        <Text>{shipping_fee?.toLocaleString()} ກີບ</Text>
                      </Flex>
                      <Divider />
                      <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                        <Text>Total</Text>
                        <Text color="blue.500">{price?.toLocaleString()} ກີບ</Text>
                      </Flex>
                      <Button
                        colorScheme="blue"
                        size="lg"
                        isDisabled={isLoading}
                        onClick={handleOrderConfirmation}
                        mt={4}
                      >
                        ຢືນຢັນການສັ່ງຊື້
                      </Button>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </>
            )}
          </Box>
        </Box>
      </Container>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Item
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to remove this item from your cart?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteProduct}
                isLoading={isLoading}
                ml={3}
              >
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Footer />
    </Box>
  );
};

export default Card;