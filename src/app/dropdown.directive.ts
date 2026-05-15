import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cmsDropdown]',
  standalone: true,
})
export class DropdownDirective {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('click', ['$event'])
  toggleOpen(event: Event) {
    event.preventDefault();
    this.elementRef.nativeElement.parentElement?.classList.toggle('open');
  }
}