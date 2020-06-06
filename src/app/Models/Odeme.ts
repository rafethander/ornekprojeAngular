import { Durum } from './Enums/DurumEnum';
import { OdemeTuru } from './Enums/OdemeTuruEnum';

export interface Odeme{

    odemeId: string,
    olusturuldu: Date,
    silindi: boolean,
    durum: Durum,
    odemeTuru: OdemeTuru,
    odemeTarih: Date,
    firmaAdi: string,
    odenecekTutar: number,
    kime: string,
    odemeTuruString: string
    
}

