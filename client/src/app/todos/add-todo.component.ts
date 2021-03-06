import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  todo: Todo;

  constructor(private fb: FormBuilder, private todoService: TodoService, private snackBar: MatSnackBar, private router: Router) {
  }

  // not sure if this owner is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_todo_validation_messages = {
    owner: [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least two characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 35 characters long'},
      {type: 'pattern', message: 'Owner must contain only numbers and letters'}
    ],

    status: [
      { type: 'required', message: 'Status is required' },
      { type: 'pattern', message: 'Status must be Complete or Incomplete' },
    ],

    body: [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least two characters long'},
      {type: 'maxlength', message: 'Body cannot be more than 150 characters long'},
      {type: 'pattern', message: 'Body must contain only numbers and letters'}
    ],

    category: [
      {type: 'required', message: 'Category is required' },
      {type: 'minlength', message: 'Category must be at least two characters long'},
      {type: 'maxlength', message: 'Category cannot be more than 35 characters long'},
      {type: 'pattern', message: 'Category must contain only numbers and letters'}
    ]
  };

  createForms() {

    // add todo form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for owner.
      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
      ])),

      status: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),

      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
       ])),

      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
      ]))
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe(newID => {
      this.snackBar.open('Added Todo ' + this.addTodoForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/todos/']);
    }, err => {
      this.snackBar.open('Failed to add the todo', null, {
        duration: 2000,
      });
    });
  }

}
