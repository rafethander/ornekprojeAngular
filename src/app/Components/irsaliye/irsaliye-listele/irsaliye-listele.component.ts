import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MusteriService } from 'src/app/Services/Musteri.service';
import { IrsaliyeService } from 'src/app/Services/irsaliye.service';
import { Irsaliye } from 'src/app/Models/Irsaliye';
import { Musteri } from 'src/app/Models/Musteri';


@Component({
  selector: 'app-irsaliye-listele',
  templateUrl: './irsaliye-listele.component.html',
  styleUrls: ['./irsaliye-listele.component.css']
})
export class IrsaliyeListeleComponent implements OnInit {

  dateBaslangic: Date;
  dateBitis : Date;
  musteriListesi: Musteri[]=[];
  valueMusteriListesi: Musteri={musteriId:undefined} as unknown as Musteri;
  irsaliyeListe: any[]=[];


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  
  constructor(private irsaliyeService: IrsaliyeService,private messageService: MessageService,private confirmationService: ConfirmationService,private musteriService: MusteriService) { }
  
  ngOnInit(): void {
    
    this.MusteriListesi();
  }

  displayedColumns: string[] = ['irsaliyeNo', 'tarih','musteriAdi','urunAdi', 'adet', 'faturaNo','islemler'];
  dataSource : MatTableDataSource<Irsaliye>;
 

  MusteriListesi(): void{
    this.musteriService.MusteriListesi()
    .subscribe(sonuc=>this.musteriListesi=sonuc);
    
  }


  Ara(irsaliyeNo: number): void{
    let bitisTarih=this.dateBitis;
    let baslangicTarih=this.dateBaslangic;
    let musteriId=this.valueMusteriListesi.musteriId;

    this.irsaliyeService.IrsaliyeGet({irsaliyeNo,bitisTarih,baslangicTarih,musteriId} as unknown as Irsaliye).subscribe(sonuc=>{
      this.irsaliyeListe=sonuc;
      if(this.irsaliyeListe.length==0){
        this.showError("İrsaliye Bulunamadı.");
      }
      this.dataSource=new MatTableDataSource<Irsaliye>(this.irsaliyeListe);
      this.dataSource.paginator = this.paginator;
    });
  }

  IrsaliyeSilHazirlik(irsaliyeNo: number): void{
    this.confirmationService.confirm({
      message: `İrsaliye Numarası '${irsaliyeNo}' Olarak Kayıtlı Verileri Silmeyi Onaylıyor musunuz?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key:'irsaliyeListele',
      accept: () => {
        this.irsaliyeService.IrsaliyeDelete(irsaliyeNo).subscribe(sonuc=>{

          if(sonuc.message='Ok'){
            irsaliyeNo=0;
            this.Ara(irsaliyeNo);
            this.showSuccess('Kayıt Silme İşlemi Gerçekleştirildi.')
          }else{
            this.showError('Beklenmedik Bir Hata Oluştu.');
          }
        });
      },
      reject: () => {
          
      }
  });
  }

 





  showSuccess(messageDetail: string) {
    this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
  }
  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
  }

}





