/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package service

import (
	"bytes"
	"fmt"
	"html/template"
	"net/http"
	"net/url"
	"os"
	"runtime"
	"strings"
	"sync"
	"time"

	"github.com/NmadeleiDev/ros_atom_case/parser/pkg/db"
	"github.com/NmadeleiDev/ros_atom_case/parser/pkg/tile"
	"github.com/dustin/go-humanize"
	"github.com/panjf2000/ants/v2"
	"github.com/sirupsen/logrus"
)

type GeoService struct {
	Name         string
	WMTStemplate string

	DB *db.DB
}

// https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE=&TILEMATRIXSET=250m&TILEMATRIX=6&TILEROW=13&TILECOL=36&FORMAT=image%2Fjpeg&TIME=2012-07-09
/* Resources
https://www.programmableweb.com/news/top-10-satellites-apis/brief/2020/06/14
*/

func New() *GeoService {
	os.MkdirAll("/images", 0664)
	db := db.New()
	db.CreateTable()
	return &GeoService{
		WMTStemplate: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={{.Layer}}&STYLE=&TILEMATRIXSET={{.Matrix}}&TILEMATRIX={{.Zoom}}&TILEROW={{.TileY}}&TILECOL={{.TileX}}&FORMAT={{.Format}}&TIME={{.TimeShootStr}}",

		DB: db,
	}
}

func (gs *GeoService) Run() {
	// gs.Check()
	gs.GetMexicanSpoil()
}

func (gs *GeoService) GetMexicanSpoil() {
	type Spot struct {
		Lat  float64
		Long float64
	}
	// 29.778360, -89.529564 LEFTUP
	// 28.345015, -87.101586 RIGHTDOWN
	type Square struct {
		X    int
		Y    int
		Zoom int
	}

	mexicanSpoilLeftUpSpot := &Spot{
		Lat:  29.778360,
		Long: -89.529564,
	}
	mexicanSpoilRightDown := &Spot{
		Lat:  28.345015,
		Long: -87.101586,
	}

	var wg sync.WaitGroup

	getImage := func(i interface{}) {
		s := i.(Square)
		defer wg.Done()
		oneTile := tile.NewByColRowZoom(s.X, s.Y, s.Zoom)
		spoilTimeStart, _ := time.Parse("2006-01-02", "2010-04-21")
		spoilTimeEnd, _ := time.Parse("2006-01-02", "2010-07-15")
		gs.GetBestImageForTimeRange(spoilTimeStart, spoilTimeEnd, oneTile)
	}

	p, _ := ants.NewPoolWithFunc(50, func(i interface{}) {
		getImage(i)
	})
	defer p.Release()

	// X Y matrix on ZOOM
	zoom := 7
	xMin, xMax, yMin, yMax := tile.GetMinMaxTilesFromRectangle(mexicanSpoilLeftUpSpot.Lat, mexicanSpoilLeftUpSpot.Long, mexicanSpoilRightDown.Lat, mexicanSpoilRightDown.Long, zoom)
	logrus.Infof("xMin: %v\n", xMin)
	logrus.Infof("xMax: %v\n", xMax)
	logrus.Infof("yMin: %v\n", yMin)
	logrus.Infof("yMax: %v\n", yMax)

	for x := xMin; x <= xMax; x++ {
		for y := yMin; y <= yMax; y++ {
			wg.Add(1)
			_ = p.Invoke(Square{X: x, Y: y, Zoom: zoom})
		}
	}
	logrus.Infof("running goroutines: %d\n", p.Running())
	go func() {
		for {
			<-time.After(time.Second * 15)
			logrus.Infof("runtime.NumGoroutine(): %v\n", runtime.NumGoroutine())
		}
	}()
	wg.Wait()

}

