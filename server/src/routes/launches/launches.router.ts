import express from "express";
import { httpGetAllLaunches, httpAddNewLaunch } from "./launches.controller";

const launchesRouter = express.Router();

launchesRouter.get("/launches", httpGetAllLaunches);

launchesRouter.post("/launches", httpAddNewLaunch);

export default launchesRouter;
