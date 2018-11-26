import { Component } from '@angular/core';
import { IonicPage, ViewController ,ModalController} from 'ionic-angular';
import { RegistPage } from '../regist/regist';
import {FindPasswordPage} from '../find-password/find-password';
import { NativeServiceProvider } from '../../providers/native-service/native-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from "@ionic/storage";
import {GlobalDataProvider} from "../../providers/global-data/global-data";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
              public globalData:GlobalDataProvider) {}

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
        console.log("登录的返回信息"+value);
        if(value.msg=="success"){
          this.storage.remove("USER_INFO");
          this.storage.set("USER_INFO", this.params);
          //放入缓存,放入全局变量
          this.storage.set("token",value.token);
          this.globalData.token=value.token;

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


}
