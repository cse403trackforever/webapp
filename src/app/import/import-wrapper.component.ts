import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef, EventEmitter,
  Input, OnChanges, OnDestroy, Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ImportComponent } from './import.component';
import { Subscription } from 'rxjs';

/**
 * Component to help add dynamic ImportComponents.
 * Based off of this stack overflow post:
 * <https://stackoverflow.com/questions/36325212/angular-2-dynamic-tabs-with-user-click-chosen-components/36325468#36325468>
 */
@Component({
  selector: 'app-import-wrapper',
  template: `<div #target></div>`
})
export class ImportWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Output() complete: EventEmitter<string> = new EventEmitter();
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() working: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('target', { read: ViewContainerRef }) target;
  @Input() type;

  compRef: ComponentRef<ImportComponent>;
  private isViewInitialized = false;

  private compSubs: Subscription[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private cdRef: ChangeDetectorRef) { }

  private subToInstance<T>(source: EventEmitter<T>, wrapper: EventEmitter<T>): void {
    this.compSubs.push(source.subscribe(e => wrapper.emit(e)));
  }

  private clearSubs(): void {
    this.compSubs.forEach(s => s.unsubscribe());
    this.compSubs = [];
  }

  updateComponent() {
    if (!this.isViewInitialized) {
      return;
    }

    if (this.compRef) {
      this.clearSubs();
      this.compRef.destroy();
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(this.type);
    this.compRef = this.target.createComponent(factory);

    this.subToInstance(this.compRef.instance.complete, this.complete);
    this.subToInstance(this.compRef.instance.error, this.error);
    this.subToInstance(this.compRef.instance.working, this.working);

    this.cdRef.detectChanges();
  }

  ngOnChanges() {
    this.updateComponent();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }

  ngOnDestroy() {
    if (this.compRef) {
      this.clearSubs();
      this.compRef.destroy();
    }
  }
}
