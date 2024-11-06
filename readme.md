# Template Detail

Save this repo in ~/Templates

1. [update_linux_script.py](./update_linux_script.py): Run array of scripts in serial.
2. [chromium_scripts](./chromium_scripts)

   - [chromium_touchpad_update.py](./chromium_scripts/chromium_touchpad_update.py): fix chromium browsers, i.e. brave's touchpad gesture after [update_linux_script.py](./update_linux_script.py)

3. [neofetch_images](./neofetch_images/): collection of images and neofetch script
   - [neofetch_images/neofetch_image_script.py](./neofetch_images/neofetch_image_script.py): script that prints neofetch with images in this folder instead of ASCII art
4. [simplify_zshrc.py](./simplify_zshrc.py): script to remove comments from .zshrc to make it minimal
5. [.zshrc](./.zshrc): backup file

...

# Issues for later

1. delete neofetch_images folder in ~/Templates and restore it using update_user_script.py
2. now try to run neofetch script, it will give error while writing to .history or .done, as update_user_script.py runs as root and now restored neofetch_images folder can only be edited by using root priviledges, same happens when you try to delete chromium backup files
3. you need to redo everything, only use sudo for important task
4. Also text color code is redundant so need to fix it too

possible solution

```python
import subprocess

def run_command(command, use_sudo=False):
    """Helper function to run a shell command and return its output."""
    if use_sudo:
        command = ["sudo"] + command  # Prefix the command with sudo
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return result.stdout.strip(), result.stderr.strip(), result.returncode
```
