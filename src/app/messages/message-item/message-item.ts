import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  imports: [],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css',
})
export class MessageItem implements OnInit {
  @Input() message!: Message;
  messageSender: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    const contact: Contact | null = this.contactService.getContact(this.message.sender);
    this.messageSender = contact ? contact.name : '';
  }
}
