import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import React from "react";
import { Icon, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Stack from "@mui/material/Stack";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

const Navigation = (props) => {
  const {
    setSearchItem,
    setSignedIn,
    signedIn,
    products,
    guestCart,
    setCartChange,
    cartChange,
    setProducts,
  } = props;
  const history = useHistory();
  const [open, setOpen] = useState(false);
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

  const handleLogOut = (event) => {
    event.preventDefault();
    history.push("/items");
    handleClick();
    setProducts([]);
    localStorage.removeItem("token");
    setSignedIn(false);
    setCartChange(cartChange + 1);
  };

  const routeChangeRegister = () => {
    const path = `/register`;
    history.push(path);
  };
  const routeChangeItems = (event) => {
    event.preventDefault();
    const path = `/items`;
    history.push(path);
  };

  return (
    <div className="navigation">
      <div className="nav-title">
        <Link className="nav-title" to={"/items"}>
          Sneaks
        </Link>
      </div>
      <div>
        <Box component="form" id="main-search" onSubmit={routeChangeItems}>
          <TextField
            id="outlined-basic"
            label="Search Items..."
            variant="outlined"
            size="small"
            type="search"
            style={{ width: 400 }}
            className="search-bar"
            onChange={(event) => setSearchItem(event.target.value)}
          />
          <Button
            size="small"
            variant="contained"
            type="submit"
            onClick={routeChangeItems}
            style={{ height: "40px" }}
          >
            {" "}
            Search
          </Button>
        </Box>
      </div>

      <div className="nav">
        {/* <Link to="/admin" className="nav-item">
          Admin Log In
        </Link> */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="baseline"
          justifyContent="space-evenly"
        >
          <Link to="/items" className="nav-item">
            <Button
              className="nav-item"
              size="small"
              variant="text"
              type="submit"
            >
              Shop Kicks
            </Button>
          </Link>
          <Link to="/shoppingcart" className="nav-item-cart">
            <Tooltip title="My Cart">
              <IconButton>
                <Badge
                  color="secondary"
                  badgeContent={(() => {
                    if (signedIn) {
                      console.log("sign cart");
                      return products.length;
                    } else if (guestCart.length) {
                      console.log("guest cart");
                      return guestCart.length;
                    } else {
                      console.log("no cart");
                      return 0;
                    }
                  })()}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Link>

          {/* <Link to="" className="nav-item">
          My Profile
        </Link> */}

          {signedIn ? (
            <Link to="/" className="nav-item" onClick={handleLogOut}>
              <Tooltip title="Sign Out">
                <IconButton>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Link>
          ) : (
            <>
              <Link to="/" className="nav-item">
                <Tooltip title="Sign In">
                  <IconButton>
                    <LoginIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <Button
                className="nav-item"
                size="small"
                variant="contained"
                type="submit"
                onClick={routeChangeRegister}
                style={{ height: "40px", width: "80px" }}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            You have been signed out successfully
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};
export default Navigation;
