import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CreatorSpaceService {

  public playlist: any
  public isLoadingPlaylist: boolean = false

  constructor(
    private http: HttpClient
  ) { }

  public getUploadURL({ fileName, fileType, Key }): Promise<any> {
    return this.http.post(`/api/s3/upload-url`, { fileName, fileType, Key, bucketName: 'videos' }).toPromise()
  }

  public uploadVideoByUrl({ url, title, duration }): Promise<any> {
    return this.http.post('/api/video', { url, title, duration }).toPromise()
  }

  public uploadVideo(image: File, url: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'x-amz-acl': 'public-read',
      'Content-Type': image.type
    })
    return this.http.put(url, image, { headers, reportProgress: true, observe: 'events' }).pipe(
      catchError(this.errorMgmt)
    )
  }

  public getUserVideos(id): Promise<any> {
    return this.http.get(`/api/users/${id}/videos`).toPromise()
  }

  public getChannelLiveStreams(id): Promise<any> {
    return this.http
      .get(`/api/channel/${id}/liveStreams`)
      .toPromise()
  }

  public toggleVideoStatus(id, status): Promise<any> {
    return this.http.patch(`/api/video/${id}/hide`, { status }).toPromise()
  }

  public deleteVideo(id): Promise<any> {
    return this.http.delete(`/api/video/${id}`).toPromise()
  }

  public getMonthLiveStreaming(): Promise<any> {
    return this.http.get(`/api/liveStreaming/me/montly`).toPromise()
  }

  public getChannels(): Promise<any> {
    return this.http.get(`/api/channel/me/active`).toPromise()
  }

  public getPlayLists({ skip, limit, me = '0' }): Promise<any> {
    return this.http.get(`/api/playlists?skip=${skip}&limit=${limit}&me=${me}`).toPromise()
  }

  public getPlaylist({ id }): Promise<any> {
    return this.http.get(`/api/playlists/${id}`).toPromise()
  }

  public createPlaylist({ title, description, status }): Promise<any> {
    return this.http.post('/api/playlists', { title, description, status }).toPromise()
  }

  public addVideoToPlaylist({ id, fk }): Promise<any> {
    return this.http.patch(`/api/playlists/${id}/video/${fk}`, {}).toPromise()
  }

  public removeVideoFromPlaylist({ id, fk }): Promise<any> {
    return this.http.delete(`/api/playlists/${id}/video/${fk}`, {}).toPromise()
  }

  public updatePlaylist({ id, title, description, status }): Promise<any> {
    return this.http.patch(`/api/playlists/${id}`, { title, description, status }).toPromise()
  }

  public deletePlaylist({ id }): Promise<any> {
    return this.http.delete(`/api/playlists/${id}`).toPromise()
  }

  public async viewPlaylistDetails({ id }) {
    try {
      this.isLoadingPlaylist = true
      this.playlist = null
      this.playlist = await this.getPlaylist({ id })
      if (this.playlist) {
        this.isLoadingPlaylist = false
      }
    } catch (e) {
      console.log(e)
    }
  }

  errorMgmt(error: HttpErrorResponse) {
    console.log('>> ERROR', error)
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(throwError)
  }
}