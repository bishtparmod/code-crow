import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, Input, Output, EventEmitter, Renderer2 } from "@angular/core";
import { ChatService } from "../../../services/chat.service";
import { TokenStorage } from "../../../auth/token.storage";
import Giphy from 'giphy-api';
declare const microlink;

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"]
})
export class InputComponent implements OnInit, AfterViewChecked {
  public chatMessage: string = '';
  showEmojiPicker = false;

  showGiphySearch = false;
  giphySearchTerm = '';
  giphyResults = [];

  showAttachment = false
  fileToUpload: File = null;
  fileToUploadName = '';

  isMenuOpen = false;

  @ViewChild('fileInput')
  fileInput: ElementRef;
  @ViewChild('emojiPicker', { read: ElementRef }) emojiPicker: ElementRef;
  @Input() show: boolean = false
  @Input() hideData: boolean = false
  @Output() sendEmoji = new EventEmitter;
  @Output() refresh = new EventEmitter;
  @Output() sendImage = new EventEmitter;
  @Output() sendGifImage = new EventEmitter;

  constructor(
    public chatService: ChatService,
    private tokenStorage: TokenStorage,
    private renderer: Renderer2
  ) { }

  ngOnInit() { }

  ngAfterViewChecked() {
    microlink('.link-preview');
    if (this.emojiPicker) {
      const el = this.emojiPicker.nativeElement.querySelector('.emoji-mart');
      this.renderer.setStyle(el, 'width', '100%');
    }
  }

  ngDoCheck() {
    if (this.hideData) {
      this.chatMessage = null;
      this.closeMenu()
      this.hideData = false
    }
  }

  emitTyping($event) {
    const { keyCode } = $event
    if (keyCode == 13 && !$event.shiftKey) {
      keyCode.preventDefault();
    } else {
      this.chatService.currentChannel.typing()
    }
  }

  toggleEmojiPicker() {
    this.showGiphySearch = false;
    this.showAttachment = false;
    this.showEmojiPicker = this.isMenuOpen = !this.showEmojiPicker;
  }

  toggleGiphySearch() {
    this.showEmojiPicker = false;
    this.showAttachment = false;
    this.showGiphySearch = this.isMenuOpen = !this.showGiphySearch;
  }

  toggleAttachment() {
    this.showGiphySearch = false;
    this.showEmojiPicker = false;
    this.showAttachment = this.isMenuOpen = !this.showAttachment;
  }

  closeMenu() {
    this.showGiphySearch = false;
    this.showAttachment = false;
    this.showEmojiPicker = false;
    this.isMenuOpen = false;
  }

  addEmoji(event) {
    const { chatMessage } = this;
    const text = chatMessage ? `${chatMessage}${event.emoji.native}` : `${event.emoji.native}`
    this.chatMessage = text;
    this.sendEmoji.emit(this.chatMessage)
    this.refresh.emit(true)
  }

  searchGiphy() {
    const giphy = Giphy();
    const searchTerm = this.giphySearchTerm;
    giphy.search(searchTerm)
      .then(res => {
        this.giphyResults = res.data;
      })
      .catch(console.error);
  }

  async handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileToUploadName = this.fileToUpload.name
    this.sendImage.emit(this.fileToUpload)
  }

  async clearFile() {
    this.fileInput.nativeElement.value = '';
    this.fileToUpload = null
    this.fileToUploadName = ''
  }

  async sendGif(title, url) {
    const $user: any = await this.tokenStorage.getUser().toPromise();
    const user = JSON.parse($user);
    const attribute = {
      avatar: user.avatar,
      email: user.email,
      text: title,
      media: url
    }
    await this.chatService.sendMessage(" ", {
      avatar: user.avatar,
      email: user.email,
      text: title,
      media: url
    }).catch(console.error);
    this.showGiphySearch = false;
    this.sendGifImage.emit(attribute)
    this.refresh.emit(true)
  }

  async sendMessage() {
    var attributes;
    if (this.chatMessage && /\S/.test(this.chatMessage) || this.fileToUpload) {
      const $user: any = await this.tokenStorage.getUser().toPromise();
      const user = JSON.parse($user);

      if (this.fileToUpload) {
        const data = await this.chatService.postFile(this.fileToUpload)
        attributes = {
          avatar: user.avatar,
          email: user.email,
          text: data.name,
          file: data.location,
          type: data.type
        }
      } else {
        attributes = {
          avatar: user.avatar,
          email: user.email,
        }
      }

      await this.chatService.sendMessage(this.chatMessage, attributes);
      this.chatMessage = null;
      this.showEmojiPicker = false;
      this.showGiphySearch = false;
      this.showAttachment = false;
      this.fileToUpload = null;
    }
  }
}
