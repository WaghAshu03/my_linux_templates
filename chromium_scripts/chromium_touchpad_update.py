import shutil
from datetime import datetime
from os import getuid, path, system
from random import choices


def get_terminal_columns():
    size = shutil.get_terminal_size()
    return size.columns


def get_formatted_time():
    now = datetime.now()
    formatted_time = now.strftime("%b %d, %-I:%M %p").lower()
    formatted_time = formatted_time.replace("pm", "pm").replace("am", "am")
    return formatted_time


def get_random_string(str_len):
    characters = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
    ]
    return "".join(choices(characters, k=str_len))


directory = f"{path.dirname(path.abspath(__file__))}"


def running_as_root() -> bool:
    return getuid() == 0


if not running_as_root():
    print("Please Run this script with root priviledge")
    exit()

file_paths = [
    "/usr/share/applications/brave-browser.desktop",
]

for file_path in file_paths:
    terminal_columns = get_terminal_columns()
    file_name = file_path.split("/")[-1].split("\\")[-1]

    # print("=" * terminal_columns)
    print(f"Processing: {file_name}\n")

    if path.exists(file_path):
        print(f"-> {file_path} path exist.")

        file_content = ""
        with open(file_path, "r") as f:
            file_content = f.read()
        file_content = file_content.split("\n")

        updated_file_content = []

        for line in file_content:
            if (
                line.startswith("Exec=")
                and "--enable-features=TouchpadOverscrollHistoryNavigation" not in line
            ):
                updated_file_content.append(
                    line + " --enable-features=TouchpadOverscrollHistoryNavigation"
                )
            else:
                updated_file_content.append(line)

        file_content = "\n".join(file_content)
        updated_file_content = "\n".join(updated_file_content)

        if file_content != updated_file_content:
            backup_file_path = f"{directory}/{get_formatted_time()} Backup-{get_random_string(5)}-{file_name}"
            while path.exists(backup_file_path):
                backup_file_path = f"{directory}/Backup|{get_formatted_time()} - {get_random_string(5)} - {file_name}"

            with open(backup_file_path, "w") as f:
                f.write(file_content)
            print(f"-> Created Backup File: {backup_file_path}")

            if system(f"sudo rm {file_path}") == 0:
                print(f"-> Successfully removed old desktop file")
            else:
                print(f"-> Failed to remove old desktop file")
                exit()

            if system("kbuildsycoca5") == 0:
                print(f"-> Updated KDE Plasma")
            else:
                print(f"-> Failed to update KDE Plasma")

            with open(file_path, "w") as f:
                f.write(updated_file_content)
            print(f"-> Updated {file_name}")

            if system("kbuildsycoca5") == 0:
                print(f"-> Updated KDE Plasma")
            else:
                print(f"-> Failed to update KDE Plasma")

        else:
            print("-> No updates needed")
    else:
        print(f"-> {file_path} path do not exist.")
    print()

# print("=" * terminal_columns)
