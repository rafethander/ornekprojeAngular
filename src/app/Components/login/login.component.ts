import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/Services/login.service';
import { Kullanici } from 'src/app/Models/Kullanici';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[MessageService]
})
export class LoginComponent implements OnInit {

  hide = true;
  
  vdKullaniciAdi=new FormControl('',Validators.required);
  vdSifre=new FormControl('',Validators.required);
  constructor(private messageService: MessageService,private loginService: LoginService,private router: Router) { }

  ngOnInit(): void {
  }


  GirisYap(kullaniciAdi: string,sifre: string): void{

   if(this.vdKullaniciAdi.invalid || this.vdSifre.invalid){
     this.showError('Zorunlu Alanlar Boş Bırakılamaz.');
     return;
   }

   this.loginService.KullaniciAuthenticate({kullaniciAdi,sifre} as unknown as Kullanici)
   .subscribe(sonuc=>{
    if(sonuc.message=='Ok'){

     
      localStorage.setItem('token',sonuc.data['token']);
      this.router.navigate(['musteri']);
    }else{
      this.showError('Bir Hata Oluştu,Tekrar Deneyiniz...');
    }
   });
    
  }






 

  
  showError(messageDetail: string) {
    this.messageService.add({severity:'error', summary: 'Uyarı', detail:`${messageDetail}`});
  }
}
