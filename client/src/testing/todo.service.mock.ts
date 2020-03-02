import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TodoService } from '../app/todos/todo.service';
import { Todo } from 'src/app/todos/todo';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'chris_id',
      owner: 'Chris',
      status: false,
      body: 'some text',
      category: 'chair',
    },
    {
      _id: 'audrey_id',
      owner: 'Audrey',
      status: true,
      body: 'another text',
      category: 'software design',
    },
    {
      _id: 'johannes_id',
      owner: 'Johannes',
      status: true,
      body: 'a third text',
      category: 'desk',
    },
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { category?: string, owner?: string }): Observable<Todo[]> {
    // Just return the test todos regardless of what filters are passed in
    return of(MockTodoService.testTodos);
  }


  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test todo,
    // return that todo, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
