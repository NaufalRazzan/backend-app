import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto{
    @ApiProperty({
        description: 'valid username',
        type: String,
        default: 'myUsername'
    })
    @IsNotEmpty({ message: 'email cannot be empty' })
    @IsEmail({}, { message: `'email' must be type of valid email` })
    email: string

    @ApiProperty({
        description: 'valid password',
        type: String,
        default: 'abcde123'
    })
    @IsNotEmpty({ message: 'password cannot be empty' })
    @IsString({ message: `'password' must be type of valid string` })
    password: string
}