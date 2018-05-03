import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { IssuePageComponent } from './issue-page/issue-page.component';
import { ImportPageComponent } from './import/import-page/import-page.component';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { SignoutPageComponent } from './signout-page/signout-page.component';
import { MyProjectsPageComponent } from './my-projects-page/my-projects-page.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'myprojects', component: MyProjectsPageComponent },
  { path: 'project/:id', component: ProjectPageComponent },
  { path: 'project/:projectId/issue/:issueId', component: IssuePageComponent },
  { path: 'import', component: ImportPageComponent },
  { path: 'signin', component: SigninPageComponent },
  { path: 'signout', component: SignoutPageComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
