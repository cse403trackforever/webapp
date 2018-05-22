import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportGooglecodeFormComponent } from './import-googlecode-form.component';
import { ImportService } from '../../import.service';

describe('ImportGooglecodeFormComponent', () => {
  let component: ImportGooglecodeFormComponent;
  let fixture: ComponentFixture<ImportGooglecodeFormComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportGooglecodeFormComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportGooglecodeFormComponent, {
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
    fixture = TestBed.createComponent(ImportGooglecodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
