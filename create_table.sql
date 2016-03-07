CREATE SEQUENCE lfs_request_serial START 1001;

create table lfs_request(
	request_id integer DEFAULT nextval('lfs_request_serial'),
	timestamp_creation timestamp DEFAULT current_timestamp,
	model json, 
	request_user json
	);

 alter table lfs_request add column request_key char(9);
 