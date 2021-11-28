/*
 *   Copyright (c) 2021 Anton Brekhov
 *   All rights reserved.
 */
package tile

import "testing"

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
		// TODO: Add test cases.
		{
			name: "zoom2toAmerica",
			fields: fields{
				Zoom: 2,
				Lat:  41.85,
				Long: -87.65,
			},
			wantX: 1,
			wantY: 1,
		},
		{
			name: "zoom3toAmerica",
			fields: fields{
				Zoom: 3,
				Lat:  41.85,
				Long: -87.65,
			},
			wantX: 2,
			wantY: 2,
		},
		{
			name: "zoom7toAmerica",
			fields: fields{
				Zoom: 7,
				Lat:  41.85,
				Long: -87.65,
			},
			wantX: 32,
			wantY: 47,
		},
		{
			name: "zoom6toCyprus",
			fields: fields{
				Zoom: 6,
				Lat:  35.2,
				Long: 33.0,
			},
			wantX: 37,
			wantY: 25,
		},
		{
			name: "zoom6toMoscow",
			fields: fields{
				Zoom: 6,
				Lat:  55.7,
				Long: 37.6,
			},
			wantX: 38,
			wantY: 20,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tr := &Tile{
				Zoom: tt.fields.Zoom,
				X:    tt.fields.X,
				Y:    tt.fields.Y,
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
