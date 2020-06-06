import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Irsaliye } from 'src/app/Models/Irsaliye';
import { MusteriService } from 'src/app/Services/Musteri.service';
import { IrsaliyeService } from 'src/app/Services/irsaliye.service';
import { Musteri } from 'src/app/Models/Musteri';
import { FaturaService } from 'src/app/Services/fatura.service';
import { Fatura } from 'src/app/Models/Fatura';
import { ActivatedRoute } from '@angular/router';
import { now } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-fatura-ekle',
  templateUrl: './fatura-ekle.component.html',
  styleUrls: ['./fatura-ekle.component.css']
})
export class FaturaEkleComponent implements OnInit {

  faturaTarih: Date;
  tarihKontrol=moment().format('YYYY-MM-DD');
  irsaliyeBaslangicTarih: Date;
  irsaliyeBitisTarih: Date;
  eskiFaturaNo: number;
  valueMusteriListesi: Musteri;
  musteriListesi: Musteri[]=[];
  irsaliyeListesi: Irsaliye[]=[];
  topTutar: any;
  topKdvTutar: any;
  
  


  vdFaturaId=new FormControl('',Validators.required);
  vdFaturaTarih=new FormControl('',Validators.required);
  vdMusteriId=new FormControl('',Validators.required);
  vdFaturaNo=new FormControl('',Validators.required);
  vdIrsaliyeBaslangicTarih=new FormControl('',Validators.required);
  vdIrsaliyeBitisTarih=new FormControl('',Validators.required);

  @ViewChild('faturaId') faturaId: ElementRef;
  @ViewChild('faturaNo') faturaNo: ElementRef;




  dataSource: MatTableDataSource<Irsaliye>;
  displayedColumns: string[]=['irsaliyeNo','irsaliyeTarih','urunAdi','fiyat','kdv','miktar','kdvTutar','tutar']

  constructor(private messageService: MessageService,private confirmService: ConfirmationService,private musteriService: MusteriService,private irsaliyeService: IrsaliyeService,private faturaService: FaturaService,private rota: ActivatedRoute) { }

  ngOnInit(): void {
    this.MusteriListesi();
    if(this.rota.routeConfig.path=="faturaEkle/:faturaNo"){
      this.FaturaGuncelleGetir();
    }
    
  }



  MusteriListesi(): void{
    this.musteriService.MusteriListesi().subscribe(sonuc=>this.musteriListesi=sonuc);
  }

  IrsaliyeGetForFaturaAdd(): void{

    if(this.vdMusteriId.invalid || this.vdIrsaliyeBaslangicTarih.invalid || this.vdIrsaliyeBitisTarih.invalid){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }

    let musteriId=this.valueMusteriListesi.musteriId;
    let baslangicTarih=this.irsaliyeBaslangicTarih;
    let bitisTarih=this.irsaliyeBitisTarih;

   

    this.irsaliyeService.IrsaliyeGetForFaturaAdd({musteriId,baslangicTarih,bitisTarih} as unknown as Irsaliye)
      .subscribe(sonuc=>
        {
        this.irsaliyeListesi=sonuc;
        this.dataSource=new MatTableDataSource<Irsaliye>(this.irsaliyeListesi);
        document.getElementById('ekleFatura').style.display="inline";
        this.ToplamTutar();
        this.ToplamKdvTutar();
        }
        );
  }

  FaturaAdd(faturaNo: number): void{
    let tarih=this.faturaTarih;
    let toplamTutar=this.topKdvTutar+this.topTutar;
    let irsaliyeler=this.irsaliyeListesi;

    
    if(this.vdFaturaTarih.invalid || this.vdMusteriId.invalid || this.vdFaturaNo.invalid || this.vdIrsaliyeBaslangicTarih.invalid ||this.vdIrsaliyeBitisTarih.invalid){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }
    if(faturaNo==0 ){
      this.showError('Fatura Numarası 0(sıfır) olamaz.');
      return;
    }
    if(tarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }

    this.faturaService.FaturaAdd({tarih,faturaNo,toplamTutar,irsaliyeler} as unknown as Fatura)
        .subscribe(sonuc=>{
          if(sonuc.message=='Ok'){
            this.valueMusteriListesi.musteriAdi='';
            this.irsaliyeListesi=[];
            this.dataSource=new MatTableDataSource<Irsaliye>(this.irsaliyeListesi);
            this.faturaNo.nativeElement.value=faturaNo+1;
            this.showSuccess('Kayıt İşlemi Gerçekleştirildi.');
          }else{
            this.showError('Beklenmedik Bir Hata Oluştu.');
          }

        })
  }


