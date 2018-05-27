import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { IssuePageComponent } from './issue-page/issue-page.component';
import { ImportPageComponent } from './import/import-page/import-page.component';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { MyProjectsPageComponent } from './my-projects-page/my-projects-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PasswordResetPageComponent } from './password-reset-page/password-reset-page.component';
import { CreateIssuePageComponent } from './create-issue-page/create-issue-page.component';
import { CreateProjectPageComponent } from './create-project-page/create-project-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'signin', component: SigninPageComponent },
  { path: 'reset', component: PasswordResetPageComponent },
  { path: 'signup', component: SignUpPageComponent },
  {
    path: 'myprojects',
    component: MyProjectsPageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'project/:id',
    component: ProjectPageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'new',
    component: CreateProjectPageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'project/:projectId/issue/:issueId',
    component: IssuePageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'project/:projectId/new',
    component: CreateIssuePageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'import',
    component: ImportPageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'user',
    component: UserPageComponent
  },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
