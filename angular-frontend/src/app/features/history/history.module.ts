import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryDetailComponent } from './history-detail/history-detail.component';

@NgModule({
  declarations: [
    HistoryListComponent,
    HistoryDetailComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HistoryListComponent,
    HistoryDetailComponent
  ]
})
export class HistoryModule { }