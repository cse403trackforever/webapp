import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportRedmineFormComponent } from './import-redmine-form.component';
import { ImportService } from '../../import.service';

describe('ImportRedmineFormComponent', () => {
  let component: ImportRedmineFormComponent;
  let fixture: ComponentFixture<ImportRedmineFormComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportRedmineFormComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportRedmineFormComponent, {
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
    fixture = TestBed.createComponent(ImportRedmineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
