import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Odeme } from '../Models/Odeme';
import { catchError } from 'rxjs/operators';
import { GetResult } from '../Models/GetResult';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class OdemeService {


  private OdemeUrl='http://localhost:65455/api/Odeme/';

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient,private messageService: MessageService) { }


  OdemelerGet(): Observable<Odeme[]>{
    return this.http.get<Odeme[]>(`${this.OdemeUrl+'Get'}`);
  }



  OdemeAdd(odeme: Odeme): Observable<GetResult>{
    
    return this.http.post<Odeme>(`${this.OdemeUrl+'Add'}`,odeme,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('Odeme Ekle'))
    )
  }

  OdemeGuncelle(odeme: Odeme): Observable<GetResult>{

    return this.http.put<Odeme>(`${this.OdemeUrl+'Update'}`,odeme,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('OdemeGuncelle'))
    )
  }

  OdemeSil(id: string): Observable<GetResult>{
    return this.http.delete<string>(`${this.OdemeUrl}Delete/${id}`,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('OdemeSil'))
    )
  }

  OdemeOdendi(id: string): Observable<GetResult>{
    return this.http.put<string>(`${this.OdemeUrl}Odendi/${id}`,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('OdemeOdendi'))
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
      }
      else if(JSON.stringify(hata.error['message']=='ODE001')){
        this.showError('Ödeme Sistemde Bulunamadı.');
      }else if(JSON.stringify(hata.error['message']=='undefined')){
        this.showError('Beklenmedik Servis Hatası');
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
