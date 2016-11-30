"use strict";

var __root = '../../../..';
var __src = __root + '/src';
var __js = __src + '/js';
var __config = __root + '/config';

var	express = require( 'express' ),
	app = express();

var auth = require( __js + '/authentication' ),
	discourse = require( __js + '/discourse' ),
	Permissions = require( __js + '/database' ).Permissions,
	Members = require( __js + '/database' ).Members;

var messages = require( __src + '/messages.json' );

var config = require( __config + '/config.json' );

var app_config = {};

app.set( 'views', __dirname + '/views' );

app.use( function( req, res, next ) {
	res.locals.app = app_config;
	res.locals.breadcrumb.push( {
		name: app_config.title,
		url: app.mountpath
	} );
	res.locals.activeApp = app_config.uid;
	next();
} );

app.get( '/', auth.isMember, function( req, res ) {
	res.render( 'map' );
} );

app.get( '/data.json', auth.isMember, function( req, res ) {
	Permissions.findOne( { slug: 'member' }, function( err, membership_permission ) {
		Members.find( function( err, members ) {
			var locations = [];
			for ( var m in members ) {
				var member = members[m];
				if ( member.postcode_coordinates.lat != undefined )
					locations.push( member.postcode_coordinates );
			}
			locations.sort();
			res.send( JSON.stringify( locations ) );
		} );
	} );
} );

module.exports = function( config ) {
	app_config = config;
	return app;
};