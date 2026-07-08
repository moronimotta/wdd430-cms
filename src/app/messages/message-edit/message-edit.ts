import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  imports: [CommonModule],
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit implements OnInit, OnDestroy {
  @ViewChild('subject') subjectInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('msgText') msgTextInputRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('sender') senderInputRef!: ElementRef<HTMLSelectElement>;

  @Output() addMessageEvent = new EventEmitter<Message>();

  contacts: Contact[] = [];
  contactSubscription!: Subscription;
  currentSender = '';

  constructor(
    private messageService: MessageService,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactService.getContacts();
    this.contactSubscription = this.contactService.contactListChangedEvent.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      if (!this.currentSender && this.contacts.length > 0) {
        this.currentSender = String(this.contacts[0]._id || this.contacts[0].id);
      }
    });
  }

  ngOnDestroy() {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }
  }

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;
    const sender = this.senderInputRef.nativeElement.value;

    const message = new Message('', subject, msgText, sender);
    this.messageService.addMessage(message);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
