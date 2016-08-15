"use strict";

var express = require('express');
var app = express();

var config = require('../config.json');

const AUTH_TOKEN = config.auth;

