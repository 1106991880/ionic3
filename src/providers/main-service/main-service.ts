//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpMyNetServiceProvider } from '../http-my-net-service/http-my-net-service';

/*
  Generated class for the MainServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MainServiceProvider {

  constructor(public httpMyNetService: HttpMyNetServiceProvider) {
    console.log('Hello MainServiceProvider Provider');
  }

  //天气
  public getWeather(params){
    console.log("获取天气信息..参数"+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost("/getWeather",params);
  }
  //首页数据
  public mainData(params){
    console.log("首页数据请求......");
    return this.httpMyNetService.commonInterfacePost('/ionicHomeData',params);
    //return this.httpMyNetService.commonInterfacePost('/ionicHomeDataOld',params);
  }

  //风险评估指数
  public riskIndex(params){
    console.log("风险评估指数..."+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/riskIndex',params);
  }

  //风险评估指数显示最新的评估数据
  public getRiskIndexNew(params){
    console.log("最新风险评估指数..."+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/getRiskIndexNew',params);
  }

  //当前条件下的风险
  public indexByCityAndTime(params){
    console.log("进入评估中..."+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/getIndexByCityAndTimeNew',params);
  }

  //用户的动态曲线
  public getUserDynamicData(params){
    console.log("获取用户的动态曲线"+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/getUserDynamicData',params);
  }


  //用户动态曲线(修改)
  public getPgResults(params){
    console.log("获取用户的动态曲线参数"+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/getPgResults',params);
  }

}
