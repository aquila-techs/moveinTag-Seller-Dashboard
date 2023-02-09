import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionsDetailComponent } from './promotions-detail.component';

describe('PromotionsDetailComponent', () => {
  let component: PromotionsDetailComponent;
  let fixture: ComponentFixture<PromotionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
