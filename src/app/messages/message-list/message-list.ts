import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageEdit } from '../message-edit/message-edit';
import { MessageItem } from '../message-item/message-item';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  imports: [CommonModule, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messages = this.messageService.getMessages();
    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }
}
