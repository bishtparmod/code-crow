import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';
import { TokenStorage } from './token.storage';
import { TooltipComponent } from '@angular/material/tooltip';

@Injectable()
export class AuthService {

  public headerRefresh: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(public http: HttpClient, public token: TokenStorage) { }

  public $userSource = new Subject<any>();

  logout(): Observable<any> {
    return Observable.create(observer => {
      this.http.get('/api/auth/logout')
        .subscribe((data: any) => {
          this.token.signOut()
          observer.next(data)
        })
    })
  }

  updateUser(payload, userName): Observable<any> {
    return Observable.create(observer => {
      this.http.patch(`/api/auth/user/${userName}/notification`, payload)
        .subscribe((data: any) => {
          observer.next(data)
        })
    })
  }

  login(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/login', {
        email,
        password
      }).subscribe((data: any) => {
        observer.next({ user: data.user });
        this.setUser(data.user);
        this.token.saveToken(data.token, data.user);
        observer.complete();
      })
    });
  }

  register(fullname: string, email: string, password: string, repeatPassword: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/register', {
        fullname,
        email,
        password,
        repeatPassword
      }).subscribe((data: any) => {
        observer.next({ user: data.user });
        this.setUser(data.user);
        this.token.saveToken(data.token, data.user);
        observer.complete();
      })
    });
  }

  authenticate(username: string, email: string, token: string): Observable<any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/getAvatar', {
        email
      }).subscribe((data: any) => {
        observer.next({ user: data.currentUser });
        this.setUser(data.currentUser);
        this.token.saveToken(token, data.user);
        observer.complete();
      });
    });
  }

  setUser(user): void {
    // if (user) user.isAdmin = (user.roles.indexOf('admin') > -1);
    this.$userSource.next(user);
    this.token.saveUser(user)
  }

  getUser(): Observable<any> {
    return this.$userSource.asObservable();
  }

  me(): Promise<any> {
    return this.http.get('/api/auth/me').toPromise()
  }

  oauthLogin(repoName: String) {
    const auth_url = '/api/auth/' + repoName;
    console.log(auth_url);
    // // return this.http.post(auth_url, {}, {responseType:'text'});
    return this.http.get(auth_url, {});
    // this.http.get(auth_url, {
    // }).subscribe((data : any) => {
    //   this.setUser(data.user);
    //   this.token.saveToken(data.token);
    // })
  }

  updateData(data) {
    this.headerRefresh.next(data);
}
}
