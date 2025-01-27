import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSolutionComponent } from './view-solution.component';

describe('ViewSolutionComponent', () => {
  let component: ViewSolutionComponent;
  let fixture: ComponentFixture<ViewSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSolutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
