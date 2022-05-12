import React, { useState, useEffect } from "react";
import { callApi } from "../api";
// getAPIHealth is defined in our axios-services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route
import { BrowserRouter as Router, Route } from "react-router-dom";
import "../style/App.css";
import AdminLogin from "./Admin-login.jsx";
import AdminRegister from "./Admin-register.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Navigation from "./Navigation.jsx";
import AdminCategories from "./Admin-categories";
import AllItems from "./Items";
import ShoppingCart from "./ShoppingCart";
import PastOrders from "./PastOrders";
import AdminItems from "./Admin-Items";
import IndividualItem from "./Individual-Item";
import Footer from "./Footer";

const App = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [adminSignedIn, setAdminSignedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [guestCart, setGuestCart] = useState([]);
  const [cartChange, setCartChange] = useState(0);
  // useEffect(() => {
  //   console.log(process.env.REACT_APP_JWT_SECRET);
  //   // follow this pattern inside your useEffect calls:
  //   // first, create an async function that will wrap your axios service adapter
  //   // invoke the adapter, await the response, and set the data

  useEffect(() => {
    const fetchItems = async () => {
      const results = await callApi({
        url: "/items",
        // token : `${token}`
      });
      setItems(results);
      setOriginalItems(results);
      // console.log("result", results)
    };
    fetchItems();
  }, []);

  useEffect(() => {
    localStorage.getItem("token") ? setSignedIn(true) : setSignedIn(false);
    localStorage.getItem("adminToken")
      ? setAdminSignedIn(true)
      : setAdminSignedIn(false);
    if (localStorage.getItem("token")) {
      console.log("signed in");
      const fetchShoppingCart = async () => {
        const results = await callApi({
          url: "/shopping-cart",
          token: `${token}`,
        });
        setProducts(results);
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

        const tester = guestResults;

        const itemQty = arr;
        const newResults = tester.filter((item) => {
          itemQty.map((qty) => {
            if (qty.itemId === item.id) item.qty = qty.quantity;
          });
          return item;
        });
        setGuestCart(newResults);
      };
      fetchGuestCart();
      //     console.log(JSON.parse(localStorage.getItem("guestCart")))
      // setGuestCart(JSON.parse(localStorage.getItem("guestCart")))
    }
  }, [cartChange]);

  // second, after you've defined your getter above
  // invoke it immediately after its declaration, inside the useEffect callback
  //   getAPIStatus();
  // }, []);

  return (
    <Router>
      <div className="app-container">
        <div className="app-content-navigation">
          <Navigation
            setSignedIn={setSignedIn}
            signedIn={signedIn}
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            products={products}
            guestCart={guestCart}
            setCartChange={setCartChange}
            cartChange={cartChange}
            setProducts={setProducts}
          />

          <div className="app-content">
            <Route path="/register">
              <Register setSignedIn={setSignedIn} />
            </Route>

            <Route exact path="/">
              <Login
                setSignedIn={setSignedIn}
                setCartChange={setCartChange}
                cartChange={cartChange}
              />
            </Route>

            <Route path="/admin">
              <AdminRegister />
            </Route>

            <Route path="/admin">
              <AdminLogin />
            </Route>

            <Route path="/admin">
              <AdminCategories />
            </Route>

            <Route path="/admin">
              <AdminItems items={items} />
            </Route>

            <Route exact path="/items">
              <AllItems
                items={items}
                setItems={setItems}
                originalItems={originalItems}
                signedIn={signedIn}
                searchItem={searchItem}
                setSearchItem={setSearchItem}
                setCartChange={setCartChange}
                cartChange={cartChange}
              />
            </Route>

            <Route path="/items/:id">
              <IndividualItem
                signedIn={signedIn}
                setCartChange={setCartChange}
                cartChange={cartChange}
              />
            </Route>

            <Route path="/past-orders">
              <PastOrders shoppingCart={shoppingCart} />
            </Route>

            <Route path="/shoppingcart">
              <ShoppingCart
                items={items}
                signedIn={signedIn}
                products={products}
                setProducts={setProducts}
                setGuestCart={setGuestCart}
                guestCart={guestCart}
              />
            </Route>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
