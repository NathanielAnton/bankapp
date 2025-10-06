import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ANavbarComponent } from './Anavbar.component';

describe('NavbarComponent', () => {
  let component: ANavbarComponent;
  let fixture: ComponentFixture<ANavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ANavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ANavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
