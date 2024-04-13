import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEnum, IsNotEmpty, IsNumber, IsOptional, Matches } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { Types } from "mongoose";

export type FetchOpenedMoviesResults = {
    _id: Types.ObjectId,
    available_seats: number,
    max_seats: number,
    room_code: string,
    start_time: Date | string,
    finish_time: Date | string,
    ticket_price: number,
    status: string,
    movie_details: {
        _id: Types.ObjectId,
        title: string,
        genres: string[],
        duration: string,
        rating: string,
        createdAt: Date,
        updatedAt: Date,
        __v: number
    }
}

export class OpenMovieDto{
    @ApiProperty({
        description: 'movie id based on the _id in movies table',
        type: Types.ObjectId,
        default: '55622066056006450'
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsObjectId({ message: 'movie_id is not a valid mongodb object id' })
    movie_id: Types.ObjectId

    @ApiProperty({
        description: 'how many seats that has been ordered\nif none, you can fill it blank',
        type: Number,
        default: 0,
        required: false
    })
    @IsNumber({}, { message: 'aval seats only accept numbers' })
    @IsOptional()
    available_seats: number
    
    @ApiProperty({
        description: 'how many max seats per studio',
        type: Number,
        default: 100
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsNumber({}, { message: 'max seats only accept numbers' })
    max_seats: number

    @ApiProperty({
        description: 'studio code\nenter it with combination of letters and numbers like `A102`',
        type: String,
        default: 'A102'
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsAlphanumeric( 'en-US', { message: 'room code only accept numbers and char' })
    room_code: string

    @ApiProperty({
        description: 'when does the movie opened',
        type: Date,
        default: 'Febuary 16, 2024 12:12:12'
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @Matches(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\s+\d{2}:\d{2}:\d{2}$/, { message:  'invalid date format `Month DD, YYYY:HH:mm:ss`'})
    start_time: Date

    @ApiProperty({
        description: 'when does the movie closed',
        type: Date,
        default: 'Febuary 16, 2024 12:12:12'
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @Matches(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\s+\d{2}:\d{2}:\d{2}$/, { message:  'invalid date format `Month DD, YYYY:HH:mm:ss`'})
    finish_time: Date

    @ApiProperty({
        description: 'how much a ticket cost',
        type: Number,
        default: 50000
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsNumber({}, { message: 'ticket price only accept numbers' })
    ticket_price: number

    @ApiProperty({
        description: 'is the movie opened or closed',
        type: String,
        enum: ['open', 'closed']
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsEnum(['open', 'closed'], { message: 'only accept open and closed status' })
    status: string
}
