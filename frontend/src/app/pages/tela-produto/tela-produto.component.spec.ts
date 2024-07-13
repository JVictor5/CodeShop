import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaProdutoComponent } from './tela-produto.component';

describe('TelaProdutoComponent', () => {
  let component: TelaProdutoComponent;
  let fixture: ComponentFixture<TelaProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
