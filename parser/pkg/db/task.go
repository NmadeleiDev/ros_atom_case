/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */

package db

import (
	"gorm.io/gorm"
)

type Task struct {
	gorm.Model

	// ID int `gorm:"type:bigint;autoIncrement;primary_key"`

	Lat_1 float64
	Lon_1 float64
	Lat_2 float64
	Lon_2 float64
}

func (t *Task) TableName() string {
	return "rosatom_case.tasks"
}
