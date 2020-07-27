import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DialogService } from './../../services/dialog.service';
import { DialogData } from './../../shared/dialog-data';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Input() user: any = {};
  @Output() sidenavClose = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  logout(): void {
    this.authService.logout().subscribe(data => {
      location.href = location.origin
    })
  }

  navigate(link): void {
    this.router.navigate([link]);
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  async openDialog() {
    const dialogData: DialogData = {
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      showOKBtn: true,
      showCancelBtn: true,
      okText: "OK",
      cancelText: "CANCEL"
    };

    const dialogRef = this.dialogService.openDialog(
      dialogData, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout()
      }
    });
  }
}
