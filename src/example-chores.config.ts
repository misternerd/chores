import {Chore} from "./types/chore.type";
import {createChore} from "./util";

export const HOUSEHOLD_MEMBERS: Array<string> = ['Alice', 'Bob'];

export const CHORES: Array<Chore> = [
	createChore('Trash', 1, new Date(2024, 0, 1), 'Alice'),
	createChore('Wash Car', 2, new Date(2024, 0, 2), 'Bob'),
];
