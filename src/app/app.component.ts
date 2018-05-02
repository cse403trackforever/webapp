import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Track Forever';
  collapsed = true;
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
