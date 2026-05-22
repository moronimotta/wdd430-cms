import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactDetail } from './contact-detail/contact-detail';
import { ContactList } from './contact-list/contact-list';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  imports: [CommonModule, ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnInit {
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contactService.contactSelectedEvent.subscribe((contact) => {
      this.selectedContact = contact;
    });
  }
}
