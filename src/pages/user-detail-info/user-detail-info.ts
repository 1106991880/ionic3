import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UserServiceProvider} from "../../providers/user-service/user-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";

/**
 * Generated class for the UserDetailInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-detail-info',
  templateUrl: 'user-detail-info.html',
})
export class UserDetailInfoPage {

  userInfo: { [key: string]: any };
  //用户其他信息
  public params = {
    account:'',
    password:'',
    sex: '',
    age: '',
    phoneNumber: '',
    basicIllness:[],
    vaccination:[],
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public storage:Storage,
              public userService:UserServiceProvider,
              public nativeService:NativeServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailInfoPage');
    //加载页面获取缓存的信息,将账号显示在页面上
    //不应该获取缓存的数据,应该获取当前账号的用户的基本信息

    //this.userService.getUserInfo();
    this.storage.get("USER_INFO").then(value => {
      var userAccount = {
        account:value.account
      }

      this.userService.getUserInfo(userAccount).then(value1 => {
        //返回值不为空
        if(value1!=null||value1!=''){
          this.params.account = value1.account;
          this.params.sex = value1.sex;
          //如果未填写基本信息
          if(value1.age==0){
            this.params.age='';
          }else {
            this.params.age = value1.age;
          }
          if(value1.phoneNumber==0){
            this.params.phoneNumber='';
          }else {
            this.params.phoneNumber = value1.phonenumber;
          }
          console.log("多选的回显示："+value1.basicillness);
          //把返回的字符串用逗号分割成数组
          this.params.basicIllness = value1.basicillness.split(",");
          this.params.vaccination =value1.vaccination.split(",");
        }
        else {
          console.log("全为空,不赋值");
        }
      })
    })
  }

  // 选择性别
  sexActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '选择性别',
      buttons: [
        {
          text: '男',
          role: 'destructive',
          handler: () => {
            this.params.sex = '男';
          }
        }, {
          text: '女',
          handler: () => {
            this.params.sex = '女';
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  //保存到详细信息表里
  save(){
    console.log("保存的信息"+this.params);
    console.log("保存的信息1"+this.params.basicIllness);

    var reg=/^[0-9]+.?[0-9]*$/;//判断输入是否为数字,年龄和电话号码
    if(!reg.test(this.params.age)){
      this.nativeService.showToast("请输入正确的年龄");
      return;
    }
    //年龄不能超过三位数,并且第一位不能为0
    var ageJudge = /^[1-9]\d{0,2}$/;
    if(!ageJudge.test(this.params.age)){
      this.nativeService.showToast("请输入正确的年龄");
      return;
    }
    if(!reg.test(this.params.phoneNumber)){
      this.nativeService.showToast("请输入正确的电话号码");
      return;
    }

    if(this.params.sex=='男'||this.params.sex=='女'){
    this.userService.changeUserInfo(this.params).then(value => {
      console.log("修改基本信息后的返回值"+value.msg);
      if(value.msg=='success') {
        this.nativeService.showToast("保存成功");

      }
      else {
        this.nativeService.showToast("保存失败");
        return;
      }
    })
    }
    else {
      this.nativeService.showToast("请输入正确的性别");
      return;
    }

  }






}
