import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';
import { DocumentItem } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  imports: [CommonModule, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'Project Plan', 'Initial scope and delivery plan', 'https://example.com/project-plan', null),
    new Document(2, 'Research Notes', 'Collected notes and references', 'https://example.com/research-notes', null),
    new Document(3, 'Design Brief', 'Design goals and user experience direction', 'https://example.com/design-brief', null),
    new Document(4, 'Meeting Summary', 'Key decisions from the latest team meeting', 'https://example.com/meeting-summary', null),
    new Document(5, 'Launch Checklist', 'Tasks that must be complete before release', 'https://example.com/launch-checklist', null),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
