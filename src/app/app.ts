import { Component } from '@angular/core';
import { Contacts } from './contacts/contacts';
import { Header } from './header';

@Component({
  selector: 'cms-root',
  imports: [Header, Contacts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
