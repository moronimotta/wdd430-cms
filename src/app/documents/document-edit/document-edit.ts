import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit {
  currentDocument: Document = new Document('', '', '', '', []);
  originalDocument: Document | null = null;
  isNew = true;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const documentId = params['id'];

      if (!documentId || documentId === 'new') {
        this.isNew = true;
        this.originalDocument = null;
        this.currentDocument = new Document('', '', '', '', []);
        return;
      }

      this.isNew = false;
      this.originalDocument = this.documentService.getDocument(documentId);

      if (this.originalDocument) {
        this.currentDocument = new Document(
          this.originalDocument.id,
          this.originalDocument.name,
          this.originalDocument.description,
          this.originalDocument.url,
          this.originalDocument.children,
          this.originalDocument._id
        );
      }
    });
  }

  onSave() {
    if (this.isNew) {
      this.documentService.addDocument(this.currentDocument);
    } else {
      this.documentService.updateDocument(this.originalDocument, this.currentDocument);
    }

    this.router.navigateByUrl('/documents');
  }

  onClear() {
    this.currentDocument.name = '';
    this.currentDocument.description = '';
    this.currentDocument.url = '';
    this.currentDocument.children = [];
  }
}
