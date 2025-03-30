import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Badge,
  Stack,
  Button,
  ButtonGroup,
  Input,
  FormLabel,
  FormControl,
  Tabs,
  TabPanel,
  TabPanels,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { edit_profile, get_profile_customer, messageClear } from "../../store/reducers/authReducer";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const { userInfo, successMessage, errorMessage, get_customer } = useSelector(
    (state) => state.auth
  );
  
  const handleOpenModal1 = () => {
    setIsModalOpen1(true);
  };
  
  const handleCloseModal1 = () => {
    setIsModalOpen1(false);
  };
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: 0,
    method: "",
    address: "",
    province: "",
    city: "",
    transport: "",
    branch: "",
    images: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, images: file });
      setImagePreview(URL.createObjectURL(file)); // Preview before upload
    }
  };

  const handleSave = () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    dispatch(
      edit_profile({
        userId: userInfo._id,
        formData: formDataToSend,
      })
    );
    setEditMode(false);
  };
  
  // Check for authentication and handle messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (!userInfo) {
      return navigate("/login");
    }
  }, [successMessage, errorMessage, dispatch, navigate, userInfo]);
  
  // Load user profile data
  useEffect(() => {
    if (userInfo) {
      dispatch(
        get_profile_customer({
          id: userInfo._id,
        })
      );
    }
  }, [userInfo, dispatch]);
  
  // Update form data when customer profile is loaded
  useEffect(() => {
    if (get_customer) {
      setFormData({
        name: get_customer.name || "",
        email: get_customer.email || "",
        phone: get_customer.phone || 0,
        method: get_customer.method || "",
        address: get_customer.address || "",
        province: get_customer.province || "",
        city: get_customer.city || "",
        transport: get_customer.transport || "",
        branch: get_customer.branch || "",
        images: get_customer.images || "",
      });
      
      // Set image preview if there's an image URL
      if (get_customer.images && typeof get_customer.images === 'string') {
        setImagePreview(get_customer.images);
      }
    }
  }, [get_customer]);

  return (
    <Box p={4} bg="gray.50" borderRadius="md" shadow="md">
      <Tabs>
        <TabPanels>
          <TabPanel>
            {editMode ? (
              <Stack spacing={4} mt={4}>
                <FormControl>
                  <FormLabel>ຊື່</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    isDisabled
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>ເບີໂທ</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>ວິທີການຊຳລະເງິນ</FormLabel>
                  <Input
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>ອັບໂຫຼດຮູບໂປຣໄຟລ</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Profile Preview"
                      boxSize="150px"
                      mt={2}
                      borderRadius="md"
                    />
                  )}
                </FormControl>
                <FormControl>
                  <Button colorScheme="red" onClick={handleOpenModal1}>
                    ເພີ່ມທີ່ຢູ່ຈັດສົ່ງ
                  </Button>
                </FormControl>
                <Button colorScheme="green" onClick={handleSave}>
                  ບັນທຶກ
                </Button>

                <Modal
                  isCentered
                  isOpen={isModalOpen1}
                  onClose={handleCloseModal1}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>ທີ່ຢູ່ຈັດສົ່ງ</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Stack spacing={3}>
                        <FormControl>
                          <FormLabel>ທີ່ຢູ່ບ້ານ</FormLabel>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>ແຂວງ</FormLabel>
                          <Input
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>ເມືອງ</FormLabel>
                          <Input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>ບໍລິສັດຂົນສົ່ງ</FormLabel>
                          <Input
                            name="transport"
                            value={formData.transport}
                            onChange={handleChange}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>ສາຂາໃກ້ບ້ານທ່ານ</FormLabel>
                          <Input
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </Stack>
                    </ModalBody>
                    <ModalFooter>
                      <Button ml={2} onClick={handleCloseModal1}>
                        ບັນທືກ
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Stack>
            ) : (
              <Flex
                flexDirection={{ base: "column", md: "row" }}
                alignItems="center"
                gap={4}
                mt={4}
              >
                <Avatar
                  size="xl"
                  name={get_customer?.name || userInfo?.name}
                  src={get_customer?.images || userInfo?.images || "https://via.placeholder.com/150"}
                />
                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {get_customer?.name || userInfo?.name}
                  </Text>
                  <Text>Email: {get_customer?.email || userInfo?.email}</Text>
                  <Text>Phone: {get_customer?.phone || userInfo?.phone}</Text>
                  <Text>
                    Method: <Badge>{get_customer?.method || userInfo?.method}</Badge>
                  </Text>
                  <Text>ທີ່ຢູ່ບ້ານ: {get_customer?.address || userInfo?.address}</Text>
                  <Text>ເມືອງ: {get_customer?.city || userInfo?.city}</Text>
                  <Text>ແຂວງ: {get_customer?.province || userInfo?.province}</Text>
                  <Text>ບໍລິສັດຂົນສົ່ງ: {get_customer?.transport || userInfo?.transport}</Text>
                  <Text>ສາຂາໃກ້ບ້ານທ່ານ: {get_customer?.branch || userInfo?.branch}</Text>
                </Box>
              </Flex>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <ButtonGroup paddingTop="10px" display="flex" justifyContent="flex-end">
        <Button colorScheme="blue" onClick={handleEditToggle}>
          {editMode ? "ປິດ" : "ແກ້ໄຂໂປຣໄຟລ"}
        </Button>
        <Button colorScheme="red">ລຶບລະຫັດຜ່ານ</Button>
      </ButtonGroup>
    </Box>
  );
};

export default Profile;