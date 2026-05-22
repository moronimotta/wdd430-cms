import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocumentDetail } from './document-detail/document-detail';
import { DocumentList } from './document-list/document-list';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  imports: [CommonModule, DocumentList, DocumentDetail],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit {
  selectedDocument: Document | null = null;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.documentSelectedEvent.subscribe((document) => {
      this.selectedDocument = document;
    });
  }
}
