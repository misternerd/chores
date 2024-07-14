import {Chore} from "./types/chore.type";

export function createChore(name: string, cadenceInWeeks: number, lastExecutedDate: Date, lastExecutedMember: string, members?: string[]): Chore {

	return {
		name,
		cadenceInWeeks,
		lastExecutedDate,
		lastExecutedMember,
		members,
	};
}
