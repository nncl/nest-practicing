import { Injectable } from '@nestjs/common';

@Injectable() // { scope: Scope.REQUEST }
export class TokenService {
  private token: string;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
}
