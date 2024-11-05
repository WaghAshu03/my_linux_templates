import os
import subprocess

if not os.getuid() == 0:
    print("Please Run this script with root priviledge")
    exit()


REPO_PATH = f"{os.path.dirname(os.path.abspath(__file__))}"

if not os.path.exists(REPO_PATH):
    print("Invalid script path:", REPO_PATH)
    exit(0)


def run_command(command):
    """Helper function to run a shell command and return its output."""
    result = subprocess.run(
        command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )
    return result.stdout.strip(), result.stderr.strip(), result.returncode


def check_for_updates():
    """Checks if there are any updates in the remote repository."""
    # Fetch the latest updates from the remote
    _, fetch_err, fetch_code = run_command(["git", "-C", REPO_PATH, "fetch", "--all"])
    if fetch_code != 0:
        print(f"❌ Error during fetch: {fetch_err}")
        return False

    # Check if the local main branch is behind the remote
    local_commit, _, _ = run_command(
        ["git", "-C", REPO_PATH, "rev-parse", "main"]
    )  # Replace 'main' if your branch is different
    remote_commit, _, _ = run_command(
        ["git", "-C", REPO_PATH, "rev-parse", "origin/main"]
    )  # Replace 'main' with the actual branch

    # Compare local and remote commits
    return local_commit != remote_commit


def update_repository():
    """Forces the local repository to match the remote repository."""
    _, reset_err, reset_code = run_command(
        ["git", "-C", REPO_PATH, "reset", "--hard", "origin/main"]
    )
    if reset_code != 0:
        print(f"❌ Error during reset: {reset_err}")
    else:
        print("✅ Repository successfully updated to match remote.")


if __name__ == "__main__":
    if check_for_updates():
        print("✅ New updates found. Pulling changes...")
        update_repository()
    else:
        print("✅ No updates available. Repository is already up-to-date.")
