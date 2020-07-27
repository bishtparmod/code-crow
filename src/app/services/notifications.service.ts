import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class NotificationService {

  public notifications: any = []
  constructor(
    private _http: HttpClient
  ) { }

  public markNotificationSeen(id): Promise<any> {
    return this._http.patch(`/notifications/${id}/seen`, {}).toPromise()
  }

  public myNotifications(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        this.notifications = await this._http.get(`/notifications/me`).toPromise()
        resolve(this.notifications)
      } catch (e) {
        reject(e)
      }
    })
  }
}