import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { AuthService } from "../auth.service";
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate.component.html',
    styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit {

    constructor(private _snackBar: MatSnackBar,private route: ActivatedRoute, private router: Router, private httpClient: HttpClient, private service: AuthService) {
        var email = this.route.snapshot.paramMap.get("email");
        var username = this.route.snapshot.paramMap.get("username");
        var token = this.route.snapshot.paramMap.get("token");
        // var avatar = this.route.snapshot.paramMap.get("avatar");

        service.authenticate(username, email, token).toPromise()
            .then(done => {
                if(done && done .user && done.user.isBanned){
                    this._snackBar.open('Your account is banned please contact support if you have any further query.', null, { duration: 5000 })
                    this.router.navigate(['/auth/login'])
                }else{
                    setTimeout(() => {
                        this.router.navigate([''])
                        this.service.updateData({headerRefresh:true}) 
                },1000)
                   
                }
                
            })
            .catch(err => {
                this.service.updateData({headerRefresh:false})
                console.log(err)
            })
    }

    ngOnInit() {
        // var email = this.route.snapshot.paramMap.get("animal");
    }

}
