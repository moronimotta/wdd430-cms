var express = require('express');
var router = express.Router();

var sequenceGenerator = require('./sequenceGenerator');
var Contact = require('../models/contact');

router.get('/', function(req, res, next) {
	Contact.find()
		.populate('group')
		.then(function(contacts) {
			res.status(200).json({
				message: 'Contacts fetched successfully!',
				contacts: contacts,
			});
		})
		.catch(function(error) {
			res.status(500).json({
				message: 'An error occurred',
				error: error,
			});
		});
});

router.post('/', function(req, res, next) {
	var maxContactId = sequenceGenerator.nextId('contacts');

	var contact = new Contact({
		id: String(maxContactId),
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		imageUrl: req.body.imageUrl,
		group: req.body.group || [],
	});

	contact.save()
		.then(function(createdContact) {
			res.status(201).json({
				message: 'Contact added successfully',
				contact: createdContact,
			});
		})
		.catch(function(error) {
			res.status(500).json({
				message: 'An error occurred',
				error: error,
			});
		});
});

router.put('/:id', function(req, res, next) {
	Contact.findOne({ id: req.params.id })
		.then(function(contact) {
			if (!contact) {
				return res.status(500).json({
					message: 'Contact not found.',
					error: { contact: 'Contact not found' },
				});
			}

			contact.name = req.body.name;
			contact.email = req.body.email;
			contact.phone = req.body.phone;
			contact.imageUrl = req.body.imageUrl;
			contact.group = req.body.group || contact.group;

			Contact.updateOne({ id: req.params.id }, contact)
				.then(function(result) {
					res.status(204).json({
						message: 'Contact updated successfully',
					});
				})
				.catch(function(error) {
					res.status(500).json({
						message: 'An error occurred',
						error: error,
					});
				});
		})
		.catch(function(error) {
			res.status(500).json({
				message: 'Contact not found.',
				error: { contact: 'Contact not found' },
			});
		});
});

router.delete('/:id', function(req, res, next) {
	Contact.findOne({ id: req.params.id })
		.then(function(contact) {
			if (!contact) {
				return res.status(500).json({
					message: 'Contact not found.',
					error: { contact: 'Contact not found' },
				});
			}

			Contact.deleteOne({ id: req.params.id })
				.then(function(result) {
					res.status(204).json({
						message: 'Contact deleted successfully',
					});
				})
				.catch(function(error) {
					res.status(500).json({
						message: 'An error occurred',
						error: error,
					});
				});
		})
		.catch(function(error) {
			res.status(500).json({
				message: 'Contact not found.',
				error: { contact: 'Contact not found' },
			});
		});
});

module.exports = router;
