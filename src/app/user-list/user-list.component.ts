import {Component, OnDestroy, OnInit} from '@angular/core';
import {IContact, UserService} from '../user.service';
import {Subscription} from 'rxjs';
import {ContactDialogComponent} from '../contact-dialog/contact-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  public contacts: Array<IContact> = [];
  private subscription: Subscription;

  constructor(private userService: UserService, private dialog: MatDialog) {
  }

  openDialog() {
    this.dialog.open(ContactDialogComponent, {height: 'auto', width: 'auto', disableClose: true});
  }

  ngOnInit() {
    this.subscription = this.userService.contactSubscription.subscribe((contacts: Array<IContact>) => {
      this.contacts = contacts;
    });
    this.contacts = this.userService.contacts;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
