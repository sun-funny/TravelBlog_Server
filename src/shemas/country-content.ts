import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICountryContent} from 'src/interface/country-content';

@Schema({ _id: false })
export class CarouselPositionSchemaClass {
  @Prop({ type: Number, default: 0 })
  x: number;

  @Prop({ type: Number, default: 0 })
  y: number;

  @Prop({ type: Number, default: 1 })
  scale: number;

  @Prop({ type: Number, required: false })
  originalWidth?: number;

  @Prop({ type: Number, required: false })
  originalHeight?: number;
}

export const CarouselPositionSchema = SchemaFactory.createForClass(CarouselPositionSchemaClass);

export type CountryContentDocument = CountryContent & Document;

@Schema({ timestamps: true })
export class CountryContent {
  @Prop({ required: true, unique: true })
  countryId: string;

  @Prop({ type: String, default: '' })
  content: string;

  @Prop({ type: [String], default: [] })
  carouselImages: string[];

  @Prop({ required: false })
  updatedBy?: string;

  @Prop({ default: Date.now })
  updatedAt: Date;

}

export const CountryContentSchema = SchemaFactory.createForClass(CountryContent);