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

	Layer     string `gorm:"type:varchar"`
	Matrix    string `gorm:"type:varchar"`
	Zoom      int
	TileX     int
	TileY     int
	Format    string `gorm:"type:varchar"`
	TimeShoot string `gorm:"type:varchar"`
	FileName  string `gorm:"type:varchar;unique"`
}

func (i *Image) TableName() string {
	return "rosatom_case.images"
}
