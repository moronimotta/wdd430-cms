import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css',
})
export class ContactEdit implements OnInit {
  currentContact: Contact = new Contact('', '', '', '', '', []);
  originalContact: Contact | null = null;
  isNew = true;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const contactId = params['id'];

      if (!contactId || contactId === 'new') {
        this.isNew = true;
        this.originalContact = null;
        this.currentContact = new Contact('', '', '', '', '', []);
        return;
      }

      this.isNew = false;
      this.originalContact = this.contactService.getContact(contactId);

      if (this.originalContact) {
        this.currentContact = new Contact(
          this.originalContact.id,
          this.originalContact.name,
          this.originalContact.email,
          this.originalContact.phone,
          this.originalContact.imageUrl,
          this.originalContact.group,
          this.originalContact._id
        );
      }
    });
  }

  onSave() {
    if (this.isNew) {
      this.contactService.addContact(this.currentContact);
    } else {
      this.contactService.updateContact(this.originalContact, this.currentContact);
    }

    this.router.navigateByUrl('/contacts');
  }

  onClear() {
    this.currentContact.name = '';
    this.currentContact.email = '';
    this.currentContact.phone = '';
    this.currentContact.imageUrl = '';
    this.currentContact.group = [];
  }
}
