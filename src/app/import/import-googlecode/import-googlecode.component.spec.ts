import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportGoogleCodeComponent } from './import-googlecode.component';
import { ImportService } from '../import.service';

describe('ImportGoogleCodeComponent', () => {
  let component: ImportGoogleCodeComponent;
  let fixture: ComponentFixture<ImportGoogleCodeComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportGoogleCodeComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportGoogleCodeComponent, {
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
    fixture = TestBed.createComponent(ImportGoogleCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
