import {Component, Input} from "@angular/core";


import {MatTableModule} from '@angular/material/table';

import {addWeeks, endOfWeek, format, isAfter, isBefore, isEqual, startOfDay, startOfWeek} from 'date-fns';

import {CHORES, HOUSEHOLD_MEMBERS} from "../../../chores.config";
import {Chore} from "../../../types/chore.type";
import {CommonModule, DatePipe, NgForOf} from "@angular/common";

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

    const earliestChoreStartDate = choreExecutions
      .map(c => c.nextExecutionDate)
      .sort((a, b) => b.getDate() - a.getDate())[0];

    const startMonday = startOfWeek(this.startDate, {weekStartsOn: 1});
    const endSunday = endOfWeek(this.endDate, {weekStartsOn: 1});
    const startDate = isAfter(earliestChoreStartDate, startMonday) ? startMonday : earliestChoreStartDate;


    for (let currentDate = startDate; isBefore(currentDate, endSunday); currentDate = addWeeks(currentDate, 1)) {
      currentDate = startOfDay(currentDate);
      const rowData = this.createTableRow(currentDate);

      for (const chore of choreExecutions) {
        if (isEqual(chore.nextExecutionDate, currentDate)) {
          (rowData as any)[chore.nextExecutionMember].push(chore.data.name);
          chore.nextExecutionDate = this.getNextExecutionDateForChore(chore.nextExecutionDate, chore.data.cadenceInWeeks);
          chore.nextExecutionMember = this.getNextExecutionMemberForChore(chore.data, chore.nextExecutionMember);
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

  private calculateNextChoreExecutions() {
    const chores: ChoreExecution[] = [];

    for (const chore of CHORES) {
      const nextExecutionDate = this.getNextExecutionDateForChore(chore.lastExecutedDate, chore.cadenceInWeeks);
      const nextExecutionMember = this.getNextExecutionMemberForChore(chore, chore.lastExecutedMember);

      chores.push({
        data: chore,
        nextExecutionDate,
        nextExecutionMember,
      })
    }

    return chores;
  }

  private getNextExecutionDateForChore(lastExecutedDate: Date, cadenceInWeeks: number): Date {
    const nextExecutionDate = addWeeks(lastExecutedDate, cadenceInWeeks);
    return startOfDay(nextExecutionDate);
  }

  private createTableRow(currentDate: Date) {
    const memberColumns = HOUSEHOLD_MEMBERS
      .reduce((previousValue, currentValue) => ({...previousValue, [currentValue]: []}), {});
    return {
      date: currentDate,
      ...memberColumns,
    };
  }

  private getNextExecutionMemberForChore(chore: Chore, lastExecutedMember: string): string {
    const members = chore.members ?? HOUSEHOLD_MEMBERS;

    const currentMemberIndex = members.indexOf(lastExecutedMember);
    return members[(currentMemberIndex + 1) % members.length];
  }

}
