import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Hello World");
}); 


AppDataSource.initialize()
  .then(async () => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));