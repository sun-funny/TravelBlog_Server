import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICountryContent, CarouselPosition } from 'src/interface/country-content';
import { Types, Schema as MongooseSchema } from 'mongoose'; // Добавьте импорт Schema

const CarouselPositionSchema = new MongooseSchema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  originalWidth: { type: Number, required: false },
  originalHeight: { type: Number, required: false }
}, { _id: false });

export type CountryContentDocument = HydratedDocument<CountryContent>;

@Schema({ timestamps: true })
export class CountryContent implements ICountryContent {
  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId;

  @Prop({ required: true, unique: true })
  countryId: string;

  @Prop({ required: true, type: String, default: '' })
  content: string;

  @Prop()
  updatedBy?: string;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [String], default: [] })
  carouselImages?: string[];

  @Prop({ type: [CarouselPositionSchema], default: [] })
  carouselPositions?: CarouselPosition[];
}

export const CountryContentSchema = SchemaFactory.createForClass(CountryContent);