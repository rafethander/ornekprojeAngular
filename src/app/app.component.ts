import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent  implements OnDestroy{
  
  showMenu: any;
  
  mobileQuery: MediaQueryList;

  

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public rota: ActivatedRoute,router: Router) {
    router.events.forEach((event)=>{
      if(event instanceof NavigationStart){
        this.showMenu=event.url != "/";
      }
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.dataSource.data = TREE_DATA;
    
  }

  
  
  

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    
  }

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  
}

interface FoodNode {
  name: string;
  pathname?: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Ürünler',
    children: [
      {name: 'Alınan Ürünler', pathname:'alinanUrunler'},
      {name: 'Satılan Ürünler' , pathname:'satilanUrunler'}
      
    ]
  },
  {
    name: 'Irsaliye',
    children: [
      {name: 'Irsaliye Ekle',pathname:'irsaliyeEkle'},
      {name: 'Irsaliye Listele',pathname:'irsaliyeListele'}
      
    ]
  },
   {
    name: 'Fatura',
    children: [
      {name: 'Fatura Ekle',pathname:'faturaEkle'},
      {name: 'Fatura Listele',pathname:'faturaListele'}
     
    ]
   }
]
 




