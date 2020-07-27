import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: any[], searchTitle: string | null): any[] {
    if (searchTitle) {
      return list.filter((item) => {
        const regex = new RegExp((searchTitle), 'gi')
        var channelName = item.friendlyName;
        var videoTitle = item.title;
        var videoAuthor = item.auther;
        var friendName = item.name;
        if ((channelName != undefined && channelName.match(regex))
         || (videoTitle != undefined && videoTitle.match(regex)) 
         || (videoAuthor != undefined && videoAuthor.match(regex))
         || (friendName != undefined && friendName.match(regex)))
          return true
        else
          return false
      });
    } else {
      return list;
    }
  }

}
