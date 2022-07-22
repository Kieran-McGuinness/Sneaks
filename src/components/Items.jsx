import React, { useState, useEffect } from "react";
import { callApi } from "../api";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const AllItems = (props) => {
  const { items, setItems, originalItems, setCartChange, cartChange } = props;
  const [itemId, setItemId] = useState(null); // change "" to null
  const [quantity, setQuantity] = useState(1);
  const { searchItem } = props;
  const token = localStorage.getItem("token");
  const signedIn = props.signedIn;
  const [subCategories, setSubCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");

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
  const handleSelectChange = (event, index) => {
    const value = event.target.value;
    setQuantity({ ...quantity, [index]: value });
    console.log(quantity);
  };

  useEffect(() => {
    const getSubCategories = async () => {
      const subCats = await callApi({
        url: "/sub-categories",
      });
      setSubCategories(subCats);
    };
    getSubCategories();
    catSearch(0);
  }, []);

  const addToCart = async (index, itemID, event) => {
    event.preventDefault();
    setItemId(itemID);
    const itemInfo = {
      itemId: itemID,
      quantity: quantity[index] ? quantity[index] : 1,
    };
    console.log("qty", quantity);
    console.log("itemId", itemId);
    if (signedIn) {
      const results = await callApi({
        url: "/shopping-cart/itemAdd",
        method: "POST",
        token: `${token}`,
        body: itemInfo,
      });
      console.log(results);
      if (results.message) {
        setCartChange(cartChange + 1);
        console.log(results);
        setSeverity("success");
        setCartMessage(results.message);
        handleClick();
      } else {
        setSeverity("error");
        setCartMessage("Item already in cart");
        handleClick();
      }
    } else {
      if (!localStorage.getItem("guestCart")) {
        localStorage.setItem("guestCart", JSON.stringify([itemInfo]));
        setSeverity("success");
        setCartMessage("Item has been added to cart");
        handleClick();
        setCartChange(cartChange + 1);
      } else {
        const guestC = JSON.parse(localStorage.getItem("guestCart"));
        const itemExists = guestC.filter((item) => item.itemId === itemID);
        if (itemExists.length) {
          setSeverity("error");
          setCartMessage("Item is already in your cart");
          handleClick();
        } else {
          localStorage.setItem(
            "guestCart",
            JSON.stringify([...guestC, itemInfo])
          );
          setSeverity("success");
          setCartMessage("Item has been added to cart");
          handleClick();
          setCartChange(cartChange + 1);
        }
      }

      console.log(JSON.parse(localStorage.getItem("guestCart")));
    }
  };

  function itemMatches(item, text) {
    if (item.name.toLowerCase().includes(text.toLowerCase())) {
      return true;
    }
  }

  const catSearch = async (id) => {
    setCurrentCategory(id);
    if (id === 0) {
      setItems(originalItems);
    } else {
      const results = await callApi({
        url: `/sub-categories/items/all/${id}`,
      });
      console.log(results);
      setItems(results);
    }
  };

  const filteredItems = items.filter((item) => itemMatches(item, searchItem));
  const itemsToDisplay = searchItem.length ? filteredItems : items;

  return (
    <div className="items">
      <div className="page-title">
        <h1>Sneakers</h1>
        <div className="item-category">
          <FormControl sx={{ m: 1, minWidth: 130 }} size="small">
            <InputLabel id="item-category">Categories</InputLabel>
            <Select
              MenuProps={{ disableScrollLock: true }}
              labelId="category-filter"
              id="item-category-select"
              label="Categories"
              value={currentCategory}
              onChange={(event) => catSearch(parseInt(event.target.value))}
            >
              <MenuItem value={0}>None</MenuItem>
              {subCategories.map((category, index) => (
                <MenuItem key={index} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* <TextField id="outlined-basic" label="Search Items..." variant="outlined" size="small" type = "search" className="search-bar" onChange={(event) => setSearchItem(event.target.value)}/> */}
        {/* <input type = "search" placeholder = "Search Items..."
                value={searchItem} className="search-bar"
                onChange={(event) => setSearchItem(event.target.value)}></input> */}
      </div>
      <div>
        <form>
          <div className="items-page">
            {itemsToDisplay.map((item, index) => (
              <div key={item.id} className="items-box">
                <Link
                  to={`/items/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <h1>{item.name}</h1>

                  <img
                    width="120px"
                    height="120px"
                    src={item.image}
                    alt="item"
                  />
                  <h3 className="item-info">{item.description}</h3>
                  <h3 className="item-info">Price: ${item.price}</h3>

                  {(() => {
                    if (item.stock > 10) {
                      return <h3>In Stock</h3>;
                    } else {
                      return <h3>Low Stock</h3>;
                    }
                  })()}
                </Link>
                <div className="quantity-selection">
                  <div className="quantity-box">
                    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                      <InputLabel id="item-quantity">Qty</InputLabel>
                      <Select
                        labelId="quantity"
                        id="item-quantity-select"
                        label="Qty"
                        value={index.quantity}
                        defaultValue={1}
                        onChange={(event) => handleSelectChange(event, index)}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {/* <label htmlFor = "quantity"> Quantity </label>
                    <select className = "Qty" 
                    onChange={(event) => setQuantity(parseInt(event.target.value))}
                    >

                        <option>Select</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                            
                        </select> */}

                  {/* <button
                        type = "submit" className="submit-btn"
                        onClick={() => setItemId(item.id)}>
                        Add to Shopping Cart
                        </button> */}
                  <Button
                    size="small"
                    onClick={(event) => addToCart(index, item.id, event)}
                    variant="contained"
                    type="submit"
                  >
                    {" "}
                    Add to Shopping Cart
                  </Button>
                </div>
              </div>
            ))}

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Collapse in={open}>
                <Alert
                  onClose={handleClose}
                  severity={severity}
                  sx={{ width: "100%" }}
                >
                  {cartMessage}
                </Alert>
              </Collapse>
            </Snackbar>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllItems;
