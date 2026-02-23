import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoordinatesDocument = Coordinates & Document;

@Schema()
export class Coordinates {
  @Prop({ required: true, unique: true })
  country: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);