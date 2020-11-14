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

getResult(subject: string, course: string, component: string){
  return this.request.get('api/timetable/search/'+subject+'/'+course+'/'+component);
}

getResultOnlySubject(subject: string){
  return this.request.get('api/timetable/subject/'+subject);
}

getResultOnlyCourse(course: string){
  return this.request.get('api/timetable/coursecode/'+course);
}
getResultOnlyComponent(component: string){
  return this.request.get('api/timetable/component/'+component);
}

getResultOnlySubjectAndCourse(subject: string, course: string){
  return this.request.get('api/timetable/search/subject/coursecode/'+subject+'/'+course);
}

createScheduleName(name: string){
  //calling the post request by passing the route and req body as parameters 
  return this.request.post('api/timetable/schedule',{"schedule_name": name} ); 
}



}
