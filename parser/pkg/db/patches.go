/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */

package db

import (
	"fmt"
	"os"

	"github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
	"gorm.io/gorm"
)

type Patch struct {
	gorm.Model

	Uid  string  `yaml:"uid" gorm:"type:varchar;unique"`
	Lat  float64 `yaml:"lat"`
	Long float64 `yaml:"lng" gorm:"column:long"`
}

type Conf struct {
	Patches *[]Patch `yml:"patches"`
}

func NewPatch() *Patch {
	return &Patch{}
}

func NewPatchesFromFile(pathToYaml string) *Conf {
	c := &Conf{}

	yamlFile, err := os.ReadFile(pathToYaml)
	if err != nil {
		logrus.Fatal(err)
	}
	err = yaml.Unmarshal(yamlFile, c)
	if err != nil {
		logrus.Error("Cannot unmarshal: ", err)
	}
	logrus.Info("First patch: ", (*c.Patches)[0].Lat, (*c.Patches)[0].Long)

	return c
}

func (db *DB) SendPatchesToDB(c *Conf) {
	for _, patch := range *c.Patches {
		tx := db.Orm.Create(&patch)
		if tx.Error != nil {
			logrus.Warn("Cannot create patch: ", tx.Error)
			continue
		}
		err := db.IgorDB.Notify("patches", fmt.Sprint(patch.ID))
		if err != nil {
			logrus.Error("Cannot notify about new patch: ", err)
		}
	}
}

func (p *Patch) TableName() string {
	return "rosatom_case.patches"
}
