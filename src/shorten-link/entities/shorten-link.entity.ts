import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShortenLinkDocument = HydratedDocument<ShortenLink>;
@Schema()
export class ShortenLink {
  @Prop({ unique: true })
  shortLink: string;

  @Prop()
  linkToRedirect: string;

  @Prop()
  countClick: number;
}

export const ShortenLinkSchema = SchemaFactory.createForClass(ShortenLink);
