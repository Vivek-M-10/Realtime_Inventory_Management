import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TablePagination, Typography, Box, Container
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Header from './Header.jsx'

const BASE_URL = "http://localhost:8001/";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.grey[200],
}));

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    fetch(BASE_URL + 'products')
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          return json;
        }
        throw new Error('Failed to fetch products');
      })
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = (event, id) => {
    event.preventDefault();
    fetch(BASE_URL + 'products/' + id, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          setProducts(prev => prev.filter(product => product.id !== id));
        } else {
          throw new Error('Delete failed');
        }
      })
      .catch(error => console.error(error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
      <>
        <Container>
   <Header />
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" component={Link} to="/create">
          Add Product
        </Button>
        <Button variant="outlined" component={Link} to="/order">
          Place Order
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={(e) => handleDelete(e, product.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </TableContainer>
    </Box>
          </Container>
            </>
  );
};
