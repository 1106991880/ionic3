import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { NativeServiceProvider } from '../../providers/native-service/native-service';

/**
 * Generated class for the FindPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-password',
  templateUrl: 'find-password.html',
})
export class FindPasswordPage {
  // 短信发送计时定时器
  timer: any;
  // 短信发送定时时间
  time = 60;
  // 表单
  findPasswordForm: any;
  // 是否已获取验证码
  isrun: boolean = false;
  //验证码
  phoneCode;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              public userService: UserServiceProvider,
              public nativeService: NativeServiceProvider) {
    this.findPasswordForm = this.formBuilder.group({
      username: [, [Validators.required]],
      phonenum: [, [Validators.required, Validators.minLength(11), Validators.pattern('1[0-9]{10}')]],
      codenum: [, [Validators.required, Validators.minLength(4), Validators.pattern('[0-9]{4}')]],
      password: [, [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPasswordPage');
  }
  // 关闭窗口
  dismiss() {
    this.viewCtrl.dismiss();
  }

  // 获取验证码
  getCode() {
    if(this.findPasswordForm.value.phonenum){
      if(this.findPasswordForm.value.phonenum.length!=11){
        this.nativeService.showToast('检查手机号是否输入正确');
        return;
      }

      if (!this.isrun) {
        let obj = {
          phonenum: this.findPasswordForm.value.phonenum,
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
    else {
      this.nativeService.showToast('检查手机号是否输入正确');
    }

  }

    //保存提交
  /*submit() {
    this.userService.resetPwd(this.findPasswordForm.value).subscribe(result => {
      this.nativeService.showToast('密码重置成功');
      this.dismiss();
    });
  }*/

  //保存提交
  submit(){
    console.log("提交");
    //判断输入的验证和实际发送的验证码是否一致
    if(this.findPasswordForm.value.codenum==this.phoneCode) {
      this.userService.findPwd(this.findPasswordForm.value).then(value => {

        if (value.msg == "success") {
          this.nativeService.showToast("修改密码成功");
          /*this.userService.logout().then(value2 => {
            console.log(value2);
            //清除缓存
            this.userService.logout().then(() => {
              console.log("清除缓存");
            });
            this.navCtrl.remove(1);
            //重新登录
            this.navCtrl.push("LoginPage");
          });*/
        }
        if (value.msg == "fail") {
          this.nativeService.showToast("修改密码失败");
          return;
        }
        if (value.msg == "accountNotFind") {
          this.nativeService.showToast("账号不存在");
          return;
        }
      });
    }
    else {
      this.nativeService.showToast("验证码输入错误");
      return;
    }

  }
  confirm(){

  }












}
