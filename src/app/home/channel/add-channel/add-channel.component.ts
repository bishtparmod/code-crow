import { Component, OnInit, Inject, Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChatService } from "../../../services/chat.service";
import { TokenStorage } from '../../../auth/token.storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
// import { ContentComponent } from '../../content/content.component';

export interface ChannelItem {
  title: string;
  description: string;
  isPrivate: boolean
}

// providers: [ContentComponent],
@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss']
})
export class AddChannelComponent implements OnInit {

  public error: any = {}
  public addChannelForm: FormGroup
  @Output() sidenavClose = new EventEmitter();
  public isPayedUser: boolean

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<AddChannelComponent>,
    public chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: ChannelItem,
    private tokenStorage: TokenStorage,
    private fb: FormBuilder,
    private paymentService: PaymentService
  ) { }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async addChannel() {
    this.onSidenavClose()
    if (this.addChannelForm.valid) {
      const $user: any = await this.tokenStorage.getUser().toPromise()
      const user = JSON.parse($user)
      const username = user.username ? user.username : user.firstName
      let check_user_exist = false;
      this.chatService.allChannels.forEach(function (channel) {
        if (channel.createdBy == username) {
          check_user_exist = true;
          return false;
        }
      });
      if (check_user_exist) {
        this.error = {
          message: "You are already hosting a channel."
        }
      }
      else {
        try {
          const channel = await this.chatService.createChannel(
            this.addChannelForm.value.title,
            user.username ? user.username : user.firstName,
            {
              description: this.addChannelForm.value.description,
              userImage: user.avatar,
              isPrivate: this.addChannelForm.value.isPrivate,
              password: this.addChannelForm.value.isPrivate ? Math.floor(100000 + Math.random() * 900000) : null,
              userId: user._id
            }
          )

          const { sid } = channel
          this.onNoClick()
          this.router.navigate(['/channel', sid]);
        } catch (err) {
          console.log(err)
          this.error = err
        }
      }

    } else {
      this.error = {
        message: "Please fill in all required fields."
      }
    }
  }

  async ngOnInit() {
    this.addChannelForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      isPrivate: [null]
    })
    const user: any = await this.tokenStorage.getUser().toPromise()
    const { customerId } = JSON.parse(user)
    const customer: any = await this.paymentService.stripeGetCustomer(customerId)
    if (customer) {
      const { data } = customer.subscriptions
      this.isPayedUser = data.length == 1 ? true : false
    }
  }

}
