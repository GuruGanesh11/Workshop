import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicCreationComponent } from './epic-creation.component';

describe('EpicCreationComponent', () => {
  let component: EpicCreationComponent;
  let fixture: ComponentFixture<EpicCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpicCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpicCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
