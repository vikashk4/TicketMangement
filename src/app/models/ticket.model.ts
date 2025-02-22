export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignee: string;
  createdAt: Date;
}

export interface NewTicket {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
}
