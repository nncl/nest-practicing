import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { BaseService } from './services/base/base.service';

const URL_API = 'https://randomuser.me/api/';

interface User {
  name: {
    first: string;
  };
}

interface ApiResponse {
  results: User[];
}

@Injectable()
export class AppService {
  constructor(private readonly baseService: BaseService) {}
  async findAll(): Promise<string[]> {
    const res = await firstValueFrom(
      this.baseService
        .get<ApiResponse>(`${URL_API}?results=5000`)
        .pipe(map((res) => res.results.map((user: any) => user.name.first))),
    );

    return res;
  }

  async findOne(id: number) {
    const { results } = await firstValueFrom(
      this.baseService.get<any>(`${URL_API}/?results=100`),
    );

    const user = results[id - 1];

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
