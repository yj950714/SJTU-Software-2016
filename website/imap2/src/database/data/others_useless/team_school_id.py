#!/usr/bin/python                                                                                                                                                                              
# -*- coding: utf-8 -*-                                                                                                                                                                        
# __author__ = "JieYao"                                                                                                                                                                        

import DB
import os
import string

teamname = []
school = []
kind = []
track = []
title = []
abstract = []
primarypi = []
secondpi = []
instructor = []

db = DB.database()
with open("information.txt", "r") as tmp_file:
    data = tmp_file.readlines()
info = []
for s in data:
    s = s.rstrip().split("|")
    info += [s]
for i in range(len(info)):
    if info[i][1].strip() == "NULL":
        continue;
    data = db.search("select School_ID from Schools where School_Name = \"%s\";" % info[i][1].strip())
    print data
    print info[i][1]
    db.insert("update Teams set Teams.School_ID = %d where Teams.Team_Name = \"%s\";" % (data[0]["School_ID"], info[i][0].strip()))

db.quit_database()

