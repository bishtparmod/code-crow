import { AdminService } from './services/admin.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from './auth/auth.service';
import { TokenStorage } from './auth/token.storage';
import { ChatService } from './services/chat.service'
import { EmailService } from './services/email.service'
import { StripeScriptTag } from "stripe-angular"
import * as schema from './schema/equipment.json';
import { Socket } from './services/socket.service';
import { Pipe, PipeTransform } from "@angular/core";
import { FriendService } from './services/friend.service'
import { FriendChatService } from './services/friendchat.service'

@Pipe({
  name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value * 60);
    return (
      ("00" + minutes).slice(-2) +
      ":" +
      ("00" + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  @Output() public sidenavToggle = new EventEmitter();
  @ViewChild('sidenav', { static: true }) public el: any;

  // @HostListener('swiperight', ['$event']) public swipePrev(event: any) {
  //   this.el.show();
  // }
  private userSubscription: Subscription;
  public user: any
  private publishableKey: string = "pk_test_zNzh2o1OkU21yGQAhUW6W0Yp00Z19jXMyA"
  public error = false
  constructor(
    private authService: AuthService,
    private _router: Router,
    private tokenStorage: TokenStorage,
    public chatService: ChatService,
    public StripeScriptTag: StripeScriptTag,
    public emailService: EmailService,
    public adminService: AdminService,
    private socket: Socket,
    private _activatedRoute: ActivatedRoute,
    private friendService: FriendService
  ) {
    this.StripeScriptTag.setPublishableKey(this.publishableKey)
  }

  public isLoggedIn: boolean = false
  public loadingChatClient: boolean = true

  public async ngOnInit() {
    console.log('>> Initialized App Component')
    try {
      // const adBlock = await this.emailService.checkForAdBlock()
      const me = await this.authService.me()
      if (!me) {
        this.tokenStorage.signOut()
        this.isLoggedIn = false
        this._router.navigate(['/auth/login'])
      } else {
        this.user = me
        this.isLoggedIn = true
        const { firstName, channelSID } = me
        this.chatService.chatConnectedEmitter.subscribe(async (data: Boolean) => {
          if (!data) this.error = true
          this.loadingChatClient = false
          await this.friendService.getFriendList()
        })
        const token = await this.chatService.generateToken(firstName)
        const connection = await this.chatService.connect(token)
        this.userSubscription = this.authService.$userSource.subscribe((user) => {
          this.user = user;
        });

        this._router.events.subscribe((evt) => {
          if (!(evt instanceof NavigationEnd)) {
            return;
          }
          window.scrollTo(0, 0)
        });

        setTimeout(async () => {
          if (!this.user.isAdmin) {
            try {
              this.socket.listenToMaintenanceMode().subscribe(request => {
                if (request.data.isEnabled) {
                  this._router.navigate([`maintenance`])
                }
              })
            } catch (e) {
              console.log(e)
            }
          }
        }, 2000)
      }
      // this.checkForAdBlock()
    } catch (e) {
      this.loadingChatClient = false
      // this.checkForAdBlock()
    }
  }

  // public checkForAdBlock() {
  //   setInterval(async () => {
  //     try {
  //       const adBlock = await this.emailService.checkForAdBlock()
  //     } catch (e) {
  //       this.router.navigate(['disable-ad-block'])
  //     }
  //   }, 10000)
  // }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  logout(): void {
    this.authService.logout().subscribe(data => {
      this._router.navigate(['/auth/login'])
    })
  }

  navigate(link): void {
    this._router.navigate([link]);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
