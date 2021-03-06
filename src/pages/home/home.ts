import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
import {el} from "@angular/platform-browser/testing/src/browser_util";

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
  dashData: any = [{value: 20, name: ''}];

  //计算流感流行度的参数
  public popularIndex = {
    //当前城市名称、也可以是选择城市之后的名称
    localCityName: '',
    //当前时间
    currentTime: '',
    //疾病id
    diseaseId:''
  }
  //地区
  cityColumns: any[];

  //GitHub测试2018-11-26

  //流感流行度显示建议定义boolean:true,false,用于显示和隐藏
  di;
  zhong;
  gao;
  jigao;
  dijy;
  zhongjy;
  gaojy;
  jigaojy;
  //当前选择的疾病名称/高爆发疾病
  diseaseName:string = '';

  //日期选择器未来第7天的时间,作为日期选择的最大时间
  datePickerMax;

  //高爆发的两种疾病
  top1DiseaseId;
  top1DiseaseName;
  top2DiseaseId;
  top2DiseaseName;

  //疾病显示颜色
  diseaseColor;

  //疾病ID
  diseaseId;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public nativeService: NativeServiceProvider,
              public storage: Storage,
              public datePicker: DatePicker,
              public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public calendar: Calendar,
              public mainService: MainServiceProvider,
              public alertCtrl: AlertController) {

    this.chooseCity = navParams.data.name;
    this.cityColumns = citise;

  }

  ionViewDidLoad() {
    console.log("---ionViewDidLoad---");

    //this.diseaseColor="#2186ff";


    this.datePickerMax=this.fun_date(6);
      //this.fun_date(7);
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

    //获取当前时间,显示在界面上
    this.event.time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
    // 请求获取首页的数据
    //查询当前地区高发病种,先设置为流行性感冒
    /*var dId = {
      diseasename: '139'
    }*/
    /**
    var dId = {
      diseasename:''
    };
    this.mainService.mainData(dId).then(value => {
      this.listData = value;
    })
    */
    //this.getDiseaseIndex();

  }
  //第七天日期函数
  fun_date(num){
    var date1=new Date();
    var date2=new Date(date1);
    date2.setDate(date1.getDate()+num);
    var m = date2.getMonth() + 1;
    var m2 = m < 10 ? '0' + m : m;
    var d = date2.getDate();
    var d2 = d < 10 ? ('0' + d) : d;
    var time2=date2.getFullYear()+"-"+m2+"-"+d2;
    return time2;
  }
/**
  //每次进入都重新加载echarts图
  ionViewDidEnter() {

    console.log("---ionViewDidEnter---")
    //2019-04-28修改查询疾病之后页面刷新问题


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
      console.log("修改上面的延迟方式："+value);
      //this.popularIndex.diseaseId='';
      this.getDiseaseIndex();
    });
  }


  */


/**
  //获取当前城市名
  getCurrentCityName = function () {
    return new Promise(function (resolve, reject) {
      let myCity = new BMap.LocalCity()
      myCity.get(function (result) {
        resolve(result.name)
      })
    })
  }
*/

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
    this.alertCtrl.create({
      title: '信息',
      subTitle: "功能正在开发中...",
      enableBackdropDismiss: false,
      buttons: [{text: '确定'}]}).present();
    //目前暂时不开发评估功能2019-04-24
    //this.refreshUserInfo();
  }

  //点击防疫处方,跳转到防疫处方页面
  prescription() {
    this.navCtrl.push(AboutPage, {isDisplay: true});
  }

  //动态曲线
  dynamicCurve() {
    console.log("动态曲线");
    //点击动态曲线时去查询当前用户的评估结果
    //let dynamicData;
    this.storage.get("USER_INFO").then(value => {
      var userAccount = {
        account: value.account
      }
      //查询出当天用户评估结果
      /*this.mainService.getUserDynamicData(userAccount).then(value1 => {
        //返回的数据放入当前数组中
        console.log("value1" + value1);
        dynamicData = value1;
        this.navCtrl.push(AboutPage, {isDisplay: false, dynamicData: dynamicData});
      })*/
      //修改为新的echarts图
      let pgResults;
      let pgTime;
      this.mainService.getPgResults(userAccount).then(value =>{
        pgResults = value.pgResult;
        pgTime= value.pgTime.map(function (str) {
          return str.replace(' ', '\n')
        });

        this.navCtrl.push(AboutPage, {isDisplay: false, pgResults: pgResults,pgTime:pgTime});
        //this.loadEchartsZx();
      })
    })
  }

  /**
  //点击选择时间确定按钮
  changeDate(chooseTime) {
    console.log("点击了确定按钮" + chooseTime);
    console.log("点击了确定按钮" + this.event.time);
    //改变仪表盘旋转
    this.event.time = chooseTime;
    this.getDiseaseIndex();
  }
   */

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
/**
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
*/
  //医疗机构查询
  medicalSearch() {
    //传递城市名称
    this.navCtrl.push(BaiduMapPage,{city:this.localCityName});
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
    this.diseaseName = '';
    this.popularIndex.currentTime = this.event.time;
    this.popularIndex.localCityName = this.localCityName;
    console.log("疾病名称---"+this.diseaseName);
    console.log("选择的时间---"+this.popularIndex.currentTime);
    console.log("当前城市名称---"+this.popularIndex.localCityName);

    //每次进入页面都要计算当前城市、当前日期的流感流行度，将计算出来的流感指数赋值给Echarts图
    //2019-04-10新增登革热查询,用城市名精确查询城市编码
    this.mainService.indexByCityAndTime(this.popularIndex).then(value => {
      console.log("当前的高爆发疾病返回值：" + JSON.stringify(value));
      //高爆发疾病名称,动态获取查询结果
      this.diseaseName = value.disease;
      //疾病ID
      this.diseaseId = value.diseaseId;
      console.log("返回的疾病ID-----------------------------"+this.diseaseId);
      var dId = {
        diseasename:value.diseaseId
      };

      this.mainService.mainData(dId).then(value => {
        this.listData = value;
      })
      //专家意见--健康提醒
      this.dijy = value.dijy;
      this.zhongjy = value.zhongjy;
      this.gaojy = value.gaojy;
      this.jigaojy = value.jigaojy;

      //疾病热点疾病排名top2
      this.top1DiseaseId = value.top1DiseaseId;
      this.top1DiseaseName = value.top1DiseaseName;
      this.top2DiseaseId = value.top2DiseaseId;
      this.top2DiseaseName = value.top2DiseaseName;

      this.dashData = [];
      //给echarts图赋值
      this.dashData.push(value);
      //加载echarts图
      this.loadEcharts();
      //如果value.value>=0&&value.value<25;流感流行度低。
      //console.log("value.value---"+value.value);
      var valueindex = value.value;
      //流感强度低
      if(valueindex>=0&&valueindex<=25){
        this.di=true;
        this.zhong=false;
        this.gao=false;
        this.jigao=false;
        //设置疾病颜色
       // document.getElementById("diseasename1").style.background="#75e600";
       // document.getElementById("diseasename2").style.background="#75e600";
      }
      //流感强度中等
      if(valueindex>25&&valueindex<=50){
        this.di=false;
        this.zhong=true;
        this.gao=false;
        this.jigao=false;
        //设置疾病颜色
       // document.getElementById("diseasename1").style.background="#e6de7d";
       // document.getElementById("diseasename2").style.background="#e6de7d";
      }
      //流感强度高
      if(valueindex>50&&valueindex<=75){
        this.di=false;
        this.zhong=false;
        this.gao=true;
        this.jigao=false;
        //设置疾病颜色
       // document.getElementById("diseasename1").style.background="#e67b00";
      // document.getElementById("diseasename2").style.background="#e67b00";
      }
      //流感强度极高
      if(valueindex>75&&valueindex<=100){
        this.di=false;
        this.zhong=false;
        this.gao=false;
        this.jigao=true;
        //设置疾病颜色
          //document.getElementById("diseasename1").style.background="#e60000";
          //document.getElementById("diseasename2").style.background="#e60000";
      }

      if(this.diseaseName=="流行性感冒"){
        //document.getElementById("diseasename2").style.background="#000000";
      }else {
        //document.getElementById("diseasename1").style.background="#000000";
      }

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
    console.log("this.diseaseName-----------------"+this.diseaseName);
    this.EChart.setOption({
      tooltip: {
        show:false,
        formatter: "{a} <br/>{b} : {c}%",   //提示框样式
      },
      series: [
        {
          splitNumber:1000,
          min:0,//默认
          max:100,
          name: '流感',
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '95%'],    // 默认全局居中
          radius: '180%',            //  图大小
          axisLine: {           // 坐标轴线
            //show:true,//是否显示仪表盘轴线
            lineStyle: {       // 属性lineStyle控制线条样式
              //width: 200
              width: 60,          //轴线的宽度(仪表盘宽度)
              color: [[0.25, '#75e600'], [0.5, '#e6de7d'], [0.75, '#e67b00'], [1, '#e60000']],
            }
          },
          axisTick: {// 坐标轴小标记
            //splitNumber: 100,   // 每份split细分多少段
            splitNumber: 1,
            length: 0,        // 属性length控制线长
            show: false,
          },
          splitLine: {
            show: false,       //是否显示刻度分割线
            length:0         //分割线线长度
          },
          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            show:true,//是否显示标签,默认为true
            distance: 20,//文字距离刻度线长度
            formatter: function (value) {
              //console.log("v-----"+value);//这个value是分的段数
              switch (value + '') {
                case '12.5':
                  return '低';
                case '37.5':
                  return '中';
                case '62.5':
                  return '高';
                case '87.5':
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
            //formatter: '流行性感冒{value}',//去掉流行性感冒的value
            formatter: this.diseaseName==undefined?" ":this.diseaseName+'\n流行强度',//\n为换行
            color:'black',//文字颜色

            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 15,     //中间指针数值字体大小
            }
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


  }


  //三个参数城市名称、时间、疾病ID
  //每次进入页面执行的方法
  ionViewDidEnter() {
    //修改上面的延迟函数，获取当前城市名称
    this.getCurrentCityName().then(value => {
      console.log("修改上面的延迟方式："+value);
      //this.popularIndex.diseaseId='';
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

  //点击选择时间确定按钮
  changeDate(chooseTime) {
    console.log("点击了确定按钮" + chooseTime);
    //改变仪表盘旋转
    this.event.time = chooseTime;
    this.getDiseaseIndex();
  }

  //切换病种
  selectDisease(){
    //发送请求到后台获取疾病数据
    this.mainService.selectDisease({}).then(value => {
      let alert = this.alertCtrl.create();
      alert.setTitle('疾病名称');
      console.log("选择疾病类型---"+value);
      //返回数组
      let arr = [];
      arr = value;
      for (let i = 0; i < arr.length; i++) {
        alert.addInput(arr[i]);
      }
      alert.addButton('取消');
      alert.addButton({
        text: '确定',
        handler: data => {
          //this.testRadioOpen = false;
          //this.testRadioResult = data;
          console.log("用户选择的数据..."+data);
          this.diseaseClick(data);
        }
      });
      alert.present();
    })
  }

  //单疾病查询
  diseaseClick(diseaseId){
    console.log("diseaseId---"+diseaseId);
    this.popularIndex.diseaseId=diseaseId;
    var diseaname = {
      diseasename:this.popularIndex.diseaseId
    }
    this.mainService.mainData(diseaname).then(value => {
      this.listData = value;
    })
    this.getDiseaseIndex();
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

  //获取首页详细信息
  getDetail(item, itemPage) {
    console.log("item" + item);
    this.navCtrl.push("MainDetailPage", {item, itemPage});
  }

  //下拉刷新界面
  doRefresh(refresher) {
    //重新加载一次页面
    this.ionViewDidLoad();
    //如果是下拉刷新，则把疾病设置为空
    this.popularIndex.diseaseId='';
    //重新从后台查询当天，当前时间，当前地区疾病信息
    this.ionViewDidEnter();
    if (refresher) {
      refresher.complete();
    }
  }


}
