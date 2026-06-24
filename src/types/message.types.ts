export interface Message {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  timestamp: number;
}
