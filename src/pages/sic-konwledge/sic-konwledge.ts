import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/**
 * Generated class for the SicKonwledgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sic-konwledge',
  templateUrl: 'sic-konwledge.html',
})
export class SicKonwledgePage {

  knowledge: any;

  //顶部分tab页

  params = {Page: 1,knowledgeType:"1",searchText: ""};
  cindex = 1;
  List: any;
  pagesize = 10;
  hasmore = true;
  //用户是否输入了查询
  isSearch = false;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService:UserServiceProvider) {
    this.params.Page = 1;
    this.params.knowledgeType = "1";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SicKonwledgePage');
    this.loaddata(true, null, null);
  }

  //获取对应信息的详细信息
  getDetail(item){
    this.navCtrl.push("DiseaseDetailPage",{item});
  }

  //点击tab页
  sec(cindex) {
    this.params.Page = 1;
    this.cindex = cindex;
    switch (cindex) {
      case 1: this.params.knowledgeType = "1"; break;
      case 2: this.params.knowledgeType = "2"; break;
    }
    this.knowledge = [];
    this.loaddata(true, null, null);
  }
  // 查询
  onInput() {
    this.params.knowledgeType = "";
    this.params.Page = 1;
    //如果输入的值为空
    if (this.params.searchText.trim() == '') {
      this.isSearch = false;
      this.sec(1);
      return;
    }
    //用户使用查询
    this.isSearch = true;
    this.loaddata(true, null, null);
  }

  private loaddata(isFirstload, refresher: any, infiniteScroll: any) {
    this.userService.loadScientificKnowledge(this.params).then(data => {
      //第一次加载或者刷新操作
      if (refresher || isFirstload) {
        this.knowledge = data;
      }
      if (refresher)
        refresher.complete();
      //上拉刷新,把刷新的数据添加到之前的数据后面
      if (infiniteScroll) {
        this.knowledge = this.knowledge.concat(data);
        infiniteScroll.complete();
      }
      this.List = data;
      //如果按照页码查询的数据小于当前页条数，说明查询到最后一页了
      if (this.List.length < this.pagesize) {
        this.hasmore = false;
      } else {
        this.hasmore = true;
      }
    }, err => {
      if (refresher) {
        refresher.complete();
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    })
  }

  //上拉加载
  doInfinite(infiniteScroll) {
    if (this.hasmore) {
      this.params.Page++;
      this.loaddata(false, null, infiniteScroll);
    } else {
      infiniteScroll.complete();
    }
  }

  //下拉刷新
  doRefresh(refresher) {
    this.knowledge = [];
    this.params.Page = 1;
    this.loaddata(false, refresher, null);
  }

}
