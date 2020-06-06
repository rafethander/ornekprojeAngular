import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Fatura } from '../Models/Fatura';
import { GetResult } from '../Models/GetResult';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FaturaService {

  private faturaUrl="https://firinwebapi20200606003136.azurewebsites.net/api/Fatura/";


  private httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json' , 'Authorization': localStorage.getItem('token')})
  }
  constructor(private messageService: MessageService,private http: HttpClient) { }





  FaturaAdd(fatura: Fatura): Observable<GetResult>{
    return this.http.post<Fatura>(`${this.faturaUrl}Add`,fatura,this.httpOptions)
    .pipe(
      catchError(this.hataYakala<any>('FaturaAdd'))
    );
  }

  FaturaGet(fatura: Fatura): Observable<Fatura[]>{
    return this.http.post<Fatura>(`${this.faturaUrl}Get`,fatura,this.httpOptions).pipe(catchError(this.hataYakala<any>('FaturaGet')));
  }

  FaturaDelete(faturaNo: number): Observable<GetResult>{
    return this.http.delete<number>(`${this.faturaUrl}Delete/${faturaNo}`,this.httpOptions).pipe(catchError(this.hataYakala<any>('FaturaDelete')));
  }

  FaturaUpdate(fatura: Fatura): Observable<GetResult>{
    return this.http.put<Fatura>(`${this.faturaUrl}Update`,fatura,this.httpOptions)
      .pipe(
        catchError(this.hataYakala<any>('FaturaUpdate'))
      );
  }

  FaturaGuncelleGetir(faturaNo: number): Observable<any[]>{
    return this.http.post(`${this.faturaUrl}GetWithFaturaNo/${faturaNo}`,this.httpOptions)
    .pipe(catchError(this.hataYakala<any>('FaturaGuncelleGetir')))
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
      if(JSON.stringify(hata.error["message"]=='FNW001')){
        this.showError('Fatura Numarası Sistemde Kayıtlı.');
      }else if(JSON.stringify(hata.error["message"]=='FNW002')){
        this.showError('Fatura Numarası Sistemde Bulunamadı.');
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