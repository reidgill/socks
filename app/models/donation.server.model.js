'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Donation Schema
 */
var DonationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill in the name of the donor.',
		trim: true
	},

    created: {
		type: Date,
		default: Date.now
	},

    dollarAmount: Number,

    paymentType: {
        type: String,
        default: '',
        trim: true
    }
});

mongoose.model('Donation', DonationSchema);
