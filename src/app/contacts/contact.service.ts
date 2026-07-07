import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly contactsUrl = 'https://wdd430-26dff-default-rtdb.firebaseio.com/contacts.json';

  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number = 0;

  constructor(private httpClient: HttpClient) {}

  getContacts(): Contact[] {
    this.httpClient.get<Contact[]>(this.contactsUrl).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts ?? [];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((firstContact: Contact, secondContact: Contact) => firstContact.name.localeCompare(secondContact.name));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );

    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id) ?? null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(String(contact.id), 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addContact(newContact: Contact | null) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = String(this.maxContactId);
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact | null, newContact: Contact | null) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact | null) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  storeContacts() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const jsonContacts = JSON.stringify(this.contacts);

    this.httpClient.put(this.contactsUrl, jsonContacts, { headers }).subscribe(
      () => {
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}