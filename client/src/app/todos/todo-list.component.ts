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
      category: this.todoCategory,
    }).subscribe(returnedTodos => {
      this.serverFilteredTodos = returnedTodos;
      // this.updateFilter();
    }, err => {
      console.log(err);
    });
  }


  /**
   * Starts an asynchronous operation to update the todos list
   *
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }
}
