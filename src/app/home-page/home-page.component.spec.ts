import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { DbkeyPipe } from '../shared/pipes/dbkey.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthenticationService } from '../authentication.service';
import { User } from '../shared/models/user';
import { mockUser } from '../shared/models/mock/mock-user';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let authServiceStub: Partial<AuthenticationService>;

  beforeEach(async(() => {
    // stub auth service
    authServiceStub = {
      getUser(): Observable<User> {
        return Observable.of(mockUser);
      }
    };

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, FontAwesomeModule ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        }
      ],
      declarations: [ HomePageComponent, DbkeyPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
