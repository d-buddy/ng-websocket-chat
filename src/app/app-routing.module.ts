import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserListComponent} from './user-list/user-list.component';
import {UserLoggedIn} from './activate/UserLoggedIn';
import {ChatComponent} from './chat/chat.component';

const routes: Routes = [
  {path: 'list', component: UserListComponent, canActivate: [UserLoggedIn]},
  {path: 'chat/:userName', component: ChatComponent, canActivate: [UserLoggedIn]},
  {path: '', pathMatch: 'full', redirectTo: '/list'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
