/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package tile

import (
	"testing"
)

func TestTile_Deg2num(t *testing.T) {
	type fields struct {
		Zoom int
		X    int
		Y    int
		Lat  float64
		Long float64
	}
	tests := []struct {
		name   string
		fields fields
		wantX  int
		wantY  int
	}{
		{
			name: "zoom10toCyprus",
			fields: fields{
				Zoom: 10,
				Lat:  35.315,
				Long: 33.943,
			},
			wantX: 760,
			wantY: 194,
		},
		{
			name: "zoom9toCyprus",
			fields: fields{
				Zoom: 9,
				Lat:  35.315,
				Long: 33.943,
			},
			wantX: 380,
			wantY: 97,
		},
		{
			name: "zoom8toCyprus",
			fields: fields{
				Zoom: 8,
				Lat:  35.315,
				Long: 33.943,
			},
			wantX: 190,
			wantY: 48,
		},
		{
			name: "zoom3toMeditterian",
			fields: fields{
				Zoom: 3,
				Lat:  35.0,
				Long: 15.0,
			},
			wantX: 5,
			wantY: 1,
		},
		{
			name: "zoom6toCyprus",
			fields: fields{
				Zoom: 6,
				Lat:  35.315,
				Long: 33.943,
			},
			wantX: 47,
			wantY: 12,
		},
		{
			name: "zoom2toAmerica",
			fields: fields{
				Zoom: 3,
				Lat:  41.85,
				Long: -87.65,
			},
			wantX: 2,
			wantY: 1,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tr := &Tile{
				Zoom: tt.fields.Zoom,
				Col:  tt.fields.X,
				Row:  tt.fields.Y,
				Lat:  tt.fields.Lat,
				Long: tt.fields.Long,
			}
			gotX, gotY := tr.Deg2num()
			if gotX != tt.wantX {
				t.Errorf("Tile.Deg2num() gotX = %v, want %v", gotX, tt.wantX)
			}
			if gotY != tt.wantY {
				t.Errorf("Tile.Deg2num() gotY = %v, want %v", gotY, tt.wantY)
			}
		})
	}
}
