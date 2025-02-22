import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { Ticket, NewTicket } from '../../models/ticket.model';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, TicketFormComponent],
  template: `
    <div class="container">
      <h1>Ticket Management System</h1>
      
      <app-ticket-form (ticketSubmit)="onTicketSubmit($event)"></app-ticket-form>

      <div class="card" *ngFor="let ticket of tickets">
        <h3>{{ ticket.title }}</h3>
        <p>{{ ticket.description }}</p>
        <div>
          <span [class]="'status-' + ticket.status.toLowerCase().replace('_', '-')">
            {{ ticket.status.replace('_', ' ') }}
          </span>
          <span [class]="'priority-' + ticket.priority.toLowerCase()">
            Priority: {{ ticket.priority }}
          </span>
        </div>
        <p>Assignee: {{ ticket.assignee }}</p>
        <p>Created: {{ ticket.createdAt | date }}</p>
        <button class="btn btn-danger" (click)="deleteTicket(ticket.id)">Delete</button>
      </div>
    </div>
  `
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  onTicketSubmit(ticket: NewTicket) {
    this.ticketService.addTicket(ticket);
  }

  deleteTicket(id: number) {
    this.ticketService.deleteTicket(id);
  }
}