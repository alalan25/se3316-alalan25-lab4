import { Component, OnInit } from '@angular/core';
import { TimeTableService } from 'src/app/time-table.service';


@Component({
  selector: 'app-search-courses',
  templateUrl: './search-courses.component.html',
  styleUrls: ['./search-courses.component.css']
})
export class SearchCoursesComponent implements OnInit {

  title = 'Look for Classes!';
  subject = ''; // this will be populated by user input 
  course = '';
  component ='';
  schedule = [];

  public errorMessage;

  result: any;

  constructor(private timeTableService: TimeTableService) { }

  ngOnInit(): void {}

  searchResults(){
     //function that subscribes to the time table service and gets use the response after making the http request 
     //Error handlers added

     //only subject
    if(this.course === "" && this.component === ""){
      this.timeTableService.getResultOnlySubject(this.subject).subscribe(response=>this.result=response, error=> {
       this.errorMessage=error.error
       alert(this.errorMessage);
      });

    } 
    //only course code
    else if(this.subject === "" && this.component === ""){
      this.timeTableService.getResultOnlyCourse(this.course).subscribe(response=>this.result=response, error=> {
        this.errorMessage=error.error
        alert(this.errorMessage);
       });
    }
    // only component 
    else if(this.subject === "" && this.course === ""){
      this.timeTableService.getResultOnlyComponent(this.component).subscribe(response=>this.result=response, error=> {
        this.errorMessage=error.error
        alert(this.errorMessage);
       });
    }
    // subject+course code
    else if(this.component===""){
      this.timeTableService.getResultOnlySubjectAndCourse(this.subject,this.course).subscribe(response=>this.result=response, error=> {
        this.errorMessage=error.error
        alert(this.errorMessage);
       });
    }
    // all the three inputs inputted by user
    else {
    this.timeTableService.getResult(this.subject,this.course,this.component).subscribe(response=>this.result=response, error=> {
      this.errorMessage=error.error
      alert(this.errorMessage);
     });
    }
 
  }


  addToSchedule(){
    // if user tries to add a course to a schedule without creating a schedule 
    if(this.schedule=[]){
      alert("No schedule has been created! Please create a schedule first to add courses!");
    }
  }


}
