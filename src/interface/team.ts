import * as mongoose from "mongoose";

export interface ITeam {
  id: string;
  name: string;
  greeting: string;
  image: string;
  position: {
    top: string;
    left: string;
  };
  direction: string;
  description: string;
  _id?: mongoose.Types.ObjectId;
}