import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe, throwError, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '@/_services';
import { environment } from 'environments/environment';
import { catchError, switchMap, filter, take } from 'rxjs/operators'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        console.log(request)
        if (isLoggedIn 
            && isApiUrl 
            && currentUser 
            && request.url != `${environment.apiUrl}/${environment.jwtRefresh}` 
            && request.url != `${environment.apiUrl}/${environment.jwtLogin}` 
            ) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        } 
        
        return next.handle(request).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 403) {
                return this.handle403Error(request, next);
            } else {
                return throwError(error);
            }
          }));
        // return next.handle(request);
    }

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private handle403Error(request: HttpRequest<any>, next: HttpHandler) {
        console.log('handling 403')
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null);
      
          return this.authenticationService.refreshToken().pipe(
            switchMap((token: any) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(token.jwt);
              return next.handle(this.addToken(request, token.jwt));
            }));
      
        } else {
          return this.refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(jwt => {
              return next.handle(this.addToken(request, jwt));
            }));
        }
      }

      private addToken(request: HttpRequest<any>, token: string) {
        const currentUser = this.authenticationService.currentUserValue;
        return request.clone({
          setHeaders: {
            'Authorization': `Bearer  ${currentUser.token}`
          }
        });
      }
}