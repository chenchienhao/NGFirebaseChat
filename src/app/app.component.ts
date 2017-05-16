import { Component, ViewChild } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods,FirebaseListObservable } from 'angularfire2';
import { ModalDirective } from 'ng2-bootstrap/modal';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: FirebaseListObservable<any>;
  name: any;
  msgVal: string = '';
  time: string;
  item: any;
  //image box
  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';
  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: string = '';

  
  constructor(public af: AngularFire){
    this.items = af.database.list('/messages',{
      query:{
        limitToLast: 6
      }
    });
    this.items.subscribe(snapshots => {
      var elem = document.getElementById('scroll_messages');
      elem.scrollTop = elem.scrollHeight;
    });
    this.af.auth.subscribe(auth => {
      if(auth) {
        this.name = auth;
      }
    });
  }
  move() {
    var elem = document.getElementById("myBar");   
    var width = 10;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
        elem.innerHTML = width * 1  + '%';
      }
    }
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
    var now = new Date();
    var month = ((now.getMonth() + 1) < 10) ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
    this.items.push({ type:"message", message: theirMessage, name: this.name.facebook.displayName, url: this.name.facebook.providerId+"/"+this.name.facebook.uid, foto: this.name.facebook.photoURL, time: now.getFullYear()+"/"+month+"/"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()});
    this.msgVal = '';
  }
  imageSend(){
    document.getElementById("tab_home").className = "active";
    document.getElementById("tab_image").classList.remove('active');
    document.getElementById("home").className = "tab-pane fade in active";
    document.getElementById("image").className = "tab-pane fade";
    
    let storageRef = firebase.storage().ref();
    var now = new Date();
    var month = ((now.getMonth() + 1) < 10) ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
    for(let selectedFile of [(<HTMLInputElement>document.getElementById('up_image')).files[0]]){
      if(selectedFile){
        let path = `/image/${this.name.facebook.uid}_${(now.getFullYear()+"_"+month+"_"+now.getDate()+"_"+now.getHours()+"_"+now.getMinutes()+"_"+now.getSeconds()).toString()}`;
        let iRef = storageRef.child(path);
        iRef.put(selectedFile).then((snapshot) => {
          this.items.push(
              {type:"image", message: snapshot.downloadURL, name: this.name.facebook.displayName, url: this.name.facebook.providerId+"/"+this.name.facebook.uid, foto: this.name.facebook.photoURL, time: now.getFullYear()+"/"+month+"/"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()}
          );
          return null;
        });
      }
    }
  }

  @ViewChild('childModal') public childModal:ModalDirective;
 
  public showChildModal():void {
    this.childModal.show();
  }
 
  public hideChildModal():void {
    this.childModal.hide();
  }
  //ImageBox 
  handleDragEnter() {
    this.dragging = true;
  }
  handleDragLeave() {
    this.dragging = false;
  } 
  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }
  handleImageLoad() {
    this.imageLoaded = true;
  }
  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.loaded = false;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  } 
  _handleReaderLoaded(e) {
    var reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
  }
}
