/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */

package db

import (
	"fmt"
	"os"
	"strconv"

	"github.com/galeone/igor"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type DB struct {
	Host     string
	DBName   string
	Port     string
	User     string
	Password string

	Orm    *gorm.DB
	IgorDB *igor.Database
}

func New() *DB {
	var err error
	var ok bool
	currOk := true
	db := &DB{}
	db.DBName, ok = os.LookupEnv("POSTGRES_DB")
	currOk = currOk && ok
	db.Host, ok = os.LookupEnv("POSTGRES_HOST")
	currOk = currOk && ok
	db.Port, ok = os.LookupEnv("POSTGRES_PORT")
	currOk = currOk && ok
	db.User, ok = os.LookupEnv("POSTGRES_USER")
	currOk = currOk && ok
	db.Password, ok = os.LookupEnv("POSTGRES_PASSWORD")
	currOk = currOk && ok
	if !currOk {
		logrus.Fatal("No env parameter")
	}
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", db.Host, db.User, db.Password, db.DBName, db.Port)
	db.Orm, err = gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{
			NamingStrategy: schema.NamingStrategy{
				TablePrefix:   "rosatom_case.", // schema name
				SingularTable: true,
			},
		})
	if err != nil {
		logrus.Fatal("Cannot connect to db:", err)
	}

	igorDB, err := igor.Connect(dsn)
	if err != nil {
		logrus.Fatal("Cannot connect to db:", err)
	}
	db.IgorDB = igorDB

	return db
}

func (db *DB) CreateTable() error {
	db.Orm.Exec("create schema if not exists rosatom_case")
	// err := db.Orm.Debug().AutoMigrate(&Image{})
	err := db.Orm.AutoMigrate(&Image{})
	if err != nil {
		logrus.Fatal(err)
	}
	logrus.Info("AutoMigration completed")
	// err = db.Orm.Debug().AutoMigrate(&Task{})
	err = db.Orm.AutoMigrate(&Task{})
	if err != nil {
		logrus.Fatal(err)
	}
	return nil
}

func (db *DB) InsertImage(i *Image) error {
	tx := db.Orm.Create(&i)
	return tx.Error
}

func (db *DB) GetTaskByID(parseTaskIDStr string) (*Task, error) {
	task := &Task{}
	ptID, err := strconv.Atoi(parseTaskIDStr)
	if err != nil {
		logrus.Error("Cannot parse parse request ID ", ptID)
	}
	task.ID = uint(ptID)
	tx := db.Orm.First(&task)
	if tx.Error != nil {
		logrus.Error("Cannot find the task ", tx.Error)
	}
	return task, tx.Error
}

func (db *DB) Run() {
	err := db.CreateTable()
	if err != nil {
		logrus.Error(err)
	}
}

func (db *DB) Close() {
	defer db.IgorDB.DB().Close()
}
