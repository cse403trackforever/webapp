import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGithubFormComponent } from './import-github-form.component';
import { FormsModule } from '@angular/forms';
import 'rxjs/add/observable/of';
import { ImportService } from '../../import.service';

describe('ImportGithubFormComponent', () => {
  let component: ImportGithubFormComponent;
  let fixture: ComponentFixture<ImportGithubFormComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportGithubFormComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportGithubFormComponent, {
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
    fixture = TestBed.createComponent(ImportGithubFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
