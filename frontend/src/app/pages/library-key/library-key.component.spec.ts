import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryKeyComponent } from './library-key.component';

describe('LibraryKeyComponent', () => {
  let component: LibraryKeyComponent;
  let fixture: ComponentFixture<LibraryKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryKeyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
