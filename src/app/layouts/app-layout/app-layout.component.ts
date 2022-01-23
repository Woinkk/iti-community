import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { NotificationStore } from 'src/modules/notification/notification.store';
import { NotificationQueries } from 'src/modules/notification/services/notification.queries';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NotificationSocketService } from 'src/modules/notification/services/notification.socket.service';

enum NotificationType {
  NewRoom = 'room_added',
  PostLiked = 'post_liked',
  NewUser = 'new_user'
}

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  sub?: Subscription;

  showDrawer: boolean = false;

  notificationList: AnyNotification[];

  constructor(
    private socket: WebsocketConnection, 
    private authStore: AuthenticationStore, 
    private notificationSocketService: NotificationSocketService,
    private notificationService: NotificationService,
    private notificationQueries: NotificationQueries,
    private notificationStore: NotificationStore,
    private notificationDisplay: NzNotificationService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.sub = this.authStore.accessToken$.subscribe(accessToken => {
      if (accessToken) {
        this.socket.connect(accessToken);
      } else {
        this.socket.disconnect();
      }
    });
    
    await this.notificationService.fetch();

    this.notificationList = await this.notificationQueries.getNotifications();

    this.notificationSocketService.onNewNotification(notif => {

      if (notif.subject === NotificationType.NewRoom) {
        this.notificationDisplay.blank("New room created", `${notif.payload.user.username} created a new room: ${notif.payload.room.name}`)
      }
      if (notif.subject === NotificationType.NewUser) {
        this.notificationDisplay.blank("New user has arrived.", `${notif.payload.user.username} has arrived !`)
      }
      if (notif.subject === NotificationType.PostLiked) {
        this.notificationDisplay.blank("New like ! ", `${notif.payload.user.username} liked your post: ${notif.payload.preview}`)
      }

      this.notificationList.push(notif);
    })

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  async onToggleNotifications() {
    if (this.showDrawer) this.showDrawer = false
    else {
      this.showDrawer = true
      await this.notificationService.markAsViewed();
    };
  }
}
