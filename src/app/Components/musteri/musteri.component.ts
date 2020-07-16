import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MusteriService } from 'src/app/Services/Musteri.service';
import { Musteri } from 'src/app/Models/Musteri';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { style, transition, state, trigger, animate } from '@angular/animations';
import {MessageService, ConfirmationService} from 'primeng/api';
import {  Validators, FormControl } from '@angular/forms';




@Component({
  selector: 'app-musteri',
  templateUrl:'./musteri.component.html',
  styleUrls: ['./musteri.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

  
})

export class MusteriComponent implements OnInit {

  musteriler: Musteri[];
  yeniMusteri: any;
  guncelMusteri: any;
  silinecekMusteriId: string;
  dataSource : MatTableDataSource<Musteri>;

  vdMusteriId=new FormControl('',[Validators.required]);
  vdMusteriAdi = new FormControl('', [Validators.required]);
  vdVergiDaire = new FormControl('', [Validators.required]);
  vdVergiDaireNo = new FormControl('', [Validators.required]);
  vdAdres = new FormControl('', [Validators.required]);
  
  
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('musteriId') musteriId: ElementRef;
  @ViewChild('musteriAdi') musteriAdi: ElementRef;
  @ViewChild('vergiDaire') vergiDaire: ElementRef;
  @ViewChild('vergiDaireNo') vergiDaireNo: ElementRef;
  @ViewChild('adres') adres: ElementRef;
  @ViewChild('aciklama') aciklama: ElementRef;
  
  columnsToDisplay = ['musteriAdi', 'vergiDaire', 'aciklama','islemler'];
  expandedElement: Musteri | null;
  constructor(private musteriService: MusteriService,private messageService: MessageService,private confirmationService: ConfirmationService) {
    
   }
  
  ngOnInit(): void {
    this.MusteriGet();
  }

 

  MusteriGet(): void{
    this.musteriService.MusteriGet()
    .subscribe(m=>
      {
        this.musteriler=m;
        this.dataSource = new MatTableDataSource<Musteri>(this.musteriler);
        this.dataSource.paginator = this.paginator;
      });
  }

  MusteriAdd(musteriAdi: string,vergiDaire: string,vergiDaireNo: string,adres: string,aciklama: string): void{
    
    if(this.vdMusteriAdi.invalid || this.vdVergiDaire.invalid || this.vdVergiDaireNo.invalid|| this.vdAdres.invalid){
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return ;
    }
    this.musteriService.MusteriAdd({musteriAdi,vergiDaire,vergiDaireNo,adres,aciklama} as Musteri)
    .subscribe(sonuc=> 
      {
        if(sonuc.message=='Ok'){
        this.yeniMusteri=sonuc.data;
        this.musteriler.push(this.yeniMusteri);
        this.dataSource = new MatTableDataSource<Musteri>(this.musteriler);
        this.dataSource.paginator = this.paginator;
        this.musteriAdi.nativeElement.value='';
        this.vergiDaire.nativeElement.value='';
        this.adres.nativeElement.value='';
        this.vergiDaireNo.nativeElement.value='';
        this.aciklama.nativeElement.value='';
        this.showSuccess("Kayıt İşlemi Gerçekleştirildi.");
        }else{
          this.showError('Beklenmedik Bir Hata Oluştu.');
        }
      });
  }

  MusteriGuncelleHazirlik(musteriId: string,musteriAdi: string,vergiDaire: string,vergiDaireNo: string,adres: string,aciklama: string): void{
    document.getElementById('Guncelle').style.display='inline';
    document.getElementById('Kaydet').style.display='none';
    this.musteriId.nativeElement.value=musteriId;
    this.musteriAdi.nativeElement.value=musteriAdi;
    this.vergiDaire.nativeElement.value=vergiDaire;
    this.adres.nativeElement.value=adres;
    this.vergiDaireNo.nativeElement.value=vergiDaireNo;
    this.aciklama.nativeElement.value=aciklama;
    this.vdMusteriAdi = new FormControl(musteriAdi, [Validators.required]);
    this.vdVergiDaire = new FormControl(vergiDaire, [Validators.required]);
    this.vdVergiDaireNo = new FormControl(vergiDaireNo, [Validators.required]);
    this.vdAdres = new FormControl(adres, [Validators.required]);
  }

  MusteriGuncelle(musteriId: string,musteriAdi: string,vergiDaire: string,vergiDaireNo: string,adres: string,aciklama: string): void{

    if(this.vdMusteriAdi.invalid || this.vdVergiDaire.invalid || this.vdVergiDaireNo.invalid|| this.vdAdres.invalid)
    {
      this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
      return ;
    }
    
      this.musteriService.MusteriGuncelle({musteriId,musteriAdi,vergiDaire,vergiDaireNo,adres,aciklama} as Musteri)
      .subscribe(sonuc=> {
        if(sonuc.message=='Ok'){
          this.MusteriGet();
          this.musteriId.nativeElement.value='';
          this.musteriAdi.nativeElement.value='';
          this.vergiDaire.nativeElement.value='';
          this.adres.nativeElement.value='';
          this.vergiDaireNo.nativeElement.value='';
          this.aciklama.nativeElement.value='';
          this.showSuccess("Güncelleme Kaydı Gerçekleştirildi.");
          document.getElementById('Guncelle').style.display='none';
          document.getElementById('Kaydet').style.display='inline';
        }else{
          this.showError('Beklenmedik Bir Hata Oluştu');
        }
        

      })
  }

  

  MusteriSilHazirlik(musteriId: string) {
    this.confirmationService.confirm({
        message: 'Silme İşlemini Onaylıyor musunuz?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        key:'musteri',
        accept: () => {
          this.silinecekMusteriId=musteriId;
            this.MusteriSil();
        },
        reject: () => {
            
        }
    });
  }

  MusteriSil(): void{
    this.musteriService.MusteriSil(this.silinecekMusteriId)
    .subscribe(sonuc=>{
      if(sonuc.message=='Ok'){
        this.MusteriGet();
        this.showSuccess('Kayıt Silme İşlemi Gerçekleştirildi.');
      }else{
        this.showError('Beklenmedik Bir Hata Oluştu');
      }
    });
    
  }

    showSuccess(messageDetail: string) {
      this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
    }
    showError(messageDetail: string) {
      this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
    }

    getValidationErrorMessage() {
      return this.vdMusteriId.hasError('required') ? 'Zorunlu Alan' : '';
    }


}





