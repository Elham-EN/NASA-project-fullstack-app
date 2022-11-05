import { getModelForClass, prop, Ref, index } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { Planet } from "./planets.typegoose";

@index({ flightNumber: 1 })
class Launch {
  @prop({ type: () => Number, required: true })
  public flightNumber: number;

  @prop({ type: () => Date, required: true })
  public launchDate: Date;

  @prop({ type: () => String, required: true })
  public mission: string;

  @prop({ type: () => String, required: true })
  public rocket: string;

  @prop({ ref: () => Planet, required: true })
  public target: Ref<Planet, mongoose.Types.ObjectId>;

  @prop({ type: () => [String], required: true })
  public customers: string[];

  @prop({ type: () => Boolean, required: true })
  public upcoming: boolean;

  @prop({ type: () => Boolean, required: true, default: true })
  public success: boolean;
}

const LaunchModel = getModelForClass(Launch);

export default LaunchModel;
