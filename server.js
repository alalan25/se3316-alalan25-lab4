const express = require ('express'); // require module express which resturns a fucntion 
const fs = require('fs'); // using fs module to read JSON file
const Joi = require('joi'); // returns a class
const { response } = require('express');
const app = express(); // we store result after calling the fucntion app
const xss = require('xss');


app.use(express.json());
//app.use(xss());// sanitize the body whenever you call post or put 
// express.json acts as a middleware and we trying to use this middleware in the request pipeline 

let data = fs.readFileSync('data.json'); // reading the json file and storing contents in the variable
let timetable_data = JSON.parse(data); // parsing converts json into javascript object
let schedule = [];


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // avoiding CORS error by giving access control to origin 
    res.header('Access-Control-Allow-Headers',"*"); // avoiding CORS error for headers 
    res.header('Access-Control-Allow-methods',"*");
    
    next();
  });
  app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Headers',"*"); // avoiding CORS error by giving access control to origin 
    req.header('Access-Control-Allow-methods',"*");
    next();
  });

app.get('/', (req,res)=>{
    // entering code block
    res.send('Hello World!'); // as a response send this 'something'
});
// this is how you create a route. (req,res) are also referred to as route handlers


// gets all available subject codes
app.get('/api/timetable/subjectcodes', (req,res)=>{
 const subject = timetable_data.map(s=> s.subject); //creates a new array with just subject codes
 res.send(subject);
});
app.get('/api/timetable/description', (req,res)=>{
    const description = timetable_data.map(s=> s.catalog_description); //creates a new array with just subject codes
    res.send(description);
   });
/*app.get('/api/timetable/:subject/:catalog_nbr', (req, res) => {
res.send(req.params);
});*/
// query string parameters are used for anything optional 


//getting course code based on subject code
app.get('/api/timetable/:subjectcode', (req, res) => { //takes subjectcode as a parameter
    const subjectCode = timetable_data.filter(s=> s.subject === req.params.subjectcode.toUpperCase()); // filters the array of objects based on the input subject code
    const subjectNumber = subjectCode.map(n=>n.catalog_nbr); // on the filtered array, we use map function to create a new array of just course codes
    
    if(subjectCode.length==0){ // if subject code does not exist then return error
        return res.status(404).send('The subject code does not exist. Please try again!');
    }
    res.send(subjectNumber);
    });


//getting timetable entry based on course code, subject code and optional course component
app.get('/api/timetable/search/:subjectCode/:courseCode/:courseComponent', (req, res) => { //takes 3 parameters
    const afterSubjectCode = timetable_data.filter(s=> s.subject === req.params.subjectCode.toUpperCase()); // filters the array of objects based on the input subject code
    const afterCourseCode = afterSubjectCode.filter(s=> s.catalog_nbr.toString() === req.params.courseCode.toUpperCase()); //filters the filtered array based on the course code
    const afterCourseComponent = afterCourseCode.filter(s=> s.course_info[0].ssr_component === req.params.courseComponent.toUpperCase()); // filters the filtered array based on the component
    
    if(afterSubjectCode.length == 0 || afterCourseCode.length == 0 ){ // if subject code or course code does not exist then return error
    return res.status(404).send('Error Occured! Double check your inputs and please try again!');
    }
    res.send(afterCourseComponent);

});
// getting entry based on just subject code and course code
app.get('/api/timetable/search/subject/coursecode/:subjectCode/:courseCode', (req, res) => { //takes 3 parameters
    const afterSubjectCode = timetable_data.filter(s=> s.subject === req.params.subjectCode.toUpperCase()); // filters the array of objects based on the input subject code
    const afterCourseCode = afterSubjectCode.filter(s=> s.catalog_nbr.toString() === req.params.courseCode.toUpperCase()); //filters the filtered array based on the course code
    
    if(afterSubjectCode.length == 0 || afterCourseCode.length == 0 ){ // if subject code or course code does not exist then return error
    return res.status(404).send('Error Occured! Double check your inputs and please try again!');
    }
    res.send(afterCourseCode);

});
// returns only the object instead of array of objects 
app.get('/api/timetable/onlyObject/subject/coursecode/:subjectCode/:courseCode', (req, res) => { //takes 3 parameters
    const afterSubjectCode = timetable_data.filter(s=> s.subject === req.params.subjectCode.toUpperCase()); // filters the array of objects based on the input subject code
    const afterCourseCode = afterSubjectCode.filter(s=> s.catalog_nbr.toString() === req.params.courseCode.toUpperCase()); //filters the filtered array based on the course code
    
    if(afterSubjectCode.length == 0 || afterCourseCode.length == 0 ){ // if subject code or course code does not exist then return error
    return res.status(404).send('Error Occured! Double check your inputs and please try again!');
    }
    res.send(afterCourseCode[0]);

});

// if user only inputs Subject Code
app.get('/api/timetable/subject/:subjectCode', (req, res) => { //takes subjectcode as a parameter
    const afterSubjectCode = timetable_data.filter(s=> s.subject === req.params.subjectCode.toUpperCase()); // filters the array of objects based on the input subject code
    if(afterSubjectCode.length == 0 ){ // if subject code does not exist then return error
    return res.status(404).send('Error Occured! Double check your inputs and please try again!');
    }
    res.send(afterSubjectCode);

});

// if user only inputs course code
app.get('/api/timetable/coursecode/:courseCode', (req, res) => { //takes coursecode as a parameter
    const afterCourseCode = timetable_data.filter(s=> s.catalog_nbr.toString() === req.params.courseCode.toUpperCase()); // filters the array of objects based on the input subject code
    if(afterCourseCode.length == 0 ){ // if subject code does not exist then return error
    return res.status(404).send('Error Occured! Double check your inputs and please try again!');
    }
    res.send(afterCourseCode);// send back to client

});

// if user only inputs component
app.get('/api/timetable/component/:courseComponent', (req, res) => { //takes subjectcode as a parameter
    const afterCourseComponent = timetable_data.filter(s=> s.course_info[0].ssr_component === req.params.courseComponent.toUpperCase());
    
    if(afterCourseComponent.length == 0 ){ // if subject code does not exist then return error
    return res.status(404).send('Error Occured! No such result found! Double check your inputs and please try again!');
    }
    res.send(afterCourseComponent);

});



//POST for schedule
app.post('/api/timetable/schedule', (req, res)=>{ // user provides the name of schedule 

// validation 
// always validate the input, never trust what the client inputs
const { error } = validateSchedule(req.body); // object destructuring
    //validation 
    if(error){
      return res.status(400).send(error.details[0].message); // list errors
        
    }


const mySchedule = 
{
"schedule_name": req.body.schedule_name,
"items":[]
}


if(schedule.find(s=> s.schedule_name === req.body.schedule_name)){ // if schedule name exists then return error
    return res.status(404).send('The schdeule name has already been taken! Please try another name');
        }

    schedule.push(mySchedule); // pushing this course into the schedule array
    res.send(mySchedule); // sending the info to client 
    // by convention the anything that you want to create is added to the response of the body 
    
});


// adding course to schedule
app.put('/api/timetable/schedule/:scheduleName', (req, res) => { //taking schedule name as params

     console.log(req.body);
    // finding the schedule name
    const name = schedule.find(s=> s.schedule_name === req.body.schedule_name); // finds the element based on the schedule name added by user 
    // if schedule name does not exist then error
    if(!name){ // if subject code does not exist then return error
       return res.status(404).send('No schedule with that schedule name was found! Please double check your input!');
    }
    const { error } = validateSchedule(req.body); // object destructuring
    //validation 
    if(error){
       return res.status(400).send(error.details[0].message); // list errors
        
    }
   
    //Update schedule
    const index = schedule.indexOf(name); // gets the index of the schdeule that we want to update
    //schedule[index].items = req.body.items; // replaces the list attribute with the new values inputted by user via request body 
    schedule[index].items.push(req.body.items); 
    // return the updated schedule
    res.send(schedule[index].items); 

    });

// gets a list of subject code and course code pairs
app.get('/api/timetable/schedule/:scheduleName', (req, res) => { 
// finding the schedule name
const name = schedule.find(s=> s.schedule_name === req.params.scheduleName); // finds the element based on the schedule name added by user 
// if schedule name does not exist then error
if(!name){ // if subject code does not exist then return error
    return res.status(404).send('No schedule with that schedule name was found! Please double check your input!');
}

const index = schedule.indexOf(name); 
res.send(schedule[index].items); // returns the subject, course pair for a given schedule

});

// Delete a schedule with a given name
app.delete('/api/timetable/schedule/:scheduleName', (req, res) => { 
    // finding the schedule name
    const name = schedule.find(s=> s.schedule_name === req.params.scheduleName); // finds the element based on the schedule name added by user 
    // if schedule name does not exist then error
    if(!name){ // if subject code does not exist then return error
       return res.status(404).send('No schedule with that schedule name was found! Please double check your input!');
    }
    
    // Delete 
    const index = schedule.indexOf(name); 
    // splice method can be used to remove a sechedule from schedule array
    schedule.splice(index,1); // go to this index inside the array and remove one object 

    // return the deleted schedule 
    res.send(name);
    
    });


// gets a list of schedule 
app.get('/api/schedule', (req, res) => { 

res.send(schedule); // returns schedule
 });



 // gets list of schedule names and number of courses per schedule from schedule
 app.get('/api/schedule/schedulenames', (req, res) => { 
    let reqData = [];
    
    for (i=0; i<schedule.length;i++){
        let test = {
            "scheduleName": schedule[i].schedule_name,
            "numberOfCourses": schedule[i].items.length
        };
        reqData.push(test);
    }
    res.send(reqData); // returns schedule
    
 });


// delete all schedules
 app.delete('/api/timetable/schedule', (req, res) => { 
    
schedule = []; // make the schdeule array empty 
// return deleted schedules 
res.send(schedule); 

});



// PORT
//Enviornment variable is part of an enviornment in which process runs. Its value is set outside this application
const port = process.env.PORT || 3000;// if no enviornment variable found then, for now it is set to 5000
app.listen(port, ()=> console.log(`Listening on port ${port}!`));
// when listening on the port number specified, perform the function after the comma
// when deploying the port is dynmically assigned. So we cant define a port hardcoded like this


function validateSchedule (obj){
    const schema = {
        "schedule_name": Joi.string().required(), // the property 'schedule_name' should be string and is required
        "items": Joi.optional() // the property items must be an array and is optional
    };
    return Joi.validate(obj, schema); // validate the request body with schema 
    
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






    