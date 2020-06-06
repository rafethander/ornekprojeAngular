import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { AlinanUrun } from 'src/app/Models/AlinanUrun';
import { MatTableDataSource } from '@angular/material/table';
import { AlinanUrunService } from 'src/app/Services/alinan-urun.service';
import { MatPaginator } from '@angular/material/paginator';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as moment from 'moment';


@Component({
  selector: 'app-alinan-urunler',
  templateUrl:'./alinan-urunler.component.html',
  styleUrls: ['./alinan-urunler.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AlinanUrunlerComponent implements OnInit {
  
  alinanUrunler: AlinanUrun[];
  yeniAlinanUrun: any;
  guncelAlinanUrun: any;
  alimTarih: Date;
  tarihKontrol=moment().format('YYYY-MM-DD');
  dataSource : MatTableDataSource<AlinanUrun>;


  columnsToDisplay: string[] = ['tedarikciAdi','urunAdi','fiyat','islemler'];
  expandedElement: AlinanUrun | null;
  
  
  

  vdAlinanUrunId=new FormControl('',[Validators.required]);
  vdTedarikciAdi=new FormControl('',[Validators.required]);
  vdAlimTarih=new FormControl('',[Validators.required]);
  vdFaturaNo=new FormControl('',[Validators.required]);
  vdUrunAdi=new FormControl('',[Validators.required]);
  vdBirim=new FormControl('',[Validators.required]);
  vdMiktar=new FormControl('',[Validators.required]);
  vdFiyat=new FormControl('',[Validators.required]);
  vdKdv=new FormControl('',[Validators.required]);


  @ViewChild('alinanUrunId') alinanUrunId: ElementRef;
  @ViewChild('tedarikciAdi') tedarikciAdi: ElementRef;
  @ViewChild('faturaNo') faturaNo: ElementRef;
  @ViewChild('urunAdi') urunAdi: ElementRef;
  @ViewChild('birim') birim: ElementRef;
  @ViewChild('miktar') miktar: ElementRef;
  @ViewChild('fiyat') fiyat: ElementRef;
  @ViewChild('kdv') kdv: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(private alinanUrunService: AlinanUrunService,private messageService: MessageService,private confirmService: ConfirmationService) { }

  ngOnInit(): void {
    this.AlinanUrunGet();
  }


  AlinanUrunGet(): void{
    this.alinanUrunService.AlinanUrunGet()
    .subscribe(sonuc=>{
      
      this.alinanUrunler=sonuc;
      this.dataSource=new MatTableDataSource<AlinanUrun>(this.alinanUrunler);
      this.dataSource.paginator = this.paginator;
    });
  }

  AlinanUrunAdd(tedarikciAdi: string,faturaNo: string,urunAdi: string,birim: string,miktar: number,fiyat: number,kdv: number): void{
    let alimTarih=this.alimTarih;
    let alimTarihString=this.alimTarih.toString();

    if(this.vdTedarikciAdi.invalid || this.vdAlimTarih.invalid || this.vdFaturaNo.invalid || this.vdUrunAdi.invalid || this.vdBirim.invalid || this.vdMiktar.invalid || this.vdFiyat.invalid || this.vdKdv.invalid){

      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }

    if(this.alimTarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }

    
    this.alinanUrunService.AlinanUrunAdd({ tedarikciAdi, alimTarih ,alimTarihString , faturaNo, urunAdi, birim, miktar, fiyat, kdv }  as AlinanUrun).subscribe(sonuc=>{
      if(sonuc.message='Ok'){
        this.yeniAlinanUrun=sonuc.data;
        this.alinanUrunler.push(this.yeniAlinanUrun);
        this.dataSource=new MatTableDataSource<AlinanUrun>(this.alinanUrunler);
        this.dataSource.paginator = this.paginator;
        this.tedarikciAdi.nativeElement.value='';
        this.faturaNo.nativeElement.value='';
        this.urunAdi.nativeElement.value='';
        this.birim.nativeElement.value='';
        this.miktar.nativeElement.value='';
        this.fiyat.nativeElement.value='';
        this.kdv.nativeElement.value='';
        this.showSuccess('Kayıt İşlemi Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.')
      }
      
    });
  }

  AlinanUrunUpdateHazirlik(alinanUrunId: string,tedarikciAdi: string,alimTarih: Date,faturaNo: string,urunAdi: string,birim: string,miktar: string, fiyat: string,kdv: string){
    document.getElementById('Guncelle').style.display='inline';
    document.getElementById('Kaydet').style.display='none';
    this.alinanUrunId.nativeElement.value=alinanUrunId;
    this.tedarikciAdi.nativeElement.value=tedarikciAdi;
    this.alimTarih=alimTarih;
    this.faturaNo.nativeElement.value=faturaNo;
    this.urunAdi.nativeElement.value=urunAdi;
    this.birim.nativeElement.value=birim;
    this.miktar.nativeElement.value=+miktar;
    this.fiyat.nativeElement.value=+fiyat;
    this.kdv.nativeElement.value=+kdv;

    this.vdTedarikciAdi=new FormControl(tedarikciAdi,Validators.required);
    this.vdAlimTarih=new FormControl(alimTarih,Validators.required);
    this.vdFaturaNo=new FormControl(faturaNo,Validators.required);
    this.vdUrunAdi=new FormControl(urunAdi,Validators.required);
    this.vdBirim=new FormControl(birim,Validators.required);
    this.vdMiktar=new FormControl(miktar,Validators.required);
    this.vdFiyat=new FormControl(fiyat,Validators.required);
    this.vdKdv=new FormControl(kdv,Validators.required);

  }

 
  AlinanUrunUpdate(alinanUrunId: string,tedarikciAdi: string,faturaNo: string,urunAdi: string,birim: string,miktar: number,fiyat: number,kdv: number): void{
    let alimTarih=this.alimTarih;
    let alimTarihString=this.alimTarih.toString();

    if(this.vdTedarikciAdi.invalid || this.vdAlimTarih.invalid || this.vdFaturaNo.invalid || this.vdUrunAdi.invalid || this.vdBirim.invalid || this.vdMiktar.invalid || this.vdFiyat.invalid || this.vdKdv.invalid){

      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return;
    }

    if(this.alimTarih.toString()>this.tarihKontrol){
      this.showError('Hatalı Tarih Seçimi');
      return;
    }
    
    
    this.alinanUrunService.AlinanUrunUpdate({alinanUrunId,tedarikciAdi,alimTarih,alimTarihString,faturaNo,urunAdi,birim,miktar,fiyat,kdv} as unknown as AlinanUrun)
    .subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.AlinanUrunGet();
        this.tedarikciAdi.nativeElement.value='';
        this.alimTarih.valueOf();
        this.faturaNo.nativeElement.value='';
        this.urunAdi.nativeElement.value='';
        this.birim.nativeElement.value='';
        this.miktar.nativeElement.value='';
        this.fiyat.nativeElement.value='';
        this.kdv.nativeElement.value='';
        this.showSuccess('Güncelleme Kaydı Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu.');
      }
    });
  }

  AlinanUrunSilHazirlik(alinanUrunId: string): void{

    this.confirmService.confirm({
      message:'Silme İşlemini Onaylıyor musunuz?',
      header:'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () =>{
        this.AlinanUrunSil(alinanUrunId);
      },
      reject: ()=>{

      }
  });
}

  AlinanUrunSil(alinanUrunId: string): void{

    this.alinanUrunService.AlinanUrunDelete(alinanUrunId)
    .subscribe(sonuc=>{
      if(sonuc.message='Ok'){
        this.AlinanUrunGet();
        this.showSuccess('Kayıt Silme İşlemi Gerçekleştirildi.')
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
    return this.vdAlinanUrunId.hasError('required') ? 'Zorunlu Alan' : '';
  }



}




