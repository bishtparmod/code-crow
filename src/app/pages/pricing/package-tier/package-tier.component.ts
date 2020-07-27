import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'
import { PaymentService } from '../../../services/payment.service'

@Component({
  selector: 'app-package-tier',
  templateUrl: './package-tier.component.html',
  styleUrls: ['./package-tier.component.scss']
})
export class PackageTierComponent implements OnInit {
  @Input() package: any
  @Input() i: any
  public ParticipantsAllowed: number
  public RecordingTime: number
  public StreamingTime: number

  constructor(
    private paymentService: PaymentService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.ParticipantsAllowed = this.package.attributes.ParticipantsAllowed
    this.RecordingTime = this.package.attributes.RecordingTime / 60
    this.StreamingTime = this.package.attributes.StreamingTime / 60
  }

  buy(productId: string) {
    this._router.navigate([`/purchase/${productId}`])
  }

}
