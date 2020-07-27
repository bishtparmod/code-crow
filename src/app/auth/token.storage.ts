import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: "root"
})
export class TokenStorage {

  constructor(
    private localStorage: LocalStorage
  ) { }

  signOut() {
    this.localStorage.clear().subscribe(() => { })
  }

  public saveToken(token: string, user) {
    if (!token) return;
    this.localStorage.setItem(TOKEN_KEY, token).subscribe(() => { })
  }

  public saveUser(user) {
    if (!user) return
    this.localStorage.setItem('user', JSON.stringify(user)).subscribe(() => { })
  }

  public getToken() {
    return this.localStorage.getItem(TOKEN_KEY)
  }

  public getUser() {
    return this.localStorage.getItem('user')
  }
}