import express from "express";
import cors from "cors";
import planetsRouter from "./routes/planets/planets.router";

//Express Application - listen for incoming request
const app = express();

//Express chain of middleware functions handle incoming request

//Our node-api application's origin and client web application origin
//are different because thier port number is different. To allow for
//cross-origin request. (only Allow requests from the react app)
app.use(cors({ origin: "http://localhost:3000" }));

//Will parse any incoming JSON to JS object from the body of
//incoming request that could POST or PUT
app.use(express.json());

app.use(planetsRouter); //Handle planets routes for incoming request

export default app;
