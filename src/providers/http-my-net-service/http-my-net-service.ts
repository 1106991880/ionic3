import { Injectable } from '@angular/core';
import { Observable ,TimeoutError} from "rxjs";
import {Response, RequestOptions, Http, RequestMethod,URLSearchParams, RequestOptionsArgs, Headers} from "@angular/http";
import {NativeServiceProvider} from "../native-service/native-service";
import {APP_SERVE_URL,REQUEST_TIMEOUT} from "../constants/constants";
import { Utils } from "../Utils";
import {GlobalDataProvider} from "../global-data/global-data";

/*
  Generated class for the HttpMyNetServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpMyNetServiceProvider {
  sign;

  constructor(public http: Http,
              private  nativeService: NativeServiceProvider,
              public  globalData:GlobalDataProvider) {
    console.log('Hello HttpMyNetServiceProvider Provider');
  }

  //公共接口GET
  public commonInterfaceGet(urlGet){
    urlGet = urlGet.startsWith('http') ? urlGet : APP_SERVE_URL + urlGet;
    //加载中
    this.nativeService.showLoading();

    return Observable.create(observer => {
      this.http.get(urlGet).timeout(REQUEST_TIMEOUT)
        .subscribe((res: any) => {
        // 隐藏加载状态
        this.nativeService.hideLoading();
        //执行下一步
          console.log("res"+res);
        observer.next(res);
      },err => {// 请求失败
          this.requestFailed(urlGet, {method: RequestMethod.Get}, err);//处理请求失败
          console.log("err"+err);
          observer.error(err);
        })
    });

  }

  //共有接口POST,如果接口需要带token则传入参数true
  public commonInterfacePost(url,params,tokenNeed:boolean=false){

    params.tokenNeed = tokenNeed;
    params.token=this.globalData.token;

    url = url.startsWith('http') ? url : APP_SERVE_URL + url;
    console.log("拼接的超链接："+url);
    //'Accept': 'application/json'代表浏览器可以接受服务器返回的类型为json
    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'发给服务器的格式
    let headers = new Headers({'Accept': 'application/json;charset=utf-8','Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'});
    return this.http.post(url,this.buildURLSearchParams(params), new RequestOptions({headers: headers}))
      .toPromise()
      .then(res => this.handleSuccess(res.json()))
      .catch(error => this.handleError(error));
  }

  //成功回掉函数
  private handleSuccess(result) {

    return result;
  }
  //错误回调
  private handleError(error: Response | any) {

    let msg = '请求失败';
    if (error.status == 0) {
      msg = '请求地址错误';
    }
    if (error.status == 400) {
      msg = '请求无效';
    }
    if (error.status == 404) {
      msg = '请求资源不存在';
    }
    console.log(error);
    //在前面调用的方法下面弹出
    //this.nativeService.showToast(msg)
    return {success: false, msg: msg};
  }



  /**
   * 将对象转为查询参数
   * @param param 参数
   * @returns 查询参数
   */
  private buildURLSearchParams(param): URLSearchParams {
    let searchParams = new URLSearchParams();
    if (!param) {
      return searchParams;
    }
    let newParams = this.sortObject(param);
    for (let key in newParams) {
      let val = newParams[key];
      if (val instanceof Date) {
        val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
      }
      searchParams.set(key, val);
    }
    return searchParams;
  }

  // 为对象排序并过滤空属性
  private sortObject(obj) {
    if(!obj) return;
    var newObj = {};
    let keys = Object.keys(obj).sort();
    for(let i in keys) {
      let key = keys[i];
      if(obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }


  /**
   * 处理请求失败事件
   * @param url 请求地址
   * @param options 请求配置
   * @param err 返回结果
   */
  private requestFailed(url: string, options: RequestOptionsArgs, err: Response): void {
    // 隐藏加载状态
    this.nativeService.hideLoading();

    // 请求超时错误
    if (err instanceof TimeoutError) {
      console.log("请求超时");
      this.nativeService.alert('请求超时,请稍后再试!');
      return;
    }

    // 未联网
    if (!this.nativeService.isConnecting()) {
      this.nativeService.alert('请求失败，请连接网络');
      return;
    }

    let msg = '请求失败';
    try {
      let result = err.json();
      // 提示失败信息
      this.nativeService.alert(result.message || msg);
    } catch (err) {
      let status = err.status;
      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 401) {
        msg = '请求失败，请重新登录';
      } else if (status === 403) {
        msg = '请求失败，无权访问';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500) {
        msg = '请求失败，服务器出错，请稍后再试';
      }
      this.nativeService.alert(msg);
    }
  }



}
