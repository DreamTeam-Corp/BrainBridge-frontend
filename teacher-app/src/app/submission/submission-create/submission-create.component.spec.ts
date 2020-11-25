import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionCreateComponent } from './submission-create.component';

describe('SubmissionCreateComponent', () => {
  let component: SubmissionCreateComponent;
  let fixture: ComponentFixture<SubmissionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
