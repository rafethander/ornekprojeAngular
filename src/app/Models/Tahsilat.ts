import { OdemeTuru } from './Enums/OdemeTuruEnum';

export interface Tahsilat{
    tahsilatId: string,
    tahsilatTarihi: Date,
    tahsilatTarihiString: string,
    tahsilatTutar: number,
    tahsilatTuru: OdemeTuru,
    tahsilatTuruString: string,
   


    //Musteri
    musteriId: string,
    musteriAdi: string,
}