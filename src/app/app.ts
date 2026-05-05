import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Contacts } from './contacts/contacts';
import { Documents } from './documents/documents';
import { Header } from './header';
import { MessageList } from './messages/message-list/message-list';

@Component({
  selector: 'cms-root',
  imports: [CommonModule, Header, Documents, MessageList, Contacts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedFeature = 'documents';

  switchView(selectedFeature: string) {
    this.selectedFeature = selectedFeature;
  }
}
