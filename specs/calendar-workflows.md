# Calendar Workflows

Seed file: `e2e/seed.spec.ts`

## Scenario 1: Navigate between month and year views

Preconditions:
- Fresh E2E database
- One favorite show exists with an episode airing in May 2022

Arrange:
- The user starts on `/calendar?mode=month&date=2022-05-05`

Act:
1. Open the month view for May 2022
2. Click the `May 2022` heading to zoom out to the year overview
3. Choose the `May` month cell from the 2022 overview

Assert:
1. The year overview for `2022` is shown after zooming out
2. The user returns to the `May 2022` month view after selecting May
3. The saved episode is visible on the calendar in the returned month view

## Scenario 2: Mark a calendar day as watched

Preconditions:
- Fresh E2E database
- One favorite show exists with an episode airing on 2022-05-05

Arrange:
- The user starts on `/calendar?mode=week&date=2022-05-05`

Act:
1. Open the week containing 2022-05-05
2. Use the day-level `Mark day as watched` action

Assert:
1. The week view refreshes successfully
2. The episode remains visible in the week view
3. The episode shows watched state in the calendar UI

## Scenario 3: Hide a series from the calendar from the series overview

Preconditions:
- Fresh E2E database
- One favorite show already exists

Arrange:
- The user starts on `/calendar`
- The user opens the saved show from Favorites

Act:
1. Use the `Hide from calendar` control in the series overview

Assert:
1. The series overview stays open
2. A success toast confirms the visibility change
3. The control text changes to `Show on calendar`

## Scenario 4: Mark a calendar day as downloaded

Preconditions:
- Fresh E2E database
- One favorite show exists with an episode airing on 2022-05-05

Arrange:
- The user starts on `/calendar?mode=week&date=2022-05-05`

Act:
1. Use the day-level `Mark day as downloaded` action

Assert:
1. The calendar refreshes successfully
2. A success message confirms the day-level download update
3. The episode remains visible in the refreshed view
