// Products.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Typography,
  Box,
  Container,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Header from "./Header.jsx";
import { ProductsCreate } from "./ProductCreate.jsx"; // <-- make sure this file exports named ProductsCreate
import OrderModal from "./Order.jsx"; // <-- make sure this file exports default OrderModal
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:8001/";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[200],
}));

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
const navigate = useNavigate()
  const fetchProducts = () => {
    fetch(BASE_URL + "products")
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          return json;
        }
        throw new Error("Failed to fetch products");
      })
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const handleDelete = (event, id) => {
  //   event.preventDefault();
  //
  //   fetch(BASE_URL + "products/" + id, { method: "DELETE" })
  //     .then((response) => {
  //       if (response.ok) {
  //         setProducts((prev) => prev.filter((product) => product.id !== id));
  //       } else {
  //         throw new Error("Delete failed");
  //       }
  //     })
  //     .catch((error) => console.error(error));
  // };

    const handleDelete = (event, id) => {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    alert("Please log in first.");
    return;
  }

  if (role !== "Admin") {
    alert("You are not authorized to delete a product.");
    return;
  }

  fetch(BASE_URL + "products/" + id, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`, // pass token so backend verifies
      "Content-Type": "application/json"
    }
  })
    .then((response) => {
      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } else {
        throw new Error("Delete failed");
      }
    })
    .catch((error) => console.error(error));
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Header />
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            {/* <Button variant="contained" onClick={() => setOpenCreateModal(true)}>
              Add Product
            </Button> */}
            <Button
  variant="contained"
  onClick={() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Please log in first.");
      navigate('/login')
      
    }

    if (role !== "Admin") {
      alert("You are not authorized to create a product.");
      return;
    }

    setOpenCreateModal(true); // ✅ Only opens if authorized
  }}
>
  Add Product
</Button>


            <Button variant="outlined" onClick={() => setOpenOrder(true)}>
              Place Order
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products && products.length > 0 ? (
                  products
  .slice() // make a copy so we don’t mutate state
  .reverse()
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

      {/* CREATE modal */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: { xs: "90%", sm: 480 },
          }}
        >
          <ProductsCreate
            onClose={() => setOpenCreateModal(false)}
            onProductAdded={() => {
              fetchProducts(); // refresh parent list
              setOpenCreateModal(false);
            }}
          />
        </Box>
      </Modal>

      {/* ORDER modal (OrderModal already renders a Modal internally) */}
      {/*<OrderModal open={openOrder} onClose={() => setOpenOrder(false)} />*/}
        <OrderModal
  open={openOrder}
  onClose={() => setOpenOrder(false)}
  onOrderPlaced={fetchProducts} // refresh table after placing order
/>

    </>
  );
};

export default Products;
