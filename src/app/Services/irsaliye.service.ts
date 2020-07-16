import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GetResult } from '../Models/GetResult';
import { MessageService } from 'primeng/api';
import { Irsaliye } from '../Models/Irsaliye';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class IrsaliyeService {

  constructor(private http: HttpClient,private messageService: MessageService) { }

  private irsaliyeUrl="http://localhost:65455/api/Irsaliye/";

  private httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json' , 'Authorization': localStorage.getItem('token')})
  }

  IrsaliyeAdd(irsaliye: Irsaliye): Observable<GetResult>{
    return this.http.post<Irsaliye>(`${this.irsaliyeUrl}Add`,irsaliye,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('İrsaliyeEkle'))
    );
  }

  IrsaliyeUpdate(irsaliye: Irsaliye): Observable<GetResult>{
    return this.http.post<Irsaliye>(`${this.irsaliyeUrl}Update`,irsaliye,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('IrsaliyeUpdate'))
    );
  }

  IrsaliyeGet(irsaliye: Irsaliye): Observable<Irsaliye[]>{
    return this.http.post<Irsaliye>(`${this.irsaliyeUrl}Get`,irsaliye,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('İrsaliyeListe'))
    );
  }

  IrsaliyeGetWithIrsaliyeNo(irsaliyeNo: number): Observable<any[]>{
    return this.http.post<number>(`${this.irsaliyeUrl}GetWithIrsaliyeNo/${irsaliyeNo}`,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('IrsaliyeGetWithIrsaliyeNo'))
    );
  }

  IrsaliyeDelete(irsaliyeNo: number): Observable<GetResult>{
    return this.http.delete<number>(`${this.irsaliyeUrl}Delete/${irsaliyeNo}`,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('IrsaliyeDelete'))
    );
  }

  IrsaliyeGetForFaturaAdd(irsaliye: Irsaliye): Observable<Irsaliye[]>{
    return this.http.post<Irsaliye>(`${this.irsaliyeUrl}GetWithMusteriAdiAndIrsaliyeNo`,irsaliye,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('GetWithMusteriAdiAndIrsaliyeNo'))
    );
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
      if(JSON.stringify(hata.error["message"]=='INW001')){
        this.showError('İrsaliye Numarası Sistemde Kayıtlı.');
      }else if(JSON.stringify(hata.error["message"]=='undefined')){
        this.showError("Beklenmedik Servis Hatası");
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
