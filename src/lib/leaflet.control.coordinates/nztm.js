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
        const LLarray = [lat, lon];
        // Enter constants
        const a = 6378137.0; // Semi-major axis of reference ellipsoid
        // Ellipsoidal flattening, this could be one of two values, but makes vary little difference
        const f = 1 / 298.257222101;
        const phizero = (0.0001 * Math.PI) / 180; // Origin latitude
        const lambdazero = (173.0001 * Math.PI) / 180; // Origin longitude
        const Nzero = 10000000.0; // False Northing
        const Ezero = 1600000.0; // False Easting
        const kzero = 0.9996; // Central meridian scale factor

        // Pass Lat and Long variables in and convert to radians
        const phi = (LLarray[0] * Math.PI) / 180; // latitude; Latitude of computation point
        const lambda = (LLarray[1] * Math.PI) / 180; // longitude; Longitude of computation point

        // Work out projection constants
        const esq = 2 * f - f ** 2; // Projection constant
        const A0 = 1 - esq / 4 - (3 * esq ** 2) / 64 - (5 * esq ** 3) / 256; // Projection constant
        const A2 = 0.375 * (esq + esq ** 2 / 4 + (15 * esq ** 3) / 128); // Projection constant
        const A4 = (15 / 256) * (esq ** 2 + (3 * esq ** 3) / 4); // Projection constant
        const A6 = (35 * esq ** 3) / 3072; // Projection constant
        // Projection constant
        const m = a * (A0 * phi - A2 * Math.sin(2 * phi) + A4 * Math.sin(4 * phi) - A6 * Math.sin(6 * phi));
        // Projection constant
        const mzero =
            a * (A0 * phizero - A2 * Math.sin(2 * phizero) + A4 * Math.sin(4 * phizero) - A6 * Math.sin(6 * phizero));
        // Determine variables at coordinates supplied
        const rho = (a * (1 - esq)) / (1 - esq * Math.sin(phi) ** 2) ** 1.5;
        const upsilon = a / (1 - esq * Math.sin(phi) ** 2) ** 0.5;
        const psi = upsilon / rho;
        const t = Math.tan(phi);
        const omega = lambda - lambdazero;

        // Calculate Northing
        const Nterm1 = (omega ** 2 / 2) * upsilon * Math.sin(phi) * Math.cos(phi);
        const Nterm2 = (omega ** 4 / 24) * upsilon * Math.sin(phi) * Math.cos(phi) ** 3 * (4 * psi ** 2 + psi - t ** 2);
        const Nterm3 =
            (omega ** 6 / 720) *
            upsilon *
            Math.sin(phi) *
            Math.cos(phi) ** 5 *
            (8 * psi ** 4 * (11 - 24 * t ** 2) -
                28 * psi ** 3 * (1 - 6 * t ** 2) +
                psi ** 2 * (1 - 32 * t ** 2) -
                psi * (2 * t ** 2) +
                t ** 4);
        const Nterm4 =
            (omega ** 8 / 40320) *
            upsilon *
            Math.sin(phi) *
            Math.cos(phi) ** 7 *
            (1385 - 3111 * t ** 2 + 543 * t ** 4 - t ** 6);
        let N = Nzero + kzero * (m - mzero + Nterm1 + Nterm2 + Nterm3 + Nterm4); // projection northing

        // Calculate Easting
        const Eterm1 = (omega ** 2 / 6) * Math.cos(phi) ** 2 * (psi - t ** 2);
        const Eterm2 =
            (omega ** 4 / 120) *
            Math.cos(phi) ** 4 *
            (4 * psi ** 3 * (1 - 6 * t ** 2) + psi ** 2 * (1 + 8 * t ** 2) - psi * 2 * t ** 2 + t ** 4);
        const Eterm3 = (omega ** 6 / 5040) * Math.cos(phi) ** 6 * (61 - 479 * t ** 2 + 179 * t ** 4 - t ** 6);
        let E = Ezero + kzero * upsilon * omega * Math.cos(phi) * (1 + Eterm1 + Eterm2 + Eterm3);

        // Round to 2dp and concatenate into a single variable
        N = Math.round((N + Number.EPSILON) * 100) / 100;
        E = Math.round((E + Number.EPSILON) * 100) / 100;
        const NE = N + ', ' + E;

        return NE;
    },
};

export default NZTM;
