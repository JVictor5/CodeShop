import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPassowordComponent } from './recover-passoword.component';

describe('RecoverPassowordComponent', () => {
  let component: RecoverPassowordComponent;
  let fixture: ComponentFixture<RecoverPassowordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverPassowordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecoverPassowordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
