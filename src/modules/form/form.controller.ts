import { Body, Controller, Post } from '@nestjs/common';
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}

@Controller('form')
export class FormController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
