import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {

  constructor(private request: HttpRequestService) { }

getSubjectCodes(){
//We want to send a web request to create a schedule name 
// returns an observable 
return this.request.get('api/timetable/subjectcodes');
}

}
