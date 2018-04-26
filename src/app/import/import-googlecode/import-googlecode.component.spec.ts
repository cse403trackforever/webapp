import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ImportGoogleCodeComponent } from './import-googlecode.component';
import { ImportGoogleCodeService } from '../import-googlecode.service';

describe('ImportGoogleCodeComponent', () => {
  let component: ImportGoogleCodeComponent;
  let fixture: ComponentFixture<ImportGoogleCodeComponent>;
  let importServiceStub: Partial<ImportGoogleCodeService>;

  beforeEach(async(() => {
    importServiceStub = {};

    TestBed.configureTestingModule({
      declarations: [ImportGoogleCodeComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: ImportGoogleCodeService,
          useValue: importServiceStub
        }
      ]
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
