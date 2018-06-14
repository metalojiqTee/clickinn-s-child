import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalDataProvider } from '../../providers/local-data/local-data';
import { User } from '../../models/users/user.interface'

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

	seeker: User;
	password: string;
  loading: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastController,
    private afs: AngularFirestore, private afAuth: AngularFireAuth, private storage: LocalDataProvider) {
  	this.seeker = {
      email: '',
      displayName: '',
      firstname: '',
      lastname: '',
      is_host: false,
      user_type: 'seeker',
      uid: '',
      fcm_token: '',
      phoneNumber: '',
      photoURL: '',
      status: false,
      threads: {}
    }
  }

  ionViewDidLoad() {
    
  }

  signup(){
    this.loading = true;
    this.afAuth.auth.createUserWithEmailAndPassword(this.seeker.email, this.password)
    .then(data =>{
      alert('signed in!')
      this.seeker.uid = data.uid;
      this.seeker.displayName = this.seeker.firstname + ' ' + this.seeker.lastname;
    })
    .then(() =>{
      alert('storing!');
      alert(this.seeker.uid);
      if(this.seeker.uid !== ''){
        alert('persisting user...');
        this.persistUser();
      }
      else{
        setTimeout(()=>{
           if(this.seeker.uid === ''){
             this.loading = false;
             alert('Something went wrong, please try again');
           }else{
             this.persistUser();
           }
        }, 5000)
      }
    })
    .catch(err => {
      this.handleError(err);
    })

  	
  }

  signin(){
    this.navCtrl.setRoot('LoginPage');
  }

  handleError(err){
    console.log(err.message);
      this.loading = false;
      this.toast.create({
        message: err.message,
        showCloseButton: true,
          closeButtonText: 'Ok',
          position: 'top',
          cssClass: 'toast_margins full_width'
    }).present()
  }

  persistUser(){
    if(this.seeker.uid !== ''){
      this.afs.collection('Users').doc(this.seeker.uid).set(this.seeker)
      .then(() =>{
          alert('stored in collection!');
          this.storage.setUser(this.seeker).then(() =>{
            alert('local storage!');
            this.navCtrl.setRoot('WelcomePage').then(() =>{
              alert('navigated');
              this.loading = false;
            }).catch(err =>{
            this.handleError(err);
          });
          }).catch(err =>{
            this.handleError(err);
          })
        }).catch(err => {
        this.handleError(err);
      })
    }
  }

}