import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPoductComponent } from './card-poduct.component';

describe('CardPoductComponent', () => {
  let component: CardPoductComponent;
  let fixture: ComponentFixture<CardPoductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPoductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPoductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
