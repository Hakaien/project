import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttComponent } from './gantt/gantt.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [
    GanttComponent,
    TimelineComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GanttComponent,
    TimelineComponent
  ]
})
export class PlanningModule { }