import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticateServiceService } from './authenticate-service.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorInterceptorService implements HttpInterceptor {

  constructor(private authservice: AuthenticateServiceService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token=this.authservice.getToken();
    if(token && this.authservice.isTokenValid())
    {
      req=req.clone({
      headers:req.headers.set('Authenticate',"Bearer "+token)
    })
    return next.handle(req);
    }else
    {
      return next.handle(req);
    }
  }

  

}
