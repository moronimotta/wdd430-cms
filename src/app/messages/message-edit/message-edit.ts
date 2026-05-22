import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  imports: [],
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  @ViewChild('subject') subjectInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('msgText') msgTextInputRef!: ElementRef<HTMLTextAreaElement>;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender = 'Your Name';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;

    const message = new Message(1, subject, msgText, this.currentSender);
    this.messageService.addMessage(message);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
