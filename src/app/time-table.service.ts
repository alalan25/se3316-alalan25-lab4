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

getResultOnlySubjectAndCourse(subject: string, course: string){
  return this.request.get('api/timetable/search/subject/coursecode/'+subject+'/'+course);
}


getResultOnlyObject(subject: string, course: string){
  return this.request.get('api/timetable/onlyObject/subject/coursecode/'+subject+'/'+course);
}

createScheduleName(name: string){
  //calling the post request by passing the route and req body as parameters 
  return this.request.post('api/timetable/schedule',{"schedule_name": name} ); 
}

deleteScheduleWithAGivenName(name: string){

  return this.request.delete('api/timetable/schedule/'+name);

}

// gets an array of all the schedules
getSchedules(){
return this.request.get('api/schedule');
}


addCourseToSchedule(schName: string, sub: string, course:string){
  return this.request.put('api/timetable/schedule/'+schName, {
    "schedule_name": schName,
                
                "items":
                
                   {
                    "subjectCode": sub,
                    "courseCode": course
                   }
                   
                
});

}



}
