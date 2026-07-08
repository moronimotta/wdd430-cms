import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly contactsUrl = 'http://localhost:3000/contacts';

  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private httpClient: HttpClient) {}

  getContacts(): Contact[] {
    this.httpClient.get<{ message: string; contacts: Contact[] }>(this.contactsUrl).subscribe(
      (responseData) => {
        this.contacts = responseData.contacts ?? [];
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );

    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id || contact._id === id) ?? null;
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

    newContact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.httpClient.post<{ message: string; contact: Contact }>(this.contactsUrl, newContact, { headers }).subscribe(
      (responseData) => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  updateContact(originalContact: Contact | null, newContact: Contact | null) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex((contact) => contact.id === originalContact.id || contact._id === originalContact._id);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.httpClient.put(this.contactsUrl + '/' + originalContact.id, newContact, { headers }).subscribe(
      () => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteContact(contact: Contact | null) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex((currentContact) => currentContact.id === contact.id || currentContact._id === contact._id);
    if (pos < 0) {
      return;
    }

    this.httpClient.delete(this.contactsUrl + '/' + contact.id).subscribe(
      () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  private sortAndSend() {
    this.contacts.sort((firstContact: Contact, secondContact: Contact) => firstContact.name.localeCompare(secondContact.name));
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}