export interface Chore {
  // Name to display on the plan
  name: string,
  // How often the chore needs to be done
  cadenceInWeeks: number,
  // When it was last executed
  lastExecutedDate: Date,
  // Who executed it last?
  lastExecutedMember: string,
  // If not all household members need to do this task, specify the names of those that do
  members?: string[],
}
