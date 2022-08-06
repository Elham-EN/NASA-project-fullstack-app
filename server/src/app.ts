import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import fs from "fs";
import planetsRouter from "./routes/planets/planets.router";
import launchesRouter from "./routes/launches/launches.router";

//Express Application - listen for incoming request
const app = express();

// create a write stream (in append mode) (write logs to a file)
const logPath = path.join(__dirname, "..", "access.log");
const accessLogStream = fs.createWriteStream(logPath, { flags: "a" });

//Express chain of middleware functions handle incoming request

//Our node-api application's origin and client web application origin
//are different because thier port number is different. To allow for
//cross-origin request. (only Allow requests from the react app)
app.use(cors({ origin: "http://localhost:3000" }));

//HTTP request logger middleware. Log incoming request
app.use(morgan("combined", { stream: accessLogStream }));

//Will parse any incoming JSON to JS object from the body of
//incoming request that could POST or PUT
app.use(express.json());

//To serve static file such as images, css and javascript from incoming
//request. Specify the root directory from which to serve static assets
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(planetsRouter); //Handle planets routes for incoming request
app.use(launchesRouter); //Handle launches routes for incoming request

//To serve index.html from slash route so that the user doesn't need to
//specify that they want to load index.html. So that first page load
//correspond to the launch page. The * match every route that does not
//exist in the above routers or in static middleware
app.get("/*", (req, res) => {
  console.log(req.path, req.method, "hello");
  //It passes on to frontend react application to handle the routing
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
