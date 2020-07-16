import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Musteri } from 'src/app/Models/Musteri';
import { MatTableDataSource } from '@angular/material/table';
import { SatilanUrun } from 'src/app/Models/SatilanUrun';
import { MusteriService } from 'src/app/Services/Musteri.service';
import { SatilanUrunService } from 'src/app/Services/satilan-urun.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { FaturaService } from 'src/app/Services/fatura.service';
import { Irsaliye } from 'src/app/Models/Irsaliye';

@Component({
  selector: 'app-fatura-direkt',
  templateUrl: './fatura-direkt.component.html',
  styleUrls: ['./fatura-direkt.component.css']
})
export class FaturaDirektComponent implements OnInit {

  faturaTarih: Date;
  musteriListesi: Musteri[];
  valueMusteriListesi: Musteri;
  satilanUrunListesi: SatilanUrun[];
  satilanUrunListeKontrol: SatilanUrun[]=[];
  tarihKontrol=moment().format('YYYY-MM-DD');


  dataSource: MatTableDataSource<SatilanUrun>;

  displayedColumns: string[]=['urunAdi', 'fiyat', 'kdv', 'miktar','kdvTutar', 'tutar','islemler'];

  @ViewChild('faturaNo') faturaNo: ElementRef;

  vdFaturaDirektId=new FormControl('',Validators.required);
  vdFaturaTarih=new FormControl('',Validators.required);
  vdMusteriId=new FormControl('',Validators.required);
  vdFaturaNo=new FormControl('',Validators.required);

  constructor(private musteriService: MusteriService,private satilanUrunService: SatilanUrunService,private messageService: MessageService,private faturaService: FaturaService) { 

  }

  ngOnInit(): void {
    this.MusteriListesi();
    this.SatilanUrunListesi();
  }


  FaturaEkle(faturaNo: number): void{

    let tarih=this.faturaTarih;
    let musteriId=this.valueMusteriListesi.musteriId;
    let irsaliyeNo=faturaNo; // BackEnd de İrsaliye kesimi üzerinden fatura olusturulucak Dto gerekliliğine göre boyle olması gerekıyor.

    if(this.vdFaturaTarih.invalid || this.vdMusteriId.invalid || this.vdFaturaNo.invalid || this.satilanUrunListeKontrol.length==0){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return ;
    }
    if(faturaNo==0){
      this.showError('Fatura Numarası 0(Sıfır) Olamaz.');
      return;
    }
    if(tarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }

    let satilanUrun=this.satilanUrunListeKontrol;
    let satilanUrunId: any[]=[];
    let miktar: any[]=[];
    let kdvTutar: any[]=[];
    let tutar: any[]=[];

    let index=0;
    let sayac=this.satilanUrunListeKontrol.length;
    this.satilanUrunListeKontrol.every(x=>{
      satilanUrunId[index]=x.satilanUrunId;
      miktar[index]=+x.miktar;
      kdvTutar[index]=+x.kdvTutar;
      tutar[index]=+x.tutar;

      index++;
      if(index==sayac){
        return false;
      }

       return true;
      
    })

    
    this.faturaService.FaturaDirektAdd({tarih,musteriId,irsaliyeNo,satilanUrunId,satilanUrun,miktar,kdvTutar,tutar} as unknown as Irsaliye).subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.valueMusteriListesi.musteriId='';
        this.faturaNo.nativeElement.value=faturaNo+1;
        this.satilanUrunListeKontrol=[];
        this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);
        this.showSuccess('Kayıt İşlemi Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.');
      }
    })

  }


  MusteriListesi(): void{
      this.musteriService.MusteriListesi()
          .subscribe(sonuc=>{
            this.musteriListesi=sonuc;
          })
  }

  SatilanUrunListesi(): void{
    this.satilanUrunService.SatilanUrunGet()
            .subscribe(sonuc=>{
              this.satilanUrunListesi=sonuc;
            })
  }


  

  RowSil(index: number): void{
    this.satilanUrunListeKontrol.splice(index,1);
    this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);
  }

  FocusOut(element): void{
      
    element.tutar=(+element.miktar*element.fiyat).toFixed(2);
    element.kdvTutar=(element.tutar*(element.kdv/100)).toFixed(2);
  }

  UrunSec(event){
    
    let index=0;
    this.satilanUrunListeKontrol.forEach(element=>{
      if(event.value['urunAdi']==element.urunAdi){
        index++;
      }
    })
      if(index>0){
        this.showError('Ürün Listede Ekli.');
        return;
      }else{
        this.satilanUrunListeKontrol.push(event.value);
        this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunListeKontrol);
      }
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
    return this.vdFaturaDirektId.hasError('required') ? 'Zorunlu Alan' : '';
  }
}
