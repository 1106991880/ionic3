import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MainDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main-detail',
  templateUrl: 'main-detail.html',
})
export class MainDetailPage {

  item: any = {};
  title;
  //传染源、传播途径、易感人群、预防措施
  titleContent;
  //数据标题,控制率、阻断率、保护率、接种率
  //数据标题
  dataTitle;
  data;
  //详情
  content;
  //老版本的
  detail;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainDetailPage');
  }

  //获取传递的参数
  ionViewDidEnter() {
    //接受页面传递的参数
    this.item = this.navParams.data.item;
    //获取首页的传染源、传播途径、易感人群、预防措施
    //this.itemPage = this.navParams.data.itemPage;
    console.log(this.item.detail+"----------------------+++---------------");
    this.detail = this.item.detail;

    switch (this.navParams.data.itemPage) {
      case 1:
        this.title = "传染源";
        this.titleContent = this.item.infectsource;
      //  this.dataTitle = "控制率";
        this.data = this.item.controlrate;//控制率
        this.content = this.item.infectsourcedes;
        break;
      case 2:
        this.title = "传播途径";
        this.titleContent = this.item.spreadway;
      //  this.dataTitle = "阻断率";
        this.data = this.item.killrate;//阻断率
        this.content = this.item.spreadwaydes;
        break;
      case 3:
        this.title = "易感人群";
        this.titleContent = this.item.infectpeople;
      //  this.dataTitle = "保护率";
        this.data = this.item.protectrate;//保护率
        this.content = this.item.infectpeopledes;
        break;
      case 4:
        this.title = "预防措施";
        this.titleContent = this.item.precaution;
       // this.dataTitle = "接种率";
        this.data = this.item.precautionrate;//接种率
        this.content = this.item.precautiondes;
        break;
    }


  }

}
