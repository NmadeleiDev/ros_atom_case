/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */

package db

import (
	"io/ioutil"

	"github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
	"gorm.io/gorm"
)

type Patch struct {
	gorm.Model

	Uid  string  `yml:"uuid" gorm:"column:varchar;unique"`
	Lat  float64 `yml:"lat"`
	Long float64 `yml:"lng"`
}

type Conf struct {
	Patches *[]Patch `yml:"patches"`
}

func NewPatch() *Patch {
	return &Patch{}
}

func NewPatchesFromFile(pathToYaml string) *Conf {
	c := &Conf{}

	yamlFile, err := ioutil.ReadFile(pathToYaml)
	if err != nil {
		logrus.Fatal(err)
	}
	yaml.Unmarshal(yamlFile, c)

	return c
}

func (db *DB) SendPatchesToDB(c *Conf) {
	for _, patch := range *c.Patches {
		tx := db.Orm.Create(&patch)
		if tx.Error != nil {
			logrus.Warn("Cannot create patch: ", tx.Error)
			continue
		}
	}
}

func (p *Patch) TableName() string {
	return "rosatom_case.patches"
}
