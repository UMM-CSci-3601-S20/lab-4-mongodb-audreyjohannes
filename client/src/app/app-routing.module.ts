import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { AddTodoComponent } from './todos/add-todo.component';
import { TodoListComponent } from './todos/todo-list.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'todos', component: TodoListComponent},
  {path: 'users/new', component: AddUserComponent},
  {path: 'todos/new', component: AddTodoComponent},
  {path: 'users/:id', component: UserProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
