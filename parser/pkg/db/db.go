/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */

package db

import (
	"fmt"
	"os"

	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/sirupsen/logrus"
)

type DB struct {
	Host     string
	DBName   string
	Port     string
	User     string
	Password string

	DbHandler *pg.DB
}

func New() *DB {
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
	db.DbHandler = pg.Connect(&pg.Options{
		User:     db.User,
		Password: db.Password,
		Database: db.DBName,
		Addr:     fmt.Sprintf("%s:%s", db.Host, db.Port),
	})
	return db
}

func (db *DB) Close() {
	db.DbHandler.Close()
}

func (db *DB) CreateSchema() error {
	err := db.DbHandler.Model((*Image)(nil)).CreateTable(&orm.CreateTableOptions{IfNotExists: true})
	if err != nil {
		logrus.Fatal(err)
	}
	return nil
}

func (db *DB) InsertImage() error {
	i := &Image{
		ImgFileId: 123413413461,
		Lat:       2.5146134162,
		Lon:       504.231345261,
	}
	res, err := db.DbHandler.Model(i).Insert()
	if err != nil {
		return err
	}
	fmt.Printf("res.RowsReturned(): %v\n", res.RowsReturned())
	fmt.Printf("res: %v\n", res)
	return nil
}

func (db *DB) Run() {
	err := db.CreateSchema()
	if err != nil {
		logrus.Error(err)
	}
	err = db.InsertImage()
	if err != nil {
		logrus.Error(err)
	}
}

/*
POSTGRES_DB=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345

*/
