import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ICountryContent } from 'src/interface/country-content';
import { Types } from 'mongoose';

export type CountryContentDocument = HydratedDocument<CountryContent>;

@Schema({ timestamps: true })
export class CountryContent implements ICountryContent {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  countryId: string;

  @Prop({ required: true, type: String, default: '' })
  content: string;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [String], default: [] })
  carouselImages: string[];
}

export const CountryContentSchema = SchemaFactory.createForClass(CountryContent);