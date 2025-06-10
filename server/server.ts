import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import * as Middlewares from "./src/middlewares";
import * as Routers from "./src/routers";
import * as Constants from "./src/globals/constants";

const app = express();
dotenv.config();

// Middlewares
app
  .use(cors())
  .use(helmet())
  .use(morgan("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

// Routers
app.use(`${Constants.System.ROOT}/`, Routers.Health);
app.use(`${Constants.System.ROOT}/auth`, Routers.Auth);
app.use(`${Constants.System.ROOT}/destination`, Routers.Destination);
app.use(`${Constants.System.ROOT}/media`, Routers.Media);
app.use(`${Constants.System.ROOT}/hoarding`, Routers.Hoarding);
app.use(`${Constants.System.ROOT}/trip`, Routers.AITrip);
app.use(`${Constants.System.ROOT}/faq`, Routers.Faq);
app.use(`${Constants.System.ROOT}/review`, Routers.Review);


// Error Handlers
app.use(Middlewares.Error.errorHandler);

app.listen(Constants.System.PORT, () => {
  console.log(`Server started on port ${Constants.System.PORT}`);
});
