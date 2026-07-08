import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly messagesUrl = 'http://localhost:3000/messages';

  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor(private httpClient: HttpClient) {}

  getMessages(): Message[] {
    this.httpClient.get<{ message: string; messages: Message[] }>(this.messagesUrl).subscribe(
      (responseData) => {
        this.messages = responseData.messages ?? [];
        this.sortAndSend();
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
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.httpClient.post<{ message: string; messageRecord: Message }>(this.messagesUrl, message, { headers }).subscribe(
      (responseData) => {
        this.messages.push(responseData.messageRecord);
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  updateMessage(originalMessage: Message | null, newMessage: Message | null) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.findIndex((message) => String(message.id) === String(originalMessage.id));
    if (pos < 0) {
      return;
    }

    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.httpClient.put(this.messagesUrl + '/' + originalMessage.id, newMessage, { headers }).subscribe(
      () => {
        this.messages[pos] = newMessage;
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteMessage(message: Message | null) {
    if (!message) {
      return;
    }

    const pos = this.messages.findIndex((currentMessage) => String(currentMessage.id) === String(message.id));
    if (pos < 0) {
      return;
    }

    this.httpClient.delete(this.messagesUrl + '/' + message.id).subscribe(
      () => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  private sortAndSend() {
    this.messages.sort((firstMessage: Message, secondMessage: Message) => String(firstMessage.subject).localeCompare(String(secondMessage.subject)));
    this.messageChangedEvent.emit(this.messages.slice());
  }
}