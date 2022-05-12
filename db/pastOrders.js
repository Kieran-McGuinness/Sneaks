const { rows } = require("pg/lib/defaults");
const client = require("./client");

async function createPastOrder({ shoppingCart, paymentType }) {
  const currentDate = new Date();
  const orderDate = currentDate.today() + currentDate.timeNow();
  const orderId = 0;

  shoppingCart.itemid.forEach((item) => {
    let itemName = item.name;
    let itemID = item.id;
    let qty = shoppingCart.quantity;
    orderId = getNextId();

    try {
      const { rows: order } = client.query(
        `
                INSERT INTO past_orders(order_id, item_name, item_id, payment_type, quantity, order_date)
                VALUES($1, $2, $3, $4, $5)
                RETURNING *;
            `,
        [orderId, itemName, itemID, paymentType, qty, orderDate]
      );
    } catch (error) {
      throw error;
    }
  });

  return getOrderByID(orderDate);
}

async function getOrderByID(orderDate) {
  try {
    const { rows: order } = await client.query(
      `
            SELECT *
            FROM past_orders
            WHERE order_date=$1;
          `,
      [orderDate]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getNextId() {
  const currentOrderIds = [];
  const orderNumber = 1;

  try {
    const { rows: order } = await client.query(
      `
            SELECT order_id
            FROM past_orders;
          `,
      []
    );

    console.log(rows);
    currentOrderIds = rows;
    orderNumber = Math.max(currentOrderIds);
    orderNumber = orderNumber + 1;

    return orderNumber;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createPastOrder,
  getOrderByID,
};
