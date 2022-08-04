//a parser converting CSV text into arrays or objects
import { parse } from "csv-parse";
import fs from "fs";
import path from "path";

interface PlanetType {
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
}

class PlanetsModel {
  private habitablePlanets: string[] = [];

  private isHabitablePlanets(planet: PlanetType): boolean {
    return (
      planet["koi_disposition"] === "CONFIRMED" &&
      planet["koi_insol"] > 0.36 &&
      planet["koi_insol"] < 1.11 &&
      planet["koi_prad"] < 1.6
    );
  }

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
      fs.createReadStream(csvData)
        /**
         * After creating creating the readable stream, pipe() forwards chuncks of
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
        .on("data", (data: PlanetType & string) => {
          //if it is habitable then push to an array
          if (this.isHabitablePlanets(data)) {
            this.habitablePlanets.push(data);
          }
        })
        .on("error", (err) => reject(err))
        .on("end", () => {
          console.log(
            `${this.habitablePlanets.length} habitable planets found`
          );
        });
      resolve(null);
    });
  }

  public getAllPlanets(): string[] {
    return this.habitablePlanets;
  }
}
export const planetsModel = new PlanetsModel();
