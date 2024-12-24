const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const config = require("./config/connection");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Connection to the database
const con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.db,
  port: config.port,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MYSQL Database!");
});

app.get("/", (req, res) => {
  res.send("Hello, Express Backend!");
});

// Route
require("./routes/user")(app, con);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
