/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package service

import (
	"bytes"
	"fmt"
	"html/template"
	"io"
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
		WMTStemplate: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={{.Layer}}&STYLE=&TILEMATRIXSET={{.Matrix}}&TILEMATRIX={{.Zoom}}&TILEROW={{.TileY}}&TILECOL={{.TileX}}&FORMAT={{.Format}}&TIME={{.TimeShoot}}",

		DB: db,
	}
}

func (gs *GeoService) Run() {
	type Square struct {
		X    int
		Y    int
		Zoom int
	}

	var wg sync.WaitGroup

	getImage := func(i interface{}) {
		s := i.(Square)
		defer wg.Done()
		t := tile.NewByColRowZoom(s.X, s.Y, s.Zoom)
		gs.GetBestImageForMonth(t)

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
			wg.Add(1)
			_ = p.Invoke(Square{X: x, Y: y, Zoom: zoom})
			// if x == 1521 && y == 388 {
			// go func(x, y, zoom int) {
			// 	defer wg.Done()
			// 	t := tile.NewByColRowZoom(x, y, zoom)
			// 	gs.GetBestImageForMonth(t)
			// }(x, y, zoom)
			// }
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

func (gs *GeoService) GetBestImageForMonth(tile *tile.Tile) {
	var err error
	t := time.Now()
	treshold := time.Now().Add(-30 * time.Hour * 24) // one month
	logrus.Debugf("treshold.Format(time.RFC3339): %v\n", treshold.Format(time.RFC3339))
	for {
		if t.Before(treshold) {
			break
		}
		if err = gs.GetImage(tile, t); err != nil {
			logrus.Error(err)
		}
		t = t.Add(time.Hour * -24)
		logrus.Debug("Curr time: ", t.Format("2006-01-02"))
	}
	logrus.Info("Gathering stopped...")
}

func (gs *GeoService) GetImage(tile *tile.Tile, t time.Time) error {
	// i := &db.Image{
	// 	Layer:      "MODIS_Terra_CorrectedReflectance_TrueColor",
	// 	Matrix:     "250m",
	// 	Zoom:       2,
	// 	TileX:      2,
	// 	TileY:      2,
	// 	Format:     url.QueryEscape("image/jpeg"),
	// 	TimeString: t.Format("2006-01-02"),
	// }
	i := &db.Image{
		Layer:  "HLS_L30_Nadir_BRDF_Adjusted_Reflectance",
		Matrix: "31.25m",

		Lat: tile.Lat,
		Lon: tile.Long,

		Zoom:      tile.Zoom,
		TileX:     tile.Col,
		TileY:     tile.Row,
		Format:    url.QueryEscape("image/png"),
		TimeShoot: t.Format("2006-01-02"),
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

	if resp.ContentLength < 5*1024 {
		logrus.Debugf("ContentLength too small (Size: %s). Perhaps bad image. Continue... ", humanize.Bytes(uint64(resp.ContentLength)))
		// b, _ := io.ReadAll(resp.Body)
		// logrus.Debug(string(b))
		return nil
	}

	i.FileName = fmt.Sprintf("%s_%s_z%d_y%d_x%d_%s.png", i.Layer, strings.ReplaceAll(i.Matrix, ".", "_"), i.Zoom, i.TileY, i.TileX, i.TimeShoot)

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

func (gs *GeoService) KV(t time.Time) error {
	type Data struct {
		Layer      string
		Matrix     string
		Zoom       int
		TileX      int
		TileY      int
		Format     string
		TimeString string
	}
	// d := &Data{
	// 	Layer:      "MODIS_Terra_CorrectedReflectance_TrueColor",
	// 	Matrix:     "250m",
	// 	Zoom:       2,
	// 	TileX:      2,
	// 	TileY:      2,
	// 	Format:     url.QueryEscape("image/jpeg"),
	// 	TimeString: t.Format("2006-01-02"),
	// }
	d := &Data{
		Layer:      "HLS_L30_Nadir_BRDF_Adjusted_Reflectance",
		Matrix:     "31.25m",
		Zoom:       10,
		TileX:      760,
		TileY:      194,
		Format:     url.QueryEscape("image/png"),
		TimeString: t.Format("2006-01-02"),
	}

	var bufUrl bytes.Buffer
	tmpl, err := template.New("req").Parse(gs.WMTStemplate)
	if err != nil {
		return err
	}
	tmpl.Execute(&bufUrl, d)

	logrus.Debug("GET to", bufUrl.String())

	resp, err := http.Get(bufUrl.String())
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.ContentLength < 5*1024 {
		logrus.Debugf("ContentLength too small (Size: %s). Perhaps bad image. Continue... ", humanize.Bytes(uint64(resp.ContentLength)))
		b, _ := io.ReadAll(resp.Body)
		logrus.Debug(string(b))
		return nil
	}

	f, err := os.Create("/images/" + d.TimeString + ".png")
	if err != nil {
		return err
	}
	defer f.Close()
	n, err := f.ReadFrom(resp.Body)
	if err != nil {
		return err
	}
	logrus.Debugf("Downloaded ", humanize.Bytes(uint64(n)))
	return nil
}

func (gs *GeoService) BestInTime() {
	var err error
	t := time.Now()
	treshold, err := time.Parse("2006-01-02", "2021-09-20")
	if err != nil {
		logrus.Fatal(err)
	}
	logrus.Debugf("treshold.Format(time.RFC3339): %v\n", treshold.Format(time.RFC3339))
	for {
		if t.Before(treshold) {
			break
		}
		if err = gs.KV(t); err != nil {
			logrus.Error(err)
		}
		t = t.Add(time.Hour * -24)
		logrus.Debug("Curr time: ", t.Format("2006-01-02"))
	}
	logrus.Info("Gathering stopped...")
}
