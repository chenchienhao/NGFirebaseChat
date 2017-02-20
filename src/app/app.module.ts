import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AngularFireModule} from 'angularfire2';
import { DropdownModule,TabsModule,ModalModule } from 'ng2-bootstrap';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyAcK42VWjJkwUc-qx0NYnKHaqXdnsc826E",
  authDomain: "sizzling-heat-7611.firebaseapp.com",
  databaseURL: "https://sizzling-heat-7611.firebaseio.com",
  storageBucket: "sizzling-heat-7611.appspot.com",
  messagingSenderId: "512906066861"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DropdownModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
