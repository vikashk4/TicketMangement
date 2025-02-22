import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ticket, NewTicket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private tickets: Ticket[] = [];
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);

  constructor() {
    // Add some sample tickets
    const tickets = [
      { id:1, title: 'Fix Bug', description: 'Resolve login issue', status: 'TODO', priority: 'High', assignee: 'John' },
      { id:2,title: 'Add Feature', description: 'Implement drag and drop', status: 'IN_PROGRESS', priority: 'Medium', assignee: 'Sarah' },
      { id:3,title: 'Testing', description: 'Run unit tests', status: 'DONE', priority: 'Low', assignee: 'Alex' },
      { id:4,title: 'Implement user authentication', description: 'Add login and registration functionality', status: 'TODO', priority: 'HIGH', assignee: 'John Doe'}
    ];
    tickets.map((ticket: NewTicket) => this.addTicket(ticket));
  }

  public getTickets(): Observable<Ticket[]> {
    return this.ticketsSubject.asObservable();
  }

  public getTicketsByStatus(status:string): Ticket[] {
    return this.ticketsSubject.getValue().filter((item)=> item.status === status);
  }

  addTicket(ticket: NewTicket): void {
    const newTicket: Ticket = {
      ...ticket,
      id: this.generateId(),
      priority : ticket.priority as 'HIGH' | 'MEDIUM' | 'LOW',
      status : ticket.status as 'TODO' | 'IN_PROGRESS' | 'DONE',
      createdAt: new Date()
    };
    this.tickets.push(newTicket);
    this.ticketsSubject.next([...this.tickets]);
  }

  updateTicket(ticket: Ticket): void {
    const index = this.tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      this.tickets[index] = ticket;
      this.ticketsSubject.next([...this.tickets]);
    }
  }

  deleteTicket(id: number): void {
    this.tickets = this.tickets.filter(t => t.id !== id);
    this.ticketsSubject.next([...this.tickets]);
  }

  private generateId(): number {
    return Math.max(0, ...this.tickets.map(t => t.id)) + 1;
  }
}