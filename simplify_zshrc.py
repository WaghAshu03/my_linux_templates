from os import path

zshrc = ""

if not path.exists("./.zshrc_backup"):
    with open(f"{path.expanduser("~")}/.zshrc") as f:
        zshrc = f.read()
    with open(".zshrc_backup", "w") as f:
        f.write(zshrc)
else:
    raise ValueError("Err: ./.zshrc_backup already exist")
    exit(0)


def remove_consecutive_empty_strings(lst):
    result = []
    skip = False

    for item in lst:
        if item == "":
            if not skip:
                result.append(item)
                skip = True
        else:
            result.append(item)
            skip = False

    return result


zshrc = zshrc.split("\n")
new_zshrc = []
for line in zshrc:
    if not line.startswith("#"):
        if line.strip("") == "":
            new_zshrc.append(line.strip())
        else:
            new_zshrc.append(line)

new_zshrc = "\n".join(remove_consecutive_empty_strings(new_zshrc))

print(new_zshrc)
with open(".zshrc", "w") as f:
    f.write(new_zshrc)
