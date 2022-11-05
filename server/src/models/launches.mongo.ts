import mongoose, { Schema } from "mongoose";

//Represent a document in mongodb
interface Launch {
  flightNumber: number;
  launchDate: Date;
  mission: string;
  rocket: string;
  target: Schema.Types.ObjectId;
  customers: string[];
  upcoming: boolean;
  success: boolean;
}

//Schema Defining shape and strcuture of Launch document
//in the launches collections
const launchesSchema = new Schema<Launch>({
  flightNumber: { type: Number, required: true },
  launchDate: { type: Date, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  //To reference documents in Planets collection
  target: { type: Schema.Types.ObjectId, ref: "Planets", required: true },
  customers: { type: [String] },
  upcoming: { type: Boolean, required: true },
  success: { type: Boolean, required: true, default: true },
});

//Connect schema with the collection
const launches = mongoose.model("Launch", launchesSchema);

export default launches;
