import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator"

export class NewMovieDto{
    @ApiProperty({
        description: 'name of the movie',
        type: String,
        default: 'film bajakan'
    })
    @IsNotEmpty({ message: 'title field cannot be empty ' })
    @IsString({ message: 'title field must be a valid string' })
    title: string

    @ApiProperty({
        description: 'list of genres',
        type: [String],
        default: 'comedy, action'
    })
    @IsNotEmpty({ message: 'genre field cannot be empty ' })
    @IsString({ message: 'genre field must be a valid string', each: true })
    @IsArray({ message: 'genre field must be an array' })
    genres: string[]

    @ApiProperty({
        description: 'duration of the movie',
        type: String,
        default: '12:12:12'
    })
    @IsNotEmpty({ message: 'duration field cannot be empty' })
    @Matches(/^(1[0-2]|0?[1-9]):([0-5]?[0-9]):([0-5]?[0-9])$/, { message: 'duration must be a valid date `HH-mm-ss`' })
    duration: string

    @ApiProperty({
        description: 'use indonesian rating system\nex: `SU`, `BO-A`, `BO`, `R`, `D`',
        type: String,
        enum: ['SU', 'BO-A', 'BO', 'R', 'D']
    })
    @IsNotEmpty({ message: 'rating field cannot be empty' })
    @IsEnum(['SU', 'BO-A', 'BO', 'R', 'D'], { message: 'rating field must use the valid Indoensian rating system for movies and films' })
    rating: string
}