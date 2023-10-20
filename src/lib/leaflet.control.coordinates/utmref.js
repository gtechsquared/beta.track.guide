/* eslint-disable no-use-before-define */
/**
 * Created by Johannes Rudolph <johannes.rudolph@gmx.com> on 01.09.2016.
 */

/**
 *
 * @type {{fromUTM: UTMREF.fromUTM, toUTM: UTMREF.toUTM}}
 */
const UTMREF = {
    /**
     *
     * @param {{zone: string, x: number, y: number}}
     * @returns {{zone, band: string, x: string, y: string}}
     */
    fromUTM: function (utm) {
        // Copyright (c) 2006, HELMUT H. HEIMEIER

        if (utm === undefined) {
            return null;
        }

        const zone = utm.zone;
        const ew = utm.x;
        const nw = utm.y;

        // Laengenzone zone, Ostwert ew und Nordwert nw im WGS84 Datum
        const z1 = zone.substr(0, 2);
        // const z2 = zone.substr(2, 1);
        const ew1 = parseInt(ew.substr(0, 2), 10);
        const nw1 = parseInt(nw.substr(0, 2), 10);
        const ew2 = ew.substr(2, 5);
        const nw2 = nw.substr(2, 5);

        const mEast = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const mNorth = 'ABCDEFGHJKLMNPQRSTUV';

        /* if (z1 < "01" || z1 > "60" || z2 < "C" || z2 > "X") {
            alert(z1 + z2 + " ist keine gueltige UTM Zonenangabe"); // jshint ignore:line
        }*/

        let mCe;
        let i = z1 % 3;
        if (i === 1) {
            mCe = ew1 - 1;
        }
        if (i === 2) {
            mCe = ew1 + 7;
        }
        if (i === 0) {
            mCe = ew1 + 15;
        }

        i = z1 % 2;
        let mCn;
        if (i === 1) {
            mCn = 0;
        } else {
            mCn = 5;
        }

        i = nw1;
        while (i - 20 >= 0) {
            i -= 20;
        }

        mCn += i;
        if (mCn > 19) {
            mCn -= 20;
        }

        const band = mEast.charAt(mCe) + mNorth.charAt(mCn);

        return {zone: zone, band: band, x: ew2, y: nw2};
    },

    /**
     *
     * @param {{zone, band: string, x: string, y: string}}
     * @returns {{zone: string, x: number, y: number}}
     */
    toUTM: function (mgr) {
        // Copyright (c) 2006, HELMUT H. HEIMEIER

        // Laengenzone zone, Ostwert ew und Nordwert nw im WGS84 Datum
        const mEast0 = 'STUVWXYZ';
        const mEast1 = 'ABCDEFGH';
        const mEast2 = 'JKLMNPQR';
        // const mNorth_0 = 'FGHJKLMNPQRSTUVABCDE';
        // const mNorth_1 = 'ABCDEFGHJKLMNPQRSTUV';

        // zone = raster.substr(0,3);
        const zone = mgr.zone;
        const rEast = mgr.band.substr(0, 1);
        // const r_north = mgr.band.substr(1, 1);

        const i = parseInt(zone.substr(0, 2), 10) % 3;
        let mCe;
        if (i === 0) {
            mCe = mEast0.indexOf(rEast) + 1;
        }
        if (i === 1) {
            mCe = mEast1.indexOf(rEast) + 1;
        }
        if (i === 2) {
            mCe = mEast2.indexOf(rEast) + 1;
        }
        const ew = '0' + mCe;

        const mCn = this._mgr2utm_find_mCn(zone);

        let nw;
        if (mCn.length === 1) {
            nw = '0' + mCn;
        } else {
            nw = String(mCn);
        }

        return {zone: zone, x: ew, y: nw};
    },
};

export default UTMREF;