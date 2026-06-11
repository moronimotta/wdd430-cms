import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ContactItem } from '../contact-item/contact-item';

@Component({
  selector: 'cms-contact-edit',
  imports: [CommonModule, FormsModule, ContactItem],
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css',
})
export class ContactEdit implements OnInit {
  originalContact: Contact | null = null;
  contact: Contact | null = null;
  groupContacts: Contact[] = [];
  editMode = false;
  id: string | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (this.id == null) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactService.getContact(this.id);

      if (this.originalContact == null) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.originalContact.group) {
        this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact('', '', '', '', '', []);

    newContact.name = value.name;
    newContact.email = value.email;
    newContact.phone = value.phone;
    newContact.imageUrl = value.imageUrl;
    newContact.group = this.groupContacts;

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }

    this.groupContacts.splice(index, 1);
  }
}
