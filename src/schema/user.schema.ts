import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, SchemaTypes, Types } from "mongoose";
import * as UniqueValidator from "mongoose-unique-validator"

type UserDocument = User & Document
@Schema({ timestamps: true })
class User{
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId

    @Prop({ unique: true, index: true, text: true })
    userName: string

    @Prop({ unique: true, index: true, text: true })
    email: string

    @Prop({ default: null, index: true })
    password: string

    @Prop({ enum: ['user', 'admin'], default: 'user' })
    role: string

    @Prop({ default: null })
    acc_token: string

    @Prop({ default: Date.now() })
    createdAt: Date

    @Prop({ default: Date.now() })
    updatedAt: Date
}

const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(UniqueValidator)

export { UserDocument, User, UserSchema}