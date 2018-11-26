import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WeatherDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-weather-detail',
  templateUrl: 'weather-detail.html',
})
export class WeatherDetailPage {
  weatherItem: any = {};
  //地点
  cityName:string;
  //温度
  temperature:string;
  //天气质量
  quality:string;
  //控制质量
  pm25:string;
  //天气状况
  situation:string;
  //建议空气状况
  suggestionAirBrf:string;
  suggestionAirTxt:string;
  //建议舒适度
  suggestionDrsgBrf:string;
  suggestionDrsgTxt:string;
  //建议感冒
  suggestionFluBrf:string;
  suggestionFluTxt:string;
  //紫外线强度
  suggestionUvBrf:string;
  suggestionUvTxt:string;




  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherDetailPage');
  }
  //获取传递的参数
  ionViewDidEnter() {

    this.weatherItem = this.navParams.data.weatherObject;

    this.cityName = this.weatherItem.result.HeWeather5[0].basic.city;
    this.temperature = this.weatherItem.result.HeWeather5[0].now.tmp;
    this.pm25 = this.weatherItem.result.HeWeather5[0].aqi.city.pm25;
    this.quality = this.weatherItem.result.HeWeather5[0].aqi.city.qlty;
    this.situation = this.weatherItem.result.HeWeather5[0].daily_forecast[0].cond.txt_d;
    this.suggestionAirBrf = this.weatherItem.result.HeWeather5[0].suggestion.air.brf;
    this.suggestionAirTxt = this.weatherItem.result.HeWeather5[0].suggestion.air.txt;

    this.suggestionDrsgBrf = this.weatherItem.result.HeWeather5[0].suggestion.drsg.brf;
    this.suggestionDrsgTxt = this.weatherItem.result.HeWeather5[0].suggestion.drsg.txt;

    this.suggestionFluBrf = this.weatherItem.result.HeWeather5[0].suggestion.flu.brf;
    this.suggestionFluTxt = this.weatherItem.result.HeWeather5[0].suggestion.flu.txt;

    this.suggestionUvBrf = this.weatherItem.result.HeWeather5[0].suggestion.uv.brf;
    this.suggestionUvTxt = this.weatherItem.result.HeWeather5[0].suggestion.uv.txt;

  }

}
