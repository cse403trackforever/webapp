import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportTrackForeverComponent } from './import-trackforever.component';
import { ImportService } from '../import.service';

describe('ImportTrackForeverComponent', () => {
  let component: ImportTrackForeverComponent;
  let fixture: ComponentFixture<ImportTrackForeverComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportTrackForeverComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportTrackForeverComponent, {
        set: {
          providers: [
            {
              provide: ImportService,
              useValue: importServiceStub
            },
          ]
        }
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
