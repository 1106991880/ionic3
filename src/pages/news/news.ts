import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
	public msg='这是一个新闻';
	public list=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	for(var i=0;i<10;i++){
    	this.list.push('这是第'+i+'条数据')
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

}
