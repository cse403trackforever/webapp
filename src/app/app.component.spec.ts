import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
import { mockUser } from './shared/models/mock/mock-user';
import { AuthUser } from './shared/models/auth-user';

describe('AppComponent', () => {
  let authServiceStub: Partial<AuthenticationService>;

  beforeEach(async(() => {
    // stub auth service
    authServiceStub = {
      getUser(): Observable<AuthUser> {
        return Observable.of(mockUser);
      }
    };

    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [ RouterTestingModule ],
      providers: [ {provide: AuthenticationService, useValue: authServiceStub} ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