func (gs *GeoService) Check() {
	type Square struct {
		X    int
		Y    int
		Zoom int
	}

	var wg sync.WaitGroup

	getImage := func(i interface{}) {
		s := i.(Square)
		defer wg.Done()
		oneTile := tile.NewByColRowZoom(s.X, s.Y, s.Zoom)
		startTime, _ := time.Parse("2006-01-02", "2021-11-01")
		endTime := time.Now()
		gs.GetBestImageForTimeRange(startTime, endTime, oneTile)

	}

	p, _ := ants.NewPoolWithFunc(50, func(i interface{}) {
		getImage(i)
	})
	defer p.Release()

	// X Y matrix on ZOOM = 11
	zoom := 10
	xMax, yMax := tile.MaxColRow(zoom)

	for x := 0; x < xMax; x++ {
		for y := 0; y < yMax; y++ {
			// For Fast DEBUG (location Cyprus Bogaz)
			if x == 760 && y == 194 {
				wg.Add(1)
				_ = p.Invoke(Square{X: x, Y: y, Zoom: zoom})
			}
		}
	}
	logrus.Infof("running goroutines: %d\n", p.Running())
	go func() {
		for {
			<-time.After(time.Second * 15)
			logrus.Infof("runtime.NumGoroutine(): %v\n", runtime.NumGoroutine())
		}
	}()
	wg.Wait()
}

func (gs *GeoService) GetBestImageForTimeRange(tStart, tEnd time.Time, tile *tile.Tile) {
	var err error
	t := tStart
	treshold := tEnd
	logrus.Debugf("treshold.Format(time.RFC3339): %v\n", treshold.Format(time.RFC3339))
	for {
		if t.After(treshold) {
			break
		}
		if err = gs.GetImage(tile, t); err != nil {
			logrus.Error(err)
		}
		t = t.Add(time.Hour * 24)
		logrus.Debug("Curr time: ", t.Format("2006-01-02"))
	}
	logrus.Info("Gathering stopped...")
}

func (gs *GeoService) GetImage(tile *tile.Tile, t time.Time) error {
	// i := &db.Image{
	// 	Layer:  "HLS_L30_Nadir_BRDF_Adjusted_Reflectance",
	// 	Matrix: "31.25m",

	// 	Lat: tile.Lat,
	// 	Lon: tile.Long,

	// 	Zoom:         tile.Zoom,
	// 	TileX:        tile.Col,
	// 	TileY:        tile.Row,
	// 	Format:       url.QueryEscape("image/png"),
	// 	TimeShoot:    t,
	// 	TimeShootStr: t.Format("2006-01-02"),
	// }
	i := &db.Image{
		Layer:  "MODIS_Terra_CorrectedReflectance_TrueColor",
		Matrix: "250m",

		Lat: tile.Lat,
		Lon: tile.Long,

		Zoom:         tile.Zoom,
		TileX:        tile.Col,
		TileY:        tile.Row,
		Format:       url.QueryEscape("image/jpeg"),
		TimeShoot:    t,
		TimeShootStr: t.Format("2006-01-02"),
	}

	var bufUrl bytes.Buffer
	tmpl, err := template.New("req").Parse(gs.WMTStemplate)
	if err != nil {
		return err
	}
	tmpl.Execute(&bufUrl, i)

	logrus.Debug("GET to", bufUrl.String())

	resp, err := http.Get(bufUrl.String())
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		logrus.Errorf("resp.Status: %v\n", resp.Status)
	}

	if resp.ContentLength < 5*1024 {
		logrus.Debugf("ContentLength too small (Size: %s). Perhaps bad image. Continue... ", humanize.Bytes(uint64(resp.ContentLength)))
		return nil
	}

	// i.FileName = fmt.Sprintf("%s_%s_z%d_y%d_x%d_%s.png", i.Layer, strings.ReplaceAll(i.Matrix, ".", "_"), i.Zoom, i.TileY, i.TileX, i.TimeShootStr)
	i.FileName = fmt.Sprintf("%s_%s_z%d_y%d_x%d_%s.jpg", i.Layer, strings.ReplaceAll(i.Matrix, ".", "_"), i.Zoom, i.TileY, i.TileX, i.TimeShootStr)

	f, err := os.Create("/images/" + i.FileName)
	if err != nil {
		return err
	}
	defer f.Close()
	n, err := f.ReadFrom(resp.Body)
	if err != nil {
		return err
	}
	logrus.Debugf("Downloaded ", humanize.Bytes(uint64(n)))
	gs.DB.InsertImage(i)
	return nil
}
