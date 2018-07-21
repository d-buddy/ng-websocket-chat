import {Component} from '@angular/core';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private userService: UserService) {

  }

  get loggedIn() {
    const userId = this.userService.user;
    return userId !== null;
  }
}
