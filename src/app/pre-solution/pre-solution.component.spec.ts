import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSolutionComponent } from './pre-solution.component';

describe('PreSolutionComponent', () => {
  let component: PreSolutionComponent;
  let fixture: ComponentFixture<PreSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreSolutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
