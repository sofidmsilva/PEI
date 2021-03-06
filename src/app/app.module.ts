import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';
import{ AngularFireModule} from '@angular/fire';
import { environment } from 'src/environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { EmailComposer} from '@ionic-native/email-composer/ngx';
import {AngularFireStorageModule} from '@angular/fire/storage'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage'
import { LanguagePopoverPageModule } from './pages/language-popover/language-popover.module';
import { NotificationsPageModule } from './pages/notifications/notifications.module';
import { SettingsPageModule } from './pages/settings/settings.module';
import { from } from 'rxjs';
import {ChartsModule} from 'ng2-charts';
import { NgCalendarModule} from 'ionic2-calendar';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http,'../assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    AngularFireStorageModule,
    NgCalendarModule,
    ChartsModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LanguagePopoverPageModule,
    NotificationsPageModule,
    SettingsPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    EmailComposer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeKeyboard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
