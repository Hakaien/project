import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../core/services/history.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss']
})
export class HistoryListComponent implements OnInit {
  historyItems: any[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyService.getHistory().subscribe(data => {
      this.historyItems = data;
    });
  }
}