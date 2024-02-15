import { SystemInfo } from './../models/systemInfo';
import { FreezeService } from './../services/freeze.service';
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { SystemService } from '../services/system.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { VerificationComponent } from '../verification/verification.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  tfsUrl: string;
  project: string;
  systemInfo: SystemInfo;
  inProgress = false;
  selectedBranch = '';
  isCompleted = false;
  branchClassValue = '';
  branchNotificationText = '';
  branchNotificationClsss = '';
  branchListIsRefreshClass = 'fa fa-refresh';
  branchIssue = true;
  subscriptions: Subscription = new Subscription();
  modalRef: BsModalRef;
  @ViewChild('branchElem') branchElement: ElementRef;

  constructor(private freezeSrv: FreezeService,
    private systemSrv: SystemService,
    private modalService: BsModalService,
    private notifierService: NotifierService) {

    const sub = systemSrv.systemInfo$.subscribe(sysinfo => {
      this.systemInfo = sysinfo;
      console.log(this.systemInfo);
      this.branchListIsRefreshClass = 'fa fa-refresh';
    });
    this.subscriptions.add(sub);
    systemSrv.getTfsUrl();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    const sub = fromEvent(this.branchElement.nativeElement, 'keyup')
      .pipe(
        tap(x => this.branchClassValue = 'fa fa-spinner fa-spin'),
        debounceTime(500),
        distinctUntilChanged(),
        tap((text) => {
          const selectedBranch = `release/${this.branchElement.nativeElement.value}`;
          // this.systemInfo.repositories.forEach(r => {
          //   console.log(`repo ${r.repoName}`, r.releaseBranches.indexOf(selectedBranch));
          // });
          const doesAllRepoHasThisSrcBranch = this.systemInfo.repositories.every(r => r.releaseBranches.indexOf(selectedBranch) >= 0);
          if (doesAllRepoHasThisSrcBranch) {
            this.branchClassValue = 'fa fa-check-circle';
            this.branchNotificationText = 'The branch was found in all of the repositories';
            this.branchIssue = false;
            this.branchNotificationClsss = 'text-success';
          } else {
            this.branchClassValue = 'fa fa-exclamation-circle';
            this.branchNotificationText = 'The branch was <b>not</b> found in all of the repositories';
            this.branchIssue = true;
            this.branchNotificationClsss = 'text-danger';
          }
        })
      )
      .subscribe();
    this.subscriptions.add(sub);
  }

  confirm() {
    this.modalRef = this.modalService.show(VerificationComponent, {});
    this.modalRef.content.onClose.subscribe(result => {
      console.log('results', result);
      if (result) {
        this.perfrom();
      }
    });
  }

  perfrom() {
    this.inProgress = false;

    if (this.selectedBranch.trim() === '') {
      this.notifierService.notify('error', 'Please set release branch');
    } else {
      this.inProgress = true;
      this.freezeSrv.freezeBranch({ fromReleaseBranch: this.selectedBranch }).subscribe(res => {
        this.inProgress = false;
        this.isCompleted = true;
        this.notifierService.notify('success', 'Branch created!');
      }, error => {
        this.inProgress = false;
        console.log(error);
        this.notifierService.notify('error', `${error.statusText}`);
      });
    }
  }

  refreshBranches() {
    console.log('refreshing');
    this.branchListIsRefreshClass = 'fa fa-refresh fa-spin';
    this.systemSrv.getTfsUrl();
  }
}
