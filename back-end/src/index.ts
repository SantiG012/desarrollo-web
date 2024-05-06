import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import wordRoutes from "./routes/word.routes";
import categoryRoutes from "./routes/category.routes";
import wordsByCategoryRoutes from "./routes/words-by-category.routes";
import playRoomRoutes from "./routes/play-room.routes";
import ErrorHandler from "./middleware/error-handler";
const cors = require('cors');

// configures dotenv to work in your application
dotenv.config();
const PORT = process.env.PORT;
const app = express();
const wsInstance = require('express-ws')(app);
const webSocketRouter = require('./routes/socket.routes')(wsInstance);


app.use(cors());
app.use(express.json());
app.use(ErrorHandler);
app.use("/ws",webSocketRouter);
app.use("/api/v1/words", wordRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/words-by-category", wordsByCategoryRoutes);
app.use("/api/v1/play-rooms", playRoomRoutes);
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