import mongoose from "mongoose";

const MONGO_URL =
  "mongodb+srv://nasa-api:BuXGXjtgCh5flRzj@nasacluster.5y3qujg.mongodb.net/nasa?retryWrites=true&w=majority";

export async function connectToMongoDB(): Promise<void> {
  await mongoose.connect(MONGO_URL);
}

export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
}

//connection emits event when connection is ready or when there is error
mongoose.connection.once("open", () => {
  console.log("MonggoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});
