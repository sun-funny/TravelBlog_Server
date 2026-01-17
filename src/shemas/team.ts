import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ITeam } from 'src/interface/team';
import { Types } from 'mongoose';

export type TeamDocument = HydratedDocument<Team>;
@Schema()
export class Team implements ITeam {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  greeting: string;
  @Prop({ required: true })
  image: string;
  @Prop({ type: Object })
  position: {
    top: string;
    left: string;
  };
  @Prop()
  direction: string;
  @Prop({ required: true })
  description: string;
}
export const TeamSchema = SchemaFactory.createForClass(Team);