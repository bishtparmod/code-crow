import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms'
import { EmailService } from '../../services/email.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public contactForm: FormGroup
  public isSendingMessage: boolean
  public isValidationError: boolean
  public isConnectionError: boolean
  public isMessageSent: boolean

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    this.contactForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.email, Validators.required])],
      subject: [null, Validators.required],
      message: [null, Validators.required]
    })
  }

  ngOnInit() {
  }

  public async sendMessage() {
    if (this.contactForm.valid) {
      const { name, email, subject, message } = this.contactForm.value
      this.isValidationError = false
      this.isConnectionError = false
      this.isSendingMessage = true
      try {
        const $email = await this.emailService.sendEmail({ name, email, subject, message })
        this.isSendingMessage = false
        this.isMessageSent = true
        this.contactForm.reset()
      } catch (e) {
        this.isConnectionError = true
      }
    } else {
      this.isValidationError = true
    }
  }

}