  FaturaGuncelleGetir(): void{
    const faturaNo=+this.rota.snapshot.paramMap.get('faturaNo');
    this.faturaService.FaturaGuncelleGetir(faturaNo)
    .subscribe(sonuc=> {
      
      this.faturaTarih=sonuc[0]["tarih"];
      this.valueMusteriListesi={musteriId:sonuc[0]["musteriId"],musteriAdi:sonuc[0]["musteriAdi"]} as unknown as Musteri;
      this.faturaNo.nativeElement.value=+sonuc[0]["faturaNo"];
      this.eskiFaturaNo=+sonuc[0]["faturaNo"];
      this.irsaliyeListesi=sonuc;
      this.dataSource=new MatTableDataSource<Irsaliye>(this.irsaliyeListesi);
      this.ToplamTutar();
      this.ToplamKdvTutar();
      document.getElementById('ekleFatura').style.display='none';
      document.getElementById("guncelleFatura").style.display='inline';
    });

  }

  FaturaGuncelle(faturaNo: number): void{
    let tarih=this.faturaTarih;
    let musteriId=this.valueMusteriListesi.musteriId;
    let toplamTutar=this.topTutar+this.topKdvTutar;
    let irsaliyeler=this.irsaliyeListesi;
    let eskiFaturaNo=this.eskiFaturaNo;

    this.vdFaturaTarih=new FormControl(tarih,Validators.required);
    this.vdMusteriId=new FormControl(musteriId,Validators.required);
    this.vdFaturaNo=new FormControl(faturaNo,Validators.required);

    
    
    if(this.vdFaturaTarih.invalid || this.vdMusteriId.invalid || this.vdFaturaNo.invalid){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }

    if(faturaNo==0 ){
      this.showError('Fatura Numarası 0(sıfır) olamaz.');
      return;
    }

    if(tarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }

    this.faturaService.FaturaUpdate({tarih,faturaNo,eskiFaturaNo,toplamTutar,irsaliyeler} as unknown as Fatura)
      .subscribe(sonuc=>{
        if(sonuc.message=='Ok'){
          this.valueMusteriListesi.musteriAdi='';
          this.irsaliyeListesi=[];
          this.dataSource=new MatTableDataSource<Irsaliye>(this.irsaliyeListesi);
          this.faturaNo.nativeElement.value=faturaNo+1;
          document.getElementById('guncelleFatura').style.display="none";
          document.getElementById('ekleFatura').style.display='inline';
          this.showSuccess('Kayıt İşlemi Gerçekleştirildi.');
        }else{
          this.showError('Beklenmedik Bir Hata Oluştu.');
        }

      });
  }




  ToplamKdvTutar(): void{
    let kdvToplam: any=0;
    let sayac=this.irsaliyeListesi.length
    let index=0;
   this.irsaliyeListesi.every((item)=> 
   {
     if(sayac>index){
      kdvToplam=kdvToplam+item.kdvTutar;
      index++;
      return true;
     }else if(sayac==index)
     return false;
     
   })
   this.topKdvTutar=kdvToplam;

  }
  
  ToplamTutar(): void{
    let toplam: any=0;
    let sayac=this.irsaliyeListesi.length
    let index=0;
   this.irsaliyeListesi.every((item)=> 
   {
     if(sayac>index){
      toplam=toplam+item.tutar;
      index++;
      return true;
     }else if(sayac==index)
     return false;
     
   })
   this.topTutar=toplam;
  }
  
  showSuccess(messageDetail: string) {
    this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
  }
  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
  }

  getValidationErrorMessage() {
    return this.vdFaturaId.hasError('required') ? 'Zorunlu Alan' : '';
  }

}
