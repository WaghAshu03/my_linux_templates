import glob
import os
import sys
import time

start_time = time.time()


def print_at_bottom(text):
    # Get the height of the terminal
    terminal_height = os.get_terminal_size().lines
    # Move the cursor to the bottom row
    sys.stdout.write(
        f"\033[{terminal_height};1H\0"
    )  # ANSI escape to move to the bottom row
    # Print the text
    print(text, end="\r")


# Example usage
# i = 0
# while True:
#     os.system("clear")
#     print("This is some previous text.", i)
#     print_at_bottom(f"Hello, bottom row! {i}")
#     i += 1
#     time.sleep(0.5)

# exit(0)


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


def get_image_paths(directory):
    # Define the patterns for image file extensions
    image_patterns = ["*.png", "*.jpg", "*.jpeg"]
    image_paths = []

    # Iterate over the patterns and add matching files to the list
    for pattern in image_patterns:
        # Use glob to find files matching the pattern
        for filepath in glob.glob(os.path.join(directory, pattern)):
            image_paths.append(os.path.abspath(filepath))

    return image_paths


directory = f"{os.path.dirname(os.path.abspath(__file__))}"

images_available = get_image_paths(directory)

if os.path.exists(os.path.expanduser("~/.cache/fastfetch/images")):
    os.system(f"rm -r {os.path.expanduser('~/.cache/fastfetch/images')}")

if os.path.exists(f"{directory}/.done"):
    os.system(f"rm {directory}/.done")

if os.path.exists(f"{directory}/.history"):
    os.system(f"rm {directory}/.history")

for i in range(len(images_available) * 3):
    percent = int((i + 1) / (len(images_available) * 3) * 100)
    columns = os.get_terminal_size().columns - 26
    filled_columns = int(columns * percent / 100)
    os.system(f"python {directory}/fastfetch_image_script.py")

    print_at_bottom(
        f"CACHING FASTFETCH [{'#' * filled_columns}{' ' * (columns - filled_columns)}] {percent}%"
    )
    # print()

print(
    f"\n{return_color_and_style("Successfully Cached fastfetch images", "#0f0", "bold")} | {return_color_and_style("Time Taken(caching):", "#188CFD", "bold")} {round((time.time() - start_time) * (10**3), 2)}ms"
)
