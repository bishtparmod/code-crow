import { Injectable } from '@angular/core';
import { CanActivate, Router } from "@angular/router";
import { TokenStorage } from '../auth/token.storage';
import { AdminService } from '../services/admin.service'

@Injectable()
export class OnlyAdminUsersGuard implements CanActivate {
  constructor(
    private tokenStorage: TokenStorage,
    private router: Router,
    private api: AdminService
  ) { }

  async canActivate() {
    const user = await this.api.getUserRole()
    console.log('>> ADMIN:', user)
    if (user) return true;

    // not admin in so redirect to 404 page with the return url
    this.router.navigate(['/404']);
    return false;
  }
}
