import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';



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
     try{
       return this.http.get(`${this.ROOT_URL}/${uri}`); 
    }
    catch(error){
      this.errorHandler(error);
    }
     
   }

   post(uri: string, payload: Object){
     return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
   }

   delete(uri: string){
     return this.http.delete(`${this.ROOT_URL}/${uri}`);
   }

   put(uri: string, body: Object){
     return this.http.put(`${this.ROOT_URL}/${uri}`, body);
   }
   errorHandler(error: HttpErrorResponse){
  return Observable.throw(error.message || "Server Error");
  }

}
