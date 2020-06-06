
export interface Irsaliye{

    irsaliyeId: string;
    irsaliyeNo: number;
    olusturuldu: Date;
    silindi: boolean;
    tarih: Date;
    tarihString: string;
    faturaNo: number;
    
    musteriId: string;
    musteriAdi: string;


    birim: string;
    urunAdi: string;
    
    

    satilanUrunId: any[];
    satilanUrun: any[];
    miktar: any[];
    kdvTutar: any[];
    tutar: any[];
}

