import { Component } from '@angular/core';
import { IonicPage, ViewController ,ModalController} from 'ionic-angular';
import { RegistPage } from '../regist/regist';
import {FindPasswordPage} from '../find-password/find-password';
import { NativeServiceProvider } from '../../providers/native-service/native-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from "@ionic/storage";
import {GlobalDataProvider} from "../../providers/global-data/global-data";
import {Http} from "@angular/http";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// 引入微信服务
declare var Wechat: any;
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public params = {
    account: '',
    password: '',
  }
  // 用户名
  account: any;
  // 密码
  password: any;

  constructor(public viewCtrl: ViewController,
              private modalCtrl: ModalController,
              public nativeService :NativeServiceProvider,
              public userService :UserServiceProvider,
              public storage:Storage,
              public globalData:GlobalDataProvider,
              public http:Http) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  closeLogin() {

    this.viewCtrl.dismiss();
  }
  /**
   * 打开窗口-注册
   */
  openModalRegister() {
    this.modalCtrl.create(RegistPage).present();
  }
  /**
   * 打开窗口-找回密码
   */
  openModalFindPassword() {
    this.modalCtrl.create(FindPasswordPage).present();
  }

  /**
   * 登录
   */
  login(){
    if(this.params.account.length>0&&this.params.password.length>0){

      this.userService.login(this.params).then(value => {
        console.log("登录的返回信息"+JSON.stringify(value));
        console.log("USER_INFO---"+JSON.stringify(this.params));
        if(value.msg=="success"){
          this.storage.remove("USER_INFO");
          this.storage.set("USER_INFO", this.params);
          //放入缓存,放入全局变量
          //this.storage.set("token",value.token);
          //this.globalData.token=value.token;

          this.nativeService.showToast("登录成功");
          this.closeLogin();
        }
        else if(value.msg=="fail"){
          this.nativeService.showToast("用户名或密码错误");
        }
        else {
          this.nativeService.showToast(value.msg);
        }
      })


    }else {
      this.nativeService.showToast('请输入账号密码');
    }
  }

  //微信登录
  wxLogin(){
    console.log("使用微信登录...");
    try {
      //alert("微信登录");
      let scope = "snsapi_userinfo";
      let state = "_" + (+new Date());
      // 1. 获取code
      Wechat.auth(scope, state, (response) => {
        console.log("获取code", response);
        //通过code去请求后台,后台返回用户信息
        var params = {
          code:response.code
        }
        this.userService.getWxUserInfo(params).then(value => {
          var params = {
            //account:value.openid,
            account:value.nickname,
            //password:'',
            password:value.openid,
            loginType:'wx',
            nickname:value.nickname,
            headimgurl:value.headimgurl
          }
          //登录成功
          this.storage.remove("USER_INFO");
          this.storage.set("USER_INFO", params);
          //放入缓存,放入全局变量
          this.storage.set("token",value.token);
          this.globalData.token=value.token;

          this.nativeService.showToast("登录成功");
          this.closeLogin();

        });

        /**
        //alert("获取code:" + JSON.stringify(response));
        let appId = "wx03950263a3466f65";
        let appSecret = "bc25fe0050e9ef807ae00594d388a11f";
        // 2. 获取token，openID
        let accessTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${response.code}&grant_type=authorization_code`;
        alert(accessTokenUrl);
        this.http.get(accessTokenUrl).map(res => res.json()).mergeMap(accessTokenResponse => {
          console.log("获取token，openID:", accessTokenResponse);
          alert("获取token，openID:" + JSON.stringify(accessTokenResponse));
          let accessToken = accessTokenResponse.access_token;
          let openId = accessTokenResponse.openid;
          let userInfoUrl = 'https://api.weixin.qq.com/sns/userinfo?access_token='+accessToken+'&openid='+openId+'';
          return this.http.get(userInfoUrl);
        }).map(res => res.json()).subscribe(userInfoResponse => {
          console.log("用户信息", userInfoResponse);
          alert("用户信息:" + JSON.stringify(userInfoResponse));
        });
        */
      }, (reason) => {
        alert("Failed: " + reason);
      });
    } catch (error) {
      console.log(error);
      alert("error"+error);
    }
  }


}
