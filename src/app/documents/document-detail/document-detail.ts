import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref';

@Component({
  selector: 'cms-document-detail',
  imports: [RouterLink],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css',
})
export class DocumentDetail implements OnInit {
  document: Document | null = null;
  nativeWindow: any;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private windRefService: WindRefService
  ) {}

  ngOnInit() {
    this.nativeWindow = this.windRefService.getNativeWindow();
    this.activatedRoute.params.subscribe((params) => {
      const documentId = params['id'];
      this.document = this.documentService.getDocument(documentId);
    });
  }

  onView() {
    if (!this.document?.url) {
      return;
    }

    this.nativeWindow.open(this.document.url);
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigateByUrl('/documents');
  }
}
