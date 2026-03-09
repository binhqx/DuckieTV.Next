# Backup And Restore Workflows

Seed file: `e2e/seed.spec.ts`

## Scenario 1: Open backup settings

Preconditions:
- Fresh E2E database

Arrange:
- The user starts on `/calendar`

Act:
1. Open the Settings panel
2. Open the `Backup` settings section

Assert:
1. The backup section heading is visible
2. The import section is visible
3. The file picker for restore is available

## Scenario 2: Restore a backup file into an empty library

Preconditions:
- Fresh E2E database
- A local backup fixture is available with one show to restore
- E2E HTTP fakes include all Trakt and TMDB data needed for that show

Arrange:
- The user starts on `/calendar`
- The user opens the `Backup` settings section

Act:
1. Choose the backup file to import
2. Confirm the restore action
3. Wait for the restore to complete
4. Open Favorites

Assert:
1. The restore request succeeds
2. The restore finishes without using live external APIs
3. The restored show appears in Favorites

## Scenario 3: Restore with wipe replaces the current library

Preconditions:
- Fresh E2E database
- One existing favorite show is already saved
- A local backup fixture is available with a different show
- Backend wipe behavior is implemented

Arrange:
- The user starts on `/calendar`
- The user opens the `Backup` settings section

Act:
1. Enable `Wipe database before import`
2. Choose the backup file to import
3. Confirm the restore action
4. Wait for the restore to complete
5. Open Favorites

Assert:
1. The previous favorite show is gone
2. The restored show is visible
3. The final library matches the imported backup instead of a merge
