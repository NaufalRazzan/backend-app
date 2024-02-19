import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class OrderMovieDto {
    @ApiProperty({
        description: 'username based on username in users table',
        type: String,
        default: 'myUsername'
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsString({ message: 'username field must be a valid string' })
    username: string

    @ApiProperty({
        description: 'title of the movie based on movies table',
        type: String,
        default: 'movie oke oke'
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsString({ message: 'title field must be a valid string' })
    title: string

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
        description: 'movie start',
        type: String,
        default: '12:12:12'
    })
    @IsNotEmpty({ message: 'duration field cannot be empty' })
    @Matches(/^(?:0\d|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, { message: 'duration must be a valid date `HH-mm-ss`' })
    movie_start_time: string

    @ApiProperty({
        description: 'movie end',
        type: String,
        default: '12:12:12'
    })
    @IsNotEmpty({ message: 'duration field cannot be empty' })
    @Matches(/^(?:0\d|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, { message: 'duration must be a valid date `HH-mm-ss`' })
    movie_finish_time: string

    @ApiProperty({
        description: 'how many tickets ordered',
        type: Number,
        default: 5
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsNumber({}, { message: 'ticket pr amount must be a number' })
    ticket_purchase_amounts: number

    @ApiProperty({
        description: 'is payment for ticket already paid or still pending\nex: `pending`, `paid`',
        type: String,
        enum: ['pending', 'paid']
    })
    @IsNotEmpty({ message: 'field cannot empty' })
    @IsEnum(['pending', 'paid'], { message: 'payment status must either pending or paid' })
    payment_status: string    
}

