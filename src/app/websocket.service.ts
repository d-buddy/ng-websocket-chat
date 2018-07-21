import {Subject} from 'rxjs';

export class WebSocketService {
  socket: WebSocket = null;
  url: string;
  subject: Subject<MessageEvent>;

  constructor(url) {
    this.url = url;
    this.subject = new Subject<MessageEvent>();
  }

  get messages() {
    return this.subject.asObservable();
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = (event: Event) => {
      this.onOpen(event);
    };
    this.socket.onclose = (event: CloseEvent) => {
      this.onClose(event);
    };
    this.socket.onmessage = (event: MessageEvent) => {
      this.onMessage(event);
    };
  }

  onOpen(event: Event) {
    console.log('open', event);
  }

  onClose(event: CloseEvent) {
    this.socket = null;
  }

  close() {
    this.socket.close();
  }

  onMessage(event: MessageEvent) {
    this.subject.next(event);
  }

  sendMessage(payload: string) {
    this.socket.send(payload);
  }
}
