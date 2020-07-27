import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorage } from './token.storage'
import { AdminService } from '../services/admin.service';

@Injectable()
export class MaintenanceGuard implements CanActivate {

  constructor(
    public router: Router,
    public tokenStorage: TokenStorage,
    public adminService: AdminService
  ) { }

  async canActivate() {
    const user = await this.tokenStorage.getUser().toPromise()
    if (user) {
      try {
        const maintenance = await this.adminService.getMaintenanceMode()
        if (maintenance && maintenance.isEnabled) {
          this.router.navigate([`maintenance`])
          return false
        }
      } catch (e) {
        console.log(e)
      }
    }
    return true
  }
}
