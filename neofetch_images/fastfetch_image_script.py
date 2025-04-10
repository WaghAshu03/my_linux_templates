import glob
import hashlib
import json
import os
import time
from random import choice

# Start the timer
start_time = time.time()
# Look for environment variables containing "VSCODE"
# if "vscode" in json.dumps(dict(os.environ)).lower():
if any("VSCODE" in key for key in os.environ):
    exit(0)


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


def save_list_to_json(file_path, data_list):
    """
    Saves a list to a JSON file.

    :param file_path: Path to the JSON file.
    :param data_list: List to be saved in the JSON file.
    """
    with open(file_path, "w") as file:
        json.dump(data_list, file)


def load_list_from_json(file_path):
    """
    Loads a list from a JSON file. If the file does not exist or is empty,
    returns an empty list.

    :param file_path: Path to the JSON file.
    :return: List loaded from the JSON file or an empty list if the file does not exist or is empty.
    """
    if not os.path.exists(file_path) or os.stat(file_path).st_size == 0:
        return []

    with open(file_path, "r") as file:
        return json.load(file)


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


def generate_image_fingerprint(image_path):
    # Read only a portion of the file to minimize time expense
    with open(image_path, "rb") as file:
        # Read the first 1024 bytes for hashing
        file_sample = file.read(1024)

        # Get file metadata (like size in bytes)
        # file_stat = file.stat()
        # file_metadata = f"{file_stat.st_size}{file_stat.st_mtime}"

        # Concatenate metadata and sample for a unique fingerprint
        fingerprint_data = f"{file_sample}"

        # Generate MD5 hash of the combined data
        fingerprint = hashlib.md5(fingerprint_data.encode()).hexdigest()

    return fingerprint


# Example usage:
directory = f"{os.path.dirname(os.path.abspath(__file__))}"
images_available = get_image_paths(directory)

if len(images_available) == 0:
    os.system("fastfetch")
    print(
        f"\n{return_color_and_style('Error:', '#f00', 'bold')} No fastfetch images found at {directory}\n"
    )
    exit(0)

for i in range(len(images_available)):
    images_available[i] = (
        f"{images_available[i]}/{generate_image_fingerprint(images_available[i])}"
    )

images_history = load_list_from_json(f"{directory}/.history.json")
done_images = load_list_from_json(f"{directory}/.done.json")
cache_fastfetch = False

# check if there is any changes in images
# if there is then reseting and starting new


if sorted(images_available) != sorted(images_history):
    done_images = []
    cache_fastfetch = True
    if os.path.exists(os.path.expanduser("~/.cache/fastfetch/images")):
        os.system(f"rm -r {os.path.expanduser('~/.cache/fastfetch/images')}")

# Saving New Images to History
save_list_to_json(f"{directory}/.history.json", images_available)

# Removing all the done images so only active images are filtered
images_active = []

if sorted(done_images) == sorted(images_available):
    temp = []

    if len(done_images) > 2:
        for i in range(1, int(len(done_images) / 2.5)):
            if len(done_images) >= i:
                temp.append(done_images[-i])
    done_images = temp


for image in images_available:
    if image not in done_images:
        images_active.append(image)


# Selecting Random Image from active Images saving it as done image
selected_image = choice(images_active)

done_images.append(selected_image)
save_list_to_json(f"{directory}/.done.json", done_images)

selected_image = selected_image.split("/")
selected_image.pop()
selected_image = "/".join(selected_image)
script_time = round((time.time() - start_time) * (10**3), 2)

os.system(
    f'clear && fastfetch --logo "{selected_image}" --logo-type kitty --logo-width 46'
)

print(
    f'\n{return_color_and_style("Image:", "#188CFD", "bold")}{selected_image.split("/")[-1]} | {return_color_and_style("Done:", "#188CFD", "bold")} {len(done_images)}/{len(images_available)}',
    end=" | ",
)
print(
    f'{return_color_and_style("Time Taken:", "#188CFD", "bold")} {"{"}fastfetch: {round(round((time.time() - start_time) * (10**3), 2) - script_time, 2)}ms, script: {script_time}ms, total: {round((time.time() - start_time) * (10**3), 2)}ms{"}"}\n',
)

if cache_fastfetch:
    os.system(f"python {directory}/cache_fastfetch.py")
