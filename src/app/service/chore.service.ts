import {Injectable} from '@angular/core';
import {Chore} from "../../types/chore.type";
import {addWeeks, startOfDay} from "date-fns";
import {HOUSEHOLD_MEMBERS} from "../../chores.config";


@Injectable({
  providedIn: 'root',
})
export class ChoreService {

  getNextExecutionDateAndMemberForChore(chore: Chore) {
    const nextExecutionDate = this.getNextExecutionDateForChore(chore, chore.lastExecutedDate);
    const nextExecutionMember = this.getNextExecutionMemberForChore(chore, chore.lastExecutedMember);

    return {nextExecutionDate, nextExecutionMember};
  }

  getNextExecutionDateForChore(chore: Chore, lastExecutedDate: Date): Date {
    const nextExecutionDate = addWeeks(lastExecutedDate, chore.cadenceInWeeks);
    return startOfDay(nextExecutionDate);
  }

  getNextExecutionMemberForChore(chore: Chore, lastExecutedMember: string): string {
    const members = chore.members ?? HOUSEHOLD_MEMBERS;
    const currentMemberIndex = members.indexOf(lastExecutedMember);

    return members[(currentMemberIndex + 1) % members.length];
  }

}
