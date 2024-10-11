import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

export type User = { name: string };

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async findAll(): Promise<string[]> {
    const res = await firstValueFrom(
      this.httpService
        .get('https://randomuser.me/api/?results=100')
        .pipe(
          map((res) => res.data.results.map((user: any) => user.name.first)),
        ),
    );

    return res;
  }

  async findOne(id: number) {
    const {
      data: { results },
    } = await firstValueFrom(
      this.httpService.get('https://randomuser.me/api/?results=100'),
    );

    const user = results[id - 1];

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
