//a parser converting CSV text into arrays or objects
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
// import planets from "./planets.mongo";
import planetModel, { Planet } from "./planets.typegoose";

interface PlanetType {
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
  kepler_name?: string;
}

class PlanetsModel {
  // private habitablePlanets: string[] = [];

  private isHabitablePlanets(planet: PlanetType): boolean {
    return (
      planet["koi_disposition"] === "CONFIRMED" &&
      planet["koi_insol"] > 0.36 &&
      planet["koi_insol"] < 1.11 &&
      planet["koi_prad"] < 1.6
    );
  }

  //We can wait for that promise to resolve before accepting any request in
  //the controller because the stream operation is done asynchronously and
  //we cant export getAllPlanets before the planets data is loaded in the the
  //array, otherwise we will just return an empty array with no data to client
  public loadPlanetsData(): Promise<null> {
    return new Promise((resolve, reject) => {
      const csvData = path.join(
        __dirname,
        "..",
        "..",
        "data",
        "kepler_data.csv"
      );

      /**
       * Use createReadStream() to read data from CSV file. It take filename as
       * an argument, then it create a readable stream, which takes a large file
       * and breaks it into smaller chuncks.
       */
      fs.createReadStream(csvData) //Asynchronous operations
        /**
         * After creating the readable stream, pipe() forwards chuncks of
         * data from the readable stream to another stream. The second stream is
         * created when the parse() method is invoked inside the pipe() method and
         * the parse() method implements a transform stream (readable stream),
         * taking a data chunk and transforming it into an object literal
         */
        .pipe(
          /**
           * takes an object that accepts properties:
           * *comment option treat all the characters after this one as a comment
           * *columns option generates record in the form of object literals
           *  -true: Infer the columns names from the first line.
           */
          parse({ comment: "#", columns: true })
        )
        /**
         * A streaming event allows the method to consume a chunk of data if a
         * certain event is emitted. The data event is triggered when data
         * transformed from the parse() method is ready to be consumed
         */
        .on("data", async (data: PlanetType & string) => {
          //if it is habitable then push to an array
          if (this.isHabitablePlanets(data)) {
            // this.habitablePlanets.push(data);
            await this.savePlanet(data);
          }
        })
        .on("error", (err) => reject(err))
        .on("end", async () => {
          const countPlanetsFound = (await this.getAllPlanets())?.length;
          console.log(
            // `${this.habitablePlanets.length} habitable planets found`
            `${countPlanetsFound} habitable planets found`
          );
        });
      resolve(null);
    });
  }

  // public getAllPlanets(): string[] {
  //   return this.habitablePlanets;
  // }

  /** CRUD OPERATIONS */

  //Return an array of habitable planets
  public async getAllPlanets(): Promise<Planet[] | null> {
    try {
      return await planetModel.find({}, "kepler_name");
    } catch (error) {
      console.log(`Could not find all the planets ${error}`);
      return null;
    }
  }

  private async savePlanet(planet: PlanetType & string): Promise<void> {
    //create with insert + update = upsert. upsert inserts data into collection
    //if it doesn't already exist in the collection and if does exist, it updates
    //that document with whatever you pass into the upsert operation
    try {
      await planetModel.updateOne(
        //filter/query as the first argument. Finding all the planets matching the
        //kepler name from the csv file.
        { kepler_name: planet.kepler_name },
        //Insert planet that doesn't exist, then insert to the collection, if it
        //does exist then just update
        { kepler_name: planet.kepler_name },
        //Our planets will only be added if it doesn't already exist, if it does
        //our update here won't change anything
        { upsert: true }
      );
    } catch (error) {
      console.error(`Could not save planet ${error}`);
    }
  }
}

export const planetsModelObject = new PlanetsModel();
