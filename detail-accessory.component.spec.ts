import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAccessoryComponent } from './detail-accessory.component';

describe('DetailAccessoryComponent', () => {
  let component: DetailAccessoryComponent;
  let fixture: ComponentFixture<DetailAccessoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAccessoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAccessoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
