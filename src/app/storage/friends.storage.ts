import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

const KEY = 'Friends';

@Injectable({
  providedIn: "root"
})
export class FriendsStorage {

  constructor(
    private localStorage: LocalStorage
  ) { }

  public saveFriends(friends) {
    if (!friends) return
    this.localStorage.setItem(KEY, JSON.stringify(friends)).subscribe(() => { })
  }

  public async getFriends() {
    const friends = await this.localStorage.getItem(KEY).toPromise()
    return friends
  }
}