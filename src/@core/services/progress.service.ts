import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private progress = new Subject<number>();

  getProgress(): Subject<number> {
    return this.progress;
  }

  updateProgress(value: number): void {
    this.progress.next(value);
  }
}