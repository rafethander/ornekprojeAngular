import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Odeme } from 'src/app/Models/Odeme';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { OdemeService } from 'src/app/Services/odeme.service';
import { OdemeTuru } from 'src/app/Models/Enums/OdemeTuruEnum';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as moment from 'moment';



@Component({
  selector: 'app-odemeler',
  templateUrl: './odemeler.component.html',
  styleUrls: ['./odemeler.component.css']
})
export class OdemelerComponent implements OnInit {

  
  keys=Object.keys;
  odemeTuru=OdemeTuru;
  
  
  Odemeler: Odeme[];
  yeniOdeme: any;
  guncellenenOdeme: any;
  silinecekOdemeId: string;
  odenecekOdemeId: string;
  odemeTarih: Date;
  tarihKontrol=moment().format('YYYY-MM-DD');
  valueOdemeTuru: number;
  

  vdOdemeId=new FormControl('',[Validators.required]);
  vdOdemeturu=new FormControl('',[Validators.required]);
  vdOdemeTarih=new FormControl('',[Validators.required]);
  vdFirmaAdi=new FormControl('',[Validators.required]);
  vdOdemeTutar=new FormControl('',[Validators.required]);
  vdKime=new FormControl('',[Validators.required]);
  
  


  dataSource : MatTableDataSource<Odeme>;
  displayedColumns: string[] = ['odemeTarih', 'firmaAdi', 'odenecekTutar', 'kime', 'odemeTuru','islemler'];
  
  @ViewChild('odemeId') odemeId: ElementRef;
  @ViewChild('firmaAdi') firmaAdi: ElementRef;
  @ViewChild('odenecekTutar') odenecekTutar: ElementRef;
  @ViewChild('kime') kime: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  
  
  constructor(private odemeService: OdemeService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    
    this.OdemelerGet();
    
  }

  OdemelerGet(): void{
    this.odemeService.OdemelerGet()
    .subscribe(sonuc=>{
      this.Odemeler=sonuc;
      this.dataSource=new MatTableDataSource<Odeme>(this.Odemeler);
      this.dataSource.paginator = this.paginator;
    })
  }

  OdemeAdd(firmaAdi: string,odenecekTutar: number,kime: string): void{

    let odemeTuru=+this.valueOdemeTuru;
    let odemeTarih=this.odemeTarih;
    let odemeTarihString=this.odemeTarih.toString();

    if(this.vdOdemeturu.invalid || this.vdOdemeTarih.invalid || this.vdFirmaAdi.invalid || this.vdOdemeTutar.invalid || this.vdKime.invalid){
      this.showError("Zorunlu Alanlar Boş Bırakılamaz.");
      return;
    }
    if(odemeTarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }


    this.odemeService.OdemeAdd({odemeTuru, odemeTarih,odemeTarihString, firmaAdi, odenecekTutar, kime } as unknown as Odeme )
    .subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.yeniOdeme=sonuc.data;
        this.Odemeler.push(this.yeniOdeme);
        this.dataSource=new MatTableDataSource<Odeme>(this.Odemeler);
        this.dataSource.paginator = this.paginator;
        this.firmaAdi.nativeElement='';
        this.odenecekTutar.nativeElement='';
        this.kime.nativeElement='';
        this.showSuccess('Kayıt İşlemi Gerçekleştirildi.')
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.')
      }
    });
  }

  OdemeGuncelleHazirlik(odemeId: string,odemeTarih: Date,firmaAdi: string,odenecekTutar: number,kime: string,odemeTuru: number,odemeTuruString: string){
    document.getElementById('Guncelle').style.display='inline';
    document.getElementById('Kaydet').style.display='none';
    this.odemeId.nativeElement.value=odemeId;
    this.valueOdemeTuru=odemeTuru;
    this.odemeTarih=odemeTarih;
    this.firmaAdi.nativeElement.value=firmaAdi;
    this.odenecekTutar.nativeElement.value=odenecekTutar;
    this.kime.nativeElement.value=kime;
    this.vdFirmaAdi=new FormControl(firmaAdi,[Validators.required]);
    this.vdOdemeTutar=new FormControl(odenecekTutar,[Validators.required]);
    this.vdKime=new FormControl(kime,[Validators.required]);
  }

  OdemeGuncelle(odemeId: string,firmaAdi: string,odenecekTutar: number,kime: string): void{

    let odemeTuru=+this.valueOdemeTuru;
    let odemeTarih=this.odemeTarih;

    

    if(this.vdOdemeturu.invalid || this.vdOdemeTarih.invalid || this.vdFirmaAdi.invalid || this.vdOdemeTutar.invalid || this.vdKime.invalid){
      this.showError("Zorunlu Alanlar Boş Bırakılamaz.");
      return;
    }

    if(odemeTarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }
    
    

    this.odemeService.OdemeGuncelle({odemeId,odemeTuru,odemeTarih,firmaAdi,odenecekTutar,kime} as unknown as Odeme)
      .subscribe(sonuc=>{
        if(sonuc.message=="Ok"){
          this.OdemelerGet();
          this.odemeId.nativeElement.value='';
          this.odemeTarih.valueOf();
          this.valueOdemeTuru=0;
          this.firmaAdi.nativeElement.value='';
          this.odenecekTutar.nativeElement.value='';
          this.kime.nativeElement.value='';
          this.showSuccess('Güncelleme Kaydı Gerçekleştirildi.');
          document.getElementById('Guncelle').style.display='none';
          document.getElementById('Kaydet').style.display='inline';
        }else{
          this.showError('Beklenmedik Bir Hata Oluştu');
        }
      }
        )
  }

  OdemeSilHazirlik(odemeId: string): void{
    this.confirmationService.confirm({
      message: 'Silme İşlemini Onaylıyor musunuz?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.silinecekOdemeId=odemeId;
          this.OdemeSil();
      },
      reject: () => {
          
      }
  });
  }

  OdemeSil(): void{
    this.odemeService.OdemeSil(this.silinecekOdemeId)
    .subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.OdemelerGet();
        this.showSuccess('Kayıt Silme İşlemi Gerçekleştirildi');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.');
      }
    })
  }

  OdemeOdendiHazirlik(odemeId: string){
    this.confirmationService.confirm({
      message: 'Ödeme İşlemini Onaylıyor musunuz?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.odenecekOdemeId=odemeId;
          this.OdemeOdendi();
      },
      reject: () => {
          
      }
  });
  }


  OdemeOdendi(): void{
    this.odemeService.OdemeOdendi(this.odenecekOdemeId)
    .subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.OdemelerGet();
        this.showSuccess('Ödeme Kayıt İşlemi Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.')
      }
    })
  }

  showSuccess(messageDetail: string) {
    this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
  }
  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
  }

  getValidationErrorMessage() {
    return this.vdOdemeId.hasError('required') ? 'Zorunlu Alan' : '';
  }

}
