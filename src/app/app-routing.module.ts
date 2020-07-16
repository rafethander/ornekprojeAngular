import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { AnasayfaComponent } from './Components/anasayfa/anasayfa.component';
import { MusteriComponent } from './Components/musteri/musteri.component';
import { AlinanUrunlerComponent } from './Components/alinan-urunler/alinan-urunler.component';
import { SatilanUrunlerComponent } from './Components/satilan-urunler/satilan-urunler.component';
import { OdemelerComponent } from './Components/odemeler/odemeler.component';
import { IrsaliyeEkleComponent } from './Components/Irsaliye/irsaliye-ekle/irsaliye-ekle.component';
import { IrsaliyeListeleComponent } from './Components/Irsaliye/irsaliye-listele/irsaliye-listele.component';
import { FaturaEkleComponent } from './Components/Fatura/fatura-ekle/fatura-ekle.component';
import { FaturaListeleComponent } from './Components/Fatura/fatura-listele/fatura-listele.component';
import { TahsilatComponent } from './Components/tahsilat/tahsilat.component';
import { LoginComponent } from './Components/login/login.component';
import { IsLoginGuard } from './IsLoginGuard';
import { pathToFileURL } from 'url';
import { FaturaDirektComponent } from './Components/fatura-direkt/fatura-direkt.component';





const routes: Routes = [
  
  { path: '', component: LoginComponent },
  { path: 'anasayfa', component: AnasayfaComponent ,canActivate: [IsLoginGuard]},
  { path: 'musteri', component: MusteriComponent },
  { path: 'alinanUrunler', component: AlinanUrunlerComponent },
  { path: 'satilanUrunler', component: SatilanUrunlerComponent },
  { path: 'odemeler', component: OdemelerComponent },
  { path: 'irsaliyeEkle/:irsaliyeNo', component: IrsaliyeEkleComponent },
  { path: 'irsaliyeEkle', component: IrsaliyeEkleComponent},
  { path: 'irsaliyeListele', component: IrsaliyeListeleComponent},
  { path: 'faturaEkle/:faturaNo', component: FaturaEkleComponent },
  { path: 'faturaEkle', component: FaturaEkleComponent },
  { path: 'faturaListele', component: FaturaListeleComponent },
  { path: 'tahsilat', component: TahsilatComponent },
  { path: 'faturaDirekt', component: FaturaDirektComponent },
  { path: '**', component: NotFoundComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[IsLoginGuard],
})
export class AppRoutingModule { }
