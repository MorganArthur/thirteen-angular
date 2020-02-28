import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ResponseResultModel } from '../net/response-result.model';
import { UserModel } from '../../routes/system/user/user.model';
import { LoginService } from '../../routes/pages/login/login.service';

/**
 * 路由守卫，访问权限认证
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private loginService: LoginService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkActive(state.url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  checkActive(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.loginService.getCurrentUser().subscribe((res: ResponseResultModel) => {
        const currentUser: UserModel = res.result;
        let canActive = false;
        if (currentUser !== null && currentUser.applications != null) {
          if (url === '/views') {
            canActive = true;
          } else {
            for (const application of currentUser.applications) {
              if (application.url === url) {
                canActive = true;
                break;
              }
            }
          }
        }
        if (!canActive) {
          this.router.navigate(['/pages/404']);
        }
        resolve(canActive);
      });
    });
  }

}
