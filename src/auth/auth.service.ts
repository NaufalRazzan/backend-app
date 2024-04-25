import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { NewUserDto } from 'src/validation/new-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/validation/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        private readonly jwtservice: JwtService
    ){}

    async signUp(payload: NewUserDto): Promise<User>{
        try {
            return await this.userModel.create({
                _id: new Types.ObjectId(),
                userName: payload.username,
                email: payload.email,
                password: await bcrypt.hash(payload.password, 10)
            });
        } catch (error) {
            if(error instanceof MongooseError && error.name === 'ValidationError'){
                throw new ConflictException('user already exists')
            }
            throw error
        }
    }

    async signIn(payload: SignInDto): Promise<string[]>{
        const user = await this.userModel.findOne({
            email: payload.email
        }).lean();

        if(!user){
            throw new UnauthorizedException('incorrect email or password')
        }

        const isValidPass = await bcrypt.compare(payload.password, user.password)
        if(!isValidPass){
            throw new UnauthorizedException('incorrect email or password')
        }

        const tokenPayload = {
            user_id: user._id,
            username: user.userName,
            password: user.password
        };     
        
        const acc_token = await this.jwtservice.signAsync(tokenPayload, { secret: process.env.SECRET_KEY_USER })

        await this.userModel.updateOne(
            { _id: user._id },
            {
                $set: { acc_token: acc_token }
            }
        )

        return [acc_token, user.role, user.userName]
    }
}
