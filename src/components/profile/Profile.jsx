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
  HStack,
  VStack,
} from "@chakra-ui/react";
import { edit_profile, messageClear } from "../../store/reducers/authReducer";
import toast from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const { userInfo, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );
  const handleOpenModal1 = () => {
    setIsModalOpen1(true);
  };
  console.log(userInfo);
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

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || 0,
        method: userInfo.method || "",
        address: userInfo.address || "",
        province: userInfo.province || "",
        city: userInfo.city || "",
        transport: userInfo.transport || "",
        branch: userInfo.branch || "",
        images: userInfo.images || "",
      });
    }
  }, [userInfo]);

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
    ); // Send formData including image
    setEditMode(false);
  };
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
                  <Button colorScheme="red" onClick={() => handleOpenModal1()}>
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
                    {" "}
                    {/* ✅ ย้าย ref มาที่นี่ */}
                    <ModalHeader>ທີ່ຢູ່ຈັດສົ່ງ</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl>
                        <FormLabel>ທີ່ຢູ່ບ້ານ</FormLabel>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
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
                      </FormControl>
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
                  name={userInfo.name}
                  src={userInfo?.images || "https://via.placeholder.com/150"}
                />
                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {userInfo.name}
                  </Text>
                  <Text>Email: {userInfo.email}</Text>
                  <Text>Phone: {userInfo?.phone}</Text>
                  <Text>
                    Method: <Badge>{userInfo.method}</Badge>
                  </Text>

                  <Text>ທີ່ຢູ່ບ້ານ: {userInfo?.address}</Text>
                  <Text>ເມືອງ: {userInfo?.city}</Text>
                  <Text>ແຂວງ: {userInfo?.province}</Text>
                  <Text>ບໍລິສັດຂົນສົ່ງ: {userInfo?.transport}</Text>
                  <Text>ສາຂາໃກ້ບ້ານທ່ານ: {userInfo?.branch}</Text>
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
