import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';
import { filter } from 'minimatch';

@Injectable()
export class TodoService {
  readonly todoUrl: string = environment.API_URL + 'todos';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { status?: string, contains?: string, owner?: string, category?: string,
    orderBy?: string, limit?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status);
      }
      if (filters.contains) {
        httpParams = httpParams.set('contains', filters.contains);
      }
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.orderBy) {
        httpParams = httpParams.set('orderBy', filters.orderBy);
      }
      if (filters.limit) {
        httpParams = httpParams.set('limit', filters.limit);
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  filterTodos(todos: Todo[], filters: { status?: string, contains?: string, owner?: string, category?: string,
    orderBy?: string, limit?: string  }): Todo[] {

    let filteredTodos = todos;

    return filteredTodos;
  }
}