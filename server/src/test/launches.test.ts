import request from "supertest";
import app from "../app";
import { connectToMongoDB } from "../services/mongo";
import { planetsModelObject } from "../models/planets.model";

interface completeLaunchData {
  mission: string;
  rocket: string;
  target: string;
  launchDate: string;
}

interface launchDataWithoutDate {
  mission: string;
  rocket: string;
  target: string;
}

enum URL {
  VERSION = "/v1/launches",
}

describe("Launches API", () => {
  //Setup an mongdb environment onece for all test cases
  beforeAll(async () => {
    await connectToMongoDB();
    await planetsModelObject.loadPlanetsData();
    await planetsModelObject.getAllPlanets();
  });

  afterAll(async () => {
    // await disconnectMongoDB();
  });

  describe("GET (Request) /launches - fetch all launches", function () {
    test("It should respond with 200 success", async function () {
      await request(app)
        .get(URL.VERSION)
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST (Request) /launches - add new launch", function () {
    const launchObject_A: completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-S",
      target: "Kepler-62 f",
      launchDate: "January 25, 2030",
    };

    const launchObject_B: launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-S",
      target: "Kepler-62 f",
    };

    //Invalid Date Type
    const launchObject_C: completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-S",
      target: "Kepler-62 f",
      launchDate: "zoot",
    };

    test("It should respond with 201 created", async function () {
      await request(app)
        .post(URL.VERSION)
        .send(launchObject_A)
        .expect("Content-Type", /json/)
        .expect(201);
    });

    test("It should catch missing required properties", async function () {
      await request(app)
        .post(URL.VERSION)
        .send(launchObject_B)
        .expect("Content-Type", /json/)
        .expect(400);
    });

    test("It should catch invlaid dates", async () => {
      await request(app)
        .post(URL.VERSION)
        .send(launchObject_C)
        .expect("Content-Type", /json/)
        .expect(400);
    });
  });
});
