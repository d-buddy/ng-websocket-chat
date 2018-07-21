import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  userName: string;
  processing: boolean;
  private subscription: Subscription;

  constructor(private userService: UserService, private router: Router) {
  }

  get buttonDisable() {
    return this.processing;
  }

  ngOnInit() {
    this.subscription = this.userService.registerSubscription.subscribe((result: boolean) => {
      if (result) {
        this.userService.setUserName(this.userName);
        this.router.navigateByUrl('list');
      }
      this.processing = false;
    });
  }

  tryLogin() {
    this.processing = true;
    this.userService.register(this.userName);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearData() {
    if (confirm('Are you sure')) {
      localStorage.removeItem('messages');
      localStorage.removeItem('contacts');
    }
  }
}
