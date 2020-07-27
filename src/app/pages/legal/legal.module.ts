import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { SharedModule } from '../../shared/shared.module';
import { LegalRoutingModule } from './legal-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    LegalRoutingModule,
    MDBBootstrapModule.forRoot(),
  ],
  declarations: [],
  providers: []
})
export class LegalModule { }