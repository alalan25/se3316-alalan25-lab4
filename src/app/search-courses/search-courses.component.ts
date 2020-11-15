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
  schedule;
  indexCourse;
  indexSchedule;
  scheduleName;
  courseInSchedule;


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
      this.timeTableService.getResultOnlyComponent(this.component).subscribe(response=>{
        this.result=response;
      }, error=> {
        this.errorMessage=error.error
        alert(this.errorMessage);
       });
    }
    // subject+course code
    else if(this.component===""){
      this.timeTableService.getResultOnlySubjectAndCourse(this.subject,this.course).subscribe(response=>this.result=response, error=> {
        this.errorMessage=error.error;
        alert(this.errorMessage);
       });
    }
    // all the three inputs inputted by user
    else {
    this.timeTableService.getResult(this.subject,this.course,this.component).subscribe(response=>this.result=response, error=> {
      this.errorMessage=error.error;
      alert(this.errorMessage);
     });
    }
 
  }


  addToSchedule(indexPar){
    // if user tries to add a course to a schedule without creating a schedule 
    this.indexCourse = indexPar; 
    
    this.timeTableService.getSchedules().subscribe(response=>{
      this.schedule = response;
      if(this.schedule.length == 0){
        alert("No schedule has been created! Please create a schedule first to add courses!");
      }else{
        alert("Please select a schedule from the list in which you would like to add this course or create a new schedule");
      }
      
      },error => {
        this.errorMessage=error.error;
        alert(this.errorMessage);
      });

   }
   // function to add course to a schedule 
   addClass(input){
  // defining all the variables in order to pass them as a parameter 
   this.indexSchedule = input;
   this.scheduleName = this.schedule[this.indexSchedule].schedule_name;
   this.subject = this.result[this.indexCourse].subject;
   this.course = this.result[this.indexCourse].catalog_nbr;
  

  this.timeTableService.addCourseToSchedule(this.scheduleName, this.subject, this.course).subscribe(response=>{
    this.courseInSchedule = response;
    //this.displayTimetable(this.courseInSchedule);
    console.log(this.courseInSchedule);
  }, error=>{
    this.errorMessage=error.error;
    alert(this.errorMessage);

  });
  

   }
// creates a new array of object by getting the timetable entry for each subject_course pair
  



}
