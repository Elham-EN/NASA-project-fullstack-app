import { getAllLaunches, addNewLaunch } from "../../models/launches.model";

import { Request, Response } from "express";

//Data transfer object. It's an object that the client sends to the server
interface CreateLaunchDto {
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
}

export function httpGetAllLaunches(_req: Request, res: Response): Response {
  return res
    .setHeader("Content-Type", "application/json")
    .status(200)
    .send(getAllLaunches());
}

export function httpAddNewLaunch(req: Request, res: Response): Response {
  const laucnhData = req.body as CreateLaunchDto;
  //A string contain a formatted date and now it will be a date object
  laucnhData.launchDate = new Date(laucnhData.launchDate);
  addNewLaunch(laucnhData);
  //Send a JSON response, convert object to JSON type
  return res.status(201).json(laucnhData);
}
