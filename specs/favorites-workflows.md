# Favorites Workflows

Seed file: `e2e/seed.spec.ts`

## Scenario 1: Add a show to favorites

Preconditions:
- Fresh E2E database
- Search fixtures include `Star Trek: Strange New Worlds`

Arrange:
- The user starts on `/calendar`

Act:
1. Open the add-show panel
2. Search for `Strange New Worlds`
3. Add the show from the results
4. Open Favorites

Assert:
1. The saved show is visible in Favorites
2. The workflow succeeds without live API calls

## Scenario 2: Remove a show from favorites

Preconditions:
- Fresh E2E database
- One favorite show already exists

Arrange:
- The user starts on `/calendar`

Act:
1. Open the saved show from Favorites
2. Choose `Delete Series`
3. Confirm the removal

Assert:
1. The user returns to Favorites
2. A success message confirms the removal
3. The removed show is no longer visible in Favorites
