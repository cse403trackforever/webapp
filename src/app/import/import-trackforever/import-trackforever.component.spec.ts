import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportTrackForeverComponent } from './import-trackforever.component';
import { ImportTrackForeverService } from '../import-trackforever.service';

describe('ImportTrackForeverComponent', () => {
  let component: ImportTrackForeverComponent;
  let fixture: ComponentFixture<ImportTrackForeverComponent>;
  let importServiceStub: Partial<ImportTrackForeverService>;

  beforeEach(async(() => {
    importServiceStub = {};

    TestBed.configureTestingModule({
      declarations: [ImportTrackForeverComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: ImportTrackForeverService,
          useValue: importServiceStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTrackForeverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
