import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SatilanUrunService } from 'src/app/Services/satilan-urun.service';
import { SatilanUrun } from 'src/app/Models/SatilanUrun';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormControl, Validators } from '@angular/forms';
import { rejects } from 'assert';

@Component({
  selector: 'app-satilan-urunler',
  templateUrl: './satilan-urunler.component.html',
  styleUrls: ['./satilan-urunler.component.css']
})
export class SatilanUrunlerComponent implements OnInit {


  satilanUrunler: SatilanUrun[];
  yeniSatilanUrun: any;
  dataSource : MatTableDataSource<SatilanUrun>;
  displayedColumns: string[] = ['urunAdi', 'birim', 'fiyat', 'kdv', 'islemler'];
  
  @ViewChild('satilanUrunId') satilanUrunId: ElementRef;
  @ViewChild('urunAdi') urunAdi: ElementRef;
  @ViewChild('birim') birim: ElementRef;
  @ViewChild('fiyat') fiyat: ElementRef;
  @ViewChild('kdv') kdv: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  vdSatilanUrunId=new FormControl('',Validators.required);
  vdUrunAdi=new FormControl('',Validators.required);
  vdBirim=new FormControl('',Validators.required);
  vdFiyat=new FormControl('',Validators.required);
  vdKdv=new FormControl('',Validators.required);
  
  
  constructor(private satilanUrunService: SatilanUrunService,private messageService: MessageService,private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.SatilanUrunGet();
  }

  SatilanUrunGet(): void{
    this.satilanUrunService.SatilanUrunGet()
    .subscribe(sonuc=>{
      this.satilanUrunler=sonuc;
      this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunler);
      this.dataSource.paginator = this.paginator;
        });
  }

  SatilanUrunAdd(urunAdi: string,birim: string, fiyat: number, kdv: number): void{

    if(this.vdUrunAdi.invalid || this.vdBirim.invalid || this.vdFiyat.invalid || this.vdKdv.invalid){
      this.showError('Zorunlu Alan Boş Bırakılamaz.');
      return;
    }

    this.satilanUrunService.SatilanUrunAdd({urunAdi,birim,fiyat,kdv} as SatilanUrun)
    .subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.yeniSatilanUrun=sonuc.data;
        this.satilanUrunler.push(this.yeniSatilanUrun);
        this.dataSource=new MatTableDataSource<SatilanUrun>(this.satilanUrunler);
        this.dataSource.paginator = this.paginator;
        this.urunAdi.nativeElement.value='';
        this.birim.nativeElement.value='';
        this.fiyat.nativeElement.value='';
        this.kdv.nativeElement.value='';
        this.showSuccess('Kayıt İşlemi Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.');
      }
     
    })
  }

  SatilanUrunSilHazirlik(satilanUrunId: string): void{
    this.confirmationService.confirm({
      message: 'Silme İşlemini Onaylıyor musunuz?',
      header:'Confirmation',
      icon:'pi pi-exclamation-triangle',
      accept: ()=>{
        this.SatilanUrunSil(satilanUrunId);
      },
      reject: ()=>{

      }
    });
  }

  SatilanUrunSil(satilanUrunId: string): void{
    this.satilanUrunService.SatilanUrunDelete(satilanUrunId)
    .subscribe(sonuc=>{
      if(sonuc.message='Ok'){
        this.SatilanUrunGet();
        this.showSuccess('Kayıt Silme İşlemi Gerçekleştirildi.');

      }else{
        this.showError('Beklenmedik Bir Hata Oluştu');
      }
    })
  }

  SatilanUrunGuncelleHazirlik(satilanUrunId: string,urunAdi: string,birim: string,fiyat: string,kdv: string): void{
    document.getElementById('Kaydet').style.display='none';
    document.getElementById('Guncelle').style.display='inline';

    this.satilanUrunId.nativeElement.value=satilanUrunId;
    this.urunAdi.nativeElement.value=urunAdi;
    this.birim.nativeElement.value=birim;
    this.fiyat.nativeElement.value=+fiyat;
    this.kdv.nativeElement.value=+kdv;

    this.vdUrunAdi=new FormControl(urunAdi,Validators.required);
    this.vdBirim=new FormControl(birim,Validators.required);
    this.vdFiyat=new FormControl(fiyat,Validators.required);
    this.vdKdv=new FormControl(kdv,Validators.required);
  }


  SatilanUrunGuncelle(satilanUrunId: string,urunAdi: string,birim: string,fiyat: number,kdv: number): void{

    if(this.vdUrunAdi.invalid || this.vdBirim.invalid || this.vdFiyat.invalid || this.vdKdv.invalid){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }

    this.satilanUrunService.SatilanUrunUpdate({satilanUrunId,urunAdi,birim,fiyat,kdv} as SatilanUrun).subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.SatilanUrunGet();
        this.satilanUrunId.nativeElement.value='';
        this.urunAdi.nativeElement.value='';
        this.birim.nativeElement.value='';
        this.fiyat.nativeElement.value='';
        this.kdv.nativeElement.value='';
        document.getElementById('Guncelle').style.display='none';
        document.getElementById('Kaydet').style.display='inline';
        this.showSuccess('Güncelleme Kaydı Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.');
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
    return this.vdSatilanUrunId.hasError('required') ? 'Zorunlu Alan' : '';
  }
}


