'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Volunteer Schema
 */
var VolunteerSchema = new Schema({
    contact: {
        type: Schema.ObjectId,
        ref: 'User'
    },
	timeIn: {
		type: Date,
		default: Date.now
	},
    timeOut: {
        type: Date,
        default: null
    }
});

mongoose.model('Volunteer', VolunteerSchema);
