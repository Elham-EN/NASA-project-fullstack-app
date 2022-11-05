//Server functionality
import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { planetsModel } from "./models/planets.model";

const MONGO_URL =
  "mongodb+srv://nasa-api:BuXGXjtgCh5flRzj@nasacluster.5y3qujg.mongodb.net/nasa?retryWrites=true&w=majority";

const PORT = process.env.PORT || 8000;

//Take express application request listener function as an argument, which
//responds to all incoming requests to our server. The benefit of this is
//that we can organize our code a bit more by separating the server
//functionailty here from our express code.
//Any middleware and route handlers that is attached to the express app
//object will respond to request coming in to our server.
const server = http.createServer(app);

//connection emits event when connection is ready or when there is error
mongoose.connection.once("open", () => {
  console.log("MonggoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

//Use this function when we need to load some data or perform some actions
//before our server actually starts responding to the usery

async function startServer() {
  await mongoose.connect(MONGO_URL);
  //To make sure the planets data is available for any request that ever
  //comes into our server. Populate planets data before listening for request
  await planetsModel.loadPlanetsData();
  //Listening on Port 8000. Listening for a request from the client
  server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

startServer();
