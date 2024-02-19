import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, SchemaTypes } from "mongoose";

export type OrderMovieDocument = OrderMovie & Document
@Schema({ timestamps: true })
export class OrderMovie{
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, index: true })
    movie_id: Types.ObjectId

    @Prop({ type: SchemaTypes.ObjectId, index: true })
    user_id: Types.ObjectId

    @Prop({ default: 0 })
    ticket_purchase_amounts: number

    @Prop({ default: 0 })
    total_amount: number

    @Prop({ default: null, index: true })
    start_time: Date

    @Prop({ default: null, index: true })
    finish_time: Date
    
    @Prop({ default: null })
    movie_start_time: string

    @Prop({ default: null })
    movie_finish_time: string

    @Prop({ default: Date.now() })
    createdAt: Date

    @Prop({ default: Date.now() })
    updatedAt: Date
}

export const OrderMovieSchema = SchemaFactory.createForClass(OrderMovie)