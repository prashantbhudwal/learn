# fd Cliffnotes

## Basic Usage
- `fd pattern` : Search for files/dirs matching regex pattern.
- `fd -g 'glob'` : Search using glob patterns (e.g., `*.js`).
- `fd pattern path` : Search starting at a specific path.

## Common Flags
- `-H`, `--hidden` : Include hidden files/dirs.
- `-I`, `--no-ignore` : Ignore `.gitignore` rules.
- `-i`, `--ignore-case` : Force case-insensitive search.
- `-e`, `--extension` : Filter by file extension (e.g., `-e md`).
- `-t`, `--type` : Filter by type (`f` for file, `d` for directory).
- `-d`, `--max-depth` : Limit search depth.

## Metadata & Execution
- `-S`, `--size` : Filter by size (e.g., `-S +1m`, `-S -10k`).
- `--changed-within` : Filter by modification time (e.g., `1d`, `1w`).
- `-x`, `--exec` : Run a command for each result (e.g., `-x wc -l {}`).
- `-X`, `--exec-batch` : Run a command once with all results.

## Placeholders
- `{}` : Full path.
- `{/}` : Filename only.
- `{.}` : Path without extension.
