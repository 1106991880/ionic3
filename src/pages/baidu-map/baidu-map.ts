import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import { Storage } from "@ionic/storage";
/**
 * Generated class for the BaiduMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var BMap;
declare var baidumap_location;
@IonicPage()
@Component({
  selector: 'page-baidu-map',
  templateUrl: 'baidu-map.html',
})
export class BaiduMapPage {
  map: any;//地图对象

  medical;

  myGeo: any;

  myIcon: any;

  @ViewChild('allmap') mapElement: ElementRef;



  constructor(public geolocation: Geolocation,
              public nativeService:NativeServiceProvider,
              public storage:Storage) {}

  ionViewDidLoad() {
    //创建地图对象
    var map = new BMap.Map(this.mapElement.nativeElement, {
      enableMapClick: true
    });
    baidumap_location.getCurrentPosition(function (result) {
      var latitude=result.latitude;
      var longitude=result.longitude;

      //当第一次点击医疗机构查询的时候，会返回正常的经纬度。
      //点击返回，马上再次点击经纬度查询的时候，经纬度会返回5e-324。
      //目前的解决方案使用下面的代码
      if(latitude=='5e-324'||longitude=='5e-324'){
        latitude = localStorage.getItem('latitude');
        longitude = localStorage.getItem('longitude');
      }else {
        localStorage.setItem('latitude', latitude);
        localStorage.setItem('longitude', longitude);
      }

      var mPoint = new BMap.Point(longitude, latitude); //获取当前位置
      map.enableScrollWheelZoom();
      map.centerAndZoom(mPoint, 15);
      //将当前位置打点,并添加到地图中去
      var icons = "../../assets/imgs/marker_yellow.png";

      var markers = new BMap.Marker(new BMap.Point(longitude, latitude)); //lng为经度,lat为纬度
      var icon = new BMap.Icon(icons, new BMap.Size(25, 25)); //显示图标大小
      markers.setIcon(icon); //设置标签的图标为自定义图标
      map.addOverlay(markers); //将标签添加到地图中去

      //圆形区域大小，颜色，透明度
      var circle = new BMap.Circle(mPoint, 10000, {
        fillColor: "blue",
        strokeWeight: 1,
        fillOpacity: 0.1,
        strokeOpacity: 0.1
      });
      map.addOverlay(circle);
      var local = new BMap.LocalSearch(map, {
        renderOptions: {
          map: map,
          autoViewport: true,
          panel:"r-result"  //查询结果面板显示
        }
      });
      local.searchNearby('医疗机构', mPoint, 10000);
    }, function (error) {
      this.nativeService.showToast("查询错误");

    });

  }


  //按钮查询
  medicalSearch() {

    var map = new BMap.Map(this.mapElement.nativeElement, {
      enableMapClick: true
    }); //创建地图实例

    //获取输入查询内容
    var condition = this.medical;
    if(condition == undefined || condition == "") {
      alert("请输入查询条件");
      this.ionViewDidLoad() ;
    } else {

      var baiduLocation = new BMap.Geolocation();
      baiduLocation.getCurrentPosition(function(message) {
        if(this.getStatus()==0) {
          map.centerAndZoom(new BMap.Point(message.point.lng, message.point.lat), 11);
          var local = new BMap.LocalSearch(map, {
            renderOptions: {
              map: map,
              autoViewport: true,
              panel:"r-result"  //查询结果面板显示
            }
          });
          local.search(condition);
        }
        else {
          //alert(this.getStatus());
          this.nativeService.showToast(this.getStatus);
        }

      },{enableHighAccuracy: true});

    }
  }


  createTimeout(errorCallback, timeout) {
    var t = setTimeout(function () {
      clearTimeout(t);
      t = null;
      errorCallback({
        code: -1,
        message: "Position retrieval timed out."
      });
    }, timeout);
    return t;
  }

}
