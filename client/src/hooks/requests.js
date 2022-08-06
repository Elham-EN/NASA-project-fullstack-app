const API_URL = "http://localhost:8000";

// Load planets and return as JSON.
async function httpGetPlanets() {
  //Make a GET request
  const response = await fetch(`${API_URL}/planets`);
  //Return javascript object notation: object or array
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  //The server API is returning a JSON and the client is receving
  //that JSON data and it is parsing into a javascript object
  const fetchedLaunches = await response.json();
  //sorted in ascending order
  const sortedLaunches = fetchedLaunches.sort(
    (a, b) => a.flightNumber - b.flightNumber
  );
  return sortedLaunches;
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
