import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalDataProvider {

  //是否评估
  private _isEvaluation: boolean;

  //城市
  private _currentCity:string;

  // 请求是否显示loading,注意:设置为true,当请求执行后需要设置为false
  private _showLoading: boolean = true;

  private _token: string='';// token

  /**
   * 获取evaluation
   */
  get evaluation(): boolean {
    return this._isEvaluation;
  }

  /**
   * 设置evaluation
   *
   */
  set evaluation(value: boolean) {
    this._isEvaluation = value;
  }

  get currentCity():string{
    return this._currentCity;
  }

  set currentCity(value:string){
    this._currentCity = value;
  }

  /**
   * 获取showLoading
   */
  get showLoading(): boolean {
    return this._showLoading;
  }

  /**
   * 设置showLoading
   */
  set showLoading(value: boolean) {
    this._showLoading = value;
  }

  /**
   * 获取token
   */
  get token(): string {
    return this._token;
  }

  /**
   * 设置token
   */
  set token(value: string) {
    this._token = value;
  }



}
