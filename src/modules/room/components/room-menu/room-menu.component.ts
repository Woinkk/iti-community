import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room, RoomType } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomSocketService } from '../../services/room.socket.service';
@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  roomId$: Observable<string | undefined>;

  rooms: Room[];

  lastVisited: string | null;

  constructor(
    private feedStore: FeedStore, 
    private queries: RoomQueries, 
    private roomSocketService: RoomSocketService,
    private router: Router
  ) 
  {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {

    this.lastVisited = localStorage.getItem('it.lastVisited');

    this.rooms = await this.queries.getAll();
    
    if(this.feedStore.value.roomId === undefined) {
      this.goToRoom(this.rooms[0]);
    }

    if (this.lastVisited != null ) {
      for (let i = 0; i < this.rooms.length; i++) {
        const element = this.rooms[i];
        if (element.id === this.lastVisited) {
          this.goToRoom(element);
        }
      }
    }

    this.roomSocketService.onNewRoom(room => {
      this.rooms.push(room);
    })
    
  }

  goToRoom(room: Room) {
    // TODO naviguer vers app/[id de la room] DONE (not working yet)
    this.router.navigate(['/app/'+room.id]);

    localStorage.setItem("it.lastVisited", room.id);
  }
}
