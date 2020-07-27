import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

	constructor(private localStorage: LocalStorage) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (req.url.indexOf('amazonaws.com') > -1) {
			return next.handle(req)
		}
		return this.localStorage.getItem('AuthToken').flatMap(token => {
			const clonedRequest = req.clone({
				headers: req
					.headers
					.set('Authorization', token ? `Bearer ${token}` : '')
			});
			return next.handle(clonedRequest);
		})

	}
}