import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportGithubComponent } from './import-github.component';
import { FormsModule } from '@angular/forms';
import 'rxjs/add/observable/of';
import { ImportService } from '../import.service';

describe('ImportGithubComponent', () => {
  let component: ImportGithubComponent;
  let fixture: ComponentFixture<ImportGithubComponent>;
  let importServiceStub: Partial<ImportService>;

  beforeEach(async(() => {
    importServiceStub = {
      importProject(args: any): Promise<string> {
        return new Promise(() => '123');
      }
    };

    TestBed.configureTestingModule({
      declarations: [ImportGithubComponent],
      imports: [FormsModule],
    })
      .overrideComponent(ImportGithubComponent, {
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
    fixture = TestBed.createComponent(ImportGithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
