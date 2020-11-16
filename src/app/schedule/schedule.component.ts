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
 
  

  constructor(private timeTableService: TimeTableService) { }

  ngOnInit(): void {
  }

createSchedule(){
this.timeTableService.createScheduleName(this.scheduleName).subscribe(response=>{
console.log(response);
  },error => {
    this.errorMessage=error.error
    alert(this.errorMessage);
  });
    
}
 

}
