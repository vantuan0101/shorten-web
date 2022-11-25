import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ShortenLink' }] })
  clickedLink: [];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'ShortenLink' }] })
  createdLink: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
