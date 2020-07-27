import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {

  public navLinks: any;
  constructor() { }

  ngOnInit() {
    this.navLinks = [
      {
        label: 'Privacy Policy',
        path: 'privacy-policy'
      },
      {
        label: 'Cookie Policy',
        path: 'cookie-policy'
      },
      {
        label: 'Copyright Policy',
        path: 'copyright-policy'
      },
      {
        label: 'GDPR Policy',
        path: 'gdpr-policy'
      },
      {
        label: 'Terms of Service',
        path: 'terms-of-service'
      }
    ];
  }

}
