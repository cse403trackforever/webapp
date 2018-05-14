import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SigninPageComponent } from './signin-page.component';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs/Observable';
import { mockUser } from '../shared/models/mock/mock-user';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AuthUser } from '../shared/models/auth-user';

describe('SigninPageComponent', () => {
  let component: SigninPageComponent;
  let fixture: ComponentFixture<SigninPageComponent>;
  let authServiceStub: Partial<AuthenticationService>;
  let routerSpy;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // stub auth service
    authServiceStub = {
      getUser(): Observable<AuthUser> {
        return Observable.of(null);
      },
      emailSignIn(value): any {
        console.log('stub');
        return new Promise((resolve) => resolve(mockUser));
      }
    };

    TestBed.configureTestingModule({
      imports: [FontAwesomeModule, FormsModule,
        // RouterTestingModule.withRoutes([{path: '/myprojects', component: MyProjectsPageComponent}])
      ],
      declarations: [SigninPageComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        },
        {
          provide: Router,
          useValue: routerSpy
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should tell router to navigate to myprojects after successful email login', fakeAsync(() => {
    const formData = {
      value: {
        email: 'christine_ta@outlook.com',
        password: 'christine_ta@outlook.com'
      }
    };

    component.tryEmailLogin(formData);
    tick();
    fixture.detectChanges();
    spyOn(component, 'tryEmailLogin');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/myprojects']);
  }));
});
