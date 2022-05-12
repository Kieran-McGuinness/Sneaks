const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

const {
  client,
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
} = require("./");

const { createAdmin } = require("./admin");

const {
  createItems,
  editItems,
  deleteItems,
  getAllItems,
  getItemById,
  getItemByName,
} = require("./items");

const {
  createShoppingCart,
  getShoppingCartByShopperId,
  getShoppingCartByUsername,
  editShoppingCart,
} = require("./shoppingCart");
const { createMainCategory } = require("./mainCategories");
const { addSubCategoryToMain } = require("./main_SubCategories");
const { createSubCategory, createSubCategoryItem } = require("./subCategories");

const { createPastOrder, getOrderByID } = require("./pastOrders");

async function buildTables() {
  try {
    //client.connect();
    // drop tables in correct order
    client.query(`
    DROP TABLE IF EXISTS wishcart;
    DROP TABLE IF EXISTS shoppingCart;
    DROP TABLE IF EXISTS past_orders CASCADE;
    DROP TABLE IF EXISTS mainitems;
    DROP TABLE IF EXISTS subitems;
    DROP TABLE IF EXISTS main_sub;
    DROP TABLE IF EXISTS maincategories;
    DROP TABLE IF EXISTS subcategories;
    DROP TABLE IF EXISTS items CASCADE;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS admins;
    `);

    // build tables in correct order

    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE admins(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      isadmin BOOLEAN NOT NULL DEFAULT true
    );
    CREATE TABLE items(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      price INTEGER NOT NULL,
      description TEXT NOT NULL,
      stock INTEGER,
      image TEXT DEFAULT 'http://placeimg.com/250/250/any?'
    );
    CREATE TABLE subcategories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE maincategories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL

    );
    CREATE TABLE main_sub(
      id SERIAL PRIMARY KEY,
      mainid INTEGER REFERENCES maincategories(id),
      subcatsid INTEGER REFERENCES subcategories(id),
      UNIQUE (mainid, subcatsid)
    );
    CREATE TABLE mainitems(
      id SERIAL PRIMARY KEY,
      maincategoryid INTEGER REFERENCES maincategories(id),
      itemid INTEGER REFERENCES items(id)
    );
    CREATE TABLE subitems(
      id SERIAL PRIMARY KEY,
      subcategoryid INTEGER REFERENCES subcategories(id),
      itemid INTEGER REFERENCES items(id),
      UNIQUE (itemid)
    );
    CREATE TABLE past_orders(
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL,
      item_name VARCHAR(255) NOT NULL REFERENCES items(name),
      item_id INTEGER NOT NULL REFERENCES items(id),
      payment_type TEXT NOT NULL,
      quantity INTEGER,
      order_date DATE NOT NULL DEFAULT LOCALTIMESTAMP
    );
    CREATE TABLE shoppingcart(
      id SERIAL PRIMARY KEY,
      shopperid INTEGER REFERENCES users(id),
      itemid INTEGER REFERENCES items(id),
      quantity INTEGER,
      UNIQUE (shopperid, itemid)
    );
    CREATE TABLE wishcart(
      id SERIAL PRIMARY KEY, 
      shopperid INTEGER REFERENCES users(id),
      itemid INTEGER REFERENCES items(id),
      quantity INTEGER,
      UNIQUE (shopperid, itemid)
    );

  `);
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    const categoriesToCreate = [
      { name: "Nike" },
      { name: "Balenciaga" },
      { name: "Louis Vuitton" },
    ];
    const subcategoriesToCreate = [
      { name: "Nike" },
    { name: "Balenciaga" },
    { name: "Louis Vuitton" },
    { name: "Adidas" },
    { name: "Jordan" }];
    const subcategoriesToAttach = [
      { mainid: 1, mainname: "Electronics", subcatsid: 1, subcatsname: "TVs" },
      {
        mainid: 1,
        mainname: "Electronics",
        subcatsid: 2,
        subcatsname: "Computers",
      },
    ];
    const subItems = [
      { subcategoryid: 1, itemid: 1 },
      { subcategoryid: 2, itemid: 2 },
    ];
    const maincategories = await Promise.all(
      categoriesToCreate.map(createMainCategory)
    );
    const subcategories = await Promise.all(
      subcategoriesToCreate.map(createSubCategory)
    );
    const attachsubcategories = await Promise.all(
      subcategoriesToAttach.map(addSubCategoryToMain)
    );
    console.log(attachsubcategories);
    //phones
    const createItem1 = await createItems({
      name: "Jordan Retro",
      price: 545,
      description: "Jordan 1 Retro High Dark Mocha High Top Sneakers",
      stock: 15,
      image: "/imgs/1.jpg"
    });
    const createItem2 = await createItems({
      name: "Louis Vuitton",
      price: 500,
      description: "Louis Vuitton Low Top Sneakers",
      stock: 6,
      image: "/imgs/2.jpg"
    });
    const createItem3 = await createItems({
      name: "Jordan",
      price: 1100,
      description: "Limited edition kicks",
      stock: 10,
      image: "/imgs/3.jpg"
    });
    const createItem4 = await createItems({
      name: "Louis Vuitton 2019",
      price: 1250,
      description:
        "Spring 2019 Collection",
      stock: 9,
      image: "imgs/4.jpg"
    });

    //Luggage
    const createItem5 = await createItems({
      name: "Off-White c/o Virgil Abloh",
      price: 377,
      description: "Off-White c/o Virgil Abloh ODSY-1000 Low Top Sneakers",
      stock: 11,
      image: "/imgs/5.jpg"
    });
    const createItem6 = await createItems({
      name: "Yeezy x adidas",
      price: 410,
      description: "Yeezy x adidas Boost 350 V2 Clay Low Top Sneakers",
      stock: 16,
      image: "/imgs/6.jpg"
    });
    const createItem7 = await createItems({
      name: "Balenciaga",
      price: 690,
      description: "Balenciaga Speed Trainer 2.0 S High Top Sock Sneakers",
      stock: 20,
      image: "/imgs/7.jpg"
    });
    const createItem8 = await createItems({
      name: "Yeezy x adidas V2",
      price: 650,
      description: "Yeezy x adidas Boost 350 V2 Cream Low Top Sneakers",
      stock: 31,
      image: "/imgs/8.jpg"
    });

    //Shoes
    const createItem9 = await createItems({
      name: "Balenciaga Armour",
      price: 8,
      description: "Running Shoe",
      stock: 55,
      image: "/imgs/9.jpg"
    });
    const createItem10 = await createItems({
      name: "Jordan X A Ma",
      price: 499,
      description: "Jordan x A Ma Maniére 1 Retro High OG High Top Athletic Sneakers",
      stock: 60,
      image: "/imgs/10.jpg"
    });
    const createItem11 = await createItems({
      name: "Nike Air Max 270",
      price: 770,
      description: "Air Max 270 React Travis Scott Cactus Trails Athletic Sneakers w/ Tags",
      stock: 80,
      image: "/imgs/11.jpg"
    });
    const createItem12 = await createItems({
      name: "Nike",
      price: 320,
      description: "Men's Stroke Running Shoe",
      stock: 70,
      image: "/imgs/12.jpg"
    });

    //Movies
    const createItem13 = await createItems({
      name: "Off-White x Nike",
      price: 105,
      description: "Off-White x Nike Air Force 1 Volt Low Top Sneakers ",
      stock: 20,
      image: "/imgs/13.jpg"
    });
    const createItem14 = await createItems({
      name: "Balenciaga High",
      price: 30,
      description: "Spring Collection Knit Top",
      stock: 50,
      image: "/imgs/14.jpg"
    });
    const createItem15 = await createItems({
      name: "Balenciaga Black",
      price: 16,
      description: "Balenciaga Speed Trainer High Top Sock Sneakers",
      stock: 31,
      image: "/imgs/15.jpg"
    });
    const createItem16 = await createItems({
      name: "Jordan Doern",
      price: 240,
      description: "4 Retro Doernbecher Sneakers",
      stock: 10,
      image: "/imgs/16.jpg"
    });


    const newShoesToCreate = [
      {
        name: "Nike Brown",
        price: 1200,
        description: "Nike legendary brown sneakers",
        stock: 50,
        image: "/imgs/17.jpg"
      },
      {
        name: "Nike OG White",
        price: 324,
        description: "White nikes from 2000 collection",
        stock: 50,
        image: "/imgs/18.jpg"
      },
      {
        name: "Balenciaga High Sole",
        price: 345,
        description: "Balenciaga Triple High sole sneakers",
        stock: 50,
        image: "/imgs/19.jpg"
      },{
        name: "Balenciaga Triple Deluxe",
        price: 1400,
        description: "The deluxe Balenciaga sneaker",
        stock: 50,
        image: "/imgs/20.jpg"
      },{
        name: "Adidas Classic",
        price: 400,
        description: "1991 Adidas Classic, Mint",
        stock: 50,
        image: "/imgs/21.jpg"
      },
      {
        name: "Balenciaga Mountain",
        price: 243,
        description: "Balenciaga Hiker Sneakers",
        stock: 50,
        image: "/imgs/22.jpg"
      },
      {
        name: "Balenciaga SPLY",
        price: 1400,
        description: "Special limited Youth sneakers",
        stock: 50,
        image: "/imgs/23.jpg"
      },
      {
        name: "Balencsiaga Classic",
        price: 220,
        description: "Rough worn black balenciagas",
        stock: 50,
        image: "/imgs/24.jpg"
      },
      {
        name: "Nike Dark",
        price: 243,
        description: "2019 dark blue Nike",
        stock: 50,
        image: "/imgs/25.jpg"
      },
      {
        name: "Nike ZAP",
        price: 400,
        description: "White and neon nikes",
        stock: 50,
        image: "/imgs/26.jpg"
      },
      {
        name: "Nike Classic Double",
        price: 600,
        description: "Nike air force double triple",
        stock: 50,
        image: "/imgs/27.jpg"
      },
      {
        name: "Balenciaga High Top",
        price: 800,
        description: "Balenciaga Triple S 2.0 Low Top Athletic Sneakers",
        stock: 50,
        image: "/imgs/28.jpg"
      },
      {
        name: "Nike Glows",
        price: 700,
        description: "Orange Neon Nike Originals",
        stock: 50,
        image: "/imgs/29.jpg"
      },
      {
        name: "Balenciaga Leather",
        price: 140,
        description: "Balenciaga leather mens sneakers",
        stock: 50,
        image: "/imgs/30.jpg"
      },
    ];
 await Promise.all(
      newShoesToCreate.map(createItems)
    );

    const subToItems = [
      { subcategoryid: 1, itemid: 11 },
      { subcategoryid: 1, itemid: 12 },
      { subcategoryid: 1, itemid: 13 },
      { subcategoryid: 1, itemid: 17 },
      { subcategoryid: 1, itemid: 18 },
      { subcategoryid: 1, itemid: 25 },
      { subcategoryid: 1, itemid: 26 },
      { subcategoryid: 1, itemid: 27 },
      { subcategoryid: 1, itemid: 29 },
      { subcategoryid: 2, itemid: 7 },
      { subcategoryid: 2, itemid:14 },
      { subcategoryid: 2, itemid: 15 },
      { subcategoryid: 2, itemid: 19 },
      { subcategoryid: 2, itemid: 20 },
      { subcategoryid: 2, itemid: 22 },
      { subcategoryid: 2, itemid: 23 },
      { subcategoryid: 2, itemid: 24 },
      { subcategoryid: 2, itemid: 28 },
      { subcategoryid: 2, itemid: 30 },
      { subcategoryid: 3, itemid: 2 },
      { subcategoryid: 3, itemid: 4 },
      { subcategoryid: 3, itemid: 5 },
      { subcategoryid: 4, itemid: 6 },
      { subcategoryid: 4, itemid: 8 },
      { subcategoryid: 4, itemid: 21 },
      { subcategoryid: 5, itemid: 1 },
      { subcategoryid: 5, itemid: 3 },
      { subcategoryid: 5, itemid: 10 },
      { subcategoryid: 5, itemid: 16 }
    ];

    await Promise.all(
     subToItems.map(createSubCategoryItem)
    );

    // const deleteItem1 = await deleteItems(15);
    // const getAllItems1 = await getAllItems();
    // const getItemById1 = await getItemById(16);
    // const getItemByName1 = await getItemByName("Nike");

    console.log("create Item 1", createItem1);
    console.log("create Item 2", createItem2);
    console.log("create Item 3", createItem3);
    console.log("create Item 4", createItem4);

    console.log("create Item 5", createItem5);
    console.log("create Item 6", createItem6);
    console.log("create Item 7", createItem7);
    console.log("create Item 8", createItem8);

    console.log("create Item 9", createItem9);
    console.log("create Item 10", createItem10);
    console.log("create Item 11", createItem11);
    console.log("create Item 12", createItem12);

    console.log("create Item 13", createItem13);
    console.log("create Item 14", createItem14);
    console.log("create Item 15", createItem15);
    console.log("create Item 16", createItem16);
    console.log("update item", editItem1);
    console.log("delete item", deleteItem1);
    console.log("get all items", getAllItems1);
    console.log("get item by id", getItemById1);
    console.log("get item by name", getItemByName1);

    //Shopping Cart

    //  const createCart = await createShoppingCart(1)
    // const shoppingCartWithItems = await getShoppingCartByShopperId(1)
    // const shoppingCartwithItems1 = await getShoppingCartByUsername({username: "albert"})
    // const updateShoppingCart = await editShoppingCart(1, 1, 5)

    // console.log("Creating Shopping Cart", createCart)
    // console.log("Shopping cart with items", shoppingCartWithItems)
    // console.log("Shopping Cart by Username", shoppingCartwithItems1)
    // console.log("Update Shopping Cart", updateShoppingCart)

    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99" },
      { username: "sandra", password: "sandra123" },
      { username: "glamgal", password: "glamgal123" },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function testUsersTable() {
  console.log("Starting to test users...");
  try {
    let userCredentials = { username: "albert", password: "bertie99" };
    const verifiedUser = await getUser(userCredentials);
    console.log(verifiedUser);

    userCredentials = { username: "billybob", password: "bobbybadboy" };
    let newUser = await createUser(userCredentials);
    console.log(newUser);

    newUser = await getUserById(verifiedUser.id);
    console.log(newUser);

    newUser = await getUserByUsername(verifiedUser.username);
    console.log(newUser);

    let allUsers = await getAllUsers();
    console.log(allUsers);

    console.log("Finished testing users!");
  } catch (error) {
    console.error("Error testing users!");
    throw error;
  }
}

async function createInitialAdmins() {
  console.log("Starting to create admins...");
  try {
    const adminToCreate = [
      { username: "devin", password: "devin" },
      { username: "mayank", password: "mayank" },
      { username: "kieran", password: "kieran" },
    ];
    const admin = await Promise.all(adminToCreate.map(createAdmin));

    console.log(admin);
    console.log("Finished creating admins!");
  } catch (error) {
    console.error("Error creating admins!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await buildTables().then(populateInitialData).catch(console.error);
    await createInitialUsers();
    await testUsersTable();
    await createInitialAdmins();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());
