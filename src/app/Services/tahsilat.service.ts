import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { Tahsilat } from '../Models/Tahsilat';
import { GetResult } from '../Models/GetResult';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TahsilatService {


  private  url="http://localhost:65455/api/Tahsilat/";

  private httpOptions={
    headers: new HttpHeaders({'Content-Type':'application/json'})
  }

  constructor(private http: HttpClient,private messageService: MessageService) { }



  TahsilatAdd(tahsilat: Tahsilat): Observable<GetResult>{
    return this.http.post<Tahsilat>(`${this.url}Add`,tahsilat,this.httpOptions)
      .pipe(
        catchError(this.hataYakala<any>('TahsilatEkle'))
      )
  }

  TahsilatDelete(tahsilatId: string): Observable<GetResult>{
    return this.http.delete<string>(`${this.url}Delete/${tahsilatId}`).pipe(catchError(this.hataYakala<any>('TahsilatSil')));
  }

  TahsilatGet(musteriId: string): Observable<Tahsilat[]>{
    return this.http.get<string>(`${this.url}Get/${musteriId}`).pipe(catchError(this.hataYakala<any>('TahsilatListe')));
  }

  ToplamFaturaTutar(musteriId: string): Observable<GetResult>{
    return this.http.get<string>(`${this.url}FaturaToplamTutar/${musteriId}`).pipe(catchError(this.hataYakala<any>('ToplamFaturaTutar')));
  }




  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Hata', detail:`${messageDetail}`});
  }



  /**
   * Http operasyonları hata verdiğinde çalışacak metot
   * @param operasyon - hata nerde oluştu? metodun ismi
   * @param sonuc - hata oluştuğunda dönülecek varsayılan değer (isteğe bağlı)
   */
  private hataYakala<T>(operasyon='operasyon', sonuc?: T)
  {
    return (hata: any):Observable<T> => {

      if(JSON.stringify(hata.error['title']=="One or more validation errors occurred.")){
        this.showError('Girilen Bilgileri Gözden Geçiriniz.');
      }else if(JSON.stringify(hata.error['message']=='SUE001')){
        this.showError('Ürün Bulunamadı.');
      }else if(JSON.stringify(hata.error['message']='undefined')){
        this.showError('Beklenmedik Servis Hatası.');
      }
      //todo: hatayı depolayacak uzak bir servise gönder
      console.error(`Beklenmedik servis hatası: ${JSON.stringify(hata)}`);

      //todo: kullanıcıya gösterebilmek  için hatayı uygun formata çevir
      //this.log(`${operasyon} metodunda hata: ${JSON.stringify(hata)}`);

      //Uygulamanın çalışmayı kesmeden devam edebilmesi için boş bir değer dönüyoruz.
      return of(sonuc as T);

    }
  }
}
