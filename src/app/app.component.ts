import { Component } from '@angular/core';
import { TimeTableService } from 'src/app/time-table.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private timeTableService: TimeTableService){}

  //function that subscribes to the time table service and gets use the response after making the http request 
 

  
}
