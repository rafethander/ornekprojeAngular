import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SatilanUrun } from '../Models/SatilanUrun';
import { GetResult } from '../Models/GetResult';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SatilanUrunService {

  private satilanUrunUrl='https://firinwebapi20200606003136.azurewebsites.net/api/SatilanUrun/';

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
  }

  constructor(private http: HttpClient ,private messageService: MessageService) {}


  SatilanUrunGet(): Observable<SatilanUrun[]>{
    const httpAuthOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
    }

    return this.http.get<SatilanUrun[]>(`${this.satilanUrunUrl+'Get'}`,httpAuthOptions);
  }

  SatilanUrunAdd(satilanUrun: SatilanUrun): Observable<GetResult>{
    return this.http.post<SatilanUrun>(`${this.satilanUrunUrl+'Add'}`,satilanUrun,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('SatilanUrunEkle'))
    );
  }


  SatilanUrunUpdate(satilanUrun: SatilanUrun): Observable<GetResult>{
    return this.http.put<SatilanUrun>(`${this.satilanUrunUrl}Update`,satilanUrun,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('SatilanUrunUpdate'))
      )
  }

  SatilanUrunDelete(satilanUrunId: string): Observable<GetResult>{
    return this.http.delete<string>(`${this.satilanUrunUrl}Delete/${satilanUrunId}`,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('SatilanUrunDelete'))
    )
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
      console.error(`Beklenmedik servis hatası: ${JSON.stringify(hata.error['title'])}`);

      //todo: kullanıcıya gösterebilmek  için hatayı uygun formata çevir
      //this.log(`${operasyon} metodunda hata: ${JSON.stringify(hata)}`);

      //Uygulamanın çalışmayı kesmeden devam edebilmesi için boş bir değer dönüyoruz.
      return of(sonuc as T);

    }
  }
}
