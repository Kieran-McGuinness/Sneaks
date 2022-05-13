# Sneaks a Full Stack E-Commerce Web Application
Deployed: https://my-web-app-sneaks.herokuapp.com/


We created "Sneaks" as a website where people can come to purchase rare and hard to find sneakers. As a group we focused on creating a clean, user friendly experience where customers could quickly and seamlessly find the sneakers of their dreams and get them delivereed to their door with as few clicks as possible.

We tried to focus on creating a clean and easily accessible UI. For this we used React JS, and Material UI for our frontend, and Stripe for payment processing. For our server and api we used Node JS and Express. Finally, for our database we used PostgresSQL. To allow unregistered users to shop we utlized browser localStorage so save a guests shopping cart between visits.


Our Application features
- an Express web server,
- a PostgreSQL database instance,
- and a React front-end


## Project Structure

```bash
├── .github/workflows
│   └── heroku-deploy.yaml
│  
├── api
│   ├── admin.js
│   ├── apiRouter.test.js
│   ├── index.js
|   ├── items.js
|   ├── main_sub.js
│   ├── maincategories.js
│   ├── pastOrders.js
│   ├── shopping_cart.js
│   ├── subCategories.js
│   ├── user.js
│   └── utils.js
│
├── db
│   ├── models
│   │   ├── index.js
│   │   └── user.js
│   ├── admin.js
│   ├── client.js
│   ├── index.js
│   ├── init_db.js
│   ├── items.js
│   ├── mainCategories.js
│   ├── main_SubCategories.js
│   ├── pastOrders.js
│   ├── shoppingCart.js
│   ├── subCategories.js
│   └── users.js
│
├── public
│   ├── imgs
│   │   └── various imgs
│   └── index.html
│
├── src
│   ├── api
│   │   └── index.js
│   ├── components
│   │   ├── Admin-Items.jsx
│   │   ├── Admin-Categories.jsx
│   │   ├── Admin--login.jsx
│   │   ├── Admin-register.jsx
│   │   ├── App.jsx
│   │   ├── Checkout.jsx
│   │   ├── Footer.jsx
│   │   ├── Individual-Items.jsx
│   │   ├── Items.jsx
│   │   ├── Login.jsx
│   │   ├── Navigation.jsx
│   │   ├── PastOrders.jsx
│   │   ├── Register.jsx
│   │   ├── ShoppingCart.jsx
│   │   └── index.jsx
│   ├── style
│   │   ├── App.css
│   │   └── index.css
│   └── index.js
│
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md
```


