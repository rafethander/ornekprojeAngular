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





const routes: Routes = [
  
  { path: '', component: LoginComponent },
  { path: 'anasayfa', component: AnasayfaComponent ,canActivate: [IsLoginGuard]},
  { path: 'musteri', component: MusteriComponent,canActivate: [IsLoginGuard] },
  { path: 'alinanUrunler', component: AlinanUrunlerComponent ,canActivate: [IsLoginGuard]},
  { path: 'satilanUrunler', component: SatilanUrunlerComponent ,canActivate: [IsLoginGuard]},
  { path: 'odemeler', component: OdemelerComponent,canActivate: [IsLoginGuard] },
  { path: 'irsaliyeEkle/:irsaliyeNo', component: IrsaliyeEkleComponent ,canActivate: [IsLoginGuard]},
  { path: 'irsaliyeEkle', component: IrsaliyeEkleComponent,canActivate: [IsLoginGuard] },
  { path: 'irsaliyeListele', component: IrsaliyeListeleComponent,canActivate: [IsLoginGuard] },
  { path: 'faturaEkle/:faturaNo', component: FaturaEkleComponent,canActivate: [IsLoginGuard] },
  { path: 'faturaEkle', component: FaturaEkleComponent ,canActivate: [IsLoginGuard]},
  { path: 'faturaListele', component: FaturaListeleComponent,canActivate: [IsLoginGuard] },
  { path: 'tahsilat', component: TahsilatComponent ,canActivate: [IsLoginGuard]},
  { path: '**', component: NotFoundComponent,canActivate: [IsLoginGuard] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[IsLoginGuard],
})
export class AppRoutingModule { }
