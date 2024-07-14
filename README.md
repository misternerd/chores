# Chores

This is a simple Angular app to manage household chores. In a [configuration file](src/chores.config.ts), you specify the members of your household as well
as the chores that need to be done, including their cadence. Then, you start the Angular app and select a date range for which to display the plan. The app will
display a table, which you can print and hang on your fridge.

Chores are specified on a weekly level and the plan also shows weeks (nothing more granular).


## Getting started

1. Run `npm install`
2. Copy the [sample configuration file](src/example-chores.config.ts) to `src/chores.config.ts` and set up household members and chores
3. Run `ng serve --open` to start the Angular app
