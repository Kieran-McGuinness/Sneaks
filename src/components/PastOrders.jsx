import React from "react";

const PastOrders = (props) => {
  const { posts: shoppingcart } = props;
  return (
    <>
      <div id="past-orders">
        <h1>Past Order(s)</h1>
        {shoppingcart.map((scEntry) => (
          <div key={scEntry.itemid}>
            <h3 id="item-id">{scEntry.itemid}</h3>
            <p id="qty">{scEntry.quantity}</p>
            <p id="price">
              ,<b>Price (ea): </b>
              {scEntry.price}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PastOrders;
