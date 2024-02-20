import L from 'leaflet';
import './style.css';

L.Control.BetterScale = L.Control.extend({
    options: {
        position: 'bottomleft',
        maxWidth: 150,
        metric: false,
        imperial: true,
        updateWhenIdle: false,
    },
    onAdd(t) {
        this._map = t;
        const e = 'leaflet-control-better-scale';
        const i = L.DomUtil.create('div', e);
        const n = this.options;
        const s = L.DomUtil.create('div', `${e}-ruler`, i);
        L.DomUtil.create('div', `${e}-ruler-block ${e}-upper-first-piece`, s);
        L.DomUtil.create('div', `${e}-ruler-block ${e}-upper-second-piece`, s);
        L.DomUtil.create('div', `${e}-ruler-block ${e}-lower-first-piece`, s);
        L.DomUtil.create('div', `${e}-ruler-block ${e}-lower-second-piece`, s);
        this._addScales(n, e, i);
        this.ScaleContainer = i;
        t.on(n.updateWhenIdle ? 'moveend' : 'move', this._update, this);
        t.whenReady(this._update, this);
        // Add click event listener to toggle between metric and imperial
        i.addEventListener('click', () => {
            this.options.metric = !this.options.metric;
            this.options.imperial = !this.options.imperial;
            this._update();
        });
        return i;
    },
    onRemove(t) {
        t.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
    },
    _addScales(t, e, i) {
        this._iScale = L.DomUtil.create('div', `${e}-label-div`, i);
        this._iScaleLabel = L.DomUtil.create('div', `${e}-label`, this._iScale);
        this._iScaleFirstNumber = L.DomUtil.create('div', `${e}-label ${e}-first-number`, this._iScale);
        this._iScaleSecondNumber = L.DomUtil.create('div', `${e}-label ${e}-second-number`, this._iScale);
    },
    _update() {
        const t = this._map.getBounds();
        const e = t.getCenter().lat;
        const i = 6378137 * Math.PI * Math.cos((e * Math.PI) / 180);
        const n = (i * (t.getNorthEast().lng - t.getSouthWest().lng)) / 180;
        const o = this._map.getSize();
        const s = this.options;
        let a = 0;
        if (o.x > 0) {
            a = n * (s.maxWidth / o.x);
        }
        this._updateScales(s, a);
    },
    _updateScales(t, e) {
        // if (t.metric && e) {
        //     this._updateMetric(e);
        // }
        // if (t.imperial && e) {
        //     this._updateImperial(e);
        // }
        if (e) {
            if (t.metric) {
                this._updateMetric(e);
            } else if (t.imperial) {
                this._updateImperial(e);
            }
        }
    },
    _updateMetric(t) {
        let e;
        let i;
        let n;
        let o;
        let s;
        const a = t;
        const r = this._iScaleFirstNumber;
        const h = this._iScaleSecondNumber;
        const l = this._iScale;
        const u = this._iScaleLabel;
        u.innerHTML = '0';
        if (a > 500) {
            e = a / 1000;
            i = this._getRoundNum(e);
            o = this._getRoundNum(e / 2);
            l.style.width = `${this._getScaleWidth(i / e)}px`;
            r.innerHTML = o;
            h.innerHTML = `${i}km`;
        } else {
            n = this._getRoundNum(a);
            s = this._getRoundNum(a / 2);
            l.style.width = `${this._getScaleWidth(n / a)}px`;
            r.innerHTML = s;
            h.innerHTML = `${n}m`;
        }
    },
    _updateImperial(t) {
        let e;
        let i;
        let n;
        let o;
        let s;
        const a = 3.2808399 * t;
        const r = this._iScaleFirstNumber;
        const h = this._iScaleSecondNumber;
        const l = this._iScale;
        const u = this._iScaleLabel;
        u.innerHTML = '0';
        if (a > 2640) {
            e = a / 5280;
            i = this._getRoundNum(e);
            o = this._getRoundNum(e / 2);
            l.style.width = `${this._getScaleWidth(i / e)}px`;
            r.innerHTML = o;
            h.innerHTML = `${i}mi`;
        } else {
            n = this._getRoundNum(a);
            s = this._getRoundNum(a / 2);
            l.style.width = `${this._getScaleWidth(n / a)}px`;
            r.innerHTML = s;
            h.innerHTML = `${n}ft`;
        }
    },
    _getScaleWidth(t) {
        return Math.round(this.options.maxWidth * t) - 10;
    },
    _getRoundNum(t) {
        if (t >= 2) {
            const e = 10 ** (String(Math.floor(t)).length - 1);
            let i = t / e;
            if (i >= 10) {
                i = 10;
            } else if (i >= 5) {
                i = 5;
            } else if (i >= 3) {
                i = 3;
            } else if (i >= 2) {
                i = 2;
            } else {
                i = 1;
            }
            return e * i;
        }
        return (Math.round(100 * t) / 100).toFixed(1);
    },
});
