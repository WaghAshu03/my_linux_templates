import argparse
from random import choice, randint

chr_set = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
num_set = "01234567890123456789"


parser = argparse.ArgumentParser()
parser.add_argument(
    "--len", type=int, default=10, help="Specify the length (default is 10)"
)

args = parser.parse_args()

length = args.len  # Get the value of --len, or default to 10 if not provided

print(choice(chr_set), end="")
for _ in range(length - 1):
    print(choice(chr_set + num_set), end="")
print()
