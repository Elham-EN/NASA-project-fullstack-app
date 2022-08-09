import {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} from "../../models/launches.model";
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
  if (!isReqBodyValid(laucnhData)) {
    return res.status(400).json({
      error:
        "Invalid Launch data, You have either provided invalid" +
        " input or have not provided required input",
    });
  }
  const newLaunch = addNewLaunch(laucnhData);
  //Send a JSON response, convert object to JSON type
  return res.status(201).json(newLaunch);
}

export function httpAbortLaunch(req: Request, res: Response): Response {
  const launchId = Number(req.params.id);
  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

function isReqBodyValid(laucnhData: CreateLaunchDto): boolean {
  let isValid = false;
  const { mission, rocket, target, launchDate } = laucnhData;
  //Null check and Type Guard
  if (mission && typeof mission === "string") {
    isValid = true;
  }
  if (rocket && typeof rocket === "string") {
    isValid = true;
  }
  if (target && typeof target === "string") {
    isValid = true;
  }
  //Invalid Date error is throw if it is not Date object
  //and also throw error if is null and check for valid format
  if (launchDate.toString() === "Invalid Date") {
    isValid = false;
  }
  return isValid;
}
