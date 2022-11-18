// import { UpdateWriteOpResult } from "mongoose";
import LaunchModel from "./launches.typegoose";
import planetModel from "./planets.typegoose";
import axios, { AxiosResponse } from "axios";

interface LaunchType {
  flightNumber?: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
  customers: string[];
  upcoming: boolean;
  success: boolean;
}

interface LaunchTypeArg {
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
}

async function existsLaunchWithId(launchId: number): Promise<boolean> {
  const launch = await LaunchModel.findOne({ flightNumber: launchId });
  //If launch doesn't exist with that id, then return false
  if (!launch) return false;
  return true;
}

async function abortLaunchById(launchId: number): Promise<boolean> {
  const abortedLaunch = await LaunchModel.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return abortedLaunch.modifiedCount === 1;
}

async function scheduleNewLaunch(
  launch: LaunchTypeArg
): Promise<LaunchTypeArg> {
  const newFlightNumber = (await getLastestFlightNumber()) + 1;
  const newLaunch: LaunchType = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["Zero to mastery", "Nasa"],
    flightNumber: newFlightNumber,
  };
  await saveLaunchToMongoDB(newLaunch);
  return newLaunch;
}

enum FLIGHT_NUMBER {
  DEFAULT = 100,
}

//Get lastest flight number that already exist in the launches collection
async function getLastestFlightNumber(): Promise<number> {
  //findOne will return the first document in the decending order (from top to botton)
  const lastestLaunch = await LaunchModel.findOne().sort("-flightNumber");
  if (!lastestLaunch) {
    //Default flight number start from 100
    return FLIGHT_NUMBER.DEFAULT;
  }
  //Return the lastest flight number from the launches collection
  return lastestLaunch.flightNumber;
}

async function saveLaunchToMongoDB(launch: LaunchType): Promise<void> {
  try {
    //Check if this launch target match one of the habitibal planets in the planets collection
    const planet = await planetModel.findOne({ kepler_name: launch.target });
    if (planet === null) throw new Error("Planet not found");
    await LaunchModel.updateOne(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    ).exec();
  } catch (error) {
    console.log(`Failed to save to the collection ${error}`);
  }
}

async function getAllLaunches(
  skip: number,
  limit: number
): Promise<LaunchType[] | unknown> {
  try {
    console.log(`skip: ${skip} limit: ${limit}`);
    return await LaunchModel.find({}, { _id: 0, __v: 0 })
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit);
  } catch (error: unknown) {
    console.log(`Failed to get all launches ${error}`);
    return error;
  }
}

enum SPACEX_API {
  URI = "https://api.spacexdata.com/v5/launches/query",
}

//Loading third-party api data (second parameter take request)
async function loadLaunchData(): Promise<void> {
  if (await firstLaunchAlreadyExistInDB()) {
    console.log("Launch Data Already loaded");
    return;
  }
  console.log("Downloading launch data...");
  try {
    //A POST request to SpaceX API
    const response = await axios.post(SPACEX_API.URI, {
      //Making a qury to get all launches objects
      query: {},
      options: {
        pagination: false,
        //populated with other documents that it reference to
        populate: [
          //select - what field you want to include in the response
          { path: "rocket", select: { name: 1 } },
          { path: "payloads", select: { customers: 1 } },
        ],
      },
    });
    if (response.status !== 200) {
      throw new Error("Launch data download failed");
    }

    createLaunchSpaceX(response);

    //Create launch from SpaceX API loaded data
  } catch (err) {
    const errorMsg: string = (err as Error).message;
    console.error(`Failed to load API. Reason: ${errorMsg}`);
  }
}

interface LaunchFilter {
  flightNumber?: number;
  mission?: string;
  rocket?: string;
}

async function findLaunch(filter: LaunchFilter): Promise<LaunchType | void> {
  try {
    const launch = (await LaunchModel.findOne(
      { ...filter },
      { _id: 0, __v: 0 }
    )) as LaunchType;
    return launch;
  } catch (error) {
    const errorMsg = (error as Error).message;
    console.log("Error found in findLaunch function: ", errorMsg);
  }
}

async function firstLaunchAlreadyExistInDB(): Promise<boolean> {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  console.log(firstLaunch);
  if (firstLaunch === null) {
    return false;
  }
  return true;
}

async function createLaunchSpaceX(response: AxiosResponse): Promise<void> {
  try {
    const launchDocs = await response.data.docs;
    for (const launchDoc of launchDocs) {
      const launch: LaunchType = {
        flightNumber: launchDoc.flight_number,
        mission: launchDoc.name,
        rocket: launchDoc.rocket.name,
        launchDate: launchDoc.date_local,
        upcoming: launchDoc.upcoming,
        success: launchDoc.success,
        customers: flattenToSingleList(launchDoc.payloads),
        target: "Kepler-1652 b",
      };
      console.log("To be save to DB: ", "\n", launch);

      await saveLaunchToMongoDB(launch);
    }
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.error("Error: ", errorMessage);
  }
}

//Get rid of nestest array and transform it into single array
function flattenToSingleList(payloads: []): string[] {
  const customers: string[] = payloads.flatMap((payload) => {
    return payload["customers"];
  });
  return customers;
}

export {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existsLaunchWithId,
  loadLaunchData,
};
