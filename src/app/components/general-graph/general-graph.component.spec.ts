import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGraphComponent } from './general-graph.component';

describe('GeneralGraphComponent', () => {
  let component: GeneralGraphComponent;
  let fixture: ComponentFixture<GeneralGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
