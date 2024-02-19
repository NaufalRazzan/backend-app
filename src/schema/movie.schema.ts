import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document, SchemaTypes } from "mongoose";
import * as UniqueValidator from "mongoose-unique-validator"

type MovieDocument = Movie & Document
@Schema({ timestamps: true })
class Movie{
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId

    @Prop({ unique: true, index: true })
    title: string

    @Prop({ default: null })
    genres: string[]

    @Prop({ default: null })
    duration: string

    @Prop({ enum: ['SU', 'BO-A', 'BO', 'R', 'D'] })
    rating: string

    @Prop({ default: Date.now() })
    createdAt: Date

    @Prop({ default: Date.now() })
    updatedAt: Date
}

const MovieSchema = SchemaFactory.createForClass(Movie)
MovieSchema.plugin(UniqueValidator)

export { MovieDocument, Movie, MovieSchema }