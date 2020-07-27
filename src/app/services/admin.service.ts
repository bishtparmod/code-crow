import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TokenStorage } from '../auth/token.storage';
import { Socket } from './socket.service'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    public socket: Socket,
    private http: HttpClient,
    private token: TokenStorage
  ) { }

  public uploadFile(file: File, url: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-amz-acl': 'public-read',
      'Content-Type': file.type
    })
    return this.http.put(url, file, { headers, reportProgress: true, observe: 'events' }).pipe(
      catchError(this.errorMgmt)
    )
  }

  public searchUsers(param): Promise<any> {
    return this.http.get('/api/users/search', { params: { param } }).toPromise()
  }

  public getUserRole() {
    return this.http.get(`/api/roles/roleMapping`).toPromise()
  }

  public getRoles() {
    return this.http.get('/api/roles').toPromise()
  }

  public getAdmins(roleId: string) {
    return this.http.get(`/api/roles/${roleId}/users`).toPromise()
  }

  public addAdmin(userId: string, roleId: string) {
    return this.http.post(`/api/roles/roleMapping`, { roleId, userId }).toPromise()
  }

  public removeAdmin(userId: string, roleId: string) {
    return this.http.patch(`/api/roles/roleMapping`, { roleId, userId }).toPromise()
  }

  public getBucketItems(bucketName: string): Promise<any> {
    return this.http.get('/api/news/get/objects', { params: { bucketName } }).toPromise()
  }

  public getUploadURL({ fileName, fileType, bucketName }): Promise<any> {
    return this.http.post(`/api/s3/upload-url`, { fileName, fileType, Key: bucketName, bucketName }).toPromise()
  }

  public getVideos(filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 5): Promise<any> {
    return this.http.get(`/api/video?admin=1&filter=${filter}&skip=${pageNumber}&limit=${pageSize}&sort=${sortOrder}`).toPromise()
  }

  public getAllVideos(): Promise<any> {
    return this.http.get(`/api/video/all?admin=1`).toPromise()
  }

  public addPage({ title }): Promise<any> {
    return this.http
      .post(`/api/pages/`, { title })
      .toPromise()
  }

  public getPages(name = null): Promise<any> {
    return this.http
      .get(`/api/pages`, { params: name ? { uniqueName: name } : {} })
      .toPromise()
  }

  public getPage({ pageId }): Promise<any> {
    return this.http
      .get(`/api/pages/${pageId}`)
      .toPromise()
  }

  public addSection({ pageId }, { title, content, order, side }): Promise<any> {
    return this.http
      .post(`/api/pages/${pageId}/sections`, { title, content, order, side })
      .toPromise()
  }

  public getSections({ pageId }): Promise<any> {
    return this.http
      .get(`/api/pages/${pageId}/sections`)
      .toPromise()
  }

  public getSectionById({ sectionId }): Promise<any> {
    return this.http
      .get(`/api/pages/sections/${sectionId}`)
      .toPromise()
  }

  public updateSection({ sectionId }, { title, content, order, side }): Promise<any> {
    return this.http
      .patch(`/api/pages/sections/${sectionId}`, { title, content, order, side })
      .toPromise()
  }

  public getChannels(): Promise<any> {
    return this.http
      .get('/api/channel')
      .toPromise()
  }

  public getChannelLiveStreams(id): Promise<any> {
    return this.http
      .get(`/api/channel/${id}/liveStreams`)
      .toPromise()
  }

  public getMonthLiveStreaming(): Promise<any> {
    return this.http.get('/api/liveStreaming/').toPromise()
  }

  public createNewsAnnouncement(data): Promise<any> {
    return this.http.post('/api/news', data).toPromise()
  }

  public getNews(): Promise<any> {
    return this.http.get('/api/news').toPromise()
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(throwError)
  }

  public getMaintenanceMode(): Promise<any> {
    return this.http.get('/api/siteSettings/maintenanceMode').toPromise()
  }

  public setMaintenanceMode({ createUpdateType, isEnabled, message }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.http.patch('/api/siteSettings/maintenanceMode', { createUpdateType, isEnabled, message }).toPromise()
        this.socket.emitMaintenanceMode({ isEnabled, message })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  public createLegalDoc({ title, createdAt, pdf }): Promise<any> {
    return this.http.post('/api/legal', { title, createdAt, pdf }).toPromise()
  }

  public setUserBan({ id, isBanned }): Promise<any> {
    return this.http.patch(`/api/users/${id}/ban`, { isBanned }).toPromise()
  }
}