import express from "express";
import {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} from "./launches.controller";

const launchesRouter = express.Router();

launchesRouter.get("/launches", httpGetAllLaunches);

launchesRouter.post("/launches", httpAddNewLaunch);

//Pass parameter ':id' for dynamic
launchesRouter.delete("/launches/:id", httpAbortLaunch);

export default launchesRouter;
