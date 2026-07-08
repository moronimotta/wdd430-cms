import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly documentsUrl = 'http://localhost:3000/documents';

  documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private httpClient: HttpClient) {}

  getDocuments(): Document[] {
    this.httpClient.get<{ message: string; documents: Document[] }>(this.documentsUrl).subscribe(
      (responseData) => {
        this.documents = responseData.documents ?? [];
        this.sortAndSend();
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

    newDocument.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.httpClient.post<{ message: string; document: Document }>(this.documentsUrl, newDocument, { headers }).subscribe(
      (responseData) => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  updateDocument(originalDocument: Document | null, newDocument: Document | null) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((document) => String(document.id) === String(originalDocument.id));
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.httpClient.put(this.documentsUrl + '/' + originalDocument.id, newDocument, { headers }).subscribe(
      () => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteDocument(document: Document | null) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((currentDocument) => String(currentDocument.id) === String(document.id));
    if (pos < 0) {
      return;
    }

    this.httpClient.delete(this.documentsUrl + '/' + document.id).subscribe(
      () => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  private sortAndSend() {
    this.documents.sort((firstDocument: Document, secondDocument: Document) => firstDocument.name.localeCompare(secondDocument.name));
    this.documentListChangedEvent.next(this.documents.slice());
  }
}