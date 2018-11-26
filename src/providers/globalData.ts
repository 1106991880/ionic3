import { Injectable } from '@angular/core';

/**
 * app全局数据
 */
@Injectable()
export class GlobalData {

  private _isEvaluation: boolean;


  /**
   * 获取token
   */
  get token(): boolean {
    return this._isEvaluation;
  }

  /**
   * 设置token
   */
  set token(value: boolean) {
    this._isEvaluation = value;
  }




}
