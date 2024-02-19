import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";

export class NewUserDto{
  @ApiProperty({
    description: 'username for new users',
    type: String,
    default: 'myUsername'
  })
  @IsNotEmpty({ message: 'username field cannot be empty' })
  @IsString({ message: 'username field must be a valid string' })
  @Matches(/^\S*$/, { message: 'username cannot contain any whitespace' })
  username: string

  @ApiProperty({
    description: 'email for new users',
    type: String,
    default: 'myUsername@email.com'
  })
  @IsNotEmpty({ message: 'email field cannot be empty' })
  @IsEmail({}, { message: 'email field must be a type of valid email' })
  email: string

  @ApiProperty({
    description: 'password for new users',
    type: String,
    default: 'abcde123'
  })
  @IsNotEmpty({ message: 'password field cannot be empty' })
  @IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1
    }, { message: 'weak password' })
  password: string
}
