from os import get_terminal_size, getenv, getuid, path, system


def running_as_root() -> bool:
    return getuid() == 0


def return_colored_text(string, color):
    # Validate color
    if not isinstance(color, str):
        raise ValueError("Color must be a string.")

    color = color.lower()

    if len(color) not in (4, 7) or not color.startswith("#"):
        raise ValueError(
            f"""Text Color: Invalid color format. 

Must be in the form #RGB or #RRGGBB."""
        )

    # Expand shorthand color codes (e.g., #f0f -> #ff00ff)
    if len(color) == 4:
        color = f"#{color[1]*2}{color[2]*2}{color[3]*2}"

    # Check if the color is within valid hex color range
    if not (0x000000 <= int(color[1:], 16) <= 0xFFFFFF):
        raise ValueError("Color value must be between #000000 and #ffffff.")

    # Print the string in the given color (this works in terminals that support ANSI escape codes)
    return f"\033[38;2;{int(color[1:3], 16)};{int(color[3:5], 16)};{int(color[5:7], 16)}m{string}\033[0m"


def return_styled_text(text, style):
    # Validate color
    if not isinstance(style, str):
        raise ValueError("Style must be a string.")

    style = style.lower()

    if style == "none":
        return text

    styles = {
        "bold": "\033[1m",
        "italic": "\033[3m",
        "underline": "\033[4m",
        "reset": "\033[0m",
    }

    # Check if the provided style is valid
    if style not in styles:
        raise ValueError(
            f"Invalid style. Available styles are: {', '.join(styles.keys())}"
        )

    # Apply the style and print the text
    styled_text = f"{styles[style]}{text}{styles['reset']}"
    return styled_text


def return_color_and_style(string="", color="#fff", style="none"):
    string = return_colored_text(string, color)
    if isinstance(style, str):
        string = return_styled_text(string, style)
    elif isinstance(style, list):
        for i in style:
            string = return_styled_text(string, i)

    return string


if not running_as_root():
    print("Please Run this script with root priviledge")
    exit()

directory = f"{path.dirname(path.abspath(__file__))}"

scripts = [
    "sudo dnf update && sudo dnf upgrade",
    f"sudo python {directory}/chromium_scripts/chromium_touchpad_update.py",
    f"python {path.join(path.expanduser(f"~{getenv('SUDO_USER')}"), "Templates/update_user_scripts.py")}",
]


for i, script in enumerate(scripts):
    if i != 0:
        print("\n")
    else:
        print()

    print(return_color_and_style("Running script    :", "#188CFD", "bold"), script)
    print("=" * get_terminal_size().columns)
    if system(script) != 0:
        print("Failed to execute script:", script)
        exit(1)

print("=" * get_terminal_size().columns)
usr_input = input("Want to reboot? (y/N): ")

if usr_input == "y" or usr_input == "Y":
    system("reboot")
