import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ShortenLinkDocument = HydratedDocument<ShortenLink>;
@Schema()
export class ShortenLink {
  @Prop({ unique: true })
  shortLink: string;

  @Prop()
  linkToRedirect: string;

  @Prop()
  countClick: number;

  @Prop()
  userId: string;
}

export const ShortenLinkSchema = SchemaFactory.createForClass(ShortenLink);
