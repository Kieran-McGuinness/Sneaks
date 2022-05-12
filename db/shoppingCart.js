const client = require("./client");
const { getUserByUsername } = "./users";

async function createShoppingCart(shopperId) {
  try {
    const {
      rows: [shoppingCart],
    } = await client.query(
      `
        INSERT INTO shoppingcart (shopperid)
        VALUES($1)
        RETURNING *;
        `,
      [shopperId]
    );

    return shoppingCart;
  } catch (error) {
    throw error;
  }
}

async function getShoppingCartByShopperId(id) {
  try {
    const { rows: shoppingCart } = await client.query(
      `
        SELECT shoppingcart.id, shoppingcart.shopperid, users.username AS "Shopper", items.name AS "Item_Name", items.price AS "Item_Price", items.image, shoppingcart.quantity AS "Qty", items.id
        FROM shoppingcart
        JOIN users ON shoppingcart.shopperid = users.id
        JOIN items ON shoppingcart.itemid = items.id
        WHERE shoppingcart.shopperid=$1;
        `,
      [id]
    );

    return shoppingCart;
  } catch (error) {
    throw error;
  }
}

async function getGuestShoppingCart(itemIds) {
  const guestValues = itemIds.map((_, index) => `$${index + 1}`).join(", ");
  try {
    const { rows: guestCart } = await client.query(
      `
       SELECT * FROM items
       WHERE id IN (${guestValues});
        `,
      itemIds
    );

    return guestCart;
  } catch (error) {
    throw error;
  }
}

async function getShoppingCartByUsername({ username }) {
  try {
    const user = await getUserByUsername(username);
    const { rows: userShoppingCart } = await client.query(
      `
        SELECT shoppingcart.id, shoppingcart.shopperid, users.username as "Shopper", items.name AS "Item_Name", items.price AS "Item_Price", shoppingcart.quantity AS "QTY", items.id
        FROM shoppingcart
        JOIN users ON shoppingcart.shopperid = users.id
        JOIN items ON shoppingcart."itemid" = items.id
        WHERE shoppingcart.shopperid = $1;
        `,
      [user.id]
    );

    return userShoppingCart;
  } catch (error) {
    throw error;
  }
}

async function addToShoppingCart(shopperid, itemid, quantity) {
  try {
    const {
      rows: [cartWithItem],
    } = await client.query(
      `
    INSERT INTO shoppingcart (shopperid, itemid, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [shopperid, itemid, quantity]
    );

    return cartWithItem;
  } catch (error) {
    throw error;
  }
}

async function editShoppingCart(shopperid, itemid, quantity) {
  console.log("shopperid db", shopperid);
  console.log("item Id db", itemid);
  console.log("quantity db", quantity);
  try {
    const { rows: updateShoppingCart } = await client.query(
      `
        UPDATE shoppingcart
        SET quantity=$1
        WHERE shopperid=$2
        AND itemid=$3
        RETURNING *;
        `,
      [quantity, shopperid, itemid]
    );
    console.log("update cart", updateShoppingCart);
    return updateShoppingCart;
  } catch (error) {
    throw error;
  }
}

async function destroyItemFromShoppingCart(itemToDelete, shopperid) {
  try {
    console.log("shopper id", shopperid, itemToDelete);
    const result = await client.query(
      `
    DELETE FROM shoppingcart
    WHERE shopperid= $1 
    AND
    itemid = $2
    RETURNING *;
    `,
      [shopperid, itemToDelete]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createShoppingCart,
  getShoppingCartByShopperId,
  getShoppingCartByUsername,
  addToShoppingCart,
  editShoppingCart,
  destroyItemFromShoppingCart,
  getGuestShoppingCart,
};
