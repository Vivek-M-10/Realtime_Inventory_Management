

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Stack,
  Paper
} from "@mui/material";

const PRODUCTS_URL = "http://localhost:8001/";
const ORDERS_URL = "http://localhost:8000/";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  width: 400,
};

const OrderModal = ({ open, onClose, onOrderPlaced }) => {
  const [id, setId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetch(PRODUCTS_URL + "product/" + id)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          const price = parseFloat(data.price) * 1.2;
          setMessage(`Your product price is $${price.toFixed(2)}`);
        })
        .catch(() => setMessage(""));
    }
  }, [id]);

  const handleCreate = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Please log in first.");
      return;
    }

    if (role !== "User") {
      alert("Only users can place an order.");
      return;
    }

    const json_string = JSON.stringify({
      product_id: id,
      quantity: quantity,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: json_string,
    };

    fetch(ORDERS_URL + "order", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        setMessage(`Order for ${quantity} item(s) placed successfully`);
        if (onOrderPlaced) {
          onOrderPlaced(); // refresh data in parent
          setId("");
          setQuantity("");
          setMessage("");
        }
        onClose(); // close modal after success
      })
      .catch((error) => {
        console.log(error);
        setMessage("Failed to place order");
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={modalStyle}>
        <Typography variant="h6" mb={2} sx={{ fontWeight: 600 }}>
          Place an Order
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Product ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            fullWidth
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            fullWidth
          />
          {message && (
            <Typography variant="body2" color="secondary">
              {message}
            </Typography>
          )}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" onClick={handleCreate}>
              Place Order
            </Button>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );
};


export default OrderModal;
