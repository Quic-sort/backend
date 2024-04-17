require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Create a connection to the MySQL database

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");

});


app.get("/discover", (req, res) => {
  try {

    const searchTerm = req.query.q;

    if( searchTerm){
      const searchTermsArray = searchTerm.toLowerCase().split(" ");

      // Construct the SQL query dynamically to match any word in the job title
      let sqlQuery = "SELECT * FROM job_database WHERE ";
      searchTermsArray.forEach((term, index) => {
        if (index !== 0) sqlQuery += " OR "; // Add OR operator between terms after the first term
        sqlQuery += "LOWER(title) LIKE ?";
      });

      // Execute the query
      connection.query(sqlQuery, searchTermsArray.map(term => `%${term}%`),(err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error retrieving data from the database");
          return;
        }
        // console.log(data);
        resultData = data;
        res.send(resultData);
      });
    }else{
      const sqlQuery = "SELECT * FROM job_database";
      var resultData =[];
      // Execute the query
      connection.query(sqlQuery, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error retrieving data from the database");
          return;
        }
        // console.log(data);
        resultData = data;
        res.send(resultData);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});




// Close the database connection when the application exits
process.on("exit", () => {
  connection.end();
});

app.listen(5000, () => {
  console.log("Server is running ");
});
