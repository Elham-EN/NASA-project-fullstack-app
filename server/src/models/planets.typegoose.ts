import { getModelForClass, prop } from "@typegoose/typegoose";

export class Planet {
  @prop({ type: () => String, required: true })
  public kepler_name: string;
}

const planetModel = getModelForClass(Planet);

export default planetModel;
