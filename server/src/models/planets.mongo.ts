import mongoose, { Schema } from "mongoose";

interface Planet {
  kepler_name: string;
}

const planetSchema = new Schema<Planet>({
  kepler_name: { type: String, required: true },
});

const planets = mongoose.model("Planet", planetSchema);

export default planets;
