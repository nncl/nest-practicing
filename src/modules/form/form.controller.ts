import { Body, Controller, Post, Query, UseFilters } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ValidationFilter } from '../../filters/errors/validation/validation.filter';

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

class CreateUserQueryDto {
  @IsOptional()
  @IsIn(['F', 'M'])
  gender: 'F' | 'M';

  @IsDefined()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;
}

@UseFilters(ValidationFilter)
@Controller('form')
export class FormController {
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Query() query: CreateUserQueryDto,
  ) {
    return { createUserDto, query };
  }
}
