import { FormBuilder, FormGroup, Validators } from "@angular/forms";


export function buildDealForm(fb: FormBuilder): FormGroup {
  return fb.group({
    dealName:       [null, Validators.required],
    dealType:       [null, Validators.required],
    targetCompany:  [null, Validators.required],
    estimatedValue: [null, Validators.required],
    currency:       [null, Validators.required],
    pipelineStage:  [null, Validators.required],
  });
}