import planetsRouter from "./planets/planets.router";
import launchesRouter from "./launches/launches.router";
import express from "express";

const api = express.Router();

api.use("/planets", planetsRouter); //Handle planets routes for incoming request
api.use("/launches", launchesRouter); //Handle launches routes for incoming request

//Export api for version 1.0
export default api;
