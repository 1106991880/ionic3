import { Component } from '@angular/core';
import { NavController, ModalController ,AlertController} from 'ionic-angular';
import { BackButtonService } from "../../services/backButton.service";
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {UserServiceProvider} from "../../providers/user-service/user-service";
import {Storage} from "@ionic/storage";
import {GlobalDataProvider} from "../../providers/global-data/global-data";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  // 用户信息
  user: any = {};
  // 是否登录
  isLogin: Boolean = false;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private backButtonService: BackButtonService,
              private platform: Platform,
              public userService :UserServiceProvider,
              public alertCtrl: AlertController,
              public storage:Storage,
              public globalData:GlobalDataProvider) {}
  //每次进入页面,获取一下用户信息
  ionViewWillEnter(){
    this.refreshUserInfo();
  }
  //刷新用户信息
  refreshUserInfo(){
    this.userService.isLogin().then(isLogin => {
      this.isLogin = isLogin;
      if(isLogin){
        this.userService.getLoginInfo().then(userInfo => {
          this.user = userInfo;
        })
      }
    })
  }

  toPageLogin() {
    if(this.isLogin) {
      //填写详细信息
      this.navCtrl.push("UserDetailInfoPage",{
        userInfo:this.user
      });

    } else {
      this.navCtrl.push("LoginPage");
    }
  }
  //意见反馈界面跳转
  toPageFeedBack(){
    this.futureDevelop();
  }
  //关于界面跳转
  toPageAppAbout(){
    this.navCtrl.push("AppInfoPage");
  }
  //版本检测
  detectVersion(){
    this.navCtrl.push("CheckVersionPage")
  }
  //修改密码
  changePassword(){
    //alert("这是修改密码页面");
    this.navCtrl.push("ChangePasswordPage");
  }
  //退出登录
  logout(){
    let alert = this.alertCtrl.create({
      title: '确定退出登录吗?',
      buttons: [
        {
          text: '否',
          handler: () => {
          }
        },
        {
          text: '是',
          handler: () => {
            //清除缓存,清除全局变量
            this.storage.set("token", '');
            this.globalData.token = '';
            this.storage.set("isEvaluation",false);
            this.userService.logout().then(() => {
              this.refreshUserInfo();
            });
          }
        }
      ]
    });
    alert.present();
  }
  //功能还在开发中的提示
  futureDevelop(){
    let alert = this.alertCtrl.create({
      title:'功能还在开发中～',
      buttons:[{
        text: '确定',
        handler: () => {

        }
      }]
    })
    alert.present();
  }
}
