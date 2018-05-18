import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { Observable } from 'rxjs/Observable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthenticationService } from '../authentication.service';
import { mockUser } from '../shared/models/mock/mock-user';
import { AuthUser } from '../shared/models/auth-user';
import { Router } from '@angular/router';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let authServiceStub: Partial<AuthenticationService>;

  beforeEach(async(() => {
    // stub auth service
    authServiceStub = {
      getUser(): Observable<AuthUser> {
        return Observable.of(mockUser);
      }
    };

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ FontAwesomeModule ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        },
        {
          provide: Router,
          useValue: routerSpy
        }
      ],
      declarations: [ HomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
