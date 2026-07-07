import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly messagesUrl = 'https://wdd430-26dff-default-rtdb.firebaseio.com/messages.json';

  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number = 0;

  constructor(private httpClient: HttpClient) {}

  getMessages(): Message[] {
    this.httpClient.get<Message[]>(this.messagesUrl).subscribe(
      (messages: Message[]) => {
        this.messages = messages ?? [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );

    return this.messages.slice();
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(String(message.id), 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getMessage(id: string): Message | null {
    return this.messages.find((message) => String(message.id) === id) ?? null;
  }

  addMessage(message: Message) {
    this.maxMessageId++;
    message.id = this.maxMessageId;
    this.messages.push(message);
    this.storeMessages();
  }

  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const jsonMessages = JSON.stringify(this.messages);

    this.httpClient.put(this.messagesUrl, jsonMessages, { headers }).subscribe(
      () => {
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}