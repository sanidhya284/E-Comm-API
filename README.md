# E-Commerce API

This is a Node.js and Express-based RESTful API for a simple e-commerce platform. It includes core features like user management, product listings, cart functionality, orders, likes, and basic authentication.

## Features

* User Signup & Login (JWT-based)
* Product Management with Category & Reviews
* Cart Management (Add, Remove, View)
* Order Processing
* Like System for Products
* File Upload Support for Product Images
* Logging Middleware for API requests
* Modular and layered folder structure (Controller, Routes, Models, Middleware)

## Tech Stack

* Node.js
* Express
* MongoDB (with Mongoose)
* Swagger for API documentation

## Installation & Running the Server

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/E-Comm-API.git
   cd E-Comm-API
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Make sure MongoDB is running locally:

   ```bash
   mongod --dbpath /path/to/your/mongo/data
   ```

4. Start the server:

   ```bash
   nodemon server.js
   # or
   node server.js
   ```

5. The server will run at:
   `http://localhost:4200`

## API Documentation

The full documentation is hosted on Hashnode:
[View API Docs →](https://e-comm-api.hashnode.space/default-guide/v1.0?t=1752301161987)

