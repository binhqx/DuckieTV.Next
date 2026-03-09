# Specs

This directory stores human-readable Playwright test plans for DuckieTV.Next.

Conventions for this repository:

- Use `e2e/seed.spec.ts` as the seed file unless a scenario needs a more specialized setup.
- Assume a blank isolated database prepared by `scripts/e2e-server.sh`.
- Assume all browser requests include `X-DuckieTV-E2E: 1` through `playwright.config.mjs`.
- Do not plan scenarios that depend on live Trakt, TMDB, or torrent-client servers unless the spec says so explicitly.
- Prefer flows that start at `/calendar`, open side panels, and verify visible UI state rather than internal implementation details.

Recommended plan sections:

1. Scenario title
2. Seed file
3. Preconditions
4. Step-by-step actions
5. Expected outcomes

## Test Writing Standard

Generated and handwritten Playwright tests should use `AAA` comments:

- `Arrange`: what state the user starts from
- `Act`: what the user does
- `Assert`: what the user expects to see

Write these comments in product language. Focus on the user flow and visible outcome, not implementation details like locator strategy unless a selector workaround needs an explicit note.
