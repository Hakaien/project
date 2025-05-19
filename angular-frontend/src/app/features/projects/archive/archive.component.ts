import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {

  archivedProjects: any[] = []; // Replace 'any' with the appropriate type for your project

  constructor() { }

  ngOnInit(): void {
    this.loadArchivedProjects();
  }

  loadArchivedProjects(): void {
    // Logic to load archived projects from the backend
  }

  restoreProject(projectId: number): void {
    // Logic to restore an archived project
  }

  deleteProject(projectId: number): void {
    // Logic to permanently delete an archived project
  }
}