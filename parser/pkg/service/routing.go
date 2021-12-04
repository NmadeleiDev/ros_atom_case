/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package service

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

/*
go get
go mod vendor
go mod tidy
*/

type RoutingService struct {
	APIKey                 string
	OverpassPlacesEndpoint string
	OverpassRiverEndpoint  string
	OSRMRouteServiceEP     string
	Client                 *http.Client
}

func NewRouteService() *RoutingService {
	apikey := os.Getenv("OPEN_ROUTE_SERVICE_TOKEN")
	c := &http.Client{}
	return &RoutingService{
		APIKey:                 apikey,
		Client:                 c,
		OverpassPlacesEndpoint: `https://overpass.openstreetmap.ru/api/interpreter?data=[out:json];node["place"]["population"](%f,%f,%f,%f);out;`,
		OverpassRiverEndpoint:  `https://overpass.openstreetmap.ru/api/interpreter?data=[out:json];rel["waterway"](%f,%f,%f,%f);out;`,
		OSRMRouteServiceEP:     `http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=false&steps=true`,
	}
}

func (rs *RoutingService) Start() {
	e := echo.New()
	e.GET("/test", hello)
	e.GET("/places/:lat/:long", GetPlaces(rs))
	e.GET("/rivers/:lat/:long", GetRivers(rs))
	e.GET("/route/:latA/:longA/:latB/:longB", GetRoute(rs))
	e.Logger.Fatal(e.Start(":1323"))
}

func GetPlaces(rs *RoutingService) echo.HandlerFunc {
	return func(c echo.Context) error {
		lat := c.Param("lat")
		long := c.Param("long")

		if lat == "" && long == "" {
			return errors.New("no lat or long or not parsable")
		}

		latFloat, err := strconv.ParseFloat(lat, 64)
		if err != nil {
			return err
		}
		longFloat, err := strconv.ParseFloat(long, 64)
		if err != nil {
			return err
		}
		deltaDegree := 1.0

		req := fmt.Sprintf(rs.OverpassPlacesEndpoint, latFloat-(deltaDegree), longFloat-(deltaDegree), latFloat+deltaDegree, longFloat+deltaDegree)
		logrus.Info("req: ", req)
		resp, err := rs.Client.Get(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		return c.String(http.StatusOK, string(respBody))
	}
}
func GetRivers(rs *RoutingService) echo.HandlerFunc {
	return func(c echo.Context) error {
		lat := c.Param("lat")
		long := c.Param("long")

		if lat == "" && long == "" {
			return errors.New("no lat or long or not parsable")
		}

		latFloat, err := strconv.ParseFloat(lat, 64)
		if err != nil {
			return err
		}
		longFloat, err := strconv.ParseFloat(long, 64)
		if err != nil {
			return err
		}
		deltaDegree := 1.0

		req := fmt.Sprintf(rs.OverpassRiverEndpoint, latFloat-(deltaDegree), longFloat-(deltaDegree), latFloat+deltaDegree, longFloat+deltaDegree)
		logrus.Info("req: ", req)
		resp, err := rs.Client.Get(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		return c.String(http.StatusOK, string(respBody))
	}
}
func GetRoute(rs *RoutingService) echo.HandlerFunc {
	return func(c echo.Context) error {
		latA := c.Param("latA")
		longA := c.Param("longA")
		latB := c.Param("latB")
		longB := c.Param("longB")

		if latA == "" || longA == "" {
			return errors.New("no lat or long or not parsable")
		}

		latFloatA, err := strconv.ParseFloat(latA, 64)
		if err != nil {
			return err
		}
		longFloatA, err := strconv.ParseFloat(longA, 64)
		if err != nil {
			return err
		}
		latFloatB, err := strconv.ParseFloat(latB, 64)
		if err != nil {
			return err
		}
		longFloatB, err := strconv.ParseFloat(longB, 64)
		if err != nil {
			return err
		}

		req := fmt.Sprintf(rs.OSRMRouteServiceEP, longFloatA, latFloatA, longFloatB, latFloatB)
		logrus.Info("req: ", req)
		resp, err := rs.Client.Get(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		return c.String(http.StatusOK, string(respBody))
	}
}

func hello(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

func (rs *RoutingService) SampleRequest() {
	body := []byte(`{"locations":[[8.681495,49.41461],[8.686507,49.41943]],"range":[300,200],"attributes":["reachfactor","area"],"intersections":"true","location_type":"destination","range_type":"time","area_units":"m","units":"m"}`)

	req, _ := http.NewRequest("POST", "https://api.openrouteservice.org/v2/isochrones/driving-car", bytes.NewBuffer(body))

	req.Header.Add("Accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8")
	req.Header.Add("Authorization", rs.APIKey)
	req.Header.Add("Content-Type", "application/json; charset=utf-8")

	resp, err := rs.Client.Do(req)

	if err != nil {
		fmt.Println("Errored when sending request to the server")
		return
	}

	defer resp.Body.Close()
	resp_body, _ := ioutil.ReadAll(resp.Body)

	fmt.Println(resp.Status)
	fmt.Println(string(resp_body))
}
