import getpass
import os

if not os.getuid() == 0:
    print("Please Run this script with root priviledge")
    exit()

# Get the username from the SUDO_USER environment variable
username = os.getenv("SUDO_USER")

# If running with sudo, this variable will be set, otherwise fallback to the current user
if not username:
    # If not running as sudo, use the effective user
    import pwd

    uid = os.geteuid()
    username = pwd.getpwuid(uid).pw_name


def remove_sudo_privileges(folder_path):
    """
    Recursively removes elevated privileges (sudo ownership) from files owned by root in a directory
    and changes their ownership to the original user running the script.

    Args:
        folder_path (str): The path to the folder to process.
    """
    # Get the original (non-root) user running the script
    current_user = getpass.getuser()
    try:
        for root, dirs, files in os.walk(folder_path):
            # Check and change ownership and permissions of files owned by root
            for file in files:
                file_path = os.path.join(root, file)
                try:
                    # Check if the file is owned by root (UID 0)
                    file_stat = os.stat(file_path)
                    if file_stat.st_uid == 0:  # root owns the file
                        # Change ownership to the original user (not root)
                        if not os.system(
                            f"sudo chown {username}:{username} {file_path} && sudo chmod 666 {file_path}"
                        ):
                            print(
                                "✅ Changed ownership of",
                                file_path,
                                f"from root to {username}",
                            )
                        else:
                            print("❌ Error Changing ownership of", file_path)
                except PermissionError:
                    print(
                        f"❌ PermissionError: Could not change ownership or permissions for {file_path}."
                    )
                except Exception as e:
                    print(
                        f"❌ Error while changing ownership or permissions for {file_path}: {e}"
                    )

            # Check and change ownership and permissions of directories owned by root
            for dir in dirs:
                dir_path = os.path.join(root, dir)

                try:
                    # Check if the directory is owned by root (UID 0)
                    dir_stat = os.stat(dir_path)
                    if dir_stat.st_uid == 0:  # root owns the directory
                        # Change ownership to the original user (not root)
                        if not os.system(
                            f"sudo chown {username}:{username} {dir_path} && sudo chmod 666 {dir_path}"
                        ):
                            print(
                                "✅ Changed ownership of",
                                dir_path,
                                f"from root to {username}",
                            )
                        else:
                            print("❌ Error Changing ownership of", dir_path)
                except PermissionError:
                    print(
                        f"❌ PermissionError: Could not change ownership or permissions for {dir_path}."
                    )
                except Exception as e:
                    print(
                        f"❌ Error while changing ownership or permissions for {dir_path}: {e}"
                    )

    except Exception as main_error:
        print(f"An error occurred: {main_error}")


# Example usage
folder_path = f"{os.path.dirname(os.path.abspath(__file__))}"

if os.path.exists(folder_path):
    remove_sudo_privileges(folder_path)
else:
    print(f"❌ {folder_path} does not exist")
