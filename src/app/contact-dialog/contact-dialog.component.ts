import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {UserService} from '../user.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit, OnDestroy {
  name: string;
  userName: string;
  hidden: boolean;
  private subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>, private userService: UserService) {
  }

  addContact() {
    if (this.userName.length === 0) {
      alert('Invalid user name');
    }
    const userName = this.userName;
    this.name = this.name ? this.name : this.userName;
    this.userService.addContact(userName);
    this.hidden = true;
  }

  ngOnInit() {
    this.subscription = this.userService.addSubscription.subscribe((result: boolean) => {
      this.hidden = false;
      if (result) {
        alert('contact added');
        this.userService.storeContact(this.name, this.userName);
        this.dialogRef.close(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
