import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the DiseaseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disease-detail',
  templateUrl: 'disease-detail.html',
})
export class DiseaseDetailPage {

  //不能定义为item:any,必须定义为下面这种方式
  item: any = {};
  //科普知识标题
  title;
  //来源:手动录入,关联百科
  source;
  //其他信息
  detail;
  //2019-04-29合并疾病知识和疫苗接种
  //vaccination;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad DiseaseDetailPage');

  }

  //获取传递的参数
  ionViewDidEnter() {

    this.item = this.navParams.data.item;
    //这种写法是去除掉字符串引号，让其转为html语言
    //document.getElementById("itemDetail").innerHTML=this.item.detail;
    this.title = this.item.name;
    this.source = this.item.source;
    this.detail = this.item.detail;
    //this.vaccination = this.item.vaccination;

  }


  //生命周期函数
  //ionViewDidLoad，当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发
  //ionViewWillEnter  将要进入页面的时候触发
  //ionViewDidEnter   进入页面的时候触发
  //ionViewWillLeave   将要从页面离开时触发
  //ionViewDidLeave     离开页面时触发
  //ionViewWillUnload   当页面将要销毁同时页面上元素移除时触发


}
