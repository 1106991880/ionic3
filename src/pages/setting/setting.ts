import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ContactPage } from '../contact/contact';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html',
})
export class SettingPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingPage');
	}
	logOut() {
//		let modal = this.modalCtrl.create(ContactPage);
//		modal.present();
		this.navCtrl.setRoot(ContactPage);
	}

}