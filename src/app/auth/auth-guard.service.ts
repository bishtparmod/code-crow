import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorage } from './token.storage'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public router: Router,
    public tokenStorage: TokenStorage
  ) { }

  async canActivate() {
    const user = await this.tokenStorage.getUser().toPromise()
    if (user) return true;

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login']);
    return false;

  }
}
