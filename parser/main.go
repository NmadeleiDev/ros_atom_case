/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */

package main

import (
	"github.com/NmadeleiDev/ros_atom_case/parser/pkg/db"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		logrus.Error(err)
	}
	logrus.Info("Parser started...")
	DB := db.New()
	defer DB.Close()
	DB.Run()

}
