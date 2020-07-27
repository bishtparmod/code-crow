import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TokenStorage } from '../auth/token.storage';
import { DialogService } from './../services/dialog.service';
import { DialogData } from './../shared/dialog-data';
import { SharedService } from './../services/shared.service';
import { FriendService } from '../services/friend.service';
import { NewsService } from './../services/news.service';
import { FriendChatService } from './../services/friendchat.service';
import { Socket } from './../services/socket.service';
import { version } from '../../../package.json';
import { environment } from '../../environments/environment';
import { PaymentService } from '../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  @Output() sidenavClose = new EventEmitter();

  public user: any
  public userSubscription
  public version: string = version;
  public isPayedUser: boolean
  public refresh: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private _socket: Socket,
    private tokenStorage: TokenStorage,
    private dialogService: DialogService,
    private sharedService: SharedService,
    public friendsService: FriendService,
    public newsService: NewsService,
    public friendChatService: FriendChatService,
    private paymentService: PaymentService,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.authService.updateData({ headerRefresh: true })
    this.authService.headerRefresh.subscribe((data: any) => {
      if (data.headerRefresh) {
        this.init()
      } else {
        return
      }
    })
  }

  async init() {
    let user: any = await this.tokenStorage.getUser().toPromise()
    const isBanned = user ? JSON.parse(user).isBanned : false

    if (!user) {
      let user = await this.authService.me()
      if (!user) {
        this.router.navigate(['/auth/login'])
      } else {
        this.user = user
      }
    } else if (isBanned) {
      this.router.navigate(['/auth/login'])
      this.logout()
    } else {
      this.user = JSON.parse(user)
      const { email, firstName, customerId } = JSON.parse(user)
      this.authService.updateData({ headerRefresh: false })
      const customer: any = await this.paymentService.stripeGetCustomer(customerId)
      if (customer) {
        const { data } = customer.subscriptions
        this.isPayedUser = data.length == 1 ? true : false
      }
    }
  }

  logout(): void {
    this.authService.logout().subscribe(data => {
      location.href = location.origin
    })
  }

  navigate(link): void {
    this.router.navigate([link]);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  async openDialog() {
    this.onSidenavClose()
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

  public setIsScrollToTiers(val: boolean) {
    this.sharedService.setIsScrollToTiers(val)
  }


  public skip: number = 100000
  public limit: number = 100000
  public onScroll(e) {
    console.log('>> CATCH SCROLL EVENT')
    const { scrollHeight, scrollTop, clientHeight } = e.srcElement
    if (scrollHeight - clientHeight <= scrollTop) {
      this.friendsService.loadMoreFriends(this.skip, this.limit)
      this.skip += this.limit
    }
  }

  public getUnseenNewsCount() {
    return this.newsService.unseenNewsCount > 0 ? this.newsService.unseenNewsCount : null
  }

  getVersion() {
    var envName = environment.production ? "" : ' [' + environment.name + ']'
    return 'v' + version + envName
  }
}
