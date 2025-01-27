import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostWorkshopComponent } from './post-workshop.component';

describe('PostWorkshopComponent', () => {
  let component: PostWorkshopComponent;
  let fixture: ComponentFixture<PostWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
