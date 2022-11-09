import request from "supertest";
import app from "../app";
import { connectToMongoDB, disconnectMongoDB } from "../services/mongo";
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

describe("Launches API", () => {
  //Setup an mongdb environment onece for all test cases
  beforeAll(async () => {
    await planetsModelObject.loadPlanetsData();
    await connectToMongoDB();
  });

  afterAll(async () => {
    await disconnectMongoDB();
  });

  describe("GET (Request) /launches - fetch all launches", function () {
    test("It should respond with 200 success", async function () {
      await request(app)
        .get("/launches")
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
        .post("/launches")
        .send(launchObject_A)
        .expect("Content-Type", /json/)
        .expect(201);

      // const requestDate = new Date(launchObject_A.launchDate).valueOf();
      // console.log(requestDate);
      // const responseLaunchBody = response.body as completeLaunchData;
      // const responseDate = new Date(responseLaunchBody.launchDate).valueOf();
      // expect(responseDate).toBe(requestDate);
      // expect(responseLaunchBody).toMatchObject(launchObject_A);
    });

    test("It should catch missing required properties", async function () {
      await request(app)
        .post("/launches")
        .send(launchObject_B)
        .expect("Content-Type", /json/)
        .expect(400);
      // const responseLaunchBody = response.body as completeLaunchData;
      // expect(responseLaunchBody).toMatchObject(launchObject_A);
    });

    test("It should catch invlaid dates", async () => {
      await request(app)
        .post("/launches")
        .send(launchObject_C)
        .expect("Content-Type", /json/)
        .expect(400);
    });
  });
});
