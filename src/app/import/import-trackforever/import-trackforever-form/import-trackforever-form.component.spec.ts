import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportTrackforeverFormComponent } from './import-trackforever-form.component';
import { ImportService } from '../../import.service';

describe('ImportTrackforeverFormComponent', () => {
  let component: ImportTrackforeverFormComponent;
  let fixture: ComponentFixture<ImportTrackforeverFormComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportTrackforeverFormComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportTrackforeverFormComponent, {
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
    fixture = TestBed.createComponent(ImportTrackforeverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
