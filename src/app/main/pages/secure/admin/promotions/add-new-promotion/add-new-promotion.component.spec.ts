import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPromotionComponent } from './add-new-promotion.component';

describe('AddNewPromotionComponent', () => {
  let component: AddNewPromotionComponent;
  let fixture: ComponentFixture<AddNewPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewPromotionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
