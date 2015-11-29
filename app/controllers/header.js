if (Meteor.isClient) {
Template.header.events({
    'click .startPerformant': function() {

        console.log("Starting Performant!");
        Session.set('isRunning', true);
    },
    'click .stopPerformant': function() {
        console.log("Stopping Perfomant!");
        Session.set('isRunning', false);
    }
});

Template.header.helpers({
    appRunning: function() {
        var running = Session.get('isRunning');
        return running;
    }
});
}