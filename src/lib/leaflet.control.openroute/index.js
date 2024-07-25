import mbPolyline from '@mapbox/polyline';
import ko from 'knockout';
import L from 'leaflet';
import Openrouteservice from 'openrouteservice-js';

import config from '~/config';
import Contextmenu from '~/lib/contextmenu';
import {makeButtonWithBar} from '~/lib/leaflet.control.commons';

import layout from './control.html';
import iconPointerStart from './pointer-start.svg';
import iconPointer from './pointer.svg';
import '~/lib/controls-styles/controls-styles.css';
import './style.css';

L.Control.OpenRoute = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    includes: L.Mixin.Events,

    initialize: function(options) {
        L.Control.prototype.initialize.call(this, options);
        this.orsDirections = new Openrouteservice.Directions({api_key: config.openRouteKey});
        this.points = {
            start: null,
            end: null,
        };
        this.polylineLayer = null;
        const iconSingle = L.icon({iconUrl: iconPointer, iconSize: [30, 30]});
        const iconStart = L.icon({iconUrl: iconPointerStart, iconSize: [30, 30]});
        const iconEnd = L.icon({iconUrl: iconPointerStart, iconSize: [30, 30]});
        this.markers = {
            single: L.marker([0, 0], {icon: iconSingle, draggable: true, which: 'start'})
                .on('drag', this.onMarkerDrag, this)
                .on('click', L.DomEvent.stopPropagation),
            start: L.marker([0, 0], {
                icon: iconStart,
                draggable: true,
                which: 'start',
                rotationOrigin: 'center center',
            })
                .on('drag', this.onMarkerDrag, this)
                .on('click', L.DomEvent.stopPropagation),
            end: L.marker([0, 0], {
                icon: iconEnd,
                draggable: true,
                which: 'end',
                rotationOrigin: 'center center',
            })
                .on('drag', this.onMarkerDrag, this)
                .on('click', L.DomEvent.stopPropagation),
        };
    },

    onAdd: function(map) {
        this._map = map;
        const {container, link, barContainer} = makeButtonWithBar(
            'leaflet-control-openroute',
            'Find routes',
            'icon-route'
        );
        this._container = container;
        L.DomEvent.on(link, 'click', this.onClick, this);

        barContainer.innerHTML = layout;
        ko.applyBindings(this, barContainer);
        return container;
    },

    onClick: function() {
        if (this.isEnabled()) {
            this.disableControl();
        } else {
            this.enableControl();
        }
    },

    onMarkerDrag: function(e) {
        const marker = e.target;
        this.setPoints({[marker.options.which]: marker.getLatLng()});
    },

    enableControl: function() {
        L.DomUtil.addClass(this._map._container, 'leaflet-point-placing');
        L.DomUtil.addClass(this._container, 'active');
        L.DomUtil.addClass(this._container, 'highlight');
        L.DomUtil.addClass(this._map._container, 'openroute-control-active');
        this._map.on('click', this.onMapClick, this);
        this.fire('enabled');
        this._map.clickLocked = true;
        this._enabled = true;
    },

    disableControl: function() {
        L.DomUtil.removeClass(this._map._container, 'leaflet-point-placing');
        L.DomUtil.removeClass(this._container, 'active');
        L.DomUtil.removeClass(this._container, 'highlight');
        L.DomUtil.removeClass(this._map._container, 'openroute-control-active');
        this._map.off('click', this.onMapClick, this);
        this._map.clickLocked = false;
        this._enabled = false;
    },

    isEnabled: function() {
        return Boolean(this._enabled);
    },

    setPoints: async function(points) {
        Object.assign(this.points, points);
        points = this.points;
        if (points.start && !points.end) {
            this.markers.single.setLatLng(points.start).addTo(this._map);
        } else {
            this.markers.single.removeFrom(this._map);
        }
        if (points.start && points.end) {
            this.markers.start.setLatLng(points.start).addTo(this._map);
            this.markers.end.setLatLng(points.end).addTo(this._map);
        } else {
            this.markers.start.removeFrom(this._map);
            this.markers.end.removeFrom(this._map);
        }
        this.updateValuesDisplay();
    },

    onMapClick: function(e) {
        if (!this.points.start && !this.points.end) {
            this.setPoints({start: e.latlng});
        } else if (this.points.start && !this.points.end) {
            this.setPoints({end: e.latlng});
        } else if (this.points.start && this.points.end) {
            this.setPoints({start: e.latlng, end: null});
        }
    },

    updateValuesDisplay: async function() {
        if (this.points.start && this.points.end) {
            try {
                const points = this.points;
                const json = await this.orsDirections.calculate({
                    coordinates: [
                        [points.start.lng, points.start.lat],
                        [points.end.lng, points.end.lat],
                    ],
                    profile: 'driving-car',
                    extra_info: ['waytype', 'steepness'],
                    format: 'json',
                    api_version: 'v2',
                });
                const coordinates = mbPolyline.decode(json.routes[0].geometry);
                // Add your own result handling here
                this.polylineLayer = L.polyline(coordinates, {color: 'blue'}).addTo(this._map);
                this.polylineLayer.on('contextmenu', (e) => {
                    this.onDirectionRightClickShowMenu(e, this.polylineLayer, points);
                });
                this._map.fitBounds(this.polylineLayer.getBounds(), {
                    padding: [10, 30],
                });
            } catch (e) {
                alert('We are unable to find direction');
            }
        }
    },

    onDirectionRightClickShowMenu: function(e, polylineLayer, points) {
        const menu = new Contextmenu([
            {
                text: 'Add as Track',
                callback: () => {
                    this.createNewTrackFromDirection(e, polylineLayer, points);
                },
            },
            {
                text: 'Delete Route',
                callback: () => {
                    this.deleteTrack(e, polylineLayer, points);
                },
            },
        ]);
        menu.show(e);
    },
    createNewTrackFromDirection: function(e, line, points) {
        this.fire('saveTrack', {e, line, points});
    },
    deleteTrack: function() {
        if (this.polylineLayer) {
            // remove polyline layer
            this.polylineLayer.remove();
        }
    }
});
