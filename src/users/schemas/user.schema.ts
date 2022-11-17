import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose, Types } from 'mongoose';
import { ShortenLink } from '../../shorten-link/entities/shorten-link.entity';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  clickedLink: [
    {
      shortLinkId: string;
      countClick: number;
    },
  ];

  @Prop()
  createdLink: ShortenLink[];
  // @Prop({ type: [{ type: Types.ObjectId, ref: 'ShortenLink' }] })
  // createdLink: ShortenLink[];
}

export const UserSchema = SchemaFactory.createForClass(User);
