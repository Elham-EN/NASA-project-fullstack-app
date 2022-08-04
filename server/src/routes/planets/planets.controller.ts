/**
 * Controller takes in actions and requests from the user and
 * work with them to update the model
 *
 * Business Logic will be the controllers that respond to HTTP request
 *
 * Controller - defines how we respond to that specific route
 */

import { Request, Response } from "express";
import { planetsModel } from "../../models/planets.model";

//Send json data to the client who made that GET request on
//route '/planets'
function httpGetAllPlanets(req: Request, res: Response): Response {
  console.log(req.method, req.path, "httpGetAllPlanets");
  return res
    .setHeader("Content-Type", "application/json")
    .status(200)
    .send(planetsModel.getAllPlanets());
}

export default httpGetAllPlanets;
