// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = "http://localhost:8001/"

// export const ProductsCreate = () => {
//   const[name, setName] = useState('')
//   const[price, setPrice] = useState('')
//   const[quantity, setQuantity] = useState('')
//   const navigate = useNavigate()

//   const handleCreate = (event) => {
//     event?.preventDefault()

//     const json_string = JSON.stringify({ name, price, quantity })

//     const requestOptions = {
//       method: 'POST',
//       headers: new Headers({
//         'Content-Type': 'application/json'
//       }),
//       body: json_string
//     }

//     fetch(BASE_URL + 'product', requestOptions)
//       .then(response => {
//         if (!response.ok) {
//           throw response
//         }
//       })
//       .then(data => {
//         navigate('/')
//       })
//       .catch(error => {
//         console.log(error);
//       })
//   }


//   return (
//     <div className="new_product body">
//       <div className="new_product_title title">Create a new product</div>
//       <div>
//         <input className="input-1" placeholder="Name"
//           onChange={(event) => setName(event.target.value)} />
//       </div>
//       <div>
//         <input className="input-1" placeholder="Price"
//           onChange={(event) => setPrice(event.target.value)} />
//       </div>
//       <div>
//         <input className="input-1" placeholder="Quantity"
//           onChange={(event) => setQuantity(event.target.value)} />
//       </div>
//       <button className="button-4" onClick={handleCreate}>Create product</button>
//     </div>
//   )
// }

import { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography
} from "@mui/material";

const BASE_URL = "http://localhost:8001/";

export const ProductsCreate = ({ onClose, onProductAdded }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleCreate = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({ name, price, quantity });

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: json_string
    };

    fetch(BASE_URL + 'product', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(() => {
        onProductAdded(); // refresh list in parent
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h2" sx={{color:"black", font:50, fontWeight:600}}>
        Create a New Product
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        fullWidth
      />

      <TextField
        label="Price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        type="number"
        fullWidth
      />

      <TextField
        label="Quantity"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        type="number"
        fullWidth
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
