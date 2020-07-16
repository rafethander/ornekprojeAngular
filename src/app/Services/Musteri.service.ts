import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Musteri } from '../Models/Musteri';
import{catchError,tap} from 'rxjs/operators';
import { GetResult } from '../Models/GetResult';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MusteriService {

  private MusteriUrl='http://localhost:65455/api/Musteri/';

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
  }
  
constructor(private http: HttpClient,private messageService: MessageService) { }




  MusteriGet(): Observable<Musteri[]>{

    const httpAuthOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
    }

    return this.http.get<Musteri[]>(`${this.MusteriUrl+'Get'}`,httpAuthOptions);
  }
  

  MusteriAdd(musteri: Musteri): Observable<GetResult>{

    return this.http
    .post<Musteri>(`${this.MusteriUrl+'Add'}`,musteri,this.httpOptions)
    .pipe(
      //tap(log atarsın ornek)
      catchError(this.hataYakala<any>('MusteriEkle'))
    );
  }

  MusteriGuncelle(musteri: Musteri): Observable<GetResult>{
    return this.http
    .put<Musteri>(`${this.MusteriUrl+'Update'}`,musteri,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('MusteriGuncelle')
        ));
  }

  MusteriSil(musteriId: string): Observable<GetResult>{
    return this.http
    .delete<string>(`${this.MusteriUrl+'Delete/'+`${musteriId}`}`,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('MusteriSil'))
    );
  }

  MusteriListesi(): Observable<Musteri[]>{
    return this.http.get<Musteri[]>(`${this.MusteriUrl}SelectGet`,this.httpOptions);
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
      if(JSON.stringify(hata.error["message"]=='undefined')){
        this.showError("Beklenmedik Servis Hatası");
      }else if(JSON.stringify(hata.error["message"]=='MUW001')){
        this.showError('Müşteri Sistemde Kayıtlı.');
      }else if(JSON.stringify(hata.error["message"]=='MUE001')){
        this.showError('Müşteri Bulunamadı.');
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
