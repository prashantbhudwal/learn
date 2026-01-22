# Unix Permissions & chmod

`chmod` (Change Mode) is the command used to manage the security "bits" of a file.

## 1. The "Big 3" Permissions
*   **`r` (Read - 4 points):** Ability to see the contents of a file or list the files in a directory.
*   **`w` (Write - 2 points):** Ability to modify or delete a file.
*   **`x` (Execute - 1 point):** Ability to run a file as a program/process.

## 2. The Permission String (`ls -l`)
Example: `-rw-r--r--`
*   **Char 1:** Type (`-` = file, `d` = directory).
*   **Chars 2-4:** **User (Owner)** permissions.
*   **Chars 5-7:** **Group** permissions.
*   **Chars 8-10:** **Others (World)** permissions.

## 3. Shorthand Methods
### The "Human" Way (Symbolic)
*   `u` (User), `g` (Group), `o` (Others), `a` (All).
*   `chmod +x`: Add execute for everyone.
*   `chmod u+w,go-w`: Give owner write access, remove it for everyone else.

### The "Math" Way (Octal)
Calculate the sum for each tier (User, Group, World):
*   **7 (4+2+1):** Full access (`rwx`).
*   **6 (4+2+0):** Read & Write (`rw-`).
*   **5 (4+0+1):** Read & Execute (`r-x`).
*   **4 (4+0+0):** Read only (`r--`).
*   **0 (0+0+0):** No access (`---`).

Example: `chmod 644` (Owner: RW, Group: R, World: R).

## 4. The Root User (God Mode)
*   **Bypass:** Root ignores `r` and `w` bits. It can read and write to anything regardless of permissions.
*   **The "At Least One" Rule:** Root cannot execute a file if **zero** execute bits are set. This is a safety feature to prevent running data as code.
*   **Loopholes:** Root can always run `chmod +x` or bypass the bit by calling an interpreter directly (e.g., `bash script.sh` instead of `./script.sh`).

## 5. Security Concept: "Safety Switch"
Unix treats all new files as data by default. Even if you create a script, the OS won't trust it as "Software" until you manually toggle the `x` bit.
