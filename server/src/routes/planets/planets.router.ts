import express from "express";
import httpGetAllPlanets from "./planets.controller";

//Define all the related routes in planetsRouter & groups together
//all related route.
const planetsRouter = express.Router();

//Listen for GET request on route /planets and then execute
//this callback function without ()
planetsRouter.get("/planets", httpGetAllPlanets);

export default planetsRouter;
