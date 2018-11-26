import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
//引入等待样式
import {LoadingController} from 'ionic-angular';
import {AlertController} from "ionic-angular";
import {UserServiceProvider} from "../../providers/user-service/user-service";

//应用内下载
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {FileOpener} from '@ionic-native/file-opener';
import {InAppBrowser} from '@ionic-native/in-app-browser';

/**
 * Generated class for the CheckVersionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-check-version',
  templateUrl: 'check-version.html',
})
export class CheckVersionPage {
  //app版本号
  currentNo = '1.0.1';
  appSystem = 'Android';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public userService: UserServiceProvider,
              private file: File,
              public fileTransfer: FileTransfer,
              public fileOpener:FileOpener,
              public nativeService: NativeServiceProvider,
              private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckVersionPage');
  }

  ionViewWillEnter() {
    //先设置为android
    if (this.appSystem == 'Android') {
      //显示加载样式
      let loading = this.loadingCtrl.create({
        content: '版本检测中'//数据加载中显示
      });
      //显示等待样式
      loading.present();
      //安卓更新
      this.userService.getAppVersion({appSystem: this.appSystem}).then(data => {
        let obj: any = data;
        console.log(obj);
        //this.nativeService.hideLoading();
        loading.dismiss();
        if (this.currentNo != obj.serverAppVersion) {
          this.alertCtrl.create({
            title: '发现新版本,是否立即升级？',
            subTitle: obj.infos,
            enableBackdropDismiss: false,
            buttons: [{text: '取消'},
              {
                text: '确定',
                handler: () => {
                  this.downloadApp(obj);
                  //this.inAppBrowser.create(obj.url, '_system');
                }
              }
            ]
          }).present();
        }
      })
    }
  }


  //应用内下载
  downloadApp(obj) {
    //显示下载进度
    let alert = this.alertCtrl.create({
      title: '下载进度：0%',
      enableBackdropDismiss: false,
      buttons: ['后台下载']
    });
    alert.present();
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const apk = this.file.externalRootDirectory + 'android.apk'; //apk保存的目录
    //下载并安装apk
    fileTransfer.download(obj.url, apk).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      //window['install'].install(apk.replace('file://', ''));
      //打开apk
       this.fileOpener.open(apk,'application/vnd.android.package-archive')
         .then(()=>{console.log("打开apk成功");})
         .catch(e=>{
           console.log("打开apk失败",e);
           //this.nativeService.showToast("打开apk失败");
           this.alertCtrl.create({
             title: '前往网页下载',
             subTitle: '本地升级失败',
             buttons: [{text: '取消'},
               {
                 text: '确定',
                 handler: () => {
                   this.inAppBrowser.create(obj.url, '_system');
                 }
               }
             ]
           }).present();
         });
    }, err => {
      this.nativeService.showToast("请在:设置-权限管理-开启读写手机存储权限");
      alert.dismiss();
      this.nativeService.showToast('android app 本地升级失败');
      this.alertCtrl.create({
        title: '前往网页下载',
        subTitle: '本地升级失败',
        buttons: [{text: '取消'},
          {
            text: '确定',
            handler: () => {
              this.inAppBrowser.create(obj.url, '_system');
            }
          }
        ]
      }).present();
    });
    //更新下载进度
    fileTransfer.onProgress((event: ProgressEvent) => {
      let num = Math.floor(event.loaded / event.total * 100);
      if (num === 100) {
        alert.dismiss();
      } else {
        let title = document.getElementsByClassName('alert-title')[0];
        title && (title.innerHTML = '下载进度：' + num + '%');
      }
    });
  }


}
