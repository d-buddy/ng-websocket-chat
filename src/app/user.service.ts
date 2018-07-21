import {Injectable} from '@angular/core';
import {WebSocketService} from './websocket.service';
import {Subject, Subscription} from 'rxjs';

const URL = 'ws url';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private socket: WebSocketService;
  private subscription: Subscription;
  private registerSubject: Subject<boolean>;
  private addSubject: Subject<boolean>;
  private messageSubject: Subject<Map<string, Array<IMessage>>>;
  private contactSubject: Subject<Array<IContact>>;
  private userName: string = null;

  private contactList: Array<IContact> = [];
  private messageList: Map<string, Array<IMessage>> = new Map<string, Array<IMessage>>();

  constructor() {
    this.socket = new WebSocketService(URL);
    this.socket.connect();
    this.registerSubject = new Subject<boolean>();
    this.addSubject = new Subject<boolean>();
    this.contactSubject = new Subject<Array<IContact>>();
    this.messageSubject = new Subject<Map<string, Array<IMessage>>>();
    this.subscription = this.socket.messages.subscribe(message => {
      this.handleMessage(message);
    });
    this.releaseContacts();
    this.releaseMessages();
  }

  get registerSubscription() {
    return this.registerSubject.asObservable();
  }

  get contactSubscription() {
    return this.contactSubject.asObservable();
  }

  get messageSubscription() {
    return this.messageSubject.asObservable();
  }

  get messages() {
    return this.messageList;
  }

  get addSubscription() {
    return this.addSubject.asObservable();
  }

  get user() {
    return this.userName;
  }

  get contacts() {
    return this.contactList;
  }

  set contacts(contacts) {
    this.contactList = contacts;
    this.contactSubject.next(contacts);
  }

  static marshall(data) {
    return JSON.stringify(data);
  }

  static unMarshall(data) {
    return JSON.parse(data);
  }

  handleMessage(event: MessageEvent) {
    const message = UserService.unMarshall(event.data);
    console.log(message);
    switch (message.type) {
      case 'register':
        this.handleRegister(message);
        break;
      case 'add':
        this.handleAdd(message);
        break;
      case 'send':
        this.handleReceive(message);
        break;
    }
  }

  handleReceive(msg: any) {
    const userName = msg.message.name;
    const message = msg.message.message;
    const [contact] = this.contacts.filter((con: IContact) => {
      return con.userName === userName;
    });
    if (!contact) {
      this.storeContact(userName, userName);
    }
    this.addMessage(userName, {type: 'from', message: message, stamp: Date.now()});
  }

  handleRegister(message: any) {
    if (message.status === 400) {
      this.registerSubject.next(false);
      alert(message.message);
      return;
    }
    this.registerSubject.next(true);
  }

  handleAdd(message: any) {
    if (message.status === 400) {
      alert(message.message);
      this.addSubject.next(false);
      return;
    }
    this.addSubject.next(true);
  }

  setUserName(name: string) {
    this.userName = name;
  }

  storeContact(name: string, userName: string) {
    const [contact] = this.contactList.filter((con: IContact) => con.userName === userName);
    if (!contact) {
      this.contactList.push({name, userName});
      this.contacts = this.contactList;
      this.persistContacts();
    }
  }

  register(name: string) {
    this.socket.sendMessage(UserService.marshall({type: 'register', name}));
  }

  addContact(userName: string) {
    this.socket.sendMessage(UserService.marshall({type: 'add', name: userName}));
  }

  removeContact(userName: string) {
    this.contactList = this.contactList.filter((contact: IContact) => contact.userName !== userName);
    this.contacts = this.contactList;
    this.persistContacts();
    this.removeMessages(userName);
  }

  sendMessage(userName: string, message: string) {
    this.socket.sendMessage(UserService.marshall({type: 'send', name: userName, message}));
    this.addMessage(userName, {
      message: message,
      type: 'to',
      stamp: Date.now()
    });
  }

  addMessage(userName: string, message: IMessage) {
    let list = [];
    if (!this.messageList.has(userName)) {
      list.push(message);
    } else {
      list = this.messageList.get(userName);
      list.push(message);
    }
    this.messageList.set(userName, list);
    this.messageSubject.next(this.messageList);
    this.persistMessages();
  }

  removeMessages(userName: string) {
    if (this.messageList.has(userName)) {
      this.messageList.delete(userName);
      this.persistMessages();
    }
  }

  private releaseMessages() {
    const messages = localStorage.getItem('messages');
    try {
      if (messages === null) {
        this.messageList = new Map<string, Array<IMessage>>();
        this.messageSubject.next(this.messageList);
        return;
      }
      const map = new Map<string, Array<IMessage>>();
      const json = JSON.parse(messages);

      Object.keys(json).forEach(key => {
        map.set(key, json[key]);
      });
      this.messageList = map;
      this.messageSubject.next(this.messageList);
    } catch (e) {
    }
  }

  private persistMessages() {
    const messages = {};
    this.messageList.forEach((list: Array<IMessage>, userName: string) => {
      messages[userName] = list;
    });
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  private releaseContacts() {
    const contacts = localStorage.getItem('contacts');
    try {
      if (contacts === null) {
        this.contacts = [];
        return;
      }
      const json = JSON.parse(contacts);
      this.contacts = json;
    } catch (e) {
    }
  }

  private persistContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contactList));
  }
}

export interface IContact {
  name: string;
  userName: string;
}

export interface IMessage {
  type: string;
  message: string;
  stamp: number;
}
