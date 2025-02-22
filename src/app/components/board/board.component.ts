import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { TicketService } from '../../services/ticket.service';
import { Ticket, NewTicket } from '../../models/ticket.model';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';

@Component({
  selector: 'app-board',
  templateUrl:'./board.component.html',
  standalone: true,
  imports: [CommonModule, DragDropModule, TicketFormComponent]
})
export class BoardComponent implements OnInit {
  todoTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  doneTickets: Ticket[] = [];
  showTicketForm = false;
  isDragging = false;
  dragTarget: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO';
  boardColumns: { status: 'TODO' | 'IN_PROGRESS' | 'DONE'; label: string; ref: string; refList: string[], tickets: Ticket[] }[] = [
    { status: 'TODO', label: 'To Do', ref: 'todoList',refList:[], tickets: [] },
    { status: 'IN_PROGRESS', label: 'In Progress', ref: 'inProgressList',refList:[], tickets: [] },
    { status: 'DONE', label: 'Done', ref: 'doneList',refList:[], tickets: [] }
  ];

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.ticketService.getTickets().subscribe(tickets => {
      this.todoTickets = tickets.filter(t => t.status === 'TODO');
      this.inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS');
      this.doneTickets = tickets.filter(t => t.status === 'DONE');
    });
    this.boardColumns = this.boardColumns.map(item => ({
      ...item,
      tickets: this.ticketService.getTicketsByStatus(item.status),
      refList: this.getConnectedLists(item.status)
    }));
    console.log(this.boardColumns)
  }

  getConnectedLists(currentStatus: string):string[] {
    const restul = this.boardColumns
      .filter(col => col.status !== currentStatus)
      .map(col => col.ref);
      console.log(restul)
      return restul;
  }

  toggleTicketForm() {
    this.showTicketForm = !this.showTicketForm;
  }

  closePopupOnOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.showTicketForm = false;
    }
  }

  onTicketSubmit(ticket: NewTicket) {
    this.ticketService.addTicket(ticket);
    this.showTicketForm = false;
  }

  deleteTicket(id: number) {
    this.ticketService.deleteTicket(id);
  }

  onDragStart(event: CdkDragStart) {
    this.isDragging = true;
  }

  onDragEnd() {
    this.isDragging = false;
    this.dragTarget = 'TODO';
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const ticket = event.container.data[event.currentIndex];
      let newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE';

      if (event.container.element.nativeElement.parentElement?.textContent?.includes('To Do')) {
        newStatus = 'TODO';
      } else if (event.container.element.nativeElement.parentElement?.textContent?.includes('In Progress')) {
        newStatus = 'IN_PROGRESS';
      } else {
        newStatus = 'DONE';
      }

      this.ticketService.updateTicket({ ...ticket, status: newStatus });
    }
  }
}