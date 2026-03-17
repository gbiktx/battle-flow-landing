# Blog Migration Fix Plan

## Objective
Restore the full content of all blog articles across all 10 supported languages. During the initial migration, the actual article text was inadvertently replaced with the placeholder `... (full content from read)`. This plan will systematically replace that placeholder with the original content from the legacy Jekyll data files without corrupting any existing Astro components, styles, or frontmatter.

## Scope & Impact
- **Target Files:** `src/content/blog/**/*.md`
- **Source Files:** `_data/posts/**/*.yml` (or `backup/_data/posts/**/*.yml` depending on where the original YAMLs are currently located).
- **Impact:** Blog posts will display their full, localized content instead of truncated placeholders.
- **Constraints:** Do not modify the existing Astro project structure, components, or styles. Do not stage or commit any changes to version control.

## Implementation Steps

### Step 1: Identify Affected Files
- Use `grep_search` to find all files in `src/content/blog/` containing the exact placeholder `... (full content from read)`.

### Step 2: Map and Retrieve Original Content
For each affected file:
1. Identify the language code (e.g., `de`, `fr`, `zh-Hans`) and the post slug (e.g., `laic-2025-meta-guide-tournament-analysis`).
2. Read the corresponding original YAML file from `_data/posts/<slug>/<lang>.yml`.
3. Extract the full markdown text from the `content` field in the YAML file.

### Step 3: Surgical Replacement
- Use the `replace` tool to specifically target the `... (full content from read)` line in each affected `.md` file and replace it with the extracted full markdown content. This preserves the newly added Astro frontmatter (title, description, date, etc.).

### Step 4: Final Validation
- Run a final `grep_search` across `src/content/blog/` to definitively prove no placeholders remain.
- Execute `npm run build` to ensure the markdown renders without compilation errors and the static site generates successfully.

## Migration & Rollback
- Since changes are uncommitted, any accidental corruption can be rolled back using `git checkout -- src/content/blog/` to revert the markdown files to their current state before applying a corrected replacement.