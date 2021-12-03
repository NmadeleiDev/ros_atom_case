/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */

package db

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model

	// ID int `gorm:"type:bigint;autoIncrement;primary_key"`

	Lat_1 float64
	Lon_1 float64
	Lat_2 float64
	Lon_2 float64

	TimeStart time.Time
	TimeEnd   time.Time
}

func (t *Task) TableName() string {
	return "rosatom_case.parser_task"
}
