import {Component, OnInit} from '@angular/core';
import {IMessage, UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  message = '';
  to = '';
  messageList: Map<string, Array<IMessage>> = new Map<string, Array<IMessage>>();

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
  }

  get messages() {
    let messages = [];
    if (this.messageList.has(this.to)) {
      messages = this.messageList.get(this.to).sort((a: IMessage, b: IMessage) => {
        return a.stamp - b.stamp;
      });
    }
    return messages;
  }

  ngOnInit() {
    this.to = this.route.snapshot.paramMap.get('userName');
    this.userService.messageSubscription.subscribe((data: Map<string, Array<IMessage>>) => {
      this.messageList = data;
    });
    this.messageList = this.userService.messages;
  }

  sendMessage() {
    if (this.message.length === 0) {
      return;
    }
    this.userService.sendMessage(this.to, this.message);
  }

  deleteContact() {
    if (confirm('Are you sure?')) {
      this.userService.removeContact(this.to);
      this.router.navigateByUrl('/list');
    }
  }

  deleteChat() {
    if (confirm('Are you sure?')) {
      this.userService.removeMessages(this.to);
    }
  }

}
