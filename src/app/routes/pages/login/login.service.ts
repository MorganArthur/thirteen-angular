import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../../../@core/constant/GlobalConstants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  /**
   * 登陆
   *
   * @param params
   */
  login(params: any): Observable<any> {
    return this.http.post(GlobalConstants.getInstance().AUTHORIZATION_SERVER + '/login', {}, {params: params});
  }

  /**
   * 登出
   */
  logout(): Observable<any> {
    return this.http.post(GlobalConstants.getInstance().AUTHORIZATION_SERVER + '/logout', {});
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): Observable<any> {
    return this.http.get(GlobalConstants.getInstance().AUTHORIZATION_SERVER + '/getCurrentUser');
  }

  /**
   * 重新加载过滤链
   */
  reloadFilterChains(): Observable<any> {
    return this.http.get(GlobalConstants.getInstance().AUTHORIZATION_SERVER + '/reloadFilterChains');
  }

}
