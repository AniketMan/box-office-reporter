DROP TABLE IF EXISTS entries;
--> statement-breakpoint
CREATE TABLE films (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collection TEXT NOT NULL,
  title TEXT NOT NULL,
  release_date TEXT,
  budget INTEGER NOT NULL,
  domestic INTEGER NOT NULL,
  worldwide INTEGER NOT NULL,
  rt_critics INTEGER,
  rt_audience INTEGER,
  cinemascore TEXT,
  source_url TEXT,
  source_label TEXT NOT NULL DEFAULT 'Google Sheet',
  source_as_of TEXT
);
--> statement-breakpoint
CREATE INDEX films_collection_idx ON films(collection);
--> statement-breakpoint
CREATE TABLE yearly_metrics (
  year INTEGER PRIMARY KEY,
  films INTEGER,
  domestic REAL,
  top10 REAL,
  tier2 REAL,
  tier3 REAL,
  tier4 REAL,
  tier5 REAL,
  tier6 REAL,
  tier7 REAL,
  n_top10 INTEGER,
  n_rest INTEGER,
  n_t2 INTEGER,
  n_t3 INTEGER,
  n_t4 INTEGER,
  n_t5 INTEGER,
  n_t6 INTEGER,
  n_t7 INTEGER
);
--> statement-breakpoint
CREATE TABLE search_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  normalized_query TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  release_date TEXT,
  budget INTEGER,
  domestic INTEGER,
  worldwide INTEGER,
  source_url TEXT NOT NULL,
  fetched_at INTEGER NOT NULL
);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Toy Story','1995-11-22',30000000,192523233,365270951,100,92,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','A Bug’s Life','1998-11-20',45000000,162798565,363095319,92,72,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Toy Story 2','1999-11-19',90000000,245852179,511358276,100,87,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Monsters, Inc.','2001-11-02',115000000,290149425,560483719,96,90,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Finding Nemo','2003-05-30',94000000,380529370,936094852,99,86,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','The Incredibles','2004-11-05',92000000,261441092,631441092,97,75,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Cars','2006-06-09',70000000,244082982,461630558,75,80,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Ratatouille','2007-06-29',150000000,206445654,626549695,96,87,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','WALL-E','2008-06-27',180000000,223808164,532508025,95,90,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Up','2009-05-29',175000000,293004164,731463377,98,90,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Toy Story 3','2010-06-18',200000000,415004880,1068879522,98,90,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Cars 2','2011-06-24',200000000,191450875,560155383,39,49,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Brave','2012-06-22',185000000,237282182,554606532,79,75,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Monsters University','2013-06-21',200000000,268488329,743455810,80,81,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Inside Out','2015-06-19',175000000,356461711,850566343,98,89,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','The Good Dinosaur','2015-11-25',187500000,123087120,333771037,75,64,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Finding Dory','2016-06-17',200000000,486295561,1025006125,94,84,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Cars 3','2017-06-16',175000000,152901115,383541369,69,68,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Coco','2017-11-22',175000000,210460015,796401721,97,94,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Incredibles 2','2018-06-15',200000000,608581744,1242805359,93,84,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Toy Story 4','2019-06-21',200000000,434038008,1072817964,97,94,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Onward','2020-03-06',200000000,61555145,133357601,88,95,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Soul','2021-06-18',200000000,946154,120070522,95,88,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Luca','2022-03-11',200000000,1324302,51112314,91,85,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Turning Red','2022-06-10',175000000,1399001,12271142,95,67,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Lightyear','2022-06-17',200000000,118307188,218768299,74,84,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Elemental','2023-06-16',200000000,154426697,484855749,73,93,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Pixar','Inside Out 2','2024-06-14',200000000,651321031,1668778335,91,96,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Iron Man','2008-05-02',186000000,318604126,585171547,94,91,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','The Incredible Hulk','2008-06-13',137500000,134806913,265573859,67,69,'A-',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Iron Man 2','2010-05-07',170000000,312433331,621156389,72,71,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Thor','2011-05-06',150000000,181030624,449326618,77,76,'B+',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Captain America: The First Avenger','2011-07-22',140000000,176654505,370569776,80,75,'A-',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','The Avengers','2012-05-04',225000000,623357910,1515100211,91,91,'A+',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Iron Man 3','2013-05-03',200000000,408992272,1215392272,79,78,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Thor: The Dark World','2013-11-08',150000000,206362140,644602516,67,75,'A-',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Captain America: The Winter Soldier','2014-04-04',170000000,259746958,714401889,90,92,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Guardians of the Galaxy','2014-08-01',170000000,333714112,770882395,92,92,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Avengers: Age of Ultron','2015-05-01',365000000,459005868,1395316979,76,82,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Ant-Man','2015-07-17',130000000,180202163,518858449,83,85,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Captain America: Civil War','2016-05-06',250000000,408084349,1151899586,90,89,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Doctor Strange','2016-11-04',165000000,232641920,676343174,89,86,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Guardians of the Galaxy Vol 2','2017-05-05',200000000,389813101,869087963,85,87,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Spider-Man: Homecoming','2017-07-07',175000000,334576561,878646712,92,87,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Thor: Ragnarok','2017-11-03',180000000,315058289,850482778,93,87,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Black Panther','2018-02-16',200000000,700059566,1336494320,96,79,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Avengers: Infinity War','2018-04-27',300000000,678815482,2048359754,85,92,'A-',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Ant-Man and the Wasp','2018-07-06',130000000,216648740,623144660,87,79,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Captain Marvel','2019-03-08',175000000,426829839,1129576094,79,45,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Avengers: Endgame','2019-04-26',400000000,858373000,2748242781,94,90,'A+',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Spider-Man: Far From Home','2019-07-02',160000000,390532085,1132107522,91,95,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Black Widow','2021-07-09',200000000,183651655,379751131,79,91,'A-',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Shang-Chi and the Legend of the Ten Rings','2021-09-03',150000000,224543292,432224634,91,98,'A-',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Eternals','2021-11-05',200000000,164870264,401731759,45,77,'B',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Spider-Man: No Way Home','2021-12-17',200000000,814115070,1907836254,93,98,'A+',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Doctor Strange in the Multverse of Madness','2022-05-06',290000000,411331607,952224986,73,85,'B+',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Thor: Love and Thunder','2022-07-08',250000000,343256830,760928081,63,76,'B+',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Black Panther: Wakanda Forever','2022-11-11',250000000,453829060,853985546,83,94,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Ant-Man and the Wasp: Quantumania','2023-02-17',330000000,214506909,463635303,46,82,'B',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Guardians of the Galaxy Vol 3','2023-05-05',250000000,358995815,845468744,82,94,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','The Marvels','2023-11-10',274800000,84500223,199706250,62,82,'B',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Deadpool & Wolverine','2024-07-26',429000000,636745858,1338071348,78,96,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Captain America: Brave New World','2025-02-14',180000000,200500001,413640021,48,73,'B',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Thunderbolts','2025-05-02',180000000,190274328,382436917,88,95,'B',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Fantastic Four','2025-07-25',181000000,274286610,521858728,86,95,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('MCU','Spiderman: Brand New Day','2026-07-24',225000000,858400177,2223400177,90,98,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. IV: A New Hope','1977-05-25',11000000,460998007,775398007,93,96,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. V: The Empire…','1980-05-21',23000000,291738960,549001086,95,97,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. VI: Return of…','1983-05-25',32500000,316465003,482365284,82,94,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. I: The Phanto…','1999-05-19',115000000,487574671,1040074671,52,59,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. II: Attack of…','2002-05-16',115000000,310676740,656695615,65,56,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. III: Revenge …','2005-05-19',115000000,380270577,848998877,79,66,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. VII: The Forc…','2015-12-18',533200000,936662225,2064615817,93,85,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Rogue One: A Star Wars Story','2016-12-16',280200000,533539991,1055083596,84,87,'B+',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars Ep. VIII: The Las…','2017-12-15',262000000,620181382,1331635141,91,41,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Solo: A Star Wars Story','2018-05-25',330400000,213767512,393151347,69,63,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Star Wars','Star Wars: The Rise of Skyw…','2019-12-20',275000000,515202542,1072767997,51,86,'A',NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Superman','1978-12-15',55000000,134218018,300200000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Superman II','1981-06-19',54000000,108185706,190400000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Superman III','1983-06-17',39000000,59950623,80200000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Superman IV: The Quest for …','1987-07-24',17000000,14522355,36700000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Batman','1989-06-23',35000000,251188924,411348924,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Batman Returns','1992-06-18',80000000,162833635,266824291,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Batman Forever','1995-06-16',100000000,184031112,336529144,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Batman & Robin','1997-06-20',125000000,107325195,238317814,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Road to Perdition','2002-07-12',80000000,104054514,183354514,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The League of Extraordinary…','2003-07-11',78000000,66465204,179265204,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Catwoman','2004-07-23',100000000,40202379,82078046,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Constantine','2005-02-18',75000000,75976178,221593554,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Batman Begins','2005-06-15',150000000,205343774,356770593,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','V for Vendetta','2006-03-17',50000000,70511035,130214162,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Superman Returns','2006-06-28',232000000,200120000,391081192,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Dark Knight','2008-07-18',185000000,534235491,1007695772,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Watchmen','2009-03-06',138000000,107509799,186976250,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Losers','2010-04-23',25000000,23591432,29863840,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Jonah Hex','2010-06-18',47000000,10547117,11022696,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Red','2010-10-15',60000000,90380162,196439693,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Green Lantern','2011-06-17',200000000,116601172,219535492,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Dark Knight Rises','2012-07-20',230000000,448139099,1082228107,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Man of Steel','2013-06-14',225000000,291045518,300200000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Batman v Superman: Dawn of Justice','2016-03-25',263000000,330360194,190400000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Suicide Squad','2016-08-05',175000000,325100054,80200000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Wonder Woman','2017-06-02',150000000,412563408,36700000,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Justice League','2017-11-17',300000000,229024295,411348924,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Teen Titans Go! To The Movies','2018-07-27',10000000,29790236,51620593,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Aquaman','2018-12-21',160000000,335061807,266824291,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Shazam!','2019-04-05',85000000,140371656,336529144,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Joker','2019-10-04',55000000,335451311,1064085246,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Birds of Prey ','2020-02-07',82000000,84158461,238317814,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Wonder Woman 1984','2020-12-25',200000000,46801036,183354514,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Suicide Squad','2021-08-05',185000000,55817425,179265204,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Batman','2022-03-01',200000000,369345583,765950479,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Black Adam','2022-10-21',200000000,168283344,82078046,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Shazam! Fury of the Gods','2023-03-17',125000000,57721819,221593554,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Flash','2023-06-16',200000000,108167507,356770593,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Blue Beetle','2023-08-18',120000000,72541501,130214162,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Aquaman and the Lost Kingdom','2023-12-22',205000000,124481226,391081192,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Man of Steel','2013-06-14',225000000,291045518,300200000,56,75,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Batman v Superman: Dawn of Justice','2016-03-25',263000000,330360194,190400000,29,63,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Suicide Squad','2016-08-05',175000000,325100054,80200000,26,58,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Wonder Woman','2017-06-02',150000000,412563408,36700000,93,83,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Justice League','2017-11-17',300000000,229024295,411348924,40,67,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Aquaman','2018-12-21',160000000,335061807,266824291,65,72,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Shazam!','2019-04-05',85000000,140371656,336529144,90,82,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Birds of Prey ','2020-02-07',82000000,84158461,238317814,79,78,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Wonder Woman 1984','2020-12-25',200000000,46801036,183354514,58,73,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Suicide Squad','2021-08-05',185000000,55817425,179265204,90,82,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Black Adam','2022-10-21',200000000,168283344,82078046,38,88,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Shazam! Fury of the Gods','2023-03-17',125000000,57721819,221593554,48,86,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','The Flash','2023-06-16',200000000,108167507,356770593,63,83,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Blue Beetle','2023-08-18',120000000,72541501,130214162,78,91,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('DC','Aquaman and the Lost Kingdom','2023-12-22',205000000,124481226,391081192,34,81,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Transformers','Transformers',NULL,151000000,319246193,708272592,57,85,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Transformers','Transformers: Revenge of th…',NULL,210000000,402111870,836519699,20,57,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Transformers','Transformers: Dark of the Moon',NULL,195000000,352390543,1123794079,35,55,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Transformers','Transformers: Age of Extinc…',NULL,210000000,245439076,1104054072,18,50,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Transformers','Transformers: The Last Knight',NULL,217000000,130168683,602893340,16,43,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Transformers','Bumblebee',NULL,102000000,127195589,465195589,90,75,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Transformers','Transformers: Rise of the B…',NULL,195000000,157341749,437944638,52,91,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','The Fast and the Furious',NULL,38000000,144512310,206458372,54,74,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','2 Fast 2 Furious',NULL,76000000,127120058,236410607,37,50,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','The Fast and the Furious: T…',NULL,85000000,62615510,157794205,37,69,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','Fast & Furious',NULL,85000000,155064265,359347833,28,67,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','Fast Five',NULL,125000000,210031325,629975898,78,88,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','Fast and Furious 6',NULL,160000000,238679850,789300444,71,84,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','Furious 7',NULL,190000000,353007020,1511986364,81,82,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','The Fate of the Furious',NULL,250000000,225764765,1235534014,67,72,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','Fast & Furious Presents: Ho…',NULL,200000000,173956935,760732926,57,88,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','F9: The Fast Saga',NULL,200000000,173005945,719360068,59,82,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Fast & Furious','Fast X',NULL,340000000,146126015,714567285,56,84,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','The Terminator','1984-10-26',6400000,38019031,78019031,90,89,'B+','https://www.the-numbers.com/movie/Terminator-The-(1984)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','Aliens','1986-07-18',17000000,85160248,183291256,93,94,'A','https://www.the-numbers.com/movie/Aliens','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','The Abyss','1989-08-09',70000000,54763229,54793997,75,83,'A-','https://www.the-numbers.com/movie/Abyss-The','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','Terminator 2: Judgment Day','1991-07-02',100000000,206063411,517944205,90,95,'A+','https://www.the-numbers.com/movie/Terminator-2-Judgment-Day-(1991)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','True Lies','1994-07-15',100000000,146282411,365300000,77,76,'A','https://www.the-numbers.com/movie/True-Lies','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','Titanic','1997-12-19',200000000,674460013,2223048786,88,69,'A+','https://www.the-numbers.com/movie/Titanic-(1997)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','Avatar','2009-12-18',237000000,785221649,2923706026,81,82,'A','https://www.the-numbers.com/movie/Avatar-(2009)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','Avatar: The Way of Water','2022-12-16',400000000,688809501,2322902023,76,92,'A','https://www.the-numbers.com/movie/Avatar-The-Way-of-Water-(2022)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('James Cameron','Avatar: Fire and Ash','2025-12-19',400000000,404340010,1490386712,66,90,'A','https://www.the-numbers.com/movie/Avatar-Fire-and-Ash-(2025)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Following','1999-04-02',6000,48482,240495,87,85,NULL,'https://www.the-numbers.com/movie/Following','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Memento','2001-03-16',5000000,25544867,39719431,94,94,NULL,'https://www.the-numbers.com/movie/Memento-(2001)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Insomnia','2002-05-24',46000000,67263182,113622499,92,77,'B','https://www.the-numbers.com/movie/Insomnia-(2002)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Batman Begins','2005-06-15',150000000,205343774,356766632,85,94,'A','https://www.the-numbers.com/movie/Batman-Begins','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','The Prestige','2006-10-20',40000000,53089891,104407366,77,92,'B','https://www.the-numbers.com/movie/Prestige-The','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','The Dark Knight','2008-07-18',185000000,536625724,1010082145,94,94,'A','https://www.the-numbers.com/movie/Dark-Knight-The','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Inception','2010-07-16',160000000,293662683,826873382,86,91,'B+','https://www.the-numbers.com/movie/Inception','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','The Dark Knight Rises','2012-07-20',230000000,448139099,1082228107,87,90,'A','https://www.the-numbers.com/movie/Dark-Knight-Rises-The','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Interstellar','2014-11-05',165000000,204479973,642481084,73,87,'B+','https://www.the-numbers.com/movie/Interstellar-(2014)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Dunkirk','2017-07-21',150000000,190068280,528068280,92,81,'A-','https://www.the-numbers.com/movie/Dunkirk-(2017)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Tenet','2020-09-03',205000000,59473550,366273550,70,76,'B','https://www.the-numbers.com/movie/Tenet-(2020)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Christopher Nolan','Oppenheimer','2023-07-21',100000000,330078895,983148052,93,91,'A','https://www.the-numbers.com/movie/Oppenheimer-(2023)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Sorcerer''s Stone','2001-11-16',125000000,321934230,966637830,80,82,'A','https://www.the-numbers.com/movie/Harry-Potter-and-the-Sorcerers-Stone-(2001)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Chamber of Secrets','2002-11-15',100000000,264186530,876751253,82,80,'A+','https://www.the-numbers.com/movie/Harry-Potter-and-the-Chamber-of-Secrets','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Prisoner of Azkaban','2004-06-04',130000000,251405744,784786649,90,86,'A','https://www.the-numbers.com/movie/Harry-Potter-and-the-Prisoner-of-Azkaban','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Goblet of Fire','2005-11-18',150000000,291997603,886774160,88,74,'A','https://www.the-numbers.com/movie/Harry-Potter-and-the-Goblet-of-Fire','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Order of the Phoenix','2007-07-11',150000000,293108509,937444235,78,81,'A-','https://www.the-numbers.com/movie/Harry-Potter-and-the-Order-of-the-Phoenix-(2007)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Half-Blood Prince','2009-07-15',250000000,302854063,926055796,83,78,'A-','https://www.the-numbers.com/movie/Harry-Potter-and-the-Half-Blood-Prince-(2009)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Deathly Hallows: Part 1','2010-11-19',125000000,297414693,943476160,77,85,'A','https://www.the-numbers.com/movie/Harry-Potter-and-the-Deathly-Hallows-Part-I','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Harry Potter and the Deathly Hallows: Part 2','2011-07-15',125000000,382747509,1312071376,96,89,'A','https://www.the-numbers.com/movie/Harry-Potter-and-the-Deathly-Hallows-Part-II-(2011)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Fantastic Beasts and Where to Find Them','2016-11-18',180000000,234037575,816037575,74,79,'A','https://www.the-numbers.com/movie/Fantastic-Beasts-and-Where-to-Find-Them','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Fantastic Beasts: The Crimes of Grindelwald','2018-11-16',200000000,159555901,655755901,36,53,'B+','https://www.the-numbers.com/movie/Fantastic-Beasts-The-Crimes-of-Grindelwald-(2018)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Harry Potter','Fantastic Beasts: The Secrets of Dumbledore','2022-04-15',200000000,95850844,407150844,46,83,'B+','https://www.the-numbers.com/movie/Fantastic-Beasts-The-Secrets-of-Dumbledore-(2021)','The Numbers','2026-08-26');
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Avatar 2',NULL,450000000,684075767,2320250281,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Elemental',NULL,200000000,154426697,484855749,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','TinTin',NULL,135000000,77591831,373993951,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Top Gun Maverick',NULL,175000000,718732821,1495696292,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Avatar 2',NULL,450000000,684075767,2320250281,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Superman',NULL,200000000,316062454,551362454,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','F4',NULL,200000000,197123387,367407746,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Avatar 3',NULL,400000000,381826673,1367721650,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Avatar 4',NULL,350000000,368140888,1328995468,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO films (collection,title,release_date,budget,domestic,worldwide,rt_critics,rt_audience,cinemascore,source_url,source_label,source_as_of) VALUES ('Single Films','Avatar 5',NULL,250000000,368140888,1328995468,NULL,NULL,NULL,NULL,'Google Sheet',NULL);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2015,707,11098999414,4705332746,546096380.39,1966181274.57,1981865820.46,1278733333.6,727197706.28,250358152.7,10,697,3,20,40,60,80,494);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2017,742,11127252460,3802824434,621853209.23,2237643503.08,2252586635.23,1453917859.8,828008260.13,275579831.52,10,732,3,22,44,63,85,515);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2018,872,11611481726,3988686930,674940875.44,2431374810.82,2448435472.84,1580022213.2,899862642.81,309475050.89,10,862,3,24,48,68,90,629);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2019,792,11444049854,4653855214,563852292.18,2031261324.09,2047785077.44,1320300209.8,752686059.67,258615085.82,10,782,3,23,46,66,87,557);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2022,460,7528452874,4102555657,283835836.26,1022814280.38,1030005362.36,664763680.2,378684314.76,127714926.04,10,450,2,15,35,55,70,273);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2023,507,8808527162,3341197877,486183073.72,1751018731.55,1763363792.85,1138689910.4,648834248.09,243359795.39,10,497,0,12,30,60,80,315);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2024,572,8607916815,3918977716,439981243.89,1581129888.42,1592696807.06,1028045053.6,585455017.94,212917257.09,10,562,0,14,34,65,85,364);
--> statement-breakpoint
INSERT INTO yearly_metrics (year,films,domestic,top10,tier2,tier3,tier4,tier5,tier6,tier7,n_top10,n_rest,n_t2,n_t3,n_t4,n_t5,n_t6,n_t7) VALUES (2025,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
