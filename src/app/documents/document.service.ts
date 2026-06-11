import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number = 0;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    return this.documents.find((document) => String(document.id) === id) ?? null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = parseInt(String(document.id), 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document | null) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId;
    this.documents.push(newDocument);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(originalDocument: Document | null, newDocument: Document | null) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }

  deleteDocument(document: Document | null) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}