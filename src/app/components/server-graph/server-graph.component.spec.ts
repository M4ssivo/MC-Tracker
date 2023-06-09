import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerGraphComponent } from './server-graph.component';

describe('ServerGraphComponent', () => {
  let component: ServerGraphComponent;
  let fixture: ComponentFixture<ServerGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
