/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package db

type Image struct {
	tableName struct{} `pg:"images,alias:i"` // default values are the same

	ImgFileId int64 `pg:",pk,notnull"`
	Lat       float64
	Lon       float64
	ClassId   string `pg:"type:varchar(255)"`
}
