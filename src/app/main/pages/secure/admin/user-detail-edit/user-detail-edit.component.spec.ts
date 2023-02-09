import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailEditComponent } from './user-detail-edit.component';

describe('UserDetailEditComponent', () => {
  let component: UserDetailEditComponent;
  let fixture: ComponentFixture<UserDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
