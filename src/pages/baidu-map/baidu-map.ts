import { Component, ViewChild, ElementRef } from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import { Storage } from "@ionic/storage";
//import * as $ from '../../../node_modules/jquery/dist/jquery.js';//jquery引用
/**
 * Generated class for the BaiduMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var BMap;
declare var baidumap_location;
declare let appAvailability: any;
declare let startApp: any;
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

  //获取home页面的参数,用于查询
  city:any;
  //geoc = new BMap.Geocoder(); //地址解析对象




  constructor(public geolocation: Geolocation,
              public nativeService:NativeServiceProvider,
              public storage:Storage,
              public navParams:NavParams) {
    this.city = navParams.get('city');

    let that = this;
    (<any>window).goMap = function (lng,lat) {
      that.goMap(lng,lat);
    }

  }

  ionViewDidLoad() {

    //创建地图对象
    var map = new BMap.Map(this.mapElement.nativeElement, {
      enableMapClick: true
    });
    //地址解析对象



/**
    map.centerAndZoom(this.city,11);
    //var markers = new BMap.Marker(this.city);
    //var icons = "../../assets/imgs/buleicon.png";
    //var icon = new BMap.Icon(icons, new BMap.Size(25, 25)); //显示图标大小
    //markers.setIcon(icon); //设置标签的图标为自定义图标
    //map.addOverlay(markers); //将标签添加到地图中去

    var local = new BMap.LocalSearch(map, {
      renderOptions: {
        map: map,
        autoViewport: true,
        panel:"r-result"  //查询结果面板显示
      }
    });

    //默认查询新增社区服务中心查询
    local.searchNearby(['医疗机构','社区卫生服务中心'], this.city, 10000);
*/



    //获取当前位置进行范围查询

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


      //map.centerAndZoom("成都市",15);
      //将当前位置打点,并添加到地图中去//阿里巴巴矢量图标库
      //var icons = "../../assets/imgs/marker_yellow.png";
      //var icons = "../../assets/imgs/blueicon.png";
      //var icons = "../../assets/imgs/timgicon.jpeg";
      //var icons = "../../assets/imgs/mapicon.jpg";
      var icons = "../../assets/imgs/buleicon.png";

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
          autoViewport: true,//检索完是否自动调整视野
          panel:"r-result"  //查询结果面板显示
        }
      });

      var opts = {
        width : 250,     // 信息窗口宽度
        height: 80,     // 信息窗口高度
        title : "信息窗口" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
      };

      var markerArr = [];
      //2019-05-07
      local.setMarkersSetCallback(function(pois){
        for(var i=0;i<pois.length;i++){
          markerArr[i]=pois[i].marker;
          //获取点的经纬度
          //console.log("pois[i]-----"+pois[i]);
          //console.log("pois[i]getPosition-----"+pois[i].marker.getPosition().lat);
          //var marker = new BMap.Marker(new BMap.Point(,));  // 创建标注
          //把点添加到地图上去
          map.addOverlay(pois[i].marker);
          pois[i].marker.addEventListener("infowindowopen", function(e){
            //do something
            //console.log("do something");
            //console.log("e-------------"+e.target.getPosition().lng);
            //console.log("e-------------"+e.target.getPosition().lat);
            var p = e.target;
            var positionLng = e.target.getPosition().lng;
            var positionLat = e.target.getPosition().lat;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow("<a onclick=\"goMap('"+positionLng+"','"+positionLat+"')\">到这去</a>",opts);  // 创建信息窗口对象
            //也可以用下面的方式设置弹窗的内容
            //infoWindow.setContent("<a>我是aaa</a>");
            map.openInfoWindow(infoWindow,point);
          })
        }
      })





      //默认查询新增社区服务中心查询
      local.searchNearby(['医疗机构','社区卫生服务中心'], mPoint, 10000);
    }, function (error) {
      this.nativeService.showToast("查询错误");
    });
    // 禁用地图拖拽
    //map.disableDragging();

    // 开启地图拖拽
    //map.enableDragging();

    /*map.addEventListener("click", function (e) {
      //alert(e.point.lng+"---"+e.point.lat);
      this.nativeService.showToast(e.point.lng+"---"+e.point.lat);
    });*/



  }

     /**
  showInfo(e) {
    document.getElementById('lng').value = e.point.lng;
    document.getElementById('lat').value = e.point.lat;
    this.geoc.getLocation(e.point, function(rs) {
      var addComp = rs.addressComponents;
      var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
      document.getElementById('sever_add').value = address;
    });
    //addMarker(e.point);
  }
      */

  //按钮查询
  medicalSearch() {
    var map = new BMap.Map(this.mapElement.nativeElement, {
      enableMapClick: true
    }); //创建地图实例

    //获取输入查询内容
    var condition = this.medical;
    console.log("condition"+condition);
    if(condition == undefined || condition == "") {
      this.nativeService.showToast("请输入查询条件");
      this.ionViewDidLoad() ;
    }
    map.centerAndZoom(this.city,11);

    var local = new BMap.LocalSearch(map, {
      renderOptions: {
        map: map,
        autoViewport: true,
        panel:"r-result"  //查询结果面板显示
      },
      onSearchComplete : function(results) {
        //console.log(results);
      }
    });

       var opts = {
         width : 250,     // 信息窗口宽度
         height: 80,     // 信息窗口高度
         title : "信息窗口" , // 信息窗口标题
         enableMessage:true//设置允许信息窗发送短息
       };

    var markerArr = [];
    //2019-05-07
       local.setMarkersSetCallback(function(pois){
         for(var i=0;i<pois.length;i++){
           markerArr[i]=pois[i].marker;
           //获取点的经纬度
           //console.log("pois[i]-----"+pois[i]);
           //console.log("pois[i]getPosition-----"+pois[i].marker.getPosition().lat);
           //var marker = new BMap.Marker(new BMap.Point(,));  // 创建标注
           //把点添加到地图上去
           map.addOverlay(pois[i].marker);
           pois[i].marker.addEventListener("infowindowopen", function(e){
             //do something
             //console.log("do something");
             //console.log("e-------------"+e.target.getPosition().lng);
             //console.log("e-------------"+e.target.getPosition().lat);
             var p = e.target;
             var positionLng = e.target.getPosition().lng;
             var positionLat = e.target.getPosition().lat;
             var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
             var infoWindow = new BMap.InfoWindow("<a onclick=\"goMap('"+positionLng+"','"+positionLat+"')\">到这去</a>",opts);  // 创建信息窗口对象
             //也可以用下面的方式设置弹窗的内容
             //infoWindow.setContent("<a>我是aaa</a>");
             map.openInfoWindow(infoWindow,point);
           })
         }
       })

    //默认查询新增社区服务中心查询
       local.searchNearby([condition], this.city, 10000);
     }

     goMap(lng,lat){
       this.openMap(lng,lat);
     }
  openMap(lng,lat){
    var that = this;
    //alert("打开百度地图...");
    var scheme = 'com.baidu.BaiduMap';
    appAvailability.check(
      scheme,       // URI Scheme or Package Name
      function() {  // Success callback
        //window.location.href = 'bdapp://map/direction?&origin=latlng:116.291226,39.965221|name:我的位置&destination=latlng:'+lat+','+lng+'&coord_type= bd09ll&src=andr.baidu.openAPIdemo';
        window.location.href = 'bdapp://map/direction?&origin=latlng:116.291226,39.965221|name:我的位置&destination=latlng:'+lat+','+lng+'|name:目标位置&coord_type= bd09ll';
      },
      function() {  // Error callback
        //alert(scheme + ' is not available :(');
        that.nativeService.showToast("未安装百度地图App,无法进行路线规划");
        //alert(11);
      }
    );
  }



    openMap1(lng,lat){
    //百度地图参数配置
    let baiduApp = startApp.set(
      {
        "action":"ACTION_VIEW",
        "category":"CATEGORY_DEFAULT",
        "type":"text/css",
        "package":'com.baidu.BaiduMap',
        "uri":"bdapp://map/direction?&origin=latlng:116.291226,39.965221|name:我的位置&destination=latlng:116.291226,39.965221|name:天安门&coord_type= bd09ll&src=andr.baidu.openAPIdemo",
        "flags":["FLAG_ACTIVITY_CLEAR_TOP","FLAG_ACTIVITY_CLEAR_TASK"],
        "intentstart":"startActivity",
      }, { /* extras */
        "EXTRA_STREAM":"extraValue1",
        "extraKey2":"extraValue2"
      }
    );
    baiduApp.start(function(){
      //跳转到百度地图
    },function(error){
      //alert(error)
      this.nativeService.showToast("未安装百度地图App");
      //alert(1);
    })
  }



    /**

    if(condition == undefined || condition == "") {
      //alert("请输入查询条件");
      this.nativeService.showToast("请输入查询条件");
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

     */




  /**goMap = function (){
    console.log("1231231");
  };*/

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
