import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { BaiduMapPage } from '../baidu-map/baidu-map';
import {UserServiceProvider} from "../../providers/user-service/user-service";
import {MainServiceProvider} from "../../providers/main-service/main-service";
//echarts图
declare var echarts; //设置echarts全局对象

@Component({
	selector: 'page-about',
	templateUrl: 'about.html'
})
export class AboutPage {

  @ViewChild('EchartsContent') container: ElementRef; //与html中div #container1对应
  EChart: any;

	// 接收数据用
	listData=[];

	//上个界面传递过的参数,为false展示动态曲线,为true展示预防处方
  isDisplay;

  //动态曲线数据
  dynamicData : any;

  //评估时间
  pgTime:any;
  //评估结果
  pgResults:any;

	
	constructor(public navCtrl: NavController,
              private http: Http,
              public navParams:NavParams,
              public userService:UserServiceProvider,
              public mainService:MainServiceProvider) {
	  //获取界面上传过来的参数
	  this.isDisplay = navParams.data.isDisplay;
	  //获取界面上传过来的动态曲线的数组
    //this.dynamicData = navParams.data.dynamicData;
    //console.log("this.dynamicData"+this.dynamicData);
    //修改为新的echarts图
    this.pgTime = navParams.data.pgTime;
    this.pgResults = navParams.data.pgResults;
  }
	ionViewDidLoad() {
		// 网络请求,用于展示防疫处方
    // this.mainService.mainData().subscribe(value => {
    //   this.listData = value.json();
    // })
		//如果isDisplay为true,则是点击了防疫处方,则不加载ecahrts图
    if(!this.isDisplay) {
      //加载echarts图
      let ctelement = this.container.nativeElement;
      this.EChart = echarts.init(ctelement);
      this.EChart.setOption({
        //调整echarts图的位置
        grid: {
          top: '15%',
          left: '3%',
          right: '10%',
          bottom: '10%',
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
          show:false,
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
	
	
}
