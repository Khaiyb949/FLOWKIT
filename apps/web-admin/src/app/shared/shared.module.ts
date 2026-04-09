// Shared module - Export common components for features

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedButtonComponent } from './components/button.component';

const SHARED_COMPONENTS = [
  SharedButtonComponent,
];

@NgModule({
  imports: [CommonModule, ...SHARED_COMPONENTS],
  exports: [...SHARED_COMPONENTS],
})
export class SharedModule {}
