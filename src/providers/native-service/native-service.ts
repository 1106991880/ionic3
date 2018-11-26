//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
//使用命令添加插件ionic cordova plugin add cordova-plugin-x-toast
//npm install --save @ionic-native/toast
import { Toast } from '@ionic-native/toast';
import {ToastController, Loading, LoadingController, Platform, AlertController} from 'ionic-angular';
import {GlobalDataProvider} from "../global-data/global-data";
import {REQUEST_TIMEOUT} from '../constants/constants';
import {Network} from "@ionic-native/network";

/*
  Generated class for the NativeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
/**
 * app状态的ts文件
 */
@Injectable()
export class NativeServiceProvider {
  // 加载状态
  private loading: Loading;
  // 是否正在加载
  private loadingIsOpen: boolean = false;

  constructor(private toastCtrl: ToastController,
              private toast: Toast,
              private http: Http,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private globalData: GlobalDataProvider,
              private alertCtrl: AlertController,
              private network: Network,
  ) {
    console.log('Hello NativeServiceProvider Provider');
  }

  /**
   * 提示信息
   * @param message 信息内容
   * @param duration 显示时长，默认：2000，单位ms
   */
  showToast(message: string = '操作完成', duration: number = 2000, position: string = "bottom"): void {
    //如果是移动手机
    if(this.isMobile()) {
      this.toast.show(message, String(duration), 'bottom').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'bottom',
        showCloseButton: false
      }).present();
    }
  };

  /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }
  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }
  /**
   * 判断是否有网络
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }

  /**
   * 显示加载中状态
   * @param content 显示的内容，默认：空
   */
  showLoading(content: string = ''): void {
    if (!this.globalData.showLoading) {
      return;
    }
    if (!this.loadingIsOpen) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content
      });
      this.loading.present();
      setTimeout(() => {
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
      }, REQUEST_TIMEOUT);
    }
  };
  /**
   * 关闭加载中状态
   */
  hideLoading(): void {
    if (!this.globalData.showLoading) {
      this.globalData.showLoading = true;
    }
    this.loadingIsOpen && this.loading.dismiss();
    this.loadingIsOpen = false;
  };

  /**
   * 提示信息-需点击按钮确认
   * @param title 标题
   * @param subTitle 子标题-默认：""
   * @param buttonText 按钮名-默认：确定
   */
  alert(title: string, subTitle: string = "", buttonText: string = "确定"): void {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{ text: buttonText }]
    }).present();
  }

}
