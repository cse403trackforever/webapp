import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageComponent } from './user-page.component';
import { AuthenticationService } from '../authentication/authentication.service';
import { AuthUser } from '../shared/models/auth-user';
import { mockUser } from '../shared/models/mock/mock-user';
import { Observable, of } from 'rxjs';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let authServiceStub: Partial<AuthenticationService>;

  beforeEach(async(() => {
    // stub auth service
    authServiceStub = {
      getUser(): Observable<AuthUser> {
        return of(mockUser);
      }
    };

    TestBed.configureTestingModule({
      declarations: [UserPageComponent],
      providers: [{
        provide: AuthenticationService,
        useValue: authServiceStub
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
