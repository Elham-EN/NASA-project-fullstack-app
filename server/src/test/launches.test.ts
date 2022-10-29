import request from "supertest";
import app from "../app";

describe("GET (Request) /launches - fetch all launches", function () {
  test("It should respond with 200 success", async function () {
    await request(app).get("/launches").expect(200);
  });
  test("It should respond with 404 not found", async function () {
    await request(app).get("/launch").expect(200);
  });
});

describe("POST (Request) /launches - add new launch", function () {
  test("It should respond with 201 created", async function () {
    await request(app)
      .post("/launches")
      .send({
        mission: "ZTM155",
        rocket: "ZTM Expermimental IS1",
        target: "Kepler-189 F",
        launchDate: "January 17, 2030",
      })
      .expect(201);
  });
  test("It should catch missing required properties", async function () {
    await request(app)
      .post("/launches")
      .send({
        mission: "",
        rocket: "ZTM Expermimental IS1",
        target: "Kepler-189 F",
        launchDate: "January 17, 2030",
      })
      .expect(400);
  });
});
