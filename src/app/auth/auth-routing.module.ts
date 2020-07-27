import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { MaintenanceGuard } from './maintenance-guard.service';

const routes: Routes = [{
    path: 'auth',
    children: 
    [
        {
            path: '',
            redirectTo: '/auth/login',
            pathMatch: 'full'
        }, 
        {
            path: 'login',
            component: LoginComponent
        },
        {
            path: 'authenticate/:username/:email/:token',
            component: AuthenticateComponent
        }
    ],
    canActivate: [MaintenanceGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
