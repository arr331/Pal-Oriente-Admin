import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesShowComponent } from './sites-show.component';

describe('SitesShowComponent', () => {
  let component: SitesShowComponent;
  let fixture: ComponentFixture<SitesShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
