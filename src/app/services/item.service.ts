import { Injectable } from '@angular/core';
import { Item } from '../classes/item'
import { environment } from '../../environments/environment';

// Before: version 8
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { RouterStateSnapshot } from '@angular/router';

// After: version 9 compat
// v9 compat packages are API compatible with v8 code
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/database';

// import {initializeApp} from "firebase/app"
// import {getDatabase, ref} from "firebase/database"

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  public items : Item[] = [];
  private fireData : any;
  static petlist = "/petlist/";
  public itemList : any;

  constructor() {
     //firebase.initializeApp(environment.firebase);
     console.log("environment.firebase.databaseURL : " + environment.firebase.databaseURL);
     // 데이터베이스 변수
     // const appSettings = {
     //   databaseURL : environment.firebase.databaseURL,
     // }
    firebase.initializeApp(environment.firebase)
    this.fireData = firebase.database();
    //  database.once("value").then(function(snapshot) {
    //    var value = snapshot.child("0").val(); // {first:"Ada",last:"Lovelace"}
    //    console.log(value);
    //  });

    // const tipRef = ref(firebaseDb, "/account/");
    // onValue(tipRef, (snapshot) => { 
    //                       const val = snapshot.val();     
    //                       console.log("Val", val);                                                                                        
    //                       console.log("loaded");          
    // });

    //const app = initializeApp(environment.firebase);
    //this.fireData = getDatabase(app);
  }

  getItems(){ 
    // if (localStorage.getItem('items')) {
    //   this.items = JSON.parse(localStorage.getItem('items')!);
    // }
    return new Promise((resolve) => {
      this.items.length = 0;
      let item : any;

      this.itemList = this.fireData.ref(ItemService.petlist);
      this.itemList.on('value', (snapshot:any) => {
        snapshot.forEach( (snap:any) => {
         // item = snap.val();  
          item = {
            key: snap.key,
            id: snap.val().id,
            name: snap.val().name,
            available: snap.val().available
          };

          this.items.push(item);
        });
        resolve(true);
      });

    });
  }

  saveItems(){
    //this.storage.store('items', this.items);
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  updateItem(item : Item){
    return this.fireData.ref(ItemService.petlist).child(item.key).update(item);
  }

  getItem(id: string){
    return this.items.find(item => item.id == id);
  }

  addItem(item: Item){
    this.items.push(item);
    //this.saveItems();
    //Use Firebase
    //console.log('Petlist and item ', ItemService.petlist, item);
    return this.fireData.ref(ItemService.petlist).push(item);

  }

  deleteItem(item: Item){

    return this.fireData.ref(ItemService.petlist).child(item.key).remove();
    this.items.splice(this.items.indexOf(item), 1);
    //this.saveItems();
  }
}
