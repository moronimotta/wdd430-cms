import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactDetail } from './contact-detail/contact-detail';
import { ContactList } from './contact-list/contact-list';
import { Contact } from './contact.model';

@Component({
  selector: 'cms-contacts',
  imports: [CommonModule, ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {
  selectedContact: Contact | null = null;
}
