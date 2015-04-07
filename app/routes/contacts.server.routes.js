'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var contacts = require('../../app/controllers/contacts.server.controller');
    var employees = require('../../app/controllers/employees.server.controller');

    var requireEmployee = employees.permissionLevel(users.EMPLOYEE);

    // Contacts Routes
    app.route('/contacts')
        .get(contacts.list)
        .post(requireEmployee, contacts.create);

    app.route('/contacts/:contactId')
        .get(contacts.read)
        .put(requireEmployee, contacts.update)
        .delete(requireEmployee, contacts.delete);

    app.route('/contacts/:contactId/adoptions')
        .get(contacts.findAdoptedCats);

    app.route('/contacts/:contactId/vets')
        .get(contacts.findCatsWithVets);

    app.route('/contacts/:contactId/donations')
        .get(contacts.findDonations);

    app.route('/contacts/:contactId')
    app.route('/adopters')
        .get(contacts.getAllAdopters);

    app.route('/contacts/:contactId/notes')
        .put(requireEmployee, contacts.addNote);
    app.route('/contacts/:contactId/notes/:noteId')
        .delete(requireEmployee, contacts.deleteNote);

    // Finish by binding the Contact middleware
    app.param('contactId', contacts.contactByID);
};
