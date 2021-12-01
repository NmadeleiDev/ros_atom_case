/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package tile

import "math"

/*
Resources
https://oms.wff.ch/calc.htm
https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Go

Same problem! With working solution!
https://gis.stackexchange.com/questions/239496/converting-long-lat-to-tile-of-nasa-gibs-wgs-84-lat-lon-geographic-epsg


Examples:
https://github.com/nasa-gibs/gibs-web-examples
*/

const TILESIZE = 256.0

type Tile struct {
	Zoom int
	Col  int     // TileCol
	Row  int     // TileRow
	Lat  float64 // X axis
	Long float64 // Y axis
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

func NewByColRowZoom(col, row int, zoom int) *Tile {
	t := &Tile{}
	t.Zoom = zoom
	t.Col = col
	t.Row = row
	t.Num2deg()
	return t
}

func (t *Tile) Deg2num() (col int, row int) {
	/*
		Same problem! With working solution!
		  https://gis.stackexchange.com/questions/239496/converting-long-lat-to-tile-of-nasa-gibs-wgs-84-lat-lon-geographic-epsg
	*/
	scale := math.Exp2(float64(t.Zoom))

	col = int((180 + t.Long) / 288 * scale) // max = 2560
	row = int((90 - t.Lat) / 288 * scale)   // max = 1280

	t.Col = col
	t.Row = row

	return
}

func (t *Tile) Num2deg() (lat, long float64) {
	scale := math.Exp2(float64(t.Zoom))

	t.Long = math.Floor(float64(t.Col)*288.0/scale - 180.0)
	t.Lat = math.Floor(-float64(t.Row)*288.0/scale + 90.0)

	long = t.Long
	lat = t.Lat

	return
}

// Google Maps Docs
// func (t *Tile) Deg2num() (x int, y int) {
// 	scale := math.Exp2(float64(t.Zoom))

// 	siny := math.Sin(t.Lat * math.Pi / 180.0)
// 	siny = math.Min(math.Max(siny, -0.9999), 0.9999)

// 	worldX := TILESIZE * (0.5 + t.Long/360.0)
// 	worldY := TILESIZE * (0.5 - math.Log((1+siny)/(1-siny))/(4*math.Pi))

// 	x = int(math.Floor(worldX * scale / TILESIZE))
// 	y = int(math.Floor(worldY * scale / TILESIZE))
// 	return
// }

// OpenSmartMaps Docs
// func (t *Tile) Deg2num() (x int, y int) {
// 	n := math.Exp2(float64(t.Zoom))
// 	x = int(math.Floor((t.Long + 180.0) / 360.0 * n))
// 	if float64(x) >= n {
// 		x = int(n - 1)
// 	}
// 	y = int(math.Floor((1.0 - math.Log(math.Tan(t.Lat*math.Pi/180.0)+1.0/math.Cos(t.Lat*math.Pi/180.0))/math.Pi) / 2.0 * n))
// 	return
// }

// func (t *Tile) Num2deg() (lat float64, long float64) {
// 	n := math.Pi - 2.0*math.Pi*float64(t.Y)/math.Exp2(float64(t.Zoom))
// 	lat = 180.0 / math.Pi * math.Atan(0.5*(math.Exp(n)-math.Exp(-n)))
// 	long = float64(t.X)/math.Exp2(float64(t.Zoom))*360.0 - 180.0
// 	return lat, long
// }
