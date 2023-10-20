/* eslint-disable no-use-before-define */
/**
 * Created by Johannes Rudolph <johannes.rudolph@gmx.com> on 01.09.2016.
 */

/**
 *
 * @type {{fromLatLng: NAC.fromLatLng, _nac2Letter: NAC._nac2Letter}}
 */
const NAC = {
    /**
     *
     * @param {{lat: number, lng: number}}
     * @returns {string}
     */
    fromLatLng: function (latlng) {
        const lat = latlng.lat;
        const lon = latlng.lng;
        let x = [];
        let y = [];
        const xy = [];
        xy.x = '';
        xy.y = '';
        if (lon >= -180 && lon <= 180) {
            const xlon = (lon + 180) / 360;
            x = this._calcValues(xlon);
        } else {
            x[0] = 0;
        }
        if (lat >= -90 && lat <= 90) {
            const ylat = (lat + 90) / 180;
            y = this._calcValues(ylat);
        } else {
            y[0] = 0;
        }
        for (let i = 0; i < x.length; i++) {
            xy.x += this._nac2Letter(x[i]);
        }
        for (let i = 0; i < y.length; i++) {
            xy.y += this._nac2Letter(y[i]);
        }
        return xy;
    },

    /**
     *
     * @param z
     * @returns {Array}
     * @private
     */
    _calcValues: function (z) {
        const ret = [];
        ret[0] = parseInt(z * 30, 10);
        ret[1] = parseInt((z * 30 - ret[0]) * 30, 10);
        ret[2] = parseInt(((z * 30 - ret[0]) * 30 - ret[1]) * 30, 10);
        ret[3] = parseInt((((z * 30 - ret[0]) * 30 - ret[1]) * 30 - ret[2]) * 30, 10);
        ret[4] = parseInt(((((z * 30 - ret[0]) * 30 - ret[1]) * 30 - ret[2]) * 30 - ret[3]) * 30, 10);
        ret[5] = parseInt((((((z * 30 - ret[0]) * 30 - ret[1]) * 30 - ret[2]) * 30 - ret[3]) * 30 - ret[4]) * 30, 10);
        return ret;
    },

    /**
     *
     * @param number
     * @returns {string}
     * @private
     */
    _nac2Letter: function (number) {
        const nacLetters = '0123456789BCDFGHJKLMNPQRSTVWXZ';
        if (!isNaN(number) && number < 30) {
            return nacLetters.substr(number, 1);
        }
        return 0;
    },
};

export default NAC;
