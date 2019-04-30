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
  title1;
  title2;
  title3;
  title4;
  //传染源、传播途径、易感人群、预防措施
  titleContent1;
  titleContent2;
  titleContent3;
  titleContent4;
  //数据标题,控制率、阻断率、保护率、接种率
  //数据标题
  dataTitle;
  data;
  //详情
  content1;
  content2;
  content3;
  content4;
  //老版本的
  detail;
  itemPage;


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
    this.itemPage = this.navParams.data.itemPage;

    switch (this.navParams.data.itemPage) {
      case 1:
       // this.title1 = "传染源";
        //this.titleContent1 = this.item.infectsource;
      //  this.dataTitle = "控制率";
        //this.data = this.item.controlrate;//控制率
        //this.content1 = this.item.infectsourcedes;
        break;
      case 2:
       // this.title2 = "传播途径";
        //this.titleContent2 = this.item.spreadway;
      //  this.dataTitle = "阻断率";
       // this.data = this.item.killrate;//阻断率
        //this.content2 = this.item.spreadwaydes;
        break;
      case 3:
       // this.title3 = "易感人群";
        //this.titleContent3 = this.item.infectpeople;
      //  this.dataTitle = "保护率";
        //this.data = this.item.protectrate;//保护率
        //this.content3 = this.item.infectpeopledes;
        break;
      case 4:
      //  this.title4 = "预防措施";
        //this.titleContent4 = this.item.precaution;
       // this.dataTitle = "接种率";
        //this.data = this.item.precautionrate;//接种率
        //this.content4 = this.item.precautiondes;

        break;
    }

    //使用延迟函数，等待页面加载完成后定位到锚点(暂时方案)
    setTimeout(() => {
      //计算疾病传染风险
      if(this.itemPage=="1"){
        this.anchorPoint("cyr");
      }
      if(this.itemPage=="2"){
        this.anchorPoint("cbtj");
      }
      if(this.itemPage=="3"){
        this.anchorPoint("ygrq");
      }
      if(this.itemPage=="4"){
        this.anchorPoint("yfcs");
      }

    }, 250)

  }

  anchorPoint(id){
    this.scrollIntoView(id);
  }
  //锚点定位
  scrollIntoView(id: string){
    let element = document.getElementById(id);
    if(element){
      element.scrollIntoView();
    }
  }



}
