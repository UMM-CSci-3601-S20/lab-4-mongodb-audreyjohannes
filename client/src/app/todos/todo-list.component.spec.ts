import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTodoService } from '../../testing/todo.service.mock';
import { Todo } from './todo';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from './todo.service';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodoListComponent],
      // providers:    [ TodoService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: TodoService, useValue: new MockTodoService() }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.serverFilteredTodos.length).toBe(3);
  });


  it('contains a todo with owner \'Chris\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.owner === 'Chris')).toBe(true);
  });

  it('contain a todo with owner \'Audrey\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.owner === 'Audrey')).toBe(true);
  });

  it('doesn\'t contain a todo with owner \'tobias\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.owner === 'tobias')).toBe(false);
  });

  it('contains a todo with category \'chair\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'chair')).toBe(true);
  });

  it('contain a todo with category \'software design\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.category === 'software design')).toBe(true);
  });

  it('doesn\'t contain a todo with category \'Santa\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
  });


  it('contains a todo with body \'some text\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.body === 'some text')).toBe(true);
  });

  it('contain a todo with body \'another text\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.body === 'another text')).toBe(true);
  });

  it('doesn\'t contain a todo with body \'out of ideas\'', () => {
    expect(todoList.serverFilteredTodos.some((todo: Todo) => todo.owner === 'out of ideas')).toBe(false);
  });
});

describe('Misbehaving Todo List', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoServiceStub: {
    getTodos: () => Observable<Todo[]>;
    getTodosFiltered: () => Observable<Todo[]>;
  };

  beforeEach(() => {
    // stub TodoService for test purposes
    todoServiceStub = {
      getTodos: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getTodosFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodoListComponent],
      // providers:    [ TodoService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: TodoService, useValue: todoServiceStub }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a TodoListService', () => {
    // Since the observer throws an error, we don't expect todos to be defined.
    expect(todoList.serverFilteredTodos).toBeUndefined();
  });
});
