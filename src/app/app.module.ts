//根模块，告诉ionic如何组装应用
//引入angular,ionic系统模块
import {HttpModule} from '@angular/http';//引入网络请求
import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
//引入components模块
import {ComponentsModule} from '../components/components.module';

import {MyApp} from './app.component';
//自定义组件
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {NewsPage} from '../pages/news/news';
import {RegistPage} from '../pages/regist/regist';
import {SettingPage} from '../pages/setting/setting';
import {BackButtonService} from "../services/backButton.service";
import {BaiduMapPage} from '../pages/baidu-map/baidu-map';
import {FindPasswordPage} from '../pages/find-password/find-password';
import {HealthPage} from "../pages/health/health";
import {SicKonwledgePage} from  "../pages/sic-konwledge/sic-konwledge";
import {CityChoosePage} from '../pages/city-choose/city-choose';

//打包成app以后配置成启动画面以及导航服务的，正常不用管
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserServiceProvider} from '../providers/user-service/user-service';
import {NativeServiceProvider} from '../providers/native-service/native-service';
import {HttpMyNetServiceProvider} from '../providers/http-my-net-service/http-my-net-service';
//获取定位的插件
import {Geolocation} from '@ionic-native/geolocation';
//toast插件
import {Toast} from "@ionic-native/toast";
//时间
import {DatePicker} from "@ionic-native/date-picker";
//地区选择器
import { MultiPickerModule } from  'ion-multi-picker';
//缓存
import {IonicStorageModule} from "@ionic/storage";

import {Calendar} from '@ionic-native/calendar';

import { GlobalDataProvider } from '../providers/global-data/global-data';

//更新下载
import { File } from '@ionic-native/file';
import { FileTransfer ,FileTransferObject} from '@ionic-native/file-transfer';
import {FileOpener} from '@ionic-native/file-opener';
import { InAppBrowser} from "@ionic-native/in-app-browser";

import {Network} from "@ionic-native/network";
import { MainServiceProvider } from '../providers/main-service/main-service';


@NgModule({
  declarations: [/* 申明组件*/
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    NewsPage,
    TabsPage,
    RegistPage,
    SettingPage,
    BaiduMapPage,
    FindPasswordPage,
    HealthPage,
    SicKonwledgePage,
    CityChoosePage

  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    //IonicModule.forRoot(MyApp)
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true',//隐藏全部子页面tabs
      backButtonText: '',    //配置返回按钮
      iconMode: 'ios',//配置图标样式
      mode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
    }),
    HttpModule,
    IonicStorageModule.forRoot(),
    MultiPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [/* 配置不会在模版中使用的组件*/
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    NewsPage,
    TabsPage,
    RegistPage,
    SettingPage,
    BaiduMapPage,
    FindPasswordPage,
    HealthPage,
    SicKonwledgePage,
    CityChoosePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    BackButtonService,
    UserServiceProvider,
    NativeServiceProvider,
    HttpMyNetServiceProvider,
    Geolocation,
    Toast,
    DatePicker,
    Calendar,
    GlobalDataProvider,
    File,
    FileTransfer,
    FileTransferObject,
    FileOpener,
    InAppBrowser,
    Network,
    MainServiceProvider
  ]
})
export class AppModule {
}
