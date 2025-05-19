import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project: any;

  get projectStatus(): string {
    return this.project.status.charAt(0).toUpperCase() + this.project.status.slice(1);
  }
}