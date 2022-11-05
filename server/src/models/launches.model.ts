// import launches from "./launches.mongo";

interface LaunchType {
  flightNumber?: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
  customers?: string[];
  upcoming?: boolean;
  success?: boolean;
}

//Keep track of flightNumber
let latestFlightNumber = 100;

//Map object holds key-value pairs where values of any type can
//be used as either keys or values
const launches: Map<number | undefined, LaunchType> = new Map();

//an object of Launch Type
const launch: LaunchType = {
  flightNumber: 100,
  mission: "Kepler Exploration Soran",
  rocket: "Saturn IS2",
  launchDate: new Date("December 27, 2030"),
  target: "kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

if (launch?.flightNumber) launches.set(launch.flightNumber, launch);
//console.log(launches.values());
//console.log(Array.from(launches.values()));

//Data Access function
export function getAllLaunches(): LaunchType[] {
  //convert Map to Array. Each value contain launch object. To send it
  //back to client as JSON we need to transform it into JS notation
  return Array.from(launches.values());
}

export function addNewLaunch(launchPostData: LaunchType): LaunchType {
  latestFlightNumber++;
  const newLaunch: LaunchType = {
    ...launchPostData,
    //Add addtional properties
    flightNumber: latestFlightNumber,
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
  };
  launches.set(latestFlightNumber, newLaunch);
  return newLaunch;
}

export function existsLaunchWithId(launchId: number): boolean {
  return launches.has(launchId);
}

export function abortLaunchById(launchId: number): LaunchType | undefined {
  //launches.delete(launchId);
  const aborted = launches.get(launchId);
  aborted?.upcoming ? (aborted.upcoming = false) : true;
  aborted?.success ? (aborted.success = false) : true;
  return aborted;
}
