import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {CommonModule, DatePipe, NgIf} from "@angular/common";
import {ChoreListComponent} from "./components/chore-list/chore-list.component";
import {addMonths, isMonday} from 'date-fns';
import {CHORES, HOUSEHOLD_MEMBERS} from "../chores.config";

import {MatCardModule} from '@angular/material/card';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe, MatDatepickerModule, MatFormFieldModule, MatDividerModule, RouterOutlet, NgIf, ChoreListComponent, MatCardModule],
  providers: [provideNativeDateAdapter()],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.component.css',
  templateUrl: './app.component.html',
})
export class AppComponent {
  startDate = new Date();
  endDate = addMonths(new Date, 1);
  errors: string[] = [];

  ngOnInit() {
    for(const chore of CHORES) {
      if(!isMonday(chore.lastExecutedDate)) {
        this.errors.push( `Chore ${chore.name} has not been last executed on a Monday`);
        continue;
      }

      if(!HOUSEHOLD_MEMBERS.includes(chore.lastExecutedMember)) {
        this.errors.push(`Chore ${chore.name} has been last executed by a person not in HOUSEHOLD_MEMBERS`);
        continue;
      }

      if(chore.members && chore.members.filter(m => !HOUSEHOLD_MEMBERS.includes(m)).length) {
        this.errors.push(`One of members of chore ${chore.name} not in HOUSEHOLD_MEMBERS`);
      }
    }
  }

  setStartDate(event: MatDatepickerInputEvent<Date>) {
    if(event.value) {
      this.startDate = event.value;
    }
  }

  setEndDate(event: MatDatepickerInputEvent<Date>) {
    if(event.value) {
      this.endDate = event.value;
    }
  }

}
