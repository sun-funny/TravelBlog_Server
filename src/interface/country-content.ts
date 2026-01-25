import * as mongoose from "mongoose";

export interface CarouselPosition {
  x: number;
  y: number;
  scale: number;
  originalWidth?: number;
  originalHeight?: number;
}

export interface ICountryContent {
  countryId: string;
  content: string;
  updatedAt?: Date;
  updatedBy?: string;
  _id?: mongoose.Types.ObjectId;
  carouselImages?: string[];
  carouselPositions?: CarouselPosition[];
}