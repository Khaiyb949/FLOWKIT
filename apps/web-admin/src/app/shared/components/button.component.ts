import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-button',
  standalone: true,
  template: `
    <button
      [class]="variant === 'primary'
        ? 'inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50'
        : 'inline-flex items-center justify-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50'"
      (click)="onClick()"
      [disabled]="disabled">
      {{ label }}
    </button>
  `,
})
export class SharedButtonComponent {
  @Input() label: string = 'Click me';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
