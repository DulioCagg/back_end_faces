const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const knex = require("knex");

const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Server working");
})

app.post("/signin", (req, res) => { signIn.handleSignin(req, res, db, bcrypt) });

app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get("/profile/:id", (req, res) => { profile.getProfile(req, res, db) });

app.put("/image", (req, res) => { image.handleImage(req, res, db) })
app.post("/imageurl", (req, res) => { image.handleApiRequest(req, res) })

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => console.log(`Server started in port ${PORT}`));