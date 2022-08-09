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

// Submit given launch data to launch system. (POST request)
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
