import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Message } from '../message.model';
import { MessageEdit } from '../message-edit/message-edit';
import { MessageItem } from '../message-item/message-item';

@Component({
  selector: 'cms-message-list',
  imports: [CommonModule, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  messages: Message[] = [
    new Message(1, 'Welcome', 'Message1', 'Bro. Jackson'),
    new Message(2, 'Assignment', 'Message2', 'Bro. Barzee'),
    new Message(3, 'Reminder', 'Message3', 'Bro. Jackson'),
    new Message(3, 'Reminder', 'Message4', 'Bro. Jackson'),
    new Message(3, 'Reminder', 'Message5', 'Bro. Barzee'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
