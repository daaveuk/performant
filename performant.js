var Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    // Set the State of the Application. The Application can either be in "Running" mode or not. Running Mode Disables the edit functionality and proceeds to countdown through tasks.
    Meteor.startup(function () {
        Session.set('isRunning', false);
    });
    
    // This code controls the overlay. A data attribute is can be applied to any button with the "showOverlay" class to display any one of the forms used.
    // There is also another event for closing the form. Meteor reacts to the session change automatically, so simply removing the value removes the form.
    
    Template.body.events({  
        'click .showOverlay': function(event, template) {
            console.log();
            var form = template.$(event.target).data('form-template');
            Session.set('activeForm', form);
        },
        'click .closeOverlay':function() {
            console.log();
            Session.set('activeForm', '');
        }
    });

    Template.header.helpers({
        appRunning: function() {
            var running = Session.get('isRunning');
            return running;
        }
    });
    
    // This final bit of code grabs the session variable so it can be attributed to the correct form.
    Template.overlay.helpers({  
      activeForm: function() {
        return Session.get('activeForm');
      }
    });
    
    // This code gets all the tasks from the database so they can be looped through on the front end of the code. 
    // I also added a class to display the task ID as a data attribute for debugging perposes
    Template.tasks.helpers({
        'task': function(){
            return Tasks.find();
        },
        appRunning: function() {
            var running = Session.get('isRunning');
            return running;
        },
        'taskID': function() {
            return this._id;
        },
        'taskPercentage': function() {
            var time =  Session.get("originalTime");
            var remaining = Session.get("timeRemaining");
            var percentage = (remaining / time) * 100;
            return percentage + "%";
       },
        'percentageClass': function() {
            var time =  Session.get("originalTime");
            var remaining = Session.get("timeRemaining");
            var percentage = (remaining / time) * 100;
            var className = "";
            if (percentage > 60) {
                className = "task__countdown--success";
            } else if (percentage > 45 ) {
                className = "task__countdown--warning";
            } else {
                className = "task__countdown--danger";
            }
            return className;
        },
        'selectedTask': function() {
            var taskID = this._id;
            var selectedTask = Session.get('selectedTask');
            if (taskID == selectedTask) {
                return true;
            }
        }
    });

    // These events handle the editing and removing of each Task. I'm passing the field data on the update task to a Session so I can use it to populate values for the form. 
    Template.tasks.events({
        'click .removeTask': function() {
            Tasks.remove(this._id);
        },
        'click .startTask': function(event, template) {
            if(Session.get('isRunning') != true) {
                Session.set('isRunning', true);
                Session.set('selectedTask', this._id);
                Session.set('originalTime', this.time);
                Session.set('timeRemaining', this.time);
                Session.set('timeBeaten', false);
                var counter = Session.get('timeRemaining');
                console.log(counter);
                var timer = setInterval(function() {
                    if (Session.get('timeBeaten') == true) {
                        clearInterval(timer);
                        Session.set("isRunning", false);
                        console.log("Task Beaten");
                        Session.set('activeForm', "results");
                    } else if (counter <= 0) {
                        clearInterval(timer);
                        Session.set("isRunning", false);
                        console.log("Task Not Beaten");
                        Session.set('activeForm', "results");
                    } else {
                        counter = counter - 0.10;
                        Session.set('timeRemaining', counter);
                    }
                }, 100);
            }
        },
        'click .updateTask': function(event, template) {
            var form = template.$(event.target).data('form-template');
            Session.set('selectedTask', this._id);
            Session.set('activeForm', form);
        },
        'click .finishTask': function(event) {
            Session.set("timeBeaten", true);
        }
    });
    
    // This listens to the 
    Template.newTask.events({
        'submit form': function (event) {
            event.preventDefault();
            var taskName = event.target.taskName.value;
            var taskTime = event.target.taskTime.value;
            if (taskName) {
                Tasks.insert({
                    name: taskName,
                    time: taskTime
                });
                Session.set('activeForm', '');
            } else {
                console.log("Task name must not be empty");
            }
        }
    });
    
    Template.updateTask.events({
        'submit form': function (event) {
            event.preventDefault();
            var selectedTask = Session.get('selectedTask');
            var taskName = event.target.updateTaskName.value;
            var taskTime = event.target.updateTaskTime.value;
            if (taskName) {
                Tasks.update(selectedTask, {
                    name: taskName,
                    time: taskTime
                });
                Session.set('activeForm', '');
            } else {
                console.log('Task name must not be empty');
            }
        }
    });
    
    Template.results.events({
        "submit form": function (event) {
            event.preventDefault();
            var selectedTask = session.get('selectedTask');
            var timeRemaining = session.get('remainingTime');
            Tasks.update(selectedTask, {$set: {time: timeRemaining} });
            Session.set('activeForm', '');
        }
    });
    
    Template.results.helper({
        "winState": function () {
            var win = Session.get("timeBeaten");
            if(win === true) {
                return true;
            }
        },
        "percentage": function () {
            return "Hi!";
        }
    });
}