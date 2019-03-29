import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserServiceProvider} from "../../providers/user-service/user-service";
import {Storage} from "@ionic/storage";

import {GlobalDataProvider} from "../../providers/global-data/global-data";
import {MainServiceProvider} from "../../providers/main-service/main-service";
import {NativeServiceProvider} from "../../providers/native-service/native-service";
import {el} from "@angular/platform-browser/testing/src/browser_util";

/**
 * Generated class for the HealthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var echarts; //设置echarts全局对象
@IonicPage()
@Component({
  selector: 'page-health',
  templateUrl: 'health.html',
})
export class HealthPage {
  @ViewChild('EchartsContent') container: ElementRef; //与html中div #container1对应

  @ViewChild('EchartsContentDynamicCurve') containerDynamicCurve: ElementRef; //动态曲线
  EChart: any;
  EChartDynamicCurve: any;
  //时间
  public event = {
    month: '2018-09-21',
    time: '',
  };

  //九宫格
  appCollections: any = [];

  items: any = [];

  //是否完成健康风险评估
  isEvaluation;
  //仪表盘数据
  dashData: any = [{value: 20, name: ''}];

  //动态曲线数据
  dynamicData: any;

  //评估指标对象
  riskFactorObj: any = {};

  //评估时间
  pgTime:any;
  //评估结果
  pgResults:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserServiceProvider,
              public storage: Storage,
              public globalData: GlobalDataProvider,
              public mainService: MainServiceProvider,
              public nativeService: NativeServiceProvider) {
  }

  //执行一次
  ionViewDidLoad() {
    //获取当前时间,显示在界面上
    this.event.time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
  }

  //进入页面的时候触发
  ionViewDidEnter() {

    //不用全局变量,改为缓存
    this.storage.get("isEvaluation").then(value => {
      this.isEvaluation = value;
      if (this.isEvaluation) {
        document.getElementById("isEvaluation").style.display = 'block';
        document.getElementById("isEvaluation1").style.display = 'none';
        //获取用户的评估结果
        this.storage.get("USER_INFO").then(value => {
          var userAccount = {
            account: value.account,
            time:this.event.time
          }
          //查询出当天用户评估结果,动态曲线的值
          /*this.mainService.getUserDynamicData(userAccount).then(value1 => {
            //返回的数据放入当前数组中
            console.log("value1" + value1);
            this.dynamicData = value1;
            //加载折线图
            this.loadEchartsZx();
          })
          */
          //修改为新的echarts图
          this.mainService.getPgResults(userAccount).then(value =>{
            this.pgResults = value.pgResult;
            this.pgTime= value.pgTime.map(function (str) {
              return str.replace(' ', '\n')
            });
            this.loadEchartsZx();
          })

          //仪表盘值
          value.chooseDate = this.event.time;
          this.userService.getHealthPageRiskIndex(value).then(value1 => {
            //无数据
            this.dashData = [];
            this.dashData.push(value1);
            //加载折线图
            this.loadEchartsYbp();
          });

        })

        //如果评估过获取影响评估的因素
        //this.items = this.getHealthData();
        //获取风险评估影响因素数据
        this.getRiskFactor();
      }
      else {
        document.getElementById("isEvaluation").style.display = 'none';
        document.getElementById("isEvaluation1").style.display = 'block';
      }
    })


  }

  //获取风险评估因素数据
  getRiskFactor() {
    this.userService.getRiskFactor().subscribe(value => {
      this.riskFactorObj = JSON.parse(value._body)[0];
      //console.log(JSON.stringify(this.dashData[0].value*0.01)+"-----");
      //下面9个感染因素的值相加等于评估值
      //保留小数点后面3位
      console.log(this.dashData[0].value*0.01);
      const pgValue = this.dashData[0].value*0.01;
      var a = pgValue*this.riskFactorObj.localrisk;
      this.riskFactorObj.localrisk = a.toFixed(3);
      var b = pgValue*this.riskFactorObj.infectsource;
      this.riskFactorObj.infectsource = b.toFixed(3);
      var c = pgValue*this.riskFactorObj.spreadway;
      this.riskFactorObj.spreadway = c.toFixed(3);
      var d = pgValue*this.riskFactorObj.infectnature;
      this.riskFactorObj.infectnature = d.toFixed(3);
      var e = pgValue*this.riskFactorObj.vaccineprotect;
      this.riskFactorObj.vaccineprotect = e.toFixed(3);
      var f = pgValue*this.riskFactorObj.chronic;
      this.riskFactorObj.chronic = f.toFixed(3);
      var g = pgValue*this.riskFactorObj.agefactor;
      this.riskFactorObj.agefactor = g.toFixed(3);
      var h = pgValue*this.riskFactorObj.weatherfactor;
      this.riskFactorObj.weatherfactor = h.toFixed(3);
      var i = pgValue*this.riskFactorObj.pm25;
      this.riskFactorObj.pm25 = i.toFixed(3);
    })
  }

