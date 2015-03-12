'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Cat = mongoose.model('Cat'),
	Adoption = mongoose.model('Adoption'),
	Donation = mongoose.model('Donation'),
	Contact = mongoose.model('Contact'),
	_ = require('lodash');

exports.list = function(req, res) {
	Cat.find().sort('name').exec(function(err, cats) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cats);
		}
	});
};

exports.view = function(req, res) {
    res.json(req.cat);
};

function isValidEvent(event) {
	// TODO: better event validation
	return true;
}

exports.addEvent = function(req, res) {
	console.log('Event created');
	if (!isValidEvent(req.body)) {
		return res.status(400).send({
			message: 'The given event is invalid.'
		});
	}
	var cat = req.cat;
	var event = req.body;
	event._id = mongoose.Types.ObjectId();
	cat.events.push(event);
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat.events[cat.events.length - 1]);
		}
	});
};

exports.adopt = function(req, res) {
	if (req.cat.currentAdoption !== undefined) {
		console.log("Tried to adoped cat with current adoption:" + JSON.stringify(req.cat.currentAdoption));
		return res.status(400).send({
			message: 'Cannot adopt cat with current adopter.'
		});
	}
	var adoption = new Adoption(req.body);
	adoption.save(function(err) {
		if (err) {
			console.log("error saving adoption");
			console.log(JSON.stringify(err));
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.cat.adoptions.push(adoption._id);
			req.cat.save(function(err) {
				if (err) {
					console.log("error saving cat.");
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json(adoption);
				}
			});
		}
	});
};

exports.unadopt = function(req, res) {
};

exports.editEvent = function(req, res) {
	if (!isValidEvent(req.body)) {
		return res.status(400).send({
			message: 'The given event is invalid.'
		});
	}
	var cat = req.cat;
	cat.events[req.params.eventIndex] = req.body;
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat.events[req.params.eventIndex]);
		}
	});
};

exports.deleteEvent = function(req, res) {
	var cat = req.cat;

	var index = -1;
	for (var i in cat.events) {
		if (cat.events[i]._id.toString() === req.params.eventId) {
			index = i;
			break;
		}
	}
	if (index === -1) {
		return res.status(404).send({
			message: 'That event does not exist with this cat.'
		});
	}
	cat.events.splice(index, 1);
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json({message: 'The event was successfully deleted.'});
		}
	});
};

exports.catByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Cat is invalid'
        });
    }
    Cat.findById(id).populate('adoptions currentAdoption')
		.exec(function(err, cat) {
		// this is ugly....
			Cat.populate(cat, { 
				path: 'adoptions.adopter currentAdoption.adopter', 
				model: Contact
			}, function(err, cat) {
				Cat.populate(cat, { path: 'adoptions.donation currentAdoption.donation', model: Donation},
					function(err, cat) {
						if (err) return next(err);
						if (!cat) {
							return res.status(404).send({
								message: 'Cat not found'
							});
						}
						req.cat = cat;
						next();
					});
			});
		});
};

exports.create = function(req, res) {
	var cat = new Cat(req.body);
	cat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(cat);
		}
	});
};
