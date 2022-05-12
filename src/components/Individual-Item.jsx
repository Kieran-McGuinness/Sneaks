import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { callApi } from "../api";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";

const IndividualItem = (props) => {
  const { signedIn, setCartChange, cartChange } = props;
  const { id } = useParams();
  const [individualProduct, setIndividualProduct] = useState([]);
  const [individualProductId, setIndividualProductId] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const token = localStorage.getItem("token");

  const addToCart = async (event) => {
    event.preventDefault();

    const itemInfo = {
      itemId: individualProductId,
      quantity: quantity,
    };
    console.log("single qty", quantity);
    console.log("single itemId", individualProductId);
    setCartChange(cartChange + 1);
    if (signedIn) {
      console.log("SignedIn", signedIn);

      const results = await callApi({
        url: "/shopping-cart/itemAdd",
        method: "POST",
        token: `${token}`,
        body: itemInfo,
      });
      console.log("single item result", results);
    } else {
      console.log("not signed in");
      const guest = JSON.parse(localStorage.getItem("guestCart"));
      localStorage.getItem("guestCart")
        ? localStorage.setItem(
            "guestCart",
            JSON.stringify([...guest, itemInfo])
          )
        : localStorage.setItem("guestCart", JSON.stringify([itemInfo]));
      console.log(JSON.parse(localStorage.getItem("guestCart")));
    }
  };

  useEffect(() => {
    const fetchIndividualProduct = async () => {
      const results = await callApi({
        url: `/items/${id}`,
      });
      console.log("Result", results);
      setIndividualProduct([results]);

      console.log("Single item", results);
    };
    fetchIndividualProduct();
  }, []);

  return (
    <>
      <form onSubmit={addToCart}>
        <div className="individual-page">
          {individualProduct.map((product) => (
            <div key={product.id}>
              <h1>{product.name}</h1>
              <img
                width="310px"
                height="310px"
                src={product.image}
                alt="Image"
              />
              <h2>{product.description}</h2>
              <h2>Price: ${product.price}</h2>

              <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                <InputLabel id="item-quantity">Qty</InputLabel>
                <Select
                  labelId="quantity"
                  id="item-quantity-select"
                  label="Qty"
                  defaultValue={1}
                  onChange={(event) =>
                    setQuantity(parseInt(event.target.value))
                  }
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1.5, minWidth: 100 }} size="small">
                <Button
                  size="small"
                  onClick={() => setIndividualProductId(product.id)}
                  variant="contained"
                  type="submit"
                >
                  {" "}
                  Add to Shopping Cart
                </Button>
              </FormControl>
            </div>
          ))}
          <div className="extra-info">
            <h2>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              quam corrupti repudiandae! Vel facilis reiciendis iste earum
              consequuntur alias ea dolores in voluptatibus quae illo explicabo
              suscipit, debitis ipsam veniam!
            </h2>
          </div>
        </div>
      </form>
    </>
  );
};

export default IndividualItem;
