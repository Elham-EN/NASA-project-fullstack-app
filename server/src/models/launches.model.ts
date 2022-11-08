// import { UpdateWriteOpResult } from "mongoose";
import LaunchModel from "./launches.typegoose";
import planetModel from "./planets.typegoose";

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

async function scheduleNewLaunch(launch: LaunchTypeArg): Promise<void> {
  const newFlightNumber = (await getLastestFlightNumber()) + 1;
  const newLaunch: LaunchType = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["Zero to mastery", "Nasa"],
    flightNumber: newFlightNumber,
  };
  await saveLaunchToMongoDB(newLaunch);
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

async function getAllLaunches(): Promise<LaunchType[] | unknown> {
  try {
    return await LaunchModel.find({}, { _id: 0, __v: 0 });
  } catch (error: unknown) {
    console.log(`Failed to get all launches ${error}`);
    return error;
  }
}

export {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  existsLaunchWithId,
};

//Keep track of flightNumber
// let latestFlightNumber = 100;

//an object of Launch Type
// const launch: LaunchType = {
//   flightNumber: 100,
//   mission: "Kepler Exploration Soran",
//   rocket: "Saturn IS2",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };

// saveLaunchToMongoDB(launch);

// export function addNewLaunch(launchPostData: LaunchType): LaunchType {
//   latestFlightNumber++;
//   const newLaunch: LaunchType = {
//     ...launchPostData,
//     //Add addtional properties
//     flightNumber: latestFlightNumber,
//     // customers: ["ZTM", "NASA"],
//     upcoming: true,
//     success: true,
//   };
//   launches.set(latestFlightNumber, newLaunch);
//   return newLaunch;
// }

// if (launch?.flightNumber) launches.set(launch.flightNumber, launch);
//console.log(launches.values());
//console.log(Array.from(launches.values()));

//Data Access function
// export function getAllLaunches(): LaunchType[] {
//convert Map to Array. Each value contain launch object. To send it
//back to client as JSON we need to transform it into JS notation
//   return Array.from(launches.values());
// }

// //Map object holds key-value pairs where values of any type can
// //be used as either keys or values
// const launches: Map<number | undefined, LaunchType> = new Map();

// export function existsLaunchWithId(launchId: number): boolean {
//   return launches.has(launchId);
// }

// export function abortLaunchById(launchId: number): LaunchType | undefined {
//   //launches.delete(launchId);
//   const aborted = launches.get(launchId);
//   aborted?.upcoming ? (aborted.upcoming = false) : true;
//   aborted?.success ? (aborted.success = false) : true;
//   return aborted;
// }
