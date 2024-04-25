import { Router } from 'express';
import {queryDatabase, incrementFieldById } from "../db/dbUtils.js";

const router = Router();



router.get("/jobs", async (req, res) => {
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

  
router.patch("/jobs/apply-analytics/:id", async (req, res) => {
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

  export default router;
  