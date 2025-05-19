import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
import { ArchiveComponent } from './features/projects/archive/archive.component';
import { GroupListComponent } from './features/groups/group-list/group-list.component';
import { GroupDetailComponent } from './features/groups/group-detail/group-detail.component';
import { GanttComponent } from './features/planning/gantt/gantt.component';
import { TimelineComponent } from './features/planning/timeline/timeline.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserDetailComponent } from './features/users/user-detail/user-detail.component';
import { HistoryListComponent } from './features/history/history-list/history-list.component';
import { HistoryDetailComponent } from './features/history/history-detail/history-detail.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'projects/archive', component: ArchiveComponent },
  { path: 'groups', component: GroupListComponent },
  { path: 'groups/:id', component: GroupDetailComponent },
  { path: 'planning/gantt', component: GanttComponent },
  { path: 'planning/timeline', component: TimelineComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'history', component: HistoryListComponent },
  { path: 'history/:id', component: HistoryDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }