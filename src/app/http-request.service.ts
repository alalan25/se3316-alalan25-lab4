import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  readonly ROOT_URL; // defining attribute of a class 

// Constructor is a block of code that initializes the newly created object
  constructor(private http: HttpClient) {   
    this.ROOT_URL = 'http://localhost:3000';
   }

   // will return observable of this type
   get(uri: string){
     // route structure 
     return this.http.get(`${this.ROOT_URL}/${uri}`); 
   }

   post(uri: string, payload: Object){
     return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
   }


}
