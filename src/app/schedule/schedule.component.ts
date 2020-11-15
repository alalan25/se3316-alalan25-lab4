import { Component, OnInit } from '@angular/core';
import { TimeTableService } from 'src/app/time-table.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  scheduleName = '';
  public errorMessage;
  letters = /^[A-Za-z]+$/;
  

  constructor(private timeTableService: TimeTableService) { }

  ngOnInit(): void {
  }

  createSchedule(){
    if(this.scheduleName.match(this.letters)){
console.log("valid input");
this.timeTableService.createScheduleName(this.scheduleName).subscribe(response=>{
console.log(response);
  },error => {
    this.errorMessage=error.error
    alert(this.errorMessage);
  });
    }
    else{
      alert("Invalid input! Please input alphabets only!");
    }
   
  }

 

}
