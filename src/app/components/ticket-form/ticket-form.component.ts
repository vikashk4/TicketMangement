import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewTicket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  templateUrl:'./ticket-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TicketFormComponent {
  @Output() ticketSubmit = new EventEmitter<NewTicket>();

  ticket: NewTicket = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: ''
  };

  onSubmit() {
    if (this.ticket.title && this.ticket.description && this.ticket.assignee) {
      this.ticketSubmit.emit({ ...this.ticket });
      this.ticket = {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assignee: ''
      };
    }
  }
}