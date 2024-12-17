import re


def format_minutes_to_time(minutes):
    """
    Convert total minutes into a formatted string like "1h 20m".

    Args:
        minutes (int): Total minutes.

    Returns:
        str: Formatted time string.

    Raises:
        ValueError: If minutes is negative.
    """
    if minutes < 0:
        raise ValueError("Minutes cannot be negative.")

    hours = minutes // 60
    remaining_minutes = minutes % 60

    result = []
    if hours > 0:
        result.append(f"{hours}h")
    if remaining_minutes > 0 or hours == 0:
        result.append(f"{remaining_minutes}m")

    return " ".join(result)


def total_minutes_from_time_strings(time_strs):
    time_strs = time_strs.replace("+", " ")
    """
    Calculate the total minutes from a string containing multiple time values.

    Args:
        time_strs (str): A string with time values separated by spaces (e.g., "1h20m 1h10m 1h30m").

    Returns:
        int: Total minutes.

    Raises:
        ValueError: If any time value is not in the correct format.
    """

    def parse_time_to_minutes(time_str):
        """Helper function to parse a single time string."""
        import re

        pattern = r"^(?:(\d+)h)?\s*(?:(\d+)m)?$"
        match = re.match(pattern, time_str)
        if not match:
            raise ValueError(f"Invalid format for time string: '{time_str}'")
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        return hours * 60 + minutes

    # Split the input string by spaces and calculate total minutes
    time_strings = time_strs.split()
    total_minutes = sum(parse_time_to_minutes(time) for time in time_strings)

    return total_minutes


while True:
    total_min = total_minutes_from_time_strings(input(f">>> "))

    print(format_minutes_to_time(total_min))
    print("-" * 20)
    print()


