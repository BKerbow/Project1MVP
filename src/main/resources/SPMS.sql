drop table genres;
drop table story_types;
drop table editors;
drop table authors;
drop table stories;
drop table genre_editor_join;
drop table messages;

alter sequence genres_id_seq restart with 1;
alter sequence story_types_id_seq restart with 1;
alter sequence editors_id_seq restart with 1;
alter sequence authors_id_seq restart with 1;
alter sequence stories_id_seq restart with 1;
alter sequence genre_editor_join_id_seq restart with 1;

create table genres(
	id serial primary key,
	name varchar(20)
);

create table story_types(
	id serial primary key,
	name varchar(15),
	points int
);
	
create table editors(
	id serial primary key,
	first_name varchar(20),
	last_name varchar(20),
	username varchar(20),
	password varchar(20),
	assistant boolean,
	senior boolean
);
	
create table authors(
	id serial primary key,
	first_name varchar(20),
	last_name varchar(20),
	bio varchar(20),
	points int,
	username varchar (20),
	password varchar (20)
);
	
create table stories (
	id serial primary key,
	title varchar(50),
	genre int references genres(id),
	story_type int references story_types(id),
	author int references authors(id),
	description varchar,
	tag_line varchar,
	completion_date date,
	approval_status varchar,
	reason varchar,
	submission_date date,
	assistant int references editors,
	editor int references editors,
	senior int references editors,
	draft varchar,
	modified bool,
	draft_approval_count int
);

create table genre_editor_join(
	id serial primary key,
	genre int references genres(id),
	editor int references editors(id)
);

create table messages(
	id serial primary key,
	title int references stories(id),
	fromEditor int references editors(id),
	fromAuthor int references authors(id),
	receiveEditor int references editors(id),
	editorMessage varchar,
	authorMessage varchar
);

insert into stories values
(default, 'a', 1, 1, 1, 'b', 'c', '2021-05-03', 'd', 'e', '2021-05-03', null, null, null, null, false, 0);

insert into messages values
(default, 1, 1, 1, 14, 'this is a placeholder', 'this is a placeholder');
select * from stories;

insert into messages values
(default, 1, 1, 1, 14, 'this is another placeholder, this is another palceholder');

insert into genre_editor_join values

alter table editors add column username varchar(20);
alter table editors add column password varchar(20);
alter table authors add column username varchar(20);
alter table authors add column password varchar(20);

select * from stories;

select * from genre_editor_join;

select s.title, a.first_name, m.editorMessage from messages m  
left join stories s on m.id = s.id 
left join editors a on m.id = a.id 
where e.id = ? and s.id = ?;

select s.title, e.first_name, m.editorMessage from messages m 
left join stories s on m.id = s.id 
left join editors e on m.id = e.id 
where a.id = ? and s.id = ?;

delete from stories where id = 6;
delete from messages where id = 3;

insert into genre_editor_join values
(default, nonfiction)

insert into stories values
(default, 1, 5, 4, 1, 'this is a test description', 'this is a test tag line', '06/20/2021', 'first draft', 'pending', 'test reason', '06/21/2020');

insert into stories values
(default, 1, 1, 4, 1, 'fantasy description', 'fantasy tagline', '06/23/2021', 'first draft', 'pending', 'test reason', '06/25/2021')

select * from messages where id = 4;
select * from stories where id = 2;

insert into messages values
(default, 1, 2, 1, 3, 'this is a placeholder message', 'this is a placeholder message');
(default, 7, 1, 2, 14, 'this is an editor to editor message test', 'placeholder');
(default, 1, 2, 1, 3, 'placeholder', 'this is an author to editor test');

insert into authors values
(default, 'bennett', 'kerbow', 'FullStackJavaDev', 100, 'BKerbow', 'manager'),
(default, 'gerald', 'stillerman', 'FullStackJavaDev', 100, 'gerald', 'test'),
(default, 'emmett', 'riddle', 'FullStackJavaDev', 100 , 'emmett', 'starwars');

insert into story_types values
(default, 'novel', 50),
(default, 'novella', 25),
(default, 'short story', 20),
(default, 'article', 10);

insert into editors values
(default, 'hisham', 'haqq', 'hisham', 'revdev', true, false),
(default, 'gregory', 'diaz', 'greg', 'yankee', false, false),
(default, 'erika', 'foreman', 'erika', 'revature', false, true),
(default, 'alexandra', 'atalis', 'alex', 'elaine', true, false),
(default, 'carla', 'badillo', 'carla', 'scottyps', false, false),
(default, 'steve', 'adams', 'steve', 'troop95', false, true),
(default, 'dan', 'felleman', 'dan', 'j2105', true, false),
(default, 'presvytera', 'poulos', 'yiayia', 'kastri', false, false),
(default, 'joe', 'kerbow', 'joe', 'johndeer', false, true),
(default, 'todd', 'howard', 'bethesda', 'buyskyrim', true, false),
(default, 'peter', 'molyneux', 'fable', 'microsoft', false, false),
(default, 'george', 'lucas', 'lucasarts', '4billion', false, true);

insert into editors values
(default, 'pepe', 'frog', 'moot', '4chan', true, false),
(default, 'shia', 'labouef', 'whitwicky', 'hwindu', false, false),
(default, 'chad', 'thunder', 'gigachad', 'enjoyer', false, true);

delete from editors values where id = 18;

insert into genres values
(default, 'fantasy'),
(default, 'science-fiction'),
(default, 'mystery'),
(default, 'article');

insert into genres values
(default, 'nonfiction');

insert into genre_editor_join values
(default, 1, 1),
(default, 1, 2),
(default, 1, 3),
(default, 2, 4),
(default, 2, 5),
(default, 2, 6),
(default, 3, 7),
(default, 3, 8),
(default, 3, 9),
(default, 4, 10),
(default, 4, 11),
(default, 4, 12);

insert into genre_editor_join values
(default, 5, 13),
(default, 5, 14),
(default, 5, 15);

insert into genres values (default, 'nonfiction');

create or replace procedure "Project1".resetTables()
language sql
as $$
	delete from stories;
	delete from authors;
	delete from genre_editor_join;
	delete from genres;
	delete from editors;

	alter sequence editors_id_seq restart with 1;
	alter sequence authors_id_seq restart with 1;
	alter sequence stories_id_seq restart with 1;
	alter sequence genre_editor_join_id_seq restart with 1;
	alter sequence genres_id_seq restart with 1;
$$;

call "Project1".resetTables();

select gej.id, g.id as g_id, g.name, e.id as e_id, e.first_name, e.last_name, e.senior, e.assistant
from genre_editor_join gej 
full join genres g
on gej.genre = g.id
full join editors e
on gej.editor = e.id
order by e.senior desc, e.assistant desc;

select gej.id, g.id as g_id, g.name, e.id as e_id, e.first_name, e.last_name, e.senior, e.assistant
from genre_editor_join gej 
full join genres g
on gej.genre = g.id
full join editors e
on gej.editor = e.id
where gej.id = 5;

select * from stories s
left join genres g on s.genre=g.id
left join genre_editor_join gej on g.id = gej.genre
left join editors e on gej.editor=e.id 
where e.id = 2;


select s.title, e.first_name,  m.editorMessage, a.username
from messages m
left join stories s on m.id=s.id
left join editors e on m.id=e.id
left join authors a on m.id=a.id;

select s.title, e.first_name,  m.editorMessage
from messages m
left join stories s on m.id=s.id
left join editors e on m.id=e.id;

select s.title, e.first_name, e.first_name, m.editorMessage
from messages m
left join stories s on m.id=s.id
left join editors e on m.id=e.id;

select s.title, e.first_name, m.editorMessage
from messages m
left join stories s on m.id=s.id
left join editors e on m.receiveeditor = e.id;

select s.title, a.first_name, m.authorMessage
from messages m
left join stories s on m.id=s.id 
left join authors a on m.id=a.id
where a.id = 1 and s.id = 1;

select * from genre_editor_join;

select * from stories where title = 'fantasy';

select * from messages where id = 1;
select * from messages;
select title, fromEditor, fromAuthor from messages;

select * from editors where assistant = true;

select * from stories s
left join genres g on s.genre=g.id
left join genre_editor_join gej on g.id = gej.genre
left join editors e on gej.editor=e.id
where e.username = 'greg' and e.password = 'yankee';

alter table stories add column modified boolean;
alter table editors add column genres int;
alter table editors add foreign key (genres) references genres(id);
alter table editors drop column genres;
alter table messages add column receiveEditor int;
alter table messages add foreign key (receiveEditor) references stories();
