import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('Todo service: ', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
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
});
