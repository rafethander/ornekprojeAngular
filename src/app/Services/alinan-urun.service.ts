import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AlinanUrun } from '../Models/AlinanUrun';
import { catchError } from 'rxjs/operators';
import { GetResult } from '../Models/GetResult';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlinanUrunService {

  private AlinanUrunUrl='http://localhost:65455/api/AlinanUrun/';

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
  }
  

  constructor(private http: HttpClient,private messageService: MessageService) { }


  AlinanUrunGet(): Observable<AlinanUrun[]> {
    return this.http.get<AlinanUrun[]>(`${this.AlinanUrunUrl+'Get'}`,this.httpOptions);
  }

  AlinanUrunAdd(alinanUrun: AlinanUrun): Observable<GetResult>{
    return this.http.post<AlinanUrun>(`${this.AlinanUrunUrl+'Add'}`,alinanUrun,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('AlinanUrunEkle'))
    );
  }

  AlinanUrunUpdate(alinanUrun: AlinanUrun): Observable<GetResult>{
    return this.http.put<AlinanUrun>(`${this.AlinanUrunUrl+'Update'}`,alinanUrun,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('AlinanUrunGuncelle'))
    );
  }

  AlinanUrunDelete(alinanUrunId: string): Observable<GetResult>{
    return this.http.delete<string>(`${this.AlinanUrunUrl}Delete/${alinanUrunId}`,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('AlinanUrunDelete'))
      );
  }




  showSuccess(messageDetail: string) {
    this.messageService.add({severity:'success', summary: 'Başarılı ', detail:`${messageDetail}`});
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
      else if(JSON.stringify(hata.error['message']='AUE001')) {
        this.showError('Alınan Ürün Bulunamadı.')
      }else if(JSON.stringify(hata.error['message']=='undefined')){
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
