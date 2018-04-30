import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportRedmineComponent } from './import-redmine.component';
import { ImportService } from '../import.service';

describe('ImportRedmineComponent', () => {
  let component: ImportRedmineComponent;
  let fixture: ComponentFixture<ImportRedmineComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportRedmineComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportRedmineComponent, {
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
    fixture = TestBed.createComponent(ImportRedmineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
