import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    ProjectCardComponent,
    NotificationComponent,
    DateFormatPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProjectCardComponent,
    NotificationComponent,
    DateFormatPipe
  ]
})
export class SharedModule { }