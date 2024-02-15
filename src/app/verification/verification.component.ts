import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { VerificationService } from '../services/verification.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  public onClose: Subject<boolean>;
  subscriptions: Subscription;
  key: string;
  inProgressClass: string;
  constructor(public bsModalRef: BsModalRef,
    private verificationService: VerificationService) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  closeDialog(approved: boolean) {
    if (approved) {
      this.inProgressClass = 'fa fa-spinner fa-spin';
      this.verificationService.verify(this.key).subscribe(isOK => {
        if (isOK) {
          this.inProgressClass = 'fa fa-check-circle';
          this.onClose.next(approved);
          this.bsModalRef.hide();
        } else {
          this.inProgressClass = 'fa fa-exclamation-circle';
        }
      });
    } else {
      this.onClose.next(approved);
      this.bsModalRef.hide();
    }

  }
}
