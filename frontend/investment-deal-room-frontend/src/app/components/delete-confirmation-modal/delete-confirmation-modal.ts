import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [ButtonModule, DialogModule],
  templateUrl: './delete-confirmation-modal.html',
})
export class DeleteConfirmationModal {
  visible = input.required<boolean>();
  recordName = input.required<string>();
  header = input<string>('Confirm Delete');
  actionLabel = input<string>('DELETE');

  confirmed = output<void>();
  cancelled = output<void>();
}
