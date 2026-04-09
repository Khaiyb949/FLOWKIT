# Shared Module

Reusable components, directives, and pipes used across features.

⚠️ **No business logic allowed**

## Contains:
- **components/**: Dumb/presentational components (Button, Table, Modal, etc.)
- **directives/**: Reusable directives (HighlightDirective, etc.)
- **pipes/**: Custom pipes (SafePipe, CurrencyFormatPipe, etc.)

## Principles:
- ✔️ Stateless components
- ✔️ Receive data via @Input() 
- ✔️ Emit events via @Output()
- ❌ No service calls
- ❌ No business logic
