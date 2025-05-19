import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '../../core/services/history.service';
import { HistoryItem } from '../../core/models/history-item.model';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  historyItem: HistoryItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.historyService.getHistoryItemById(id).subscribe(item => {
        this.historyItem = item;
      });
    }
  }
}