import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { NativeServiceProvider } from '../../providers/native-service/native-service';
import { LoginPage } from '../login/login';
/**
 * Generated class for the RegistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-regist',
  templateUrl: 'regist.html',
})
export class RegistPage {

  // 表单
  registerForm: any;
  sex;
  // 定时器
  timer: any;
  // 定时器计时
  time = 60;
  // 是否已获取验证码
  isrun: boolean = false;

  //验证码
  phoneCode;

  //获取验证码的手机号码,防止获取到正确验证码之后修改手机号
  getCodePhoneNum;






  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              public actionSheetCtrl: ActionSheetController,
              public userService: UserServiceProvider,
              public nativeService: NativeServiceProvider
  ) {
    this.registerForm = this.formBuilder.group({
      account: [, [Validators.required]],
      password: [, [Validators.required]],
      confirmpassword: [, [Validators.required]],
      //手机号码
      phonenum: [, [Validators.required, Validators.pattern('1[0-9]{10}')]],
      //手机验证码
      codenum: [, [Validators.required]],
      // age: [, [Validators.required]],
      // sex: [, ],

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistPage');
  }
  register() {

    this.registerForm.value.sex = this.sex;
    if(this.registerForm.value.password!==this.registerForm.value.confirmpassword){
      this.nativeService.showToast('输入密码不一致');
      return;
    }



    //if(this.registerForm.value.sex == "男" || this.registerForm.value.sex == "女") {
      if(this.registerForm.value.codenum==this.phoneCode) {
        console.log("验证码输入正确。。。");

        if(this.registerForm.value.phonenum!=this.getCodePhoneNum){
          this.nativeService.showToast('当前手机号与获取验证码的手机号不一致');
          return;
        }

        this.userService.userRegist(this.registerForm.value).then(value => {
          console.log(value.msg);
          if (value.msg == "accountExist") {
            this.nativeService.showToast('账号已存在');
            return;
          }
          if (value.msg == "fail") {
            this.nativeService.showToast('注册失败');
            return;
          }
          if (value.msg == "success") {
            this.nativeService.showToast('注册成功');
            this.navCtrl.setRoot(LoginPage);
          }

        })
      }
      else {
        this.nativeService.showToast("验证码输入错误");
      }
    // } else {
    //   this.nativeService.showToast("请正确填写您的性别");
    // }
  }
  //form表单
  confirm() {

  }
  // 关闭窗口
  dismiss() {
    if(this.timer) {
      clearInterval(this.timer);
    }
    this.viewCtrl.dismiss();
  }
  //性别选择
  sexActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '选择性别',
      buttons: [{
        text: '男',
        role: 'destructive',
        handler: () => {
          this.sex = '男';
          this.registerForm.value.sex = '男';
        }
      }, {
        text: '女',
        handler: () => {
          this.sex = '女';
          this.registerForm.value.sex = '女';
        }
      }, {
        text: '取消',
        role: 'cancel',
        handler: () => {}
      }]
    });
    actionSheet.present();
  }


  //获取验证码
  getCode() {

    if(!this.isrun) {
      let obj = {
        phonenum: this.registerForm.value.phonenum,
        timestamp: new Date().getTime()
      };
      this.userService.getUserSms(obj).then(data => {
        if(data==false){
          console.log("短信验证失败");
          this.nativeService.showToast('短信验证失败');
          this.time = 60;
          this.isrun = false;
          return;
        }
        else {
          console.log("短信验证成功"+data);
          //获取到验证码之后，防止改变电话号码的情况
          this.getCodePhoneNum = this.registerForm.value.phonenum;
          console.log("获取验证码的手机号"+this.getCodePhoneNum);
          this.nativeService.showToast('短信验证码已发送到手机');
          //用于判断用户输入的验证码和收到的验证码是否一致
          this.phoneCode = data;
        }

      });

      this.timer = setInterval(() => {
        this.time--;
        this.isrun = true;
        if(this.time == 0) {
          clearInterval(this.timer);
          this.time = 60;
          this.isrun = false;
        }
      }, 1000);
    }
  }




}
