import {Component, inject, Input} from "@angular/core";


import {MatTableModule} from '@angular/material/table';

import {addWeeks, endOfWeek, format, isAfter, isBefore, isEqual, startOfDay, startOfWeek} from 'date-fns';

import {CHORES, HOUSEHOLD_MEMBERS} from "../../../chores.config";
import {Chore} from "../../../types/chore.type";
import {CommonModule, DatePipe, NgForOf} from "@angular/common";
import {ChoreService} from "../../service/chore.service";

interface MonthData {
  date: Date;
  tableData: any;
}

interface ChoreExecution {
  data: Chore;
  nextExecutionDate: Date;
  nextExecutionMember: string;
}

@Component({
  imports: [MatTableModule, NgForOf, DatePipe, CommonModule],
  selector: 'chore-list',
  standalone: true,
  templateUrl: './chore-list.component.html',
})
export class ChoreListComponent {
  choreService = inject(ChoreService);
  @Input() startDate!: Date;
  @Input() endDate!: Date;

  tableColumnNames: string[] = ['date'];
  tableColumnDisplayNames: string[] = ['Date'];
  tableDataByMonth: MonthData[] = [];

  ngOnInit() {
    for (const member of HOUSEHOLD_MEMBERS) {
      this.tableColumnNames.push(member);
      this.tableColumnDisplayNames.push(member);
    }
  }

  ngOnChanges() {
    const tableData: MonthData[] = [];
    const choreExecutions = this.calculateNextChoreExecutions();
    const startMonday = startOfWeek(this.startDate, {weekStartsOn: 1});
    const endSunday = endOfWeek(this.endDate, {weekStartsOn: 1});
    const startDate = this.getStartDateForCalculation(choreExecutions, startMonday);

    for (let currentDate = startDate; isBefore(currentDate, endSunday); currentDate = addWeeks(currentDate, 1)) {
      currentDate = startOfDay(currentDate);
      const rowData = this.createTableRow(currentDate);

      for (const chore of choreExecutions) {
        if (isEqual(chore.nextExecutionDate, currentDate)) {
          (rowData as any)[chore.nextExecutionMember].push(chore.data.name);
          chore.nextExecutionDate = this.choreService.getNextExecutionDateForChore(chore.data, chore.nextExecutionDate);
          chore.nextExecutionMember = this.choreService.getNextExecutionMemberForChore(chore.data, chore.nextExecutionMember);
        }
      }

      if (currentDate < startMonday) {
        continue;
      }

      const monthIndex = +format(currentDate, 'yyyyMM');

      if (!tableData[monthIndex]) {
        tableData[monthIndex] = {
          date: currentDate,
          tableData: [],
        };
      }

      tableData[monthIndex].tableData.push(rowData);
    }

    this.tableDataByMonth = tableData.filter(x => !!x);
  }

  private getStartDateForCalculation(choreExecutions: {
    nextExecutionDate: Date;
    data: Chore;
    nextExecutionMember: string
  }[], startMonday: Date) {
    const earliestNextExecutionDate = choreExecutions
      .map(c => c.nextExecutionDate)
      .sort((a, b) => b.getDate() - a.getDate())[0];
    return isAfter(earliestNextExecutionDate, startMonday) ? startMonday : earliestNextExecutionDate;
  }

  private calculateNextChoreExecutions() {
    return CHORES
      .map(chore => ({
        data: chore,
        ...this.choreService.getNextExecutionDateAndMemberForChore(chore),
      }));
  }

  private createTableRow(currentDate: Date) {
    const memberColumns = HOUSEHOLD_MEMBERS
      .reduce((previousValue, currentValue) => ({...previousValue, [currentValue]: []}), {});
    return {
      date: currentDate,
      ...memberColumns,
    };
  }

}
