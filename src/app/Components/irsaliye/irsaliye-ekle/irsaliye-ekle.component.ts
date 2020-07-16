import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl,  Validators } from '@angular/forms';
import { SatilanUrun } from 'src/app/Models/SatilanUrun';
import { MessageService } from 'primeng/api';
import { MusteriService } from 'src/app/Services/Musteri.service';
import { Musteri } from 'src/app/Models/Musteri';
import { SatilanUrunService } from 'src/app/Services/satilan-urun.service';
import { IrsaliyeService } from 'src/app/Services/irsaliye.service';
import { Irsaliye } from 'src/app/Models/Irsaliye';
import { ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import * as moment from 'moment';

@Component({
  selector: 'app-irsaliye-ekle',
  templateUrl: './irsaliye-ekle.component.html',
  styleUrls: ['./irsaliye-ekle.component.css']
})
export class IrsaliyeEkleComponent implements OnInit {

  satilanUrunListeKontrol: SatilanUrun[]=[];
  musteriListesi: Musteri[];
  valueMusteriListesi: Musteri;
  satilanUrunListesi: SatilanUrun[];
  satilanUrun: SatilanUrun;
  irsaliyeTarih: Date;
  tarihKontrol=moment().format('YYYY-MM-DD');
  irsaliyeNoGuncellenecek: number;
  eskiIrsaliyeNo: number;
  

  dataSource : MatTableDataSource<SatilanUrun>;

  displayedColumns: string[] = ['urunAdi', 'fiyat', 'kdv', 'miktar','kdvTutar', 'tutar','islemler'];

  

  @ViewChild('tablo') tablo: ElementRef;
  @ViewChild('irsaliyeId') irsaliyeId: ElementRef;
  @ViewChild('irsaliyeNo') irsaliyeNo: ElementRef;
  
  
  vdIrsaliyeId=new FormControl('',Validators.required);
  vdIrsaliyeTarih=new FormControl('',Validators.required);
  vdMusteriId=new FormControl('',Validators.required);
  vdIrsaliyeNo=new FormControl('',Validators.required);
  

  constructor(private messageService: MessageService,private musteriService: MusteriService,private satilanUrunService: SatilanUrunService,private irsaliyeService: IrsaliyeService,private rota: ActivatedRoute) {
  
     }

  ngOnInit(): void {
    this.MusteriListesi();
    this.SatilanUrunListesi();
    if(this.rota.routeConfig.path=="irsaliyeEkle/:irsaliyeNo"){
      this.IrsaliyeGuncelleGetir();
    }
    }



    IrsaliyeEkle(irsaliyeNo: number): void{
      let tarih=this.irsaliyeTarih;
      let musteriId=this.valueMusteriListesi.musteriId;
      let satilanUrunId: any[]=[];
      let satilanUrun=this.satilanUrunListeKontrol;
      let miktar: any[]=[];
      let kdvTutar: any[]=[];
      let tutar: any[]=[];

    let sayac=this.satilanUrunListeKontrol.length
    let index=0;
    this.satilanUrunListeKontrol.every(element => {
      satilanUrunId[index]=element.satilanUrunId;
      miktar[index]=+element.miktar;
      kdvTutar[index]=+element.kdvTutar;
      tutar[index]=+element.tutar;

      index++;
      if(sayac==index){
        return false;
      }
      return true;
    });

    

    if(this.vdIrsaliyeNo.invalid || this.vdIrsaliyeTarih.invalid || this.vdMusteriId.invalid || this.satilanUrunListeKontrol.length==0){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }
    if(irsaliyeNo==0){
      this.showError("İrsaliye Numarası 0(Sıfır) Olamaz.");
      return;
    }
    if(tarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }

    this.irsaliyeService.IrsaliyeAdd({tarih,musteriId,irsaliyeNo,satilanUrunId,satilanUrun,miktar,kdvTutar,tutar} as unknown as Irsaliye ).subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.valueMusteriListesi.musteriId='';
        this.satilanUrunListeKontrol=[];
        this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);
        this.irsaliyeNo.nativeElement.value=irsaliyeNo+1;
        this.showSuccess('Kayıt İşlemi Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.');
      }
    });
    }

    IrsaliyeGuncelleGetir(): void{
      const irsaliyeNo=+this.rota.snapshot.paramMap.get('irsaliyeNo');
      this.irsaliyeService.IrsaliyeGetWithIrsaliyeNo(irsaliyeNo)
      .subscribe(sonuc=>{
        document.getElementById("Ekle").style.display="none";
        document.getElementById("Guncelle").style.display="inline";
        this.irsaliyeTarih=sonuc[0]["tarih"];
       this.valueMusteriListesi={musteriAdi:sonuc[0]["musteriAdi"],musteriId:sonuc[0]["musteriId"]}as unknown as Musteri;
        this.irsaliyeNo.nativeElement.value=sonuc[0]["irsaliyeNo"];
        this.eskiIrsaliyeNo=sonuc[0]["irsaliyeNo"];
        this.satilanUrunListeKontrol=sonuc;
        this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);

      });
    }

     IrsaliyeGuncelle(irsaliyeNo: number): void{

        let tarih=this.irsaliyeTarih;
        let musteriId=this.valueMusteriListesi.musteriId;
        console.log(this.valueMusteriListesi);
        let satilanUrunId: any[]=[];
        let eskiIrsaliyeNo=this.eskiIrsaliyeNo;
        let satilanUrun=this.satilanUrunListeKontrol;
        let miktar: any[]=[];
        let kdvTutar: any[]=[];
        let tutar: any[]=[];

      let sayac=this.satilanUrunListeKontrol.length
      let index=0;
      this.satilanUrunListeKontrol.every(element => {
        satilanUrunId[index]=element.satilanUrunId;
        miktar[index]=+element.miktar;
        kdvTutar[index]=+element.kdvTutar;
        tutar[index]=+element.tutar;

        index++;
        if(sayac==index){
          return false;
        }
        return true;
      });


      this.vdIrsaliyeNo=new FormControl(irsaliyeNo,Validators.required);
      this.vdIrsaliyeTarih=new FormControl(tarih,Validators.required);
      this.vdMusteriId=new FormControl(musteriId,Validators.required);

      if(this.vdIrsaliyeNo.invalid || this.vdIrsaliyeTarih.invalid || this.vdMusteriId.invalid || this.satilanUrunListeKontrol.length==0){
        this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
        return;
      }
      
      if(irsaliyeNo==0){
        this.showError("İrsaliye Numarası 0(Sıfır) Olamaz.");
        return;
      }
      
      if(tarih.toString()>this.tarihKontrol){
        this.showError('Hatalı Tarih Seçimi');
        return;
      }

      this.irsaliyeService.IrsaliyeUpdate({tarih,musteriId,irsaliyeNo,eskiIrsaliyeNo,satilanUrunId,satilanUrun,miktar,kdvTutar,tutar} as unknown as Irsaliye).subscribe(sonuc=>{
        if(sonuc.message=='Ok'){
          this.satilanUrunListeKontrol=[];
          this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);
          this.irsaliyeNo.nativeElement.value=irsaliyeNo+1;
          this.showSuccess('Güncelleme İşlemi Gerçekleştirildi.');
          document.getElementById("Guncelle").style.display="none";
          document.getElementById("Ekle").style.display="inline";
        }else{
          this.showError('Beklenmedik Bir Hata Oluştu.');
        }
      });

     }
   
  
    MusteriListesi(): void{
      this.musteriService.MusteriListesi()
      .subscribe(
        sonuc=>{
            this.musteriListesi=sonuc;
        }
      )
      
    }


    SatilanUrunListesi(): void{
      
      this.satilanUrunService.SatilanUrunGet()
      .subscribe(sonuc=>this.satilanUrunListesi=sonuc)
    }

 
    UrunSec(event){
      

    let index=0;
      this.satilanUrunListeKontrol.forEach(element => {
        if(event.value["urunAdi"]==element.urunAdi){
          index++;
        }
      });
      if(index>0){
        this.showError('Ürün Listede Ekli.');
        return;
      }else{
        this.satilanUrunListeKontrol.push(event.value);
        this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);
      }
    
      
    }

  
    FocusOut(element) 
    {
      element.tutar= (+element.miktar * element.fiyat).toFixed(2);
      element.kdvTutar=(element.tutar*(element.kdv/100)).toFixed(2);
      
    }

    RowSil(index: number){
      this.satilanUrunListeKontrol.splice(index,1);
      this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);
    }
  
    ToplamKdvTutar() {   
      let toplamKdvTutar=this.satilanUrunListeKontrol.map(s=>s).reduce((topKdvTutar,sU)=>topKdvTutar+((sU.kdv/100)*sU.tutar),0);
      return toplamKdvTutar.toFixed(2);
    }
  
    ToplamTutar(){
      let toplamTutar=this.satilanUrunListeKontrol.map(t=>t.tutar).reduce((topTutar,tutar)=>+topTutar+(+tutar),0);
      return toplamTutar.toFixed(2);
    }




    showSuccess(messageDetail: string) {
      this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
    }
    showError(messageDetail: string) {
      this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
    }

    getValidationErrorMessage() {
      return this.vdIrsaliyeId.hasError('required') ? 'Zorunlu Alan' : '';
    }

 
}


