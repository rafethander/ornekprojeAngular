import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatTreeModule} from '@angular/material/tree';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { ReactiveFormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';







import {MessageService} from 'primeng/api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnasayfaComponent } from './Components/anasayfa/anasayfa.component';
import { MusteriComponent } from './Components/musteri/musteri.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import{ HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { AlinanUrunlerComponent } from './Components/alinan-urunler/alinan-urunler.component';
import { SatilanUrunlerComponent } from './Components/satilan-urunler/satilan-urunler.component';
import { OdemelerComponent } from './Components/odemeler/odemeler.component';
import { IrsaliyeEkleComponent } from './Components/Irsaliye/irsaliye-ekle/irsaliye-ekle.component';
import { IrsaliyeListeleComponent } from './Components/Irsaliye/irsaliye-listele/irsaliye-listele.component';
import {ButtonModule} from 'primeng/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FaturaEkleComponent } from './Components/Fatura/fatura-ekle/fatura-ekle.component';
import { FaturaListeleComponent } from './Components/Fatura/fatura-listele/fatura-listele.component';
import { TahsilatComponent } from './Components/tahsilat/tahsilat.component';
import { LoginComponent } from './Components/login/login.component';





@NgModule({
  declarations: [
    AppComponent,
    AnasayfaComponent,
    MusteriComponent,
    NotFoundComponent,
    AlinanUrunlerComponent,
    SatilanUrunlerComponent,
    OdemelerComponent,
    IrsaliyeEkleComponent,
    IrsaliyeListeleComponent,
    FaturaEkleComponent,
    FaturaListeleComponent,
    TahsilatComponent,
    LoginComponent

    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatTableModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTreeModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    ReactiveFormsModule,
    DropdownModule

  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue:'en-GB'},
     MessageService 
     ,ConfirmationService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
