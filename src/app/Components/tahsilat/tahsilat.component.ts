import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Musteri } from 'src/app/Models/Musteri';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MusteriService } from 'src/app/Services/Musteri.service';
import * as moment from 'moment';
import { OdemeTuru } from 'src/app/Models/Enums/OdemeTuruEnum';
import { TahsilatService } from 'src/app/Services/tahsilat.service';
import { Tahsilat } from 'src/app/Models/Tahsilat';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tahsilat',
  templateUrl: './tahsilat.component.html',
  styleUrls: ['./tahsilat.component.css']
})
export class TahsilatComponent implements OnInit {

  musteriListesi: Musteri[]=[];
  valueMusteriListesi: Musteri;
  tahsilatListesi: Tahsilat[]=[];
  tahsilatTarih: Date;
  tarihKontrol=moment().format('YYYY-MM-DD');
  tahsilatTur: number;
  toplamFaturaTutar: number;
  
  TahsilatPenceresi: boolean=false;
  tahsilatTuru=OdemeTuru;
  keys=Object.keys;

  @ViewChild('tahsilatTutar') tahsilatTutar: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dataSource:  MatTableDataSource<Tahsilat>;
  displayedColumns: string[]=["musteriAdi","tarih","tur","tutar","islemler"];

  
  vdTahsilatTarih=new FormControl('',Validators.required);
  vdTahsilatId=new FormControl('',Validators.required);
  vdMusteriId=new FormControl('',Validators.required);
  vdTahsilatTuru=new FormControl('',Validators.required);
  vdTahsilatTutari=new FormControl('',Validators.required);

  constructor(private messageService: MessageService,private musteriService: MusteriService,private tahsilatService: TahsilatService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.MusteriListesi();
    
  }


  MusteriListesi(): void{
    this.musteriService.MusteriListesi().subscribe(sonuc=> this.musteriListesi=sonuc);
  }

  TahsilatGirHazirlik(): void{
    if(this.vdMusteriId.invalid){
      this.showError('Müşteri seçimi yapılması zorunludur.');
      return;
    }

    this.TahsilatPenceresi= !this.TahsilatPenceresi;
  }

  TahsilatEkle(tahsilatTutar: number): void{
    if(this.vdTahsilatTarih.invalid || this.vdTahsilatTuru.invalid || this.vdTahsilatTutari.invalid){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }
    if(this.tahsilatTarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }

    let tahsilatTarihi=this.tahsilatTarih;
    let tahsilatTuru=+this.tahsilatTur;
    let musteriId=this.valueMusteriListesi.musteriId;
    this.tahsilatService.TahsilatAdd({tahsilatTarihi,tahsilatTuru,tahsilatTutar,musteriId} as unknown as Tahsilat).subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.TahsilatPenceresi!= this.TahsilatPenceresi;
        this.TahsilatListele();
        this.dataSource=new MatTableDataSource<Tahsilat>(this.tahsilatListesi);
        this.dataSource.paginator=this.paginator;
        this.showSuccess('Kayıt İşlemi Gerçekleştirildi.')
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.')
      }
    })
    
  }

  TahsilatListele(){
    if(this.vdMusteriId.invalid){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }

    let musteriId=this.valueMusteriListesi.musteriId;
    this.tahsilatService.ToplamFaturaTutar(musteriId)
        .subscribe(sonuc=>
          {
            if(sonuc.message=='Ok')
            this.toplamFaturaTutar=+sonuc.data;
            else(
              this.showError('Fatura Toplam Tutar Hesaplama Hatası.')
            )
          })
    this.tahsilatService.TahsilatGet(musteriId)
        .subscribe(sonuc=>
          {
            this.tahsilatListesi=sonuc;
            console.log(this.tahsilatListesi);
            this.dataSource=new MatTableDataSource<Tahsilat>(this.tahsilatListesi);
            this.dataSource.paginator=this.paginator;
          });

  }

  TahsilatSil(tahsilatId: string){
    this.tahsilatService.TahsilatDelete(tahsilatId)
    .subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.TahsilatListele();
        this.showSuccess('Kayıt Silme İşlemi Gerçekleştirildi');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.');
      }
    })
  }

  TahsilatSilHazirlik(id: string): void{
    this.confirmationService.confirm({
      message: 'Silme İşlemini Onaylıyor musunuz?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key:'tahsilat',
      accept: () => {
         let tahsilatId=id;
         console.log(tahsilatId);
          this.TahsilatSil(tahsilatId);
      },
      reject: () => {
          
      }
  });
  }

  ToplamTahsilatTutar(): number{
    return this.tahsilatListesi.map(t=>t.tahsilatTutar).reduce((top,tahsilatTutar)=>top+tahsilatTutar,0);
  }

  





  showSuccess(messageDetail: string) {
    this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
  }
  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
  }

  getValidationErrorMessage() {
    return this.vdTahsilatId.hasError('required') ? 'Zorunlu Alan' : '';
  }

}
