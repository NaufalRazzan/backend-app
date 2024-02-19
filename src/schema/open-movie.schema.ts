import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";

export type OpenMovieDocument = OpenMovie & Document
@Schema({ timestamps: true })
export class OpenMovie{
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, index: true })
    movie_id: Types.ObjectId
    
    @Prop({ default: 0 })
    available_seats: number

    @Prop({ default: 0 })
    max_seats: number

    @Prop({ default: null })
    room_code: string

    @Prop({ default: null, index: true })
    start_time: Date

    @Prop({ default: null, index: true })
    finish_time: Date

    @Prop({ default: 0 })
    ticket_price: number

    @Prop({ enum: ['open', 'closed'], default: 'closed', index: true })
    status: string

    @Prop({ default: Date.now() })
    createdAt: Date
    
    @Prop({ default: Date.now() })
    updatedAt: Date
}

export const OpenMovieSchema = SchemaFactory.createForClass(OpenMovie)