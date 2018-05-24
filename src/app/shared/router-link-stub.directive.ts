import { Directive, Input } from '@angular/core';
import { NgModule } from '@angular/core';

/**
 * For testing components that use [routerLink]
 *
 * Disabling tslint because the selector needs to match the original RouterLinkDirective
 */
/* tslint:disable */
@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}
/* tslint:enable */

// Dummy module to satisfy Angular Language service. Never used.
@NgModule({
  declarations: [
    RouterLinkStubDirective
  ]
})
export class RouterStubsModule {}
