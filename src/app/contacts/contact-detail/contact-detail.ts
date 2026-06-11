import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  imports: [RouterLink],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetail implements OnInit {
  contact: Contact | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const contactId = params['id'];
      this.contact = this.contactService.getContact(contactId);
    });
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }
}
