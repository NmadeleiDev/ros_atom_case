/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package service

import (
	"bytes"
	"html/template"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/dustin/go-humanize"
	"github.com/sirupsen/logrus"
)

type GeoService struct {
	Name         string
	WMTStemplate string
}

// https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE=&TILEMATRIXSET=250m&TILEMATRIX=6&TILEROW=13&TILECOL=36&FORMAT=image%2Fjpeg&TIME=2012-07-09
/* Resources
https://www.programmableweb.com/news/top-10-satellites-apis/brief/2020/06/14
*/

func New() *GeoService {
	os.MkdirAll("/images", 0664)
	return &GeoService{
		WMTStemplate: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={{.Layer}}&STYLE=&TILEMATRIXSET={{.Matrix}}&TILEMATRIX={{.Zoom}}&TILEROW={{.TileX}}&TILECOL={{.TileY}}&FORMAT={{.Format}}&TIME={{.TimeString}}",
	}
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
	d := &Data{
		Layer:      "MODIS_Terra_CorrectedReflectance_TrueColor",
		Matrix:     "250m",
		Zoom:       2,
		TileX:      2,
		TileY:      2,
		Format:     url.QueryEscape("image/jpeg"),
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
	f, err := os.Create("/images/" + d.TimeString + ".jpg")
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

func (gs *GeoService) Run() {
	var err error
	t := time.Now()
	treshold, err := time.Parse("2006-01-02", "2021-11-20")
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
