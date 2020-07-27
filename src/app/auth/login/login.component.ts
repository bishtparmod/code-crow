import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { TokenStorage } from '../token.storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validationForm: FormGroup;
  constructor(private tokenStorage: TokenStorage, private _snackBar: MatSnackBar,private authService: AuthService, private router: Router, public fb: FormBuilder) {
    this.validationForm = fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get email() { return this.validationForm.get('email'); }
  get password() { return this.validationForm.get('password'); }

 ngOnInit() {
  }
 
  login(): void {
    let{
      email, password
    } = this.validationForm.getRawValue();
    this.authService.login(email, password)
    .subscribe(data => {
      this.router.navigate(['']);
    })
  }
  
 

  oauthLogin(repName:String): void{
    console.log(repName + " button clicked");

    this.authService.oauthLogin(repName).subscribe(data=>{
      console.log("auth return value::", data);
      // this.router.navigate(['']);
    })
  }
}
