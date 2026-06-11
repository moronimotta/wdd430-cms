import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit {
  originalDocument: Document | null = null;
  document: Document | null = null;
  editMode = false;
  id: string | null = null;

  constructor(
    private documentService: DocumentService,
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

      this.originalDocument = this.documentService.getDocument(this.id);

      if (this.originalDocument == null) {
        return;
      }

      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document(0, '', '', '', null);

    newDocument.name = value.name;
    newDocument.description = value.description;
    newDocument.url = value.url;
    newDocument.children = this.originalDocument?.children ?? null;

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }
}
