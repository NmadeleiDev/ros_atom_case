from typing import Tuple


def convert_coords(coords: tuple, coords_system: str) -> Tuple[float, float]:
    return coords[0], coords[1]