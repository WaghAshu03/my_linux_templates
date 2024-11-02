import glob
import os


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

for i in range(len(images_available) * 2):
    os.system(f"python {directory}/fastfetch_image_script.py")
    print("\n##### CACHING FASTFETCH #####")
