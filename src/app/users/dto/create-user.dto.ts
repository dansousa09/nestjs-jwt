import { IsEmail, IsNotEmpty, Matches } from "class-validator";
import { messagesHelper } from "../helpers/messages.helper";
import { regexHelper } from "../helpers/regex.helper";

export class CreateUserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(regexHelper.password, { message: messagesHelper.PASSWORD_VALID })
  password: string;
}