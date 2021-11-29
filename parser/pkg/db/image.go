/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package db

import "gorm.io/gorm"

type Image struct {
	gorm.Model

	ID int `gorm:"type:bigint;primary_key,AUTO_INCREMENT"`

	ImgFileId int64 `gorm:"primaryKey"`
	Lat       float64
	Lon       float64
	ClassId   string `pg:"type:varchar(255)"`
}

func (i *Image) TableName() string {
	return "rosatom_case.images"
}