//获取数据进行展示
  getHealthData() {
    this.userService.getHealthData().subscribe(value => {
      this.items = value.json();
    })
  }

  //修改时间
  changeDate(a) {
    console.log("点击了确定按钮" + a);
    console.log("点击了确定按钮" + this.event.time);
    //改变仪表盘旋转
    // this.userService.getEchartsData().subscribe(value => {
    //   console.log("仪表盘数据" + value.json());
    //   this.dashData = [];
    //   this.dashData.push(value.json());
    //   this.loadEcharts();
    // })

    //查看当天评估的最新结果
    this.storage.get("USER_INFO").then(value => {
      value.chooseDate = this.event.time;
      this.userService.getHealthPageRiskIndex(value).then(value1 => {
        //无数据
        this.dashData = [];
        this.dashData.push(value1);
        this.loadEchartsYbp();
      });

    })

  }


  //加载echarts仪表盘
  loadEchartsYbp() {
    if (this.EChart != null && this.EChart != "" && this.EChart != undefined) {
      this.EChart.dispose();
    }
    let ctelement = this.container.nativeElement;
    this.EChart = echarts.init(ctelement);
    this.EChart.setOption({
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%",   //提示框样式
      },
      series: [
        {
          name: '流感',
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
              color: [[0.2, '#75e600'], [0.5, '#e6de7d'], [0.8, '#e67b00'], [1, '#e60000']],
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
            //formatter: '{value}%',
            formatter: '感染风险',
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 15,     //中间指针数值字体大小
            }
          },
          animation: true,       //是否开启动画
          //animationThreshold:100,    //是否开启动画的阈值，当单个系列显示的图形数量大于这个阈值时会关闭动画。
          animationDuration: 3000,       //初始化动画的时常
          animationDurationUpdate: 3000,  //数据更新动画的时长
          data: this.dashData
        }
      ]

    });
  }

  //echarts折线图
  loadEchartsZx(){
    //动态曲线
    if (this.EChartDynamicCurve != null && this.EChartDynamicCurve != "" && this.EChartDynamicCurve != undefined) {
      this.EChartDynamicCurve.dispose();
    }
    let dynamicelement = this.containerDynamicCurve.nativeElement;
    this.EChartDynamicCurve = echarts.init(dynamicelement);
    /*this.EChartDynamicCurve.setOption({
      //调整echarts图的位置
      grid: {
        top: '25%',
        left: '12%',
        right: '12%',
        bottom: '15%'
      },
      //横坐标的值
      xAxis: {
        type: 'category',
        name: '次数',
      },
      yAxis: {
        type: 'value',
        name: '感染风险',
      },
      series: [{
        data: this.dynamicData,
        type: 'line'
      }]
    })*/
    // 修改图形
    this.EChartDynamicCurve.setOption({
      //调整echarts图的位置
      grid: {
        top: '15%',
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel:true,
      },
      title : {
        show:false,
        //text: '中科软科技',
        //subtext: '中科软科技',
        x: 'center',
        align: 'right'
      },
      toolbox: {
        show:false
      },
      tooltip : {
        show:false,//鼠标移动是否显示详情
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765'
          }
        }
      },
      legend: {
        show:false,
        data:['风险感染指数'],//和下面的series对应
        x: 'left'
      },
      dataZoom: [
        {
          show: false,//是否显示下面的滑块
          realtime: true,
          start: 50,
          end: 100
        },
        {
          type: 'inside',
          realtime: true,
          start: 50,
          end: 100
        }
      ],
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          axisLine: {onZero: false},
          data:this.pgTime
        }
      ],
      yAxis: [
        {
          name: '风险感染指数',
          type: 'value',
          max: 1,//纵坐标最大值
          //nameLocation:'center'//坐标轴名称显示位置。
        }
      ],
      series: [
        {
          name:'风险感染指数',
          type:'line',
          animation: false,
          areaStyle: {
          },
          lineStyle: {
            width: 1
          },
          data:this.pgResults
        }
      ]

    })
  }
}
