//Server functionality
import http from "http";
// loads environment variables from a .env file into process.env
import * as dotenv from "dotenv";
//Must call this function above all local imports
dotenv.config();
import { connectToMongoDB } from "./services/mongo";
import app from "./app";
import { planetsModelObject } from "./models/planets.model";
import { loadLaunchData } from "./models/launches.model";

const PORT = process.env.PORT || 8000;

//Take express application request listener function as an argument, which
//responds to all incoming requests to our server. The benefit of this is
//that we can organize our code a bit more by separating the server
//functionailty here from our express code.
//Any middleware and route handlers that is attached to the express app
//object will respond to request coming in to our server.
const server = http.createServer(app);

//Use this function when we need to load some data or perform some actions
//before our server actually starts responding to the user
async function startServer() {
  await connectToMongoDB();
  //To make sure the planets data is available for any request that ever
  //comes into our server. Populate planets data before listening for request
  await planetsModelObject.loadPlanetsData();
  await loadLaunchData();
  //Listening on Port 8000. Listening for a request from the client
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

startServer();
