import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';

@NgModule({
  declarations: [
    GroupListComponent,
    GroupDetailComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GroupListComponent,
    GroupDetailComponent
  ]
})
export class GroupsModule { }