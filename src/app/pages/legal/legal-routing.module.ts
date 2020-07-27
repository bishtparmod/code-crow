import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { CopyrightPolicyComponent } from './copyright-policy/copyright-policy.component'
import { AuthGuard } from '../../auth/auth-guard.service';
import { LegalComponent } from './legal.component';
import { GdprPolicyComponent } from './gdpr-policy/gdpr-policy.component';

const routes: Routes = [{
  path: 'legal',
  component: LegalComponent,
  children: [
    {
      path: 'cookie-policy',
      component: CookiePolicyComponent
    },
    {
      path: 'privacy-policy',
      component: PrivacyPolicyComponent
    },
    {
      path: 'terms-of-service',
      component: TermsOfServiceComponent
    },
    {
      path: 'copyright-policy',
      component: CopyrightPolicyComponent
    },
    {
      path: 'gdpr-policy',
      component: GdprPolicyComponent
    }
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalRoutingModule { }
