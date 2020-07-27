import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public plans = []
  constructor(
    private paymentService: PaymentService
  ) { }

  async ngOnInit() {
    
  }
}
