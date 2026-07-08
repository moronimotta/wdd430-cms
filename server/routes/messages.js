var express = require('express');
var router = express.Router();

var sequenceGenerator = require('./sequenceGenerator');
var Message = require('../models/message');

router.get('/', function(req, res, next) {
	Message.find()
		.populate('sender')
		.then(function(messages) {
			res.status(200).json({
				message: 'Messages fetched successfully!',
				messages: messages,
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
	var maxMessageId = sequenceGenerator.nextId('messages');

	var message = new Message({
		id: String(maxMessageId),
		subject: req.body.subject,
		msgText: req.body.msgText,
		sender: req.body.sender,
	});

	message.save()
		.then(function(createdMessage) {
			res.status(201).json({
				message: 'Message added successfully',
				messageRecord: createdMessage,
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
	Message.findOne({ id: req.params.id })
		.then(function(message) {
			if (!message) {
				return res.status(500).json({
					message: 'Message not found.',
					error: { message: 'Message not found' },
				});
			}

			message.subject = req.body.subject;
			message.msgText = req.body.msgText;
			message.sender = req.body.sender;

			Message.updateOne({ id: req.params.id }, message)
				.then(function(result) {
					res.status(204).json({
						message: 'Message updated successfully',
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
				message: 'Message not found.',
				error: { message: 'Message not found' },
			});
		});
});

router.delete('/:id', function(req, res, next) {
	Message.findOne({ id: req.params.id })
		.then(function(message) {
			if (!message) {
				return res.status(500).json({
					message: 'Message not found.',
					error: { message: 'Message not found' },
				});
			}

			Message.deleteOne({ id: req.params.id })
				.then(function(result) {
					res.status(204).json({
						message: 'Message deleted successfully',
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
				message: 'Message not found.',
				error: { message: 'Message not found' },
			});
		});
});

module.exports = router;
