import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./Checkout";
import { callApi } from "../api";
import AllItems from "./Items";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { idleTimeoutMillis } from "pg/lib/defaults";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: "#f44339",
    },
  },
});

const ShoppingCart = (props) => {
  const { products, setProducts, guestCart, setGuestCart } = props;
  const items = props.items;
  const signedIn = props.signedIn;
  // const [products, setProducts] = useState([]);
  const [productsDepend, setProductsDepend] = useState([]);
  const [guestProductsDepend, setGuestProductsDepend] = useState([]);
  // const [guestCart, setGuestCart] = useState([]);
  // const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [clientSecret, setClientSecret] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [itemsPrice, setItemsPrice] = useState(0);
  const [guestItemsPrice, setGuestItemsPrice] = useState(0);
  const [clicked, setClicked] = useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // const itemssPrice = Array.from(products).reduce(
  //   (acc, curr) => acc + curr.Item_Price * curr.Qty,
  //   0
  // );
  const taxPrice = itemsPrice * 0.15;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // const guestItemssPrice = guestCart.reduce(
  //   (acc, curr) => acc + curr.price * curr.qty,
  //   0
  // );
  const guestTaxPrice = guestItemsPrice * 0.15;
  const guestShippingPrice = guestItemsPrice > 100 ? 0 : 10;
  const guestTotalPrice = guestItemsPrice + guestTaxPrice + guestShippingPrice;

  useEffect(() => {
    setClicked(false);
    if (signedIn) {
      const fetchShoppingCart = async () => {
        const results = await callApi({
          url: "/shopping-cart",
          token: `${token}`,
        });
        setProducts(results);
        console.log(results);
        setItemsPrice(
          Array.from(results).reduce(
            (acc, curr) => acc + curr.Item_Price * curr.Qty,
            0
          )
        );
      };
      fetchShoppingCart();
    } else if (localStorage.getItem("guestCart")) {
      const fetchGuestCart = async () => {
        const arr = JSON.parse(localStorage.getItem("guestCart"));
        // const res = Array.from(
        //   arr.reduce(
        //     (m, { itemId, quantity }) =>
        //       m.set(itemId, (m.get(itemId) || 0) + quantity),
        //     new Map()
        //   ),
        //   ([itemId, quantity]) => ({ itemId, quantity })
        // );
        // console.log("res", res);

        const itemIds = arr.map((item) => item.itemId);
        const guestResults = await callApi({
          url: `/shopping-cart/guest/${itemIds}`,
        });
        console.log("guestresultsd", guestResults);

        // const itemQty = JSON.parse(localStorage.getItem("guestCart"));
        const itemQty = arr;
        const newResults = guestResults.filter((item) => {
          itemQty.map((qty) => {
            if (qty.itemId === item.id) item.qty = qty.quantity;
          });
          return item;
        });
        setGuestItemsPrice(
          Array.from(guestResults).reduce(
            (acc, curr) => acc + curr.price * curr.qty,
            0
          )
        );
        setGuestCart(newResults);
        console.log("Guest Products", newResults);
        console.log(itemQty);
        console.log(guestItemsPrice);
      };
      fetchGuestCart();
      //     console.log(JSON.parse(localStorage.getItem("guestCart")))
      // setGuestCart(JSON.parse(localStorage.getItem("guestCart")))
    }
    setProductsDepend(products);
    setGuestProductsDepend(guestCart);
    console.log(products);
  }, [productsDepend, guestProductsDepend]);

  // console.log("quantity", quantity)

  const token = localStorage.getItem("token");

  const handleDelete = async (productIdToDelete) => {
    // setProductId(productIdToDelete);

    console.log("ItemId to Delete", productIdToDelete);

    const itemToDelete = productIdToDelete;
    // console.log("itemid", itemToDelete);

    const results = await callApi({
      url: `/shopping-cart/${productIdToDelete}`,
      method: "DELETE",
      token: `${token}`,
    });
    if (results.message) {
      setCartMessage(results.message);
      setSeverity("success");
      handleClick();
      setProductsDepend([]);
      console.log("result", results);
    } else {
      setCartMessage("Item could not be removed from cart, please try again");
      setSeverity("error");
      handleClick();
    }
  };

  const isClicked = (event) => {
    event.preventDefault();
    setClicked(true);
  };
  const handleGuestDelete = async (productIdToDelete) => {
    const itemId = productIdToDelete;
    const arr = JSON.parse(localStorage.getItem("guestCart"));
    const newCartDelete = arr.filter((item) => item.itemId !== itemId);

    const newRenderCartDelete = guestCart.filter((item) => item.id !== itemId);
    if (newRenderCartDelete.length) {
      localStorage.setItem("guestCart", JSON.stringify(newCartDelete));
      setGuestCart(newRenderCartDelete);
    } else {
      localStorage.removeItem("guestCart");
      setGuestCart([]);
    }
    setCartMessage("The item has been removed from your cart");
    setSeverity("success");
    handleClick();
    setGuestItemsPrice(
      Array.from(newRenderCartDelete).reduce(
        (acc, curr) => acc + curr.price * curr.qty,
        0
      )
    );
  };

  const updateHandler = async (event, id) => {
    event.preventDefault();
    const updatedQuantity = event.target.value;
    setQuantity(updatedQuantity);

    console.log("adjust Quantity", updatedQuantity);
    console.log("ItemId", id);

    const itemInfo = {
      quantity: updatedQuantity,
      itemId: id,
    };

    const token = localStorage.getItem("token");
    // console.log("itemInfo", itemInfo);
    // console.log("My Token", token)
    const results = await callApi({
      url: "/shopping-cart/edit",
      method: "PATCH",
      token: `${token}`,
      body: itemInfo,
    });

    console.log("Update Items", results);

    const result = products.map((item) =>
      id === item.id ? { ...item, Qty: updatedQuantity } : item
    );
    setProducts(result);
    setItemsPrice(
      Array.from(result).reduce(
        (acc, curr) => acc + curr.Item_Price * curr.Qty,
        0
      )
    );
    console.log(itemsPrice);
    console.log("final result", result);
  };

  const updateGuestHandler = async (event, id) => {
    console.log(event.target.value);
    const itemId = id;
    console.log(id);
    const itemInfo = {
      itemId: itemId,
      quantity: event.target.value,
    };
    const arr = JSON.parse(localStorage.getItem("guestCart"));
    const newCart = arr.map((item) => {
      if (item.itemId === itemId) {
        return { ...item, quantity: event.target.value };
      } else {
        return item;
      }
    });
    const newRenderCart = guestCart.map((item) => {
      if (item.id === itemId) {
        return { ...item, qty: event.target.value };
      } else {
        return item;
      }
    });
    localStorage.setItem("guestCart", JSON.stringify(newCart));
    setGuestCart(newRenderCart);
    console.log(newRenderCart);
    console.log(newCart);
    setGuestItemsPrice(
      Array.from(newRenderCart).reduce(
        (acc, curr) => acc + curr.price * curr.qty,
        0
      )
    );
    // const guestC = JSON.parse(localStorage.getItem("guestCart"));
    // localStorage.getItem("guestCart")
    //   ? localStorage.setItem("guestCart", JSON.stringify([...guestC, itemInfo]))
    //   : localStorage.setItem("guestCart", JSON.stringify([itemInfo]));

    // const arr = JSON.parse(localStorage.getItem("guestCart"));
    // const res = Array.from(
    //   arr.reduce(
    //     (m, { itemId, quantity }) =>
    //       m.set(itemId, (m.get(itemId) || 0) + quantity),
    //     new Map()
    //   ),
    //   ([itemId, quantity]) => ({ itemId, quantity })
    // );

    // console.log(res);
  };

  return (
    <div>
      <div className="cart-page">
        <div className="cart-all-items">
          <h2 className="shoppingcart-title"> Shopping Cart </h2>

          {products.map((product) => (
            <div key={product.id} className="cart-all-ind-info">
              <div className="cart-no-img">
                <img
                  className="cart-item-img"
                  width="85px"
                  height="85px"
                  src={product.image}
                  alt="Image"
                />
                <div className="cart-item-info">
                  <h1 className="cart-item-name">{product.Item_Name}</h1>

                  <h2>Price: ${product.Item_Price * product.Qty}</h2>

                  {/* <div className="input-group">
                       <button type = "button" onClick={() => handleDecrement(product.id)} className="input-group-text">-</button>
                       <h3 className="quantity" onChange={(event) => setQuantity(parseInt(event.target.value))}>Qty: {product.Qty}</h3>
                       <button type = "button" onClick={() => handleIncrement(product.id)} className="input-group-text">+</button>
                    </div> <br></br> */}

                  <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                    <InputLabel id="item-quantity"> Qty </InputLabel>
                    <Select
                      labelId="quantity"
                      id="item-quantity-select"
                      label="Age"
                      onChange={(event) => updateHandler(event, product.id)}
                      defaultValue={product.Qty}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="cart-item-buttons">
                  <Button
                    className="delete-Btn"
                    style={{ fontSize: "10px" }}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                    // type="submit"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                  {/* <button
            type="button"
            className="delete-Btn"
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </button> */}

                  {/* <button
            type="button"
            className="wish-btn"
            onClick={() => wishCartHandler(product.id, product.Qty)}
          >
            Add to Wish Cart
          </button> */}
                </div>
              </div>
            </div>
          ))}

          {!signedIn && guestCart.length ? (
            guestCart.map((product) => (
              <div key={product.id} className="cart-all-ind-info">
                <img
                  className="cart-item-img"
                  width="85px"
                  height="85px"
                  src={product.image}
                  alt="Image"
                />
                <div className="cart-no-img">
                  <div className="cart-item-info">
                    <h2 className="cart-item-name">{product.name}</h2>

                    <h3 className="cart-item-price">
                      Price: ${product.price * product.qty}
                    </h3>

                    {/* <div className="input-group">
                       <button type = "button" onClick={() => handleDecrement(product.id)} className="input-group-text">-</button>
                       <h3 className="quantity" onChange={(event) => setQuantity(parseInt(event.target.value))}>Qty: {product.Qty}</h3>
                       <button type = "button" onClick={() => handleIncrement(product.id)} className="input-group-text">+</button>
                    </div> <br></br> */}

                    <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
                      <InputLabel id="item-quantity"> Qty </InputLabel>
                      <Select
                        labelId="quantity"
                        id="item-quantity-select"
                        label="Qty"
                        defaultValue={product.qty}
                        onChange={(event) =>
                          updateGuestHandler(event, product.id)
                        }
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="cart-item-buttons">
                    <Button
                      className="delete-Btn"
                      style={{ fontSize: "10px" }}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      color="error"
                      type="submit"
                      onClick={() => handleGuestDelete(product.id)}
                    >
                      Delete
                    </Button>
                    {/* <button
            type="button"
            className="delete-Btn"
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </button> */}
                    {/* <Button
                      className="wish-btn"
                      style={{ fontSize: "10px" }}
                      variant="outlined"
                      type="submit"
                      onClick={() => wishCartHandler(product.id, product.Qty)}
                    >
                      Add to Wish Cart
                    </Button> */}
                    {/* <button
            type="button"
            className="wish-btn"
            onClick={() => wishCartHandler(product.id, product.Qty)}
          >
            Add to Wish Cart
          </button> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        {products.length || guestCart.length ? (
          <>
            <div className="cart-totals">
              <h3>
                Items Price: $
                {signedIn ? itemsPrice.toFixed(2) : guestItemsPrice.toFixed(2)}
              </h3>
              <h3>
                Tax Price: $
                {signedIn ? taxPrice.toFixed(2) : guestTaxPrice.toFixed(2)}
              </h3>
              <h3>
                Shipping Price: $
                {signedIn
                  ? shippingPrice.toFixed(2)
                  : guestShippingPrice.toFixed(2)}
              </h3>
              <h1>
                Total Price: $
                {signedIn ? totalPrice.toFixed(2) : guestTotalPrice.toFixed(2)}
              </h1>
              {clicked ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              ) : (
                <Button
                  className="checkout"
                  size="small"
                  variant="contained"
                  type="submit"
                  onClick={isClicked}
                >
                  CheckOut
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="cart-no-items">
            <h2>There are no items in your cart!</h2>
          </div>
        )}
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {cartMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ShoppingCart;
