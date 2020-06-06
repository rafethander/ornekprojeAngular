import{ Durum } from 'src/app/Models/Enums/DurumEnum';
export interface Fatura{

    faturaId: string;
    olusturuldu: Date;
    silindi: boolean;
    durum: Durum;
    faturaNo: number;
    tarih: Date;
    toplamTutar: number;
}