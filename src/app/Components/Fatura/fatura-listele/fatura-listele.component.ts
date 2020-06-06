import { Component, OnInit, ViewChild } from '@angular/core';
import { Musteri } from 'src/app/Models/Musteri';
import { Fatura } from 'src/app/Models/Fatura';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MusteriService } from 'src/app/Services/Musteri.service';
import { FaturaService } from 'src/app/Services/fatura.service';

@Component({
  selector: 'app-fatura-listele',
  templateUrl: './fatura-listele.component.html',
  styleUrls: ['./fatura-listele.component.css']
})
export class FaturaListeleComponent implements OnInit {

  dateBaslangic: Date;
  dateBitis: Date;
  musteriListesi: Musteri[]=[];
  valueMusteriListesi: Musteri={musteriId:undefined} as unknown as Musteri;
  faturaListe: Fatura[]=[];
  dataSource: MatTableDataSource<Fatura>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[]=['faturaNo','tarih','musteriAdi','tutar','kdvTutar','toplamTutar','islemler']

  constructor(private messageService: MessageService,private confirmationService: ConfirmationService,private musteriService: MusteriService,private faturaService: FaturaService) {
   
   }

  ngOnInit(): void {
    this.MusteriListesi();
  }

  MusteriListesi(): void{
    this.musteriService.MusteriListesi().subscribe(sonuc=>this.musteriListesi=sonuc);
  }

  FaturaAra(faturaNo: number): void{
    let baslangicTarih=this.dateBaslangic;
    let bitisTarih=this.dateBitis;
    let musteriId=this.valueMusteriListesi.musteriId;
    
    this.faturaService.FaturaGet({baslangicTarih,bitisTarih,faturaNo,musteriId} as unknown as Fatura).subscribe(sonuc=>{
      this.faturaListe=sonuc;
      if(this.faturaListe.length==0){
        this.showError('Fatura Bulunamadı.');
      }
      this.dataSource=new MatTableDataSource<Fatura>(this.faturaListe);
      this.dataSource.paginator=this.paginator;
    });

  }


  FaturaSilHazirlik(faturaNo: number): void{
    this.confirmationService.confirm({
      message: `Fatura Numarası '${faturaNo}' Olarak Kayıtlı Verileri Silmeyi Onaylıyor musunuz?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.faturaService.FaturaDelete(faturaNo).subscribe(sonuc=>{

          if(sonuc.message='Ok'){
            faturaNo=0;
            this.FaturaAra(faturaNo);
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
