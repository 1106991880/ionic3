import { Injectable } from '@angular/core';
import { HttpMyNetServiceProvider } from '../http-my-net-service/http-my-net-service';
import { Http } from "@angular/http";
import { NativeServiceProvider} from "../native-service/native-service";
import { Storage} from "@ionic/storage";
import { ModalController} from 'ionic-angular';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  constructor(private httpMyNetService: HttpMyNetServiceProvider,
              public http: Http,
              public nativeService :NativeServiceProvider,
              public storage:Storage,
              public modalCtrl: ModalController) {
    console.log('Hello UserServiceProvider Provider');
  }


  //用户注册
  public  userRegist(params){
    console.log(params);
    return this.httpMyNetService.commonInterfacePost('/ionicRegist',params);
  }

  //登录
   public login(params){
    console.log(params);
    console.log("进入登录方法");
    return this.httpMyNetService.commonInterfacePost('/ionicLogin',params);
  }
  //修改密码
  public changePassword(params){
    console.log("修改密码的参数"+params);
    return this.httpMyNetService.commonInterfacePost('/ionicChangePassword',params);

  }
  //找回密码
  public findPwd(params){
    console.log("找回密码的参数"+params);
    return this.httpMyNetService.commonInterfacePost('/findPassword',params);
  }

  //更新用户信息
  public changeUserInfo(params){
    console.log("更新用户信息的参数"+params);
    return this.httpMyNetService.commonInterfacePost('/ionicChangeUserInfo',params);
  }
  //获取用户全部信息
  public getUserInfo(params){
    console.log("获取用户全部信息的参数"+params);
    return this.httpMyNetService.commonInterfacePost('/ionicGetUserInfo',params);
  }

  //获取短信验证码
  public getUserSms(params){
    console.log("短信验证码参数"+params);
    return this.httpMyNetService.commonInterfacePost('/getUserSms',params);
  }

  //版本检测
  public getAppVersion(param){
    console.log("进入版本检测.."+param);
    return this.httpMyNetService.commonInterfacePost("/getAppVersion",param);
  }

  //加载科普知识
  public loadScientificKnowledge(params){
    //return this.httpMyNetService.commonInterfacePost('/getScientificKnowledge',params);
    //getScientificKnowledgeV2,2019-04-25
    return this.httpMyNetService.commonInterfacePost('/getScientificKnowledgeV2',params);
  }

  //我的健康页面echarts数据,返回随机数测试
  public getEchartsData(){
    return this.httpMyNetService.commonInterfaceGet('/getEchartsData');
  }

  //我的健康页面数据
  public getHealthData(){
    console.log("获取我的健康页面数据");
    return this.httpMyNetService.commonInterfaceGet('/getHealthData');
  }

  //意见反馈
  public feedBack(params){
    console.log("意见反馈参数"+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/feedBack',params);
  }

  //关注城市
  public cityFocus(params){
    console.log("城市关注参数"+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/cityFocus',params);
  }

  //查询已关注的城市
  public selectCityFocus(params){
    console.log("查询已关注的城市参数："+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/selectCityFocus',params);
  }

  //取消关注
  public cityFocusDelete(params){
    console.log("取消关注参数："+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/cityFocusDelete',params);
  }

  //健康页面的仪表盘数据
  public getHealthPageRiskIndex(params){
    console.log("获取健康页面的参数："+JSON.stringify(params));
    return this.httpMyNetService.commonInterfacePost('/getHealthPageRiskIndex',params);
  }

  //个人健康信息页面的风险评估影响因素数据
  public getRiskFactor(){
    return this.httpMyNetService.commonInterfaceGet('/getRiskFactor');
  }

  //微信登录
  public getWxUserInfo(params){
    return this.httpMyNetService.commonInterfacePost('/getWxUserInfo',params);
  }


  /**
   * 当前是否登录
   * @param isNeedShowLogin
   */
  isLogin(isNeedShowLogin: boolean = false){
    // return this.getLoginInfo().then(value => {
    //   let isLogin = value ? true:false;
    // })
    return new Promise<Boolean>(resolve =>
      this.getLoginInfo().then(data => {
        let isLogin = data ? true : false;
        resolve(isLogin);
        if (!isLogin && isNeedShowLogin) {
          this.modalCtrl.create('LoginPage').present();
        }
      })
    );
  }
  //获取用户信息
  getLoginInfo(){
    return this.storage.get("USER_INFO");
  }
  //退出登录
  logout() {
    return this.storage.remove("USER_INFO");
  }

}
