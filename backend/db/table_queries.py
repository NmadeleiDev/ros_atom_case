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