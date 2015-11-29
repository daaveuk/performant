if (Meteor.isClient) {   
    // This code gets all the tasks from the database so they can be looped through on the front end of the code. 
    // I also added a class to display the task ID as a data attribute for debugging perposes
    Template.tasks.helpers({
        'task': function(){
            return Tasks.find();
        },
        'taskID': function() {
            return this._id;
        }
    });

    // These events handle the editing and removing of each Task. I'm passing the field data on the update task to a Session so I can use it to populate values for the form. 
    Template.tasks.events({
        'click .removeTask': function() {
            Tasks.remove(this._id);
        },
        'click .updateTask': function(event, template) {
            var form = template.$(event.target).data('form-template');
            Session.set('selectedTask', this._id);
            Session.set('activeForm', form);
        }
    });
}