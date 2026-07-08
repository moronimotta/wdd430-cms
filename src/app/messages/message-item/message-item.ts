import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';
import { Message } from '../message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-item',
  imports: [],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css',
})
export class MessageItem implements OnInit, OnChanges, OnDestroy {
  @Input() message!: Message;
  messageSender: string = '';
  contactSubscription!: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.resolveSender();
    this.contactSubscription = this.contactService.contactListChangedEvent.subscribe(() => {
      this.resolveSender();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message']) {
      this.resolveSender();
    }
  }

  ngOnDestroy() {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }
  }

  private resolveSender() {
    if (!this.message) {
      this.messageSender = '';
      return;
    }

    if (typeof this.message.sender === 'object' && this.message.sender !== null) {
      this.messageSender = this.message.sender.name;
      return;
    }

    const contact: Contact | null = this.contactService.getContact(String(this.message.sender));
    this.messageSender = contact ? contact.name : '';
  }
}
