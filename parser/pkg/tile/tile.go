/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package tile

import (
	"math"
)

/*
Resources
https://oms.wff.ch/calc.htm
https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Go
*/

type Tile struct {
	Zoom int
	X    int // TileCol
	Y    int // TileRow
	Lat  float64
	Long float64
}

type Conversion interface {
	Deg2num(t *Tile) (x int, y int)
	Num2deg(t *Tile) (lat float64, long float64)
}

func NewByLatLong(lat, long float64, zoom int) (t *Tile) {
	t.Lat = lat
	t.Long = long
	t.Zoom = zoom
	return
}

func (t *Tile) Deg2num() (x int, y int) {
	n := math.Exp2(float64(t.Zoom))
	x = int(math.Floor((t.Long + 180.0) / 360.0 * n))
	if float64(x) >= n {
		x = int(n - 1)
	}
	y = int(math.Floor((1.0 - math.Log(math.Tan(t.Lat*math.Pi/180.0)+1.0/math.Cos(t.Lat*math.Pi/180.0))/math.Pi) / 2.0 * n))
	return
}

func (t *Tile) Num2deg() (lat float64, long float64) {
	n := math.Pi - 2.0*math.Pi*float64(t.Y)/math.Exp2(float64(t.Zoom))
	lat = 180.0 / math.Pi * math.Atan(0.5*(math.Exp(n)-math.Exp(-n)))
	long = float64(t.X)/math.Exp2(float64(t.Zoom))*360.0 - 180.0
	return lat, long
}
