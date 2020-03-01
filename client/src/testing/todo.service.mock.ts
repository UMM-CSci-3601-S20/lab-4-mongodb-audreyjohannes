import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'thomas_id',
      owner: 'thomas',
      status: true,
      body: 'You are tasked with doing a speedrun of the 1997 video game "GoldenEye" for the Nintendo 64 console.',
      category: 'video games'
  },
  {
      _id: 'mark_id',
      owner: 'mark',
      status: false,
      body: 'Tonight is game night. You have to bring one of the following: (1) super smash bros; (2) mario party; (3) goldeneye.',
      category: 'video games'
  },
  {
      _id: 'thomas_id',
      owner: 'thomas',
      status: true,
      body: 'You are tasked with completing your taxes for 2019. You can use TurboTax, HR Block, or a CPA.',
      category: 'adulting'
  }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters?: { status?: string, contains?: string, owner?: string, category?: string,
    orderBy?: string, limit?: string }): Observable<Todo[]> {
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
