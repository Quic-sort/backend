require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { queryDatabase, incrementFieldById } = require("./db/dbUtils");
const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/discover", async (req, res) => {
  const searchTerm = req.query.q;

  if (searchTerm) {
    const searchTermsArray = searchTerm.toLowerCase().split(" ");

    let sqlQuery = "SELECT * FROM job_database WHERE ";
    searchTermsArray.forEach((term, index) => {
      if (index !== 0) sqlQuery += " OR ";
      sqlQuery += "LOWER(title) LIKE ?";
    });

    try {
      const resultData = await queryDatabase(
        sqlQuery,
        searchTermsArray.map((term) => `%${term}%`)
      );
      return res.send(resultData);
    } catch (err) {
      return res.status(500).send("Error retrieving data from the database");
    }
  } else {
    const sqlQuery = "SELECT * FROM job_database";

    try {
      const resultData = await queryDatabase(sqlQuery);
      return res.send(resultData);
    } catch (err) {
      return res.status(500).send("Error retrieving data from the database");
    }
  }
});

app.post("/jobs/apply-analytics/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await incrementFieldById("job_database", id);
    if (result.affectedRows === 0) {
      res.status(404).send({ message: "No entry found with the specified ID" });
    } else {
      res.send({ message: "Field incremented successfully", result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.post("/posts/apply-analytics/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await incrementFieldById("post_database", id);
    if (result.affectedRows === 0) {
      res.status(404).send({ message: "No entry found with the specified ID" });
    } else {
      res.send({ message: "Field incremented successfully", result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.get("/posts", async (req, res) => {
  const searchTerm = req.query.q;

  if (searchTerm) {
    const searchTermsArray = searchTerm.toLowerCase().split(" ");

    let sqlQuery = "SELECT * FROM post_database WHERE ";
    searchTermsArray.forEach((term, index) => {
      if (index !== 0) sqlQuery += " OR ";
      sqlQuery += "LOWER(title) LIKE ?";
    });
    try {
      const resultData = await queryDatabase(
        sqlQuery,
        searchTermsArray.map((term) => `%${term}%`)
      );
      res.send(resultData);
    } catch (err) {
      return res.status(500).send("Error retrieving data from the database");
    }
  } else {
    const sqlQuery = "SELECT * FROM post_database";

    try {
      const resultData = await queryDatabase(sqlQuery);
      res.send(resultData);
    } catch (err) {
      return res.status(500).send("Error retrieving data from the database");
    }
  }
});

app.listen(port, () => {
  console.log("Server is running ");
});
