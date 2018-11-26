import { Component ,ViewChild} from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { HealthPage } from '../health/health';
import { SicKonwledgePage } from '../sic-konwledge/sic-konwledge';
import { Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabs: Tabs;
  tab1Root = HomePage;
  tab2Root = SicKonwledgePage;
  tab3Root = HealthPage;
  tab4Root = ContactPage;

  constructor() {

  }
}
