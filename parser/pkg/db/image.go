/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package db

import (
	"gorm.io/gorm"
)

type Image struct {
	gorm.Model

	// ID int `gorm:"type:bigint;autoIncrement;primary_key"`

	ImgFileId int64
	Lat       float64
	Lon       float64
	ClassId   string

	Layer     string `gorm:"type:varchar(255)"`
	Matrix    string `gorm:"type:varchar(255)"`
	Zoom      int
	TileX     int
	TileY     int
	Format    string `gorm:"type:varchar(255)"`
	TimeShoot string `gorm:"type:varchar(255)"`
	FileName  string `gorm:"type:varchar(255);unique"`
}

func (i *Image) TableName() string {
	return "rosatom_case.images"
}
