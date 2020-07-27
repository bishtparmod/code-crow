import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(
    private http: HttpClient
  ) { }

  public sendEmail({ name, email, subject, message }): Promise<any> {
    return this.http.post('/api/email/send', { name, email, subject, message }).toPromise()
  }

  // checkForAdBlock(): Promise<any> {
  //   return this.http.get('/api/js/ads.js').toPromise()
  // }
}