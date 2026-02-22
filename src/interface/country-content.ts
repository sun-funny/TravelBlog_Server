import * as mongoose from "mongoose";

export interface ICountryContent {
  countryId: string;
  content: string;
  updatedAt?: Date;
  updatedBy?: string;
  _id?: mongoose.Types.ObjectId;
  carouselImages?: string[];
}