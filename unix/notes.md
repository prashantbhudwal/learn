# Unix & Networking Exploration Graph

*   **Network Path Discovery (`traceroute`)**
    *   **Finding:** Traces packets through "hops" (routers).
    *   **Answer:** `* * *` represents firewalls or timeouts, not necessarily a broken connection.
*   **The Fullstack Toolbox**
    *   **DNS (`dig`):** Translates domains to IPs.
    *   **HTTP (`curl -v`):** Inspects the "handshake" and headers.
    *   **Sockets (`nc`):** Manual text-based conversation with a server port.
*   **Deep Dive: `lsof` (List Open Files)**
    *   **The "Everything is a File" Axiom**
        *   **Answer:** Processes interact with hardware, disks, and networks via **File Descriptors (FDs)**.
        *   **Standard FDs:** `0` (stdin), `1` (stdout), `2` (stderr).
        *   **Network FDs:** Usually `3u` (Read/Write access).
    *   **The "Ghost File" Lifecycle**
        *   **Answer:** `rm` only "unlinks" a filename. If a process has an open FD, the data remains on disk and the process keeps writing until it is terminated.
*   **Process Management & Inspection**
    *   **`ps` vs `lsof`**
        *   **`ps`:** The "Employee Roster" — Inspects the **program** (CPU, Arguments, Start Time).
        *   **`lsof`:** The "Keycard Log" — Inspects the **resources** (Ports, File Locks, Working Directory).
    *   **Advanced Filtering**
        *   **Problem:** `ps | grep` often catches itself and unrelated noise.
        *   **Solution (`pgrep`):**
            *   `pgrep node`: Exact executable match (Clean).
            *   `pgrep -f node`: Full command string match (Noisy).
    *   **The "Pro" Workflow**
        *   **Command:** `ps -ww -fp $(pgrep node)`
        *   **Answer:** Uses **Command Substitution** to feed clean PIDs into a high-width `ps` view for isolated analysis.
