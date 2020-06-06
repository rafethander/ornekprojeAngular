import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Kullanici } from '../Models/Kullanici';
import { Observable, of } from 'rxjs';
import { GetResult } from '../Models/GetResult';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url="https://firinwebapi20200606003136.azurewebsites.net/api/Kullanici/";
  httpOptions={headers:new HttpHeaders({'Content-Type':'application/json'})}
  




  constructor(private http: HttpClient,private messageService: MessageService) { }





  KullaniciAuthenticate(kullanici: Kullanici): Observable<GetResult>{
    return this.http.post<Kullanici>(`${this.url}Authenticate`,kullanici,this.httpOptions).pipe(catchError(this.hataYakala<any>('Authenticate')));
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
      
      this.showError("Beklenmedik Servis Hatası");
      

      
      
      //todo: hatayı depolayacak uzak bir servise gönder
      //console.error(`Beklenmedik servis hatası: ${JSON.stringify(hata)}`);
      

      //todo: kullanıcıya gösterebilmek  için hatayı uygun formata çevir
      //this.log(`${operasyon} metodunda hata: ${JSON.stringify(hata)}`);

      //Uygulamanın çalışmayı kesmeden devam edebilmesi için boş bir değer dönüyoruz.
      return of(sonuc as T);

    }
  }
}
