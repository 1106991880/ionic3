import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';

import {UserServiceProvider} from "../../providers/user-service/user-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {MainServiceProvider} from "../../providers/main-service/main-service";
import {Storage} from "@ionic/storage";
import {AboutPage} from "../about/about";
import {CityChoosePage} from "../city-choose/city-choose";
//引入等待样式
import {LoadingController} from 'ionic-angular';

//使用时间控件
import {DatePicker} from '@ionic-native/date-picker';

import {DatePickerOptions} from '@ionic-native/date-picker';
//日历选择控件
import {Calendar} from '@ionic-native/calendar';

import {BaiduMapPage} from '../baidu-map/baidu-map';
// @ts-ignore
import citise from '../../assets/chinese-cities.json';

declare var echarts; //设置echarts全局对象
//当前城市
declare var BMap;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('EchartsContent') container: ElementRef; //与html中div #container1对应
  EChart: any;

  //防疫站首页数据
  listData: any;
  //是否点击评估
  isEvaluation;
  //风险指数
  index = "";

  //时间
  public event = {
    month: '2018-09-21',
    time: '',
  };
  //城市三级联动
  public eventcity = {
    text: '',
    value: ''
  }

  //城市
  localCityName: string;//用于查询天气
  //城市，用于在界面上显示，城市名过长的时候显示省略号
  localCityNameSub: String;
  //手动选择的城市
  chooseCity;

  dateStr;
  //天气
  cityWeather;
  //天气图标
  weatherIcon;
  //查询天气的所有结果
  weatherObject: any;

  //仪表盘数据格式
  dashData: any = [{value: 20, name: '流行性感冒'}];

  //计算流感流行度的参数
  public popularIndex = {
    //当前城市名称、也可以是选择城市之后的名称
    localCityName: '',
    //当前时间
    currentTime: ''
  }
  //地区
  cityColumns: any[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public nativeService: NativeServiceProvider,
              public storage: Storage,
              public datePicker: DatePicker,
              public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public calendar: Calendar,
              public mainService: MainServiceProvider) {

    this.chooseCity = navParams.data.name;
    this.cityColumns = citise;

  }

  ionViewDidLoad() {
    //选择的城市
    console.log("选择的城市:" + this.chooseCity);

    this.getCurrentCityName().then(value => {
      // @ts-ignore
      this.localCityName = value;
      //地区长度过长使用省略号代替,将城市名作为其他参数的时候还是要使用localCityName,不使用localCityNameSub
      let cityNameLength = this.localCityName.length;
      console.log("cityNameLength" + cityNameLength);
      if (cityNameLength > 5) {
        let str = this.localCityName.substring(0, 5) + "...";
        this.localCityNameSub = str;
      }
      else {
        this.localCityNameSub = this.localCityName;
      }
      let cityWeatherParam = {
        cityName: this.localCityName
      }
      this.getWeather(cityWeatherParam);
    });

    //获取城市,现修改为上面的方式,封装成promise
    /*var myCity = new BMap.LocalCity();
    myCity.get(function (result) {
      var cityName = result.name;
      //使用localStoage存储cityName. 此处不可以使用this.localCityName = cityName; 因为这里的this 指向的是当前的类， 也就是 function(result)这个类
      localStorage.setItem('currentCity', cityName);
      return cityName;
    });*/

    //localStorage.getItem('currentCity');

    //延迟毫秒取存储在localStorage中的 cityName,防止时间太短，未获取到最近的城市
    /*setTimeout(() => {
      this.localCityName = localStorage.getItem('currentCity');
      //地区长度过长使用省略号代替,将城市名作为其他参数的时候还是要使用localCityName,不使用localCityNameSub
      let cityNameLength = this.localCityName.length;
      console.log("cityNameLength"+cityNameLength);
      if(cityNameLength>5){
        let str = this.localCityName.substring(0,5)+"...";
        this.localCityNameSub = str;
      }
      else {
        this.localCityNameSub = this.localCityName;
      }

      let cityWeatherParam = {
        cityName: this.localCityName
      }
      this.getWeather(cityWeatherParam);

    }, 500);*/

    //获取当前时间,显示在界面上
    this.event.time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
    // 请求获取首页的数据
    //查询当前地区高发病种,先设置为流行性感冒
    var diseaname = {
      diseasename: '流行性感冒'
    }
    this.mainService.mainData(diseaname).then(value => {
      this.listData = value;
    })

  }

  //每次进入都重新加载echarts图
  ionViewDidEnter() {

    //为了保证用户退出应用再次进入也能看到评估信息
    this.storage.get("isEvaluation").then(value => {
      this.isEvaluation = value;
      //如果评估过,则获取用户评估的指数
      if (this.isEvaluation) {

        //从缓存里获取用户的账号
        this.storage.get("USER_INFO").then(value => {
          var userAccount = {
            account: value.account
          }
          //评估数据获取,获取用户评估的最新数据

          this.mainService.getRiskIndexNew(userAccount).then(value2 => {
            let riskIndex = value2;
            this.index = riskIndex;

          });

        })

      }

    });

    //添加延迟，防止获取城市为空
    //setTimeout(() => {
    //计算疾病传染风险
    //this.getDiseaseIndex();
    // }, 500)

    //修改上面的延迟函数
    this.getCurrentCityName().then(value => {
      console.log("修改上面的延迟方式：" + value);
      this.getDiseaseIndex();
    });

  }

  //获取当前城市名
  getCurrentCityName = function () {
    return new Promise(function (resolve, reject) {
      let myCity = new BMap.LocalCity()
      myCity.get(function (result) {
        resolve(result.name)
      })
    })
  }


  //获取用户信息
  refreshUserInfo() {
    this.userService.isLogin().then(isLogin => {
      //this.isLogin = isLogin;
      //已经登录
      if (isLogin) {
        //查询登录的用户是否已经填写了基本信息
        this.getUserOtherInfo();
      }
      else {
        this.nativeService.showToast("请先登录");
        this.navCtrl.push("LoginPage");
      }
    })
  }


  //判断用户信息填写是否完全
  getUserOtherInfo() {
    this.storage.get("USER_INFO").then(value => {
      var userAccount = {
        account: value.account
      }
      this.userService.getUserInfo(userAccount).then(value1 => {
        //返回值不为空
        if (value1 != null || value1 != '') {
          //判断基本信息是否填写完全
          if (value1.sex == null || value1.sex == '' || value1.age == null || value1.age == '' || value1.phonenumber == null || value1.phonenumber == '' || value1.basicillness == null || value1.basicillness == '' || value1.vaccination == null || value1.vaccination == '') {
            console.log("基本信息未填写完全");
            //填写基本信息
            this.nativeService.showToast("请完善基本信息");
            //跳转到填写基本信息的页面
            this.navCtrl.push("UserDetailInfoPage");
          }
          else {
            //评估数据获取
            //开始评估
            this.getEvaluationIndex(userAccount);
          }
        }
        else {
          this.nativeService.showToast("账号不存在");
        }

      })
    })
  }

  //点击我要评估
  evaluation() {
    //如果未登录进入登录页面
    this.refreshUserInfo();
  }

  //点击防疫处方,跳转到防疫处方页面
  prescription() {
    this.navCtrl.push(AboutPage, {isDisplay: true});
  }

  //动态曲线
  dynamicCurve() {
    console.log("动态曲线");
    //点击动态曲线时去查询当前用户的评估结果
    let dynamicData;
    this.storage.get("USER_INFO").then(value => {
      var userAccount = {
        account: value.account
      }
      //查询出当天用户评估结果
      this.mainService.getUserDynamicData(userAccount).then(value1 => {
        //返回的数据放入当前数组中
        console.log("value1" + value1);
        dynamicData = value1;
        this.navCtrl.push(AboutPage, {isDisplay: false, dynamicData: dynamicData});
      })
    })
  }

  //点击选择时间确定按钮
  changeDate(chooseTime) {
    console.log("点击了确定按钮" + chooseTime);
    console.log("点击了确定按钮" + this.event.time);
    //改变仪表盘旋转
    this.event.time = chooseTime;
    this.getDiseaseIndex();
  }

  //选择地区
  changeCity(city) {
    console.log("选择的城市为:" + city);
    console.log("触发选择事件------");
  }

  //查看天气详细信息
  weatherDetail(weatherObject) {
    console.log("查看天气详细信息...");
    //let weatherDetailModal = this.modalCtrl.create(WeatherDetailPage);
    this.navCtrl.push("WeatherDetailPage", {weatherObject});
  }

  //城市选择
  cityChoose() {
    console.log("进入城市选择页面");
    let cityChooseModal = this.modalCtrl.create(CityChoosePage);
    cityChooseModal.onDidDismiss(data => {
      console.log("将push改为modalCtrl:" + data.name);
      //如果点击城市页面的关闭,首页还是显示之前选择的城市
      if (data.name == null || data.name == "") {
        //this.localCityName = localStorage.getItem('currentCity');
      }
      //点击选择的城市
      else {

        //把选择的城市赋值给当前城市
        this.localCityName = data.name;
        //如果地区过长,则显示部分,剩余部分用省略号代替
        let cityNameLength = data.name.length;
        console.log("cityNameLength" + cityNameLength);
        if (cityNameLength > 5) {
          let str = data.name.substring(0, 5) + "...";
          this.localCityNameSub = str;
        }
        else {
          this.localCityNameSub = this.localCityName;
        }


        //重新获取天气
        let cityWeatherParam = {
          cityName: this.localCityName
        }
        //点击更改地点时,重新获取天气信息
        this.getWeather(cityWeatherParam);
        //重新调用一次echarts图,获取疾病指数
        this.getDiseaseIndex();
      }

    });
    cityChooseModal.present();
  }

  //下拉刷新界面
  doRefresh(refresher) {
    //重新加载一次页面
    this.ionViewDidLoad();
    this.ionViewDidEnter();

    if (refresher) {
      refresher.complete();
    }
    //setTimeout(() => {
    // console.log('加载完成后，关闭刷新');
    // refresher.complete();
    //   //toast提示，修改为网络请求时显示
    //   //this.nativeService.showToast("加载完成");
    // }, 1000);
  }

  //医疗机构查询
  medicalSearch() {
    this.navCtrl.push(BaiduMapPage);
  }

  //获取首页详细信息
  getDetail(item, itemPage) {
    console.log("item" + item);
    this.navCtrl.push("MainDetailPage", {item, itemPage});
  }

  //获取天气信息
  getWeather(cityWeatherParam) {

    console.log("城市天气参数" + JSON.stringify(cityWeatherParam));
    this.mainService.getWeather(cityWeatherParam).then(value => {
      //聚合天气
      //this.cityWeather = value.result.today.temperature+" "+value.result.today.weather;
      //this.cityWeather = value.result.today.temperature;
      //京东万象天气
      //天气 晴天
      //value.result.HeWeather5[0].daily_forecast[0].cond.txt_d
      console.log("返回查询成功的值：" + value.msg);
      if (value.msg == "查询成功" && value.result.HeWeather5[0].status != "unknown city") {
        console.log("查询成功了！！！！！！！" + value);
        //将查询结果赋值给对象,用于查看天气详细信息
        this.weatherObject = value;

        //先注释掉天气
        this.cityWeather = value.result.HeWeather5[0].daily_forecast[0].tmp.min + "℃~" + value.result.HeWeather5[0].daily_forecast[0].tmp.max + "℃";

        //返回根据天气,返回天气图标
        //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。如果要检索的字符串值没有出现，则该方法返回 -1。
        if (value.result.HeWeather5[0].daily_forecast[0].cond.txt_d.indexOf("晴") != -1) {
          this.weatherIcon = "sunny";
        }
        else if (value.result.HeWeather5[0].daily_forecast[0].cond.txt_d.indexOf("雨") != -1) {
          this.weatherIcon = "rainy";
        }
        else {
          this.weatherIcon = "cloudy";
        }
      }
      else {
        //天气信息设置为空
        this.cityWeather = '';
        //天气图标设置为空
        this.weatherIcon = '';
      }
    })
  }

  //获取用户个人评估指数
  getEvaluationIndex(userAccount) {
    //显示加载样式
    let loading = this.loadingCtrl.create({
      content: 'AI评估中...'//数据加载中显示
    });
    //显示等待样式
    loading.present();
    this.mainService.riskIndex(userAccount).then(value2 => {
      var riskIndex = value2;
      //加载样式消失
      loading.dismiss();//显示多久消失
      if (riskIndex == "" || riskIndex == null) {
        this.index = "无";
      }
      else {
        this.index = riskIndex;
        //计算传染风险指数
        this.isEvaluation = true;
        //评估存入缓存
        this.storage.set("isEvaluation", true);
      }
    });
  }

  //计算疾病传染风险
  getDiseaseIndex() {
    this.popularIndex.currentTime = this.event.time;
    this.popularIndex.localCityName = this.localCityName;
    //每次进入页面都要计算当前城市、当前日期的流感流行度，将计算出来的流感指数赋值给Echarts图
    this.mainService.indexByCityAndTime(this.popularIndex).then(value => {
      console.log("当前的流行感染度：" + JSON.stringify(value));
      this.dashData = [];
      //给echarts图赋值
      this.dashData.push(value);
      //this.dashData.push();
      //加载echarts图
      this.loadEcharts();
    })
  }

  //选择时间
  getDate() {
    let options: DatePickerOptions = {
      date: new Date(),
      mode: 'datetime',
      titleText: '请选择日期',
      okText: '选择',
      cancelText: '取消',
      todayText: '今天',
      nowText: '现在',
      is24Hour: true,
      allowOldDates: true,
      doneButtonLabel: '确定',
      minuteInterval: 10,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }
    this.datePicker.show(options).then(
      date => {
        console.log('Got date: ', date);
        alert(date.getSeconds());
        this.dateStr = date.getTime().toString();
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }


  //echarts图
  loadEcharts() {
    //调整echarts图
    //如果当前dom中有echarts图，
    if (this.EChart != null && this.EChart != "" && this.EChart != undefined) {
      this.EChart.dispose();
    }
    let ctelement = this.container.nativeElement;
    this.EChart = echarts.init(ctelement);
    this.EChart.setOption({
      tooltip: {
        show: false,//是否显示点击显示详情
        alwaysShowContent: true,
        confine: true,
        formatter: "{a}{b}:{c}%",   //提示框样式
        position: [0, 0],  //位置,默认不设置时位置会跟随鼠标的位置
        //triggerOn:'none',//不在 'mousemove' 或 'click' 时触发
      },
      series: [
        {
          name: '流感流行度',
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '95%'],    // 默认全局居中
          radius: '180%',            //  图大小
          axisLine: {            // 坐标轴线
            //show:true,//是否显示仪表盘轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              //width: 200
              width: 60,          //轴线的宽度
              color: [[0.25, '#75e600'], [0.5, '#e6de7d'], [0.75, '#e67b00'], [1, '#e60000']],
            }
          },
          axisTick: {// 坐标轴小标记
            //splitNumber: 10,   // 每份split细分多少段
            splitNumber: 1,
            length: 0,        // 属性length控制线长
            show: false,
          },
          splitLine: {
            show: false,       //是否显示刻度分割线
            //length:30         //分割线线长度
          },
          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            formatter: function (v) {
              switch (v + '') {
                case '10':
                  return '低';
                case '40':
                  return '中';
                case '60':
                  return '高';
                case '90':
                  return '极高';
                default:
                  return '';
              }
            },
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: '#fff',
              fontSize: 15,
              fontWeight: 'bolder'
            },
            distance: 0,//文字距离刻度线长度

          },
          pointer: {
            width: 5,
            length: '90%',
          },
          itemStyle: {
            //color:'rgb(255,215,0)',//指针颜色
            //color:'yellow',
            color: '#4f75e6',

          },
          title: {
            show: true,
            offsetCenter: [0, '-60%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: '#fff',
              fontSize: 30
            }
          },
          detail: {
            show: true,           //是否显示仪表盘详情
            backgroundColor: 'rgba(0,0,0,0)',
            borderWidth: 0,
            borderColor: '#ccc',
            width: 100,
            height: 40,
            offsetCenter: [0, -40],       // x, y，单位px
            formatter: '流行性感冒{value}',
            // formatter:function(value){
            //   return value;
            // },
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 15,     //中间指针数值字体大小
            },
            //color:'black',    //文字颜色
          },
          animation: true,       //是否开启动画
          //animationThreshold:100,    //是否开启动画的阈值，当单个系列显示的图形数量大于这个阈值时会关闭动画。
          animationDuration: 3000,       //初始化动画的时常
          animationDurationUpdate: 3000,  //数据更新动画的时长
          //data:[{value: 50, name: '完成率'}]
          //data: [{value: 20, name: ''}]
          data: this.dashData
        }
      ]

    });
    //echarts图end


    /* this.EChart.setOption({

       title: {
         x: "center",
         //left:'29%',
         y:"50%",
         bottom: 380,
         text: '流感流行度',
         textStyle: {
           fontWeight: 'normal',
           fontSize: 22,
           color: "#999"
         },
       },
       series: [
         {
           center: ['45%', '95%'],
           type: 'gauge',
           radius: '175%',
           splitNumber: 1,
           min: 0,
           max: 0,
           startAngle: 180,
           endAngle: 0,
           axisLine: {
             show: false,
             lineStyle: {
               width: 2,
               shadowBlur: 0,
               color: [
                 [1, '#8f8f8f']
               ]
             }
           },
           axisTick: {
             show: true,
             lineStyle: {
               color: '#8f8f8f',
               width: 1
             },
             length: -8,
             splitNumber: 50
           },
           splitLine: {
             show: true,
             length: 12,
             lineStyle: {
               color: '#8f8f8f',
             }
           },
           axisLabel:{
             show:false
           },
           detail:{
             show:false
           }
         }
         ,{
           center: ['45%', '95%'],
           type: 'gauge',
           startAngle: 180,
           radius: '165%',
           splitNumber:12,
           endAngle: 0,
           min: 0,
           max: 100,
           axisLine: {
             show: true,
             lineStyle: {
               width: 20,
               shadowBlur: 0,
               color: [
                 [1/4, '#05FA1D'],
                 [2/4, '#FBC402'],
                 [3/4, '#FA9900'],
                 [4/4,'#FD0000'],
               ]
             }
           },
           axisTick: {
             show:false
           },
           axisLabel:{
             show:false,
             //fontSize:25,
           },
           //是否显示分割刻度线
           splitLine: {
             show: true,
             length: 20,
             lineStyle:{
               color:'white',
               width:2
             }
           },
           pointer: {
             show: true,
             length:'80%',
             width:5
           },
           itemStyle:{
             normal:{
               color:'#FFFFFF',
               borderColor:'#92DAFF',
               borderWidth:'2',
             }
           },
           detail: {
             //不显示详情
             show:false
           },
           animation: true,       //是否开启动画
           animationDuration: 3000,       //初始化动画的时常
           animationDurationUpdate: 3000,  //数据更新动画的时长
           data: this.dashData
         }]
     })
 */


  }

}
