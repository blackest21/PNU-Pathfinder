--
-- PostgreSQL database dump
--

\restrict 52wrV3CXpQqgCxbuu7VWaWM25JTYfnnXYJxEsWkATCcZDLM3tz2WqdaPVRccTBP

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: academic_programs; Type: TABLE DATA; Schema: public; Owner: idowon
--

INSERT INTO public.academic_programs (id, department, major, created_at, curriculum_year) VALUES (2, '의생명융합공학부', '첨단바이오공학전공', '2026-05-02 02:21:17.142172+09', 2024);


--
-- Data for Name: curriculum_courses; Type: TABLE DATA; Schema: public; Owner: idowon
--

INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (2, 2, '효원핵심교양', 'ZE1000091', '고전읽기와토론', 'Reading Classics of Great Literature', '1-1', 2, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (3, 2, '효원핵심교양', 'ZE1000453', '인공지능과디지털사고', 'AI Literacy and Digital Thinking', '1-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (4, 2, '효원핵심교양', 'ZE1000113', '대학영어', 'College English', '1-2', 2, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (5, 2, '효원핵심교양', 'ZE1000118', '공학작문및발표', 'Technical Writing & Presentation', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (6, 2, '효원균형교양', 'ZFz000091', '사상과역사', 'Philosophy and History', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (7, 2, '효원균형교양', 'ZFz000092', '사회와문화', 'Society and Culture', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (8, 2, '효원균형교양', 'ZFz000093', '문학과예술', 'Literature and Arts', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (9, 2, '효원균형교양', 'ZFz000094', '과학과기술', 'Science and Technology', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (10, 2, '효원균형교양', 'ZFz000096', '세계와소통', 'Global Communication', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (11, 2, '효원균형교양', 'ZFz000098', '효원브릿지', 'Hyowon Bridge', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (12, 2, '효원창의교양', 'ZF1200682', '공학자의눈으로세계를보다', 'Engineers See the World', '1-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (13, 2, '효원창의교양', 'ZFz000095', '건강과레포츠', 'Health and Recreation/Sports', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (14, 2, '효원창의교양', 'ZFz000097', '융합과 창의', 'Convergence and Creativity', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (15, 2, '효원창의교양', 'ZFz000110', '인성과 사회봉사', 'Character and Community Service', '1-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (16, 2, '기초교양', 'ZF1500697', '공학미적분학', 'Differential Equation', '1-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (17, 2, '전공기초', 'BX1500037', '일반물리학(Ⅰ)', 'General Physics(Ⅰ)', '1-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (18, 2, '전공기초', 'BX1500043', '일반화학(Ⅰ)', 'General Chemistry(Ⅰ)', '1-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (19, 2, '전공기초', 'BX1600701', '생명과학(Ⅰ)', 'Biological Science(Ⅰ)', '1-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (20, 2, '전공기초', 'BX1500215', '일반물리학(Ⅱ)', 'General Physics(Ⅱ)', '1-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (21, 2, '전공기초', 'BX1600702', '프로그래밍원리와실습', 'Programming Principles and Practice', '1-2', 4, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (22, 2, '전공기초', 'BX1600706', '생명과학(Ⅱ)', 'Biological Science(Ⅱ)', '1-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (23, 2, '전공기초', 'BX1600707', '일반화학(Ⅱ)', 'General Chemistry(Ⅱ)', '1-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (24, 2, '전공기초', 'BX3600079', '확률및통계', 'Probability and Statistics', '1-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (25, 2, '전공필수', 'BX2001047', '선형대수학', 'Linear Algebra', '2-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (26, 2, '전공필수', 'BX2001048', '미분방정식', 'Differential Equation', '2-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (27, 2, '전공필수', 'BX2003490', '인체해부생리학', 'Human Anatomy and Physiology', '2-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (28, 2, '일반선택', 'BX1101254', '효원전공탐색', 'Introduction to College Majors', '1-1', 2, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (29, 2, '전공필수', 'AB2003552', '첨단바이오공학입문', 'INTRODUCTION TO ADVANCED BIOENGINEERING', '2-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (30, 2, '전공필수', 'AB2001049', '분자세포생물학', 'MOLECULAR CELL BIOLOGY', '2-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (31, 2, '전공필수', 'AB2002386', '생물공정공학', 'BIOPROCESS ENGINEERING', '2-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (32, 2, '전공필수', 'AB2001184', '의생명정보학개론', 'INTRODUCTION TO BIOMEDICAL INFORMATICS', '3-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (33, 2, '전공필수', 'AB2002390', '유전공학', 'GENETIC ENGINEERING', '3-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (34, 2, '전공필수', 'AB2700085', '생화학', 'BIOCHEMISTRY', '3-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (35, 2, '전공필수', 'AB2002389', '첨단바이오실험', 'ADVANCED BIOENGINEERING LABORATORY', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (36, 2, '전공필수', 'AB2002394', '면역학', 'IMMUNOLOGY', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (37, 2, '전공필수', 'AB2001053', '♣산학캡스톤디자인', 'INDUSTRY-ACADEMY CAPSTONE DESIGN', '4-1,2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (38, 2, '전공선택', 'AB2001633', '응용통계학', 'APPLIED STATISTICS', '2-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (39, 2, '전공선택', 'AB2002371', '유기화학', 'ORGANIC CHEMISTRY', '2-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (40, 2, '전공선택', 'AB3600087', '기계학습개론', 'MACHINE LEARNING', '2-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (41, 2, '전공선택', 'AB2001051', '인공지능', 'ARTIFICIAL INTELLIGENCE', '3-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (42, 2, '전공선택', 'AB2002388', '생물분리공학', 'BIOSEPARATION ENGINEERING', '3-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (43, 2, '전공선택', 'AB2002422', '세포공학실험', 'CELLULAR ENGINEERING LABORATORY', '3-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (44, 2, '전공선택', 'AB3600091', '알고리즘', 'ALGORITHM', '3-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (45, 2, '전공선택', 'AB2001185', '의생명과학 프로그래밍', 'PROGRAMMING FOR BIOMEDICAL SCIENCES', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (46, 2, '전공선택', 'AB2001885', '열역학', 'PHYSICAL CHEMISTRY FOR ENGINEERING', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (47, 2, '전공선택', 'AB2002387', '유전체학', 'GENOMICS', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (48, 2, '전공선택', 'AB2800460', '생체재료', 'BIOMATERIALS', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (49, 2, '전공선택', 'AB3600066', '생명정보학', 'BIOINFORMATICS', '3-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (50, 2, '전공선택', 'AB2001138', '바이오헬스 진로설계', 'CAREER DESIGN IN HEALTHCARE INDUSTRY', '4-1', 1, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (51, 2, '전공선택', 'AB2001634', '의료기기인허가', 'MEDICAL DEVICE REGULATORY AFFAIRS', '4-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (52, 2, '전공선택', 'AB2002391', '단백질공학', 'PROTEIN ENGINEERING', '4-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (53, 2, '전공선택', 'AB2002395', '신약개발및설계', 'DRUG DEVELOPMENT AND DESIGN', '4-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (54, 2, '전공선택', 'AB2600088', '조직공학', 'TISSUE ENGINEERING', '4-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (55, 2, '전공선택', 'AB3600092', '바이오센서공학', 'BIOSENSOR ENGINEERING', '4-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (56, 2, '전공선택', 'AB3600541', '산학인턴십(Ⅰ)', 'INDUSTRY-ACADEMY INTERNSHIP(I)', '4-1', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (57, 2, '전공선택', 'AB2001135', '글로벌헬스케어산업', 'GLOBAL HEALTHCARE INDUSTRY', '4-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (58, 2, '전공선택', 'AB2001183', '바이오이미징', 'BIOMEDICAL OPTICAL IMAGING', '4-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (59, 2, '전공선택', 'AB2001248', '산학인턴십(Ⅱ)', 'INDUSTRY-ACADEMY INTERNSHIP(II)', '4-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (60, 2, '전공선택', 'AB2002392', '시스템생물학', 'SYSTEMS BIOLOGY', '4-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (61, 2, '전공선택', 'AB2002393', '약물역학', 'PHARMACOKINETICS AND DYNAMICS', '4-2', 3, '2026-05-02 02:21:17.142172+09', NULL);
INSERT INTO public.curriculum_courses (id, program_id, completion_category, course_number, course_name_ko, course_name_en, recommended_semester, credits, created_at, description) VALUES (62, 2, '전공선택', 'AB3600099', '나노의학', 'NANO MEDICINE', '4-2', 3, '2026-05-02 02:21:17.142172+09', NULL);


--
-- Data for Name: graduation_requirements; Type: TABLE DATA; Schema: public; Owner: idowon
--

INSERT INTO public.graduation_requirements (id, program_id, liberal_required, liberal_elective, major_basic, major_required, major_elective, general_elective, created_at, total_credits) VALUES (2, 2, 10, 15, 25, 36, 41, 6, '2026-05-02 02:21:17.142172+09', 133);


--
-- Name: academic_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: idowon
--

SELECT pg_catalog.setval('public.academic_programs_id_seq', 2, true);


--
-- Name: curriculum_courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: idowon
--

SELECT pg_catalog.setval('public.curriculum_courses_id_seq', 62, true);


--
-- Name: graduation_requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: idowon
--

SELECT pg_catalog.setval('public.graduation_requirements_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 52wrV3CXpQqgCxbuu7VWaWM25JTYfnnXYJxEsWkATCcZDLM3tz2WqdaPVRccTBP

