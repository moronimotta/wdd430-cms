import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly documentsUrl = 'https://wdd430-26dff-default-rtdb.firebaseio.com/documents.json';

  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number = 0;

  constructor(private httpClient: HttpClient) {}

  getDocuments(): Document[] {
    this.httpClient.get<Document[]>(this.documentsUrl).subscribe(
      (documents: Document[]) => {
        this.documents = documents ?? [];
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((firstDocument: Document, secondDocument: Document) => firstDocument.name.localeCompare(secondDocument.name));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );

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
    this.storeDocuments();
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
    this.storeDocuments();
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
    this.storeDocuments();
  }

  storeDocuments() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const jsonDocuments = JSON.stringify(this.documents);

    this.httpClient.put(this.documentsUrl, jsonDocuments, { headers }).subscribe(
      () => {
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}