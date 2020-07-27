import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { TokenStorage } from '../../auth/token.storage'
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import value from '*.json';
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['title']
  public dataSource: MatTableDataSource<any>
  private conSub: any;
  public channels: any;
  public channel: any;
  public isEditingChannel: Boolean = false
  public channelUsers: any
  public blockedUsers: any
  public username: string
  public channelAPI: any
  public liveStreaming
  public filter: string

  public pageNumber: number = 0;
  public pageLimit: number = 5;
  public totalCount: number = 0;

  constructor(
    public chatService: ChatService,
    public tokenStorage: TokenStorage
  ) { }

  async ngOnInit() {
    await this.connectChat();

    this.conSub = this.chatService.chatConnectedEmitter.subscribe(async () => {
      const channelWithCount = await this.chatService.getAllChannels()
      this.channels = channelWithCount.channelItems
      this.dataSource = new MatTableDataSource(this.channels)
      this.totalCount = channelWithCount.count
      console.log(this.channels)
    })
  }

  public async connectChat(){
    const $user: any = await this.tokenStorage.getUser().toPromise()
    const user = JSON.parse($user)
    const identity = user.firstName
    this.username = identity
    const token = await this.chatService.generateToken(identity)
    this.chatService.connect(token)
  } 

  public async filterChannels(filterValue: string){
    this.filter = filterValue.trim();
    this.pageNumber = 0;
    await this.loadChannelsPage()
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  public changePage($event) {
    this.pageLimit = $event.pageSize
    this.pageNumber = $event.pageIndex 
    this.loadChannelsPage()
  }

  async loadChannelsPage() {
    if(!this.conSub.closed){
      const channelWithCount = await this.chatService.getFilteredChannels(this.filter, this.pageLimit, this.pageNumber)
      this.dataSource = new MatTableDataSource(channelWithCount.channelItems)
      this.totalCount = channelWithCount.count
    } else {
      await this.connectChat();
      this.conSub = this.chatService.chatConnectedEmitter.subscribe(async () => {
        const channelWithCount = await this.chatService.getFilteredChannels(this.filter, this.pageLimit, this.pageNumber)
        this.dataSource = new MatTableDataSource(channelWithCount.channelItems)
        this.totalCount = channelWithCount.count
      })
    }
  }

  public async showChannel(channel) {
    if (this.channel && this.channel.sid == channel.sid) {
      console.log('>> CONDITION TRUE')
    } else {
      const $user: any = await this.tokenStorage.getUser().toPromise()
      const user = JSON.parse($user)
      const identity = user.firstName

      this.chatService.enterChannel(channel.sid, identity)
        .then(async () => {
          const usernames = []
          this.chatService.currentChannel.members.forEach(member => { usernames.push(member.state.identity) })
          this.channelUsers = await this.chatService.getUsersByIds(usernames)
          this.lineChartData[0].data = this.getWeekActivity(this.chatService.messages, 'timestamp', 'lineChartLabels', 'lastWeekMessages')

          const channelAPI = await this.chatService.getChannelAPI({ id: this.chatService.currentChannel.sid })
          this.channelAPI = channelAPI.channel
          this.liveStreaming = channelAPI.liveStreaming
          const liveStreamingWeekActivity = this.getWeekActivity(this.liveStreaming, 'startDate', 'lineChartLabels', 'lastWeekStreams')

          const arr = new Array(7).fill([])
          const keys = Object.keys(this.lastWeekStreams).map(i => parseInt(i))
          arr.forEach(($arr, i) => {
            if (keys.indexOf(i) > -1)
              arr[i] = this.lastWeekStreams[i.toString()]
          })
          const durations = arr.map($arr => $arr.length ? $arr.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0) : 0)
          const participants = arr.map($arr => $arr.length ? $arr.reduce((accumulator, currentValue) => accumulator + currentValue.participants.length, 0) : 0)

          this.streamingLineChartData = [
            {
              data: durations,
              yAxisID: 'A',
              label: 'Duration (sec.)',
              fill: false
            },
            {
              data: participants,
              yAxisID: 'B',
              label: 'Participants',
              fill: false
            }
          ]
          const blockedUsers = await this.chatService.getChannelBlockList({ id: this.channelAPI._id })

          this.blockedUsers = blockedUsers
          const blockedUsersIds = blockedUsers.map(user => user.user._id)
          this.channelUsers = this.channelUsers.filter(user => blockedUsersIds.indexOf(user._id) > -1 || user.firstName == this.username ? false : true)
          this.channel = channel
          this.isEditingChannel = !this.isEditingChannel
        })
    }
  }

  public lastWeekMessages: any = []
  public lastWeekStreams: any = []

  getWeekActivity(arr, key, that, id) {
    const weekObj = {}
    const weekofYear = arr.map(val => {
      const int = moment(val[key]).format('w')
      weekObj[int] ? weekObj[int].push(val) : weekObj[int] = [val]
      return parseInt(int)
    })
    const maxNumber = Math.max(...weekofYear)
    const lastWeekActivity = weekObj[maxNumber.toString()] || []
    const dayObj = {}
    const dayofWeek = lastWeekActivity.map(value => {
      const int = moment(value[key]).format('d')
      dayObj[int] ? dayObj[int].push(value) : dayObj[int] = [value]
      return parseInt(int)
    })
    this[id] = dayObj
    const values = this[that].map((day, i) => dayObj[i.toString()] ? dayObj[i.toString()].length : 0)
    return values
  }

  async blockUser(userId) {
    try {
      const block = await this.chatService.blockUser({ userId, channelId: this.channelAPI._id })
      this.channelUsers = this.channelUsers.filter(user => user._id == userId ? false : true)
      this.blockedUsers.push(block)
    } catch (e) {
      console.log(e)
    }
  }

  async unblockUser(blockId, user) {
    try {
      const unblock = await this.chatService.unblockUser({ blockId })
      this.blockedUsers = this.blockedUsers.filter(block => block._id == blockId ? false : true)
      this.channelUsers.push(user)
    } catch (e) {
      console.log(e)
    }
  }

  async deleteChannel() {
    const bool = confirm(`Are you sure you want to delete channel ${this.channel.friendlyName}?`)
    if (bool) {
      this.chatService.currentChannel.delete()
      this.channels = this.channels.filter(c => c.sid != this.channel.sid ? true : false)
      this.channel = null
      this.isEditingChannel = false
    }
  }


  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      fill: false
    }
  ]
  public streamingLineChartData: ChartDataSets[] = [
    {
      data: [],
      fill: false
    }
  ]
  public lineChartLabels: Label[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      gridLines: {
        display: false
      }
    },
    maintainAspectRatio: false,
    legend: {
      display: false
    }
  };
  public streamLineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      gridLines: {
        display: false
      },
      yAxes: [
        {
          id: 'A',
          type: 'linear',
          position: 'left',
        },
        {
          id: 'B',
          type: 'linear',
          position: 'right'
        }
      ]
    },
    maintainAspectRatio: false,
    legend: {
      display: false
    }
  }
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
}
