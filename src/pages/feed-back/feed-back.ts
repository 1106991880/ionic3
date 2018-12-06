import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {UserServiceProvider} from "../../providers/user-service/user-service";

/**
 * Generated class for the FeedBackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed-back',
  templateUrl: 'feed-back.html',
})
export class FeedBackPage {
  feedbackMsg;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public nativeService:NativeServiceProvider,
              public userService:UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedBackPage');
  }

  submit() {
    if(this.feedbackMsg){
      this.userService.feedBack({feedbackMsg: this.feedbackMsg}).then(value => {
        if(value.result=="success"){
          this.nativeService.showToast('意见反馈成功');
          this.navCtrl.pop();
        }
        else {
          this.nativeService.showToast('意见反馈失败');
        }

      });

    }else {
      this.nativeService.showToast('请输入反馈内容');
    }

  }

}
