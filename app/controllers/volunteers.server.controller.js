'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Volunteer = mongoose.model('Volunteer'),
	_ = require('lodash');

/**
 * Create a Volunteer
 */
exports.create = function(req, res) {
	var volunteer = new Volunteer(req.body);
	volunteer.user = req.user;

	volunteer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteer);
		}
	});
};

/**
 * Show the current Volunteer
 */
exports.read = function(req, res) {
	res.jsonp(req.volunteer);
};

/**
 * Update a Volunteer
 */
exports.update = function(req, res) {
	var volunteer = req.volunteer ;

	volunteer = _.extend(volunteer , req.body);

	volunteer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteer);
		}
	});
};


/**
 * Delete an Volunteer
 */
exports.delete = function(req, res) {
	var volunteer = req.volunteer ;

	volunteer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteer);
		}
	});
};

exports.getVolunteerByName = function(req, res) {
    Volunteer.find({contact:req.params.contactId,timeOut: null}).exec(function(err, volunteers) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(volunteers);
        }
    });
};

/*
*Get hours worked by a volunteer
 */

 exports.minutesWorked = function(req, res) {
     var minutes = 0;
     var vols = Volunteer.find({contact:req.params.contactId});
     for (var i = 0; i < vols.length; ++i) {
         //if session is from before desired range
         if ((vols[i].timeIn - req.params.startDate < 0) || (vols[i].timeOut - req.params.endDate > 0)) {
             //this session is not in the requested range
         }
         else {
             //this volunteer session is in the range
             minutes += ((vols[i].timeOut - vols[i].timeIn)/60000)
         }
     }
     if (err) {
         return res.status(400).send({
             message: errorHandler.getErrorMessage(err)
         });
     }
     else {
         res.jsonp(minutes);
     }
 }



/**
 * List of Volunteers
 */
exports.list = function(req, res) { 
	Volunteer.find().sort('-created').populate('user', 'displayName').exec(function(err, volunteers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(volunteers);
		}
	});
};

/**
 * Volunteer middleware
 */
exports.volunteerByID = function(req, res, next, id) { 
	Volunteer.findById(id).populate('user', 'displayName').exec(function(err, volunteer) {
		if (err) return next(err);
		if (! volunteer) return next(new Error('Failed to load Volunteer ' + id));
		req.volunteer = volunteer ;
		next();
	});
};

/**
 * Volunteer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.volunteer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

