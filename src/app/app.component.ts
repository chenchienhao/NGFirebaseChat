import { Component, ViewChild } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods,FirebaseListObservable } from 'angularfire2';

import { ModalDirective } from 'ng2-bootstrap/modal';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  items: FirebaseListObservable<any>;
  name: any;
  msgVal: string = '';
  
  constructor(public af: AngularFire){
    this.items = af.database.list('/messages',{
      query:{
        limitToLast: 5
      }
    });
    
    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
      }
    });
  }
  login(){
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    });
  }
  
  logout() {
     this.af.auth.logout();
     location.reload();
  }

  chatSend(theirMessage: string){
    this.items.push({ message: theirMessage, name: this.name.facebook.displayName});
    this.msgVal = '';
  }

  @ViewChild('childModal') public childModal:ModalDirective;
 
  public showChildModal():void {
    this.childModal.show();
  }
 
  public hideChildModal():void {
    this.childModal.hide();
  }
}
