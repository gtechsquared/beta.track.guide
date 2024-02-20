/* eslint-disable no-use-before-define */
/**
 * Created by Johannes Rudolph <johannes.rudolph@gmx.com> on 01.09.2016.
 */

/**
 *
 * @type {{fromLatLng: NAC.fromLatLng, _nac2Letter: NAC._nac2Letter}}
 */
const NZTM = {
    /**
     *
     * @param {{lat: number, lng: number}}
     * @returns {string}
     */
    fromLatLng: function (latlng) {
        const lat = latlng.lat;
        const lon = latlng.lng;
        // Split LL variable into an array
        var LLarray = [lat, lon];
        console.log('LLarray', LLarray);
        // Enter constants
        var a = 6378137.0; //Semi-major axis of reference ellipsoid
        var f = 1 / 298.257222101; //Ellipsoidal flattening, this could be one of two values, but makes vary little difference
        var phizero = (0.0001 * Math.PI) / 180; //Origin latitude
        var lambdazero = (173.0001 * Math.PI) / 180; //Origin longitude
        var Nzero = 10000000.0; //False Northing
        var Ezero = 1600000.0; //False Easting
        var kzero = 0.9996; //Central meridian scale factor

        // Pass Lat and Long variables in and convert to radians
        var phi = (LLarray[0] * Math.PI) / 180; //latitude; //Latitude of computation point
        var lambda = (LLarray[1] * Math.PI) / 180; //longitude; //Longitude of computation point

        // Work out projection constants
        var esq = 2 * f - Math.pow(f, 2); //Projection constant
        var A0 = 1 - esq / 4 - (3 * Math.pow(esq, 2)) / 64 - (5 * Math.pow(esq, 3)) / 256; //Projection constant
        var A2 = 0.375 * (esq + Math.pow(esq, 2) / 4 + (15 * Math.pow(esq, 3)) / 128); //Projection constant
        var A4 = (15 / 256) * (Math.pow(esq, 2) + (3 * Math.pow(esq, 3)) / 4); //Projection constant
        var A6 = (35 * Math.pow(esq, 3)) / 3072; //Projection constant
        var m = a * (A0 * phi - A2 * Math.sin(2 * phi) + A4 * Math.sin(4 * phi) - A6 * Math.sin(6 * phi)); //Projection constant
        var mzero =
            a * (A0 * phizero - A2 * Math.sin(2 * phizero) + A4 * Math.sin(4 * phizero) - A6 * Math.sin(6 * phizero)); //Projection constant

        // Determine variables at coordinates supplied
        var rho = (a * (1 - esq)) / Math.pow(1 - esq * Math.pow(Math.sin(phi), 2), 1.5);
        var upsilon = a / Math.sqrt(1 - esq * Math.pow(Math.sin(phi), 2));
        var psi = upsilon / rho;
        var t = Math.tan(phi);
        var omega = lambda - lambdazero;

        // Calculate Northing
        var Nterm1 = (Math.pow(omega, 2) / 2) * upsilon * Math.sin(phi) * Math.cos(phi);
        var Nterm2 =
            (Math.pow(omega, 4) / 24) *
            upsilon *
            Math.sin(phi) *
            Math.pow(Math.cos(phi), 3) *
            (4 * Math.pow(psi, 2) + psi - Math.pow(t, 2));
        var Nterm3 =
            (Math.pow(omega, 6) / 720) *
            upsilon *
            Math.sin(phi) *
            Math.pow(Math.cos(phi), 5) *
            (8 * Math.pow(psi, 4) * (11 - 24 * Math.pow(t, 2)) -
                28 * Math.pow(psi, 3) * (1 - 6 * Math.pow(t, 2)) +
                Math.pow(psi, 2) * (1 - 32 * Math.pow(t, 2)) -
                psi * (2 * Math.pow(t, 2)) +
                Math.pow(t, 4));
        var Nterm4 =
            (Math.pow(omega, 8) / 40320) *
            upsilon *
            Math.sin(phi) *
            Math.pow(Math.cos(phi), 7) *
            (1385 - 3111 * Math.pow(t, 2) + 543 * Math.pow(t, 4) - Math.pow(t, 6));
        var N = Nzero + kzero * (m - mzero + Nterm1 + Nterm2 + Nterm3 + Nterm4); //projection northing

        // Calculate Easting
        var Eterm1 = (Math.pow(omega, 2) / 6) * Math.pow(Math.cos(phi), 2) * (psi - Math.pow(t, 2));
        var Eterm2 =
            (Math.pow(omega, 4) / 120) *
            Math.pow(Math.cos(phi), 4) *
            (4 * Math.pow(psi, 3) * (1 - 6 * Math.pow(t, 2)) +
                Math.pow(psi, 2) * (1 + 8 * Math.pow(t, 2)) -
                psi * 2 * Math.pow(t, 2) +
                Math.pow(t, 4));
        var Eterm3 =
            (Math.pow(omega, 6) / 5040) *
            Math.pow(Math.cos(phi), 6) *
            (61 - 479 * Math.pow(t, 2) + 179 * Math.pow(t, 4) - Math.pow(t, 6));
        var E = Ezero + kzero * upsilon * omega * Math.cos(phi) * (1 + Eterm1 + Eterm2 + Eterm3);

        // Round to 2dp and concatenate into a single variable
        var N = Math.round((N + Number.EPSILON) * 100) / 100;
        var E = Math.round((E + Number.EPSILON) * 100) / 100;
        var NE = N + ', ' + E;

        return NE;
    },
};

export default NZTM;
