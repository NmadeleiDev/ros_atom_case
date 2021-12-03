schema_create_query = """create schema if not exists rosatom_case"""

images_table_query = """
create table if not exists rosatom_case.images
(
	id serial
		constraint images_pk
			primary key,
	img_file_id varchar not null unique,
	lat float default 0,
	lon float default 0,
	class_id varchar default 'OK'
);
"""


sent_imgs_table = """
create table if not exists rosatom_case.sentinel_images
(
	id serial
		constraint images_pk
			primary key,
	shoot_ts timestamp,
	lat float default 0,
	lon float default 0,
	class_id varchar default null,
	npy_img_bytes BYTEA not null,
	polution_type varchar default null,
	company varchar default null,
	license_area varchar default null,
	poluted_area_reg_n varchar default null,
	location_of_poluted_area varchar default null,
	adm_region varchar default null,
	last_spill_date timestamp default null,
	region_category varchar default null,

	location_name varchar default null,
	have_special_zones varchar default null,

	level_of_pol float default 0,
	area_meters float default 0

);
"""
