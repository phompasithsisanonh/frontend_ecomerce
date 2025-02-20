import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

const Pagination = ({ pageNumber, setPageNumber, totalItem, parPage, showItem }) => {
  const totalPages = Math.ceil(totalItem / parPage);

  const handlePrevious = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => (
      <Button
        key={index + 1}
        onClick={() => setPageNumber(index + 1)}
        isActive={pageNumber === index + 1}
        mx={1}
      >
        {index + 1}
      </Button>
    ));
  };

  return (
    <Flex   width={{ base: "auto", md: "100%" }} justifyContent="center" alignItems="center" mt={4}>
      <Button  onClick={handlePrevious} disabled={pageNumber === 1}>
        Previous
      </Button>
      <Flex>{renderPageNumbers()}</Flex>
      <Button onClick={handleNext} disabled={pageNumber === totalPages} >
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;
