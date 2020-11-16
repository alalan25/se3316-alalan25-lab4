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
  timetableArray = [];
  letters = /^[A-Za-z]+$/;
  letterNumber = /^[0-9a-zA-Z]+$/;



  public errorMessage;

  result: any;

  constructor(private timeTableService: TimeTableService) { }

  ngOnInit(): void {}

 searchResults(){


     //function that subscribes to the time table service and gets use the response after making the http request 
     //Error handlers added
     //user input could either be alphabet, numbers(for courses) or an empty string
     if((this.subject.match(this.letters)|| this.subject == "") && (this.course.match(this.letterNumber)|| this.course == "") && (this.component.match(this.letters)|| this.component == "")){
    console.log("valid inputs");

     //only subject
     if(this.course === "" && this.component === ""){
      alert("Error! An input value for the course is required!");

    } 
    //only course code
    else if(this.subject === "" && this.component === ""){
      alert("Error! An input value for the subject is required!");
    }
    // only component 
    else if(this.subject === "" && this.course === ""){
      alert(" Error! An input value for the subject and course is required!");
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
     else{
      alert("Invalid input! Please input alphabets only! Numbers are only acceptable for course entry!");
     }
    
 
  }


  addToSchedule(indexPar){
    
    this.indexCourse = indexPar; 
    
    this.timeTableService.getSchedules().subscribe(response=>{
      this.schedule = response;
      if(this.schedule.length == 0){
        // if user tries to add a course to a schedule without creating a schedule 
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
    this.displayTimetable(this.courseInSchedule);
    console.log(this.courseInSchedule);
  }, error=>{
    this.errorMessage=error.error;
    alert(this.errorMessage);

  });
  

   }
// creates a new array of object by getting the timetable entry for each subject_course pair
   displayTimetable(courseList){
     for(let x=0; x<courseList.length; x++){
       this.subject = courseList[x].subjectCode;
       this.course = courseList[x].courseCode;

       this.timetableArray = [];
      this.timeTableService.getResultOnlyObject(this.subject, this.course).subscribe(response=>{
        // adding objects to the timetableArray and dyanmically displaying it 
       this.timetableArray.push(response);
      }, error=>{
        this.errorMessage=error.error;
        alert(this.errorMessage);
      });

     }

   }

     // function to delete schedule 
     deleteSchedule(input){
       // index at which we want to delete 
      this.indexSchedule = input; 
      this.scheduleName = this.schedule[this.indexSchedule].schedule_name;
      // calling the service that calls the delete request and returns an observable 
      this.timeTableService.deleteScheduleWithAGivenName(this.scheduleName).subscribe(response=>{
      this.schedule = response;

      },error=>{
        this.errorMessage=error.error;
        alert(this.errorMessage);

      });

       }

       



}
