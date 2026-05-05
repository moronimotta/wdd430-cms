import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'cms-document-list',
  imports: [CommonModule],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {
  documents: string[] = [
    'document 1',
    'document 2',
  ];
}
