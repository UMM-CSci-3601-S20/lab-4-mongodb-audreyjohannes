import { Component, OnInit } from '@angular/core';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: []
})

export class TodoListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];


  public todoOwner: string;
  public todoStatus: string;
  public todoBody: string;
  public todoCategory: string;
  public todoOrderBy: string;
  public todoLimit: string;



  // Inject the TodoService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private todoService: TodoService) {

  }

  getTodosFromServer() {
    this.todoService.getTodos({
      status: this.todoStatus,
      contains: this.todoBody,
      owner: this.todoOwner,
      category: this.todoCategory,
    }).subscribe(returnedTodos => {
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter() {
    if (this.todoStatus === 'complete') {
      this.filteredTodos = this.todoService.filterTodos(
        this.serverFilteredTodos, { status: 'complete', contains: this.todoBody,
        owner: this.todoOwner, category: this.todoCategory, orderBy: this.todoOrderBy, limit: this.todoLimit });
    } else if (this.todoStatus === 'incomplete') {
      this.filteredTodos = this.todoService.filterTodos(
        this.serverFilteredTodos, { status: 'incomplete', contains: this.todoBody,
        owner: this.todoOwner, category: this.todoCategory, orderBy: this.todoOrderBy, limit: this.todoLimit });
    } else {
      this.filteredTodos = this.todoService.filterTodos(
        this.serverFilteredTodos, { contains: this.todoBody,
        owner: this.todoOwner, category: this.todoCategory, orderBy: this.todoOrderBy, limit: this.todoLimit });
    }
  }

  /**
   * Starts an asynchronous operation to update the todos list
   *
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }
}
