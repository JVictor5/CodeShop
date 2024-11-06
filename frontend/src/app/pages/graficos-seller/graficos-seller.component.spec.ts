import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosSellerComponent } from './graficos-seller.component';

describe('GraficosSellerComponent', () => {
  let component: GraficosSellerComponent;
  let fixture: ComponentFixture<GraficosSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficosSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficosSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
