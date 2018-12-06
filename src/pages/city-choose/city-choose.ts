import { Component, ViewChildren, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,Content} from 'ionic-angular';
import { CityProvider } from './../../providers/cityprovider';
import {ViewController} from "ionic-angular";
import {AlertController} from 'ionic-angular';
import {UserServiceProvider} from "../../providers/user-service/user-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {Storage} from "@ionic/storage";
import {ItemSliding} from "ionic-angular";


/**
 * Generated class for the CityChoosePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-city-choose',
  templateUrl: 'city-choose.html',
  providers: [CityProvider]
})
export class CityChoosePage {
  indexes: Array<string> = []
  cities: Array<any> = [];
  filterCities: Array<any> = [];
  cityFocus:any;
  isLogin: Boolean = false;

  @ViewChildren('cityGroup') cityGroup;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public cityProvider: CityProvider,
              public viewCtrl:ViewController,
              public alertCtrl:AlertController,
              public userService:UserServiceProvider,
              public nativeService:NativeServiceProvider,
              public storage:Storage) {
    this.indexes = cityProvider.getIndexes();
    this.cities = cityProvider.getGroupCities();
  }

  ionViewDidLoad() {
    var $this = this;
    function alphabetMove(e, move) {
      var pPositionY = e.changedTouches[0].clientY
      var currentItem, targetItem;
      var d = document;
      currentItem = d.elementFromPoint(d.body.clientWidth - 1, pPositionY);
      if (!currentItem || currentItem.className.indexOf('index-bar') < 0) return;
      targetItem = document.getElementById(currentItem.innerText);
      document.getElementById('indexs-title').style.display = 'block'
      document.getElementById('indexs-title').innerText = currentItem.innerText;
      if (move) {
        var index = $this.indexes.join('').indexOf(currentItem.innerText);
        $this.content.scrollTo(0, $this.cityGroup._results[index].nativeElement.offsetTop, 300);
      }
    }
    var indexsBar = document.getElementById('indexs-bar');
    indexsBar.addEventListener('touchstart', function (e) {
      alphabetMove(e, false);
    });
    indexsBar.addEventListener('touchmove', e => {
      alphabetMove(e, false);
    });
    indexsBar.addEventListener('touchend', function (e) {
      alphabetMove(e, true);
      document.getElementById('indexs-title').style.display = 'none';
    });
  }
  //将要进入页面
  ionViewWillEnter(){
    //判断是否登录,登录则显示关注城市,未登录则不显示已关注城市
    this.userService.isLogin().then(isLogin => {
      this.isLogin = isLogin;
    })
  }

  //每次进入页面加载登录用户查询关注的城市
  ionViewDidEnter(){
    //查询当前用户关注的城市
    this.userService.isLogin().then(isLogin => {
      //已经登录
      if (isLogin) {
        //获取用户账号
        this.storage.get("USER_INFO").then(value => {
          //将用户账号得到作为参数,查询用户已经关注的城市
          this.userService.selectCityFocus(value).then(value1 => {
            this.cityFocus = [];
            console.log("value1:"+value1);
            this.cityFocus = value1;
          });
        })
      }
      else {
        //未登录则不显示关注城市

      }
    })
  }

  citySelect(city) {
    console.log("city:"+JSON.stringify(city));
    this.viewCtrl.dismiss(city);
  }
  //城市关注
  cityPressc(city,slidingItem) {
    console.log("city:"+JSON.stringify(city));
    //判断用户是否登录
    this.refreshUserInfo(city,slidingItem);

  }

  //移除关注
  delete(city){
    console.log("进入移除关注操作");
    console.log(city);
    this.storage.get("USER_INFO").then(value => {
      //将用户账号得到作为参数,服务器使用账号存用户关注的城市
      city.userAccount = value.account;
      this.userService.cityFocusDelete(city).then(value1 => {
        if(value1.result=='success'){
          //取消关注之后重新加载一下页面
          this.ionViewDidEnter();
          this.nativeService.showToast("取消关注成功");
        }
        else {
          this.nativeService.showToast("取消关注失败");
        }
      });

    })

  }

  //判断用户是否已经登录,登录的用户才能进行关注
  refreshUserInfo(city,slidingItem:ItemSliding) {
    this.userService.isLogin().then(isLogin => {
      //已经登录
      if (isLogin) {
        //进行关注操作
        //获取用户账号
        this.storage.get("USER_INFO").then(value => {
          //将用户账号得到作为参数,服务器使用账号存用户关注的城市
          city.userAccount = value.account;
          this.userService.cityFocus(city).then(value1 => {
            if(value1.result=='success'){
              //关注成功加载一下页面
              this.ionViewDidEnter();
              //关注成功后,关闭滑动
              slidingItem.close();
              this.nativeService.showToast("关注成功");
            }
            else {
              this.nativeService.showToast("已经关注该城市或关注失败");
            }
          });

        })

      }
      else {
        this.nativeService.showToast("请先登录,登录后才能关注城市");
        this.navCtrl.push("LoginPage");
      }
    })
  }


  //顶部关闭按钮
  dismiss(){
    let cityClose={name:"",};
    this.viewCtrl.dismiss(cityClose);
  }

  getItems(e) {
    var newVal = e.target.value;
    if (newVal) {
      this.filterCities = this.cityProvider.filterCities(newVal);
    }
    else {
      this.filterCities = [];
    }
    this.content.scrollToTop(500);
  }

}
