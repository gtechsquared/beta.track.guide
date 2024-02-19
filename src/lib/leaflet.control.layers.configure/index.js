import L from 'leaflet';
import './style.css';
import enableTopRow from '~/lib/leaflet.control.layers.top-row';
import ko from 'knockout';
import {notify} from '~/lib/notifications';
import * as logging from '~/lib/logging';
import safeLocalStorage from '~/lib/safe-localstorage';
import './customLayer';

function enableConfig(control, {layers, customLayersOrder}) {
    const originalOnAdd = control.onAdd;
    const originalUnserializeState = control.unserializeState;
    const originalAddItem = control._addItem;
    if (control._configEnabled) {
        return;
    }
    enableTopRow(control);

    L.Util.extend(control, {
        _configEnabled: true,
        _allLayersGroups: layers,
        _allLayers: [].concat(...layers.map((group) => group.layers)),
        _customLayers: ko.observableArray(),

        onAdd: function(map) {
            const container = originalOnAdd.call(this, map);
            this.__injectConfigButton();
            return container;
        },

        __injectConfigButton: function() {
            const configButton = L.DomUtil.create('div', 'button icon-settings');
            configButton.title = 'Configure layers';
            this._topRow.appendChild(configButton);
            L.DomEvent.on(configButton, 'click', this._onConfigButtonClick, this);

            const newCustomLayerButton = L.DomUtil.create('div', 'button icon-edit');
            newCustomLayerButton.title = 'Add custom layer';
            this._topRow.appendChild(newCustomLayerButton);
            L.DomEvent.on(newCustomLayerButton, 'click', this.onCustomLayerCreateClicked, this);
        },

        _initializeLayersState: function() {
            let storedLayersEnabled = {};
            const serialized = safeLocalStorage.getItem('layersEnabled');
            if (serialized) {
                try {
                    storedLayersEnabled = JSON.parse(serialized);
                } catch (e) {
                    logging.captureMessage('Failed to load enabled layers from localstorage - invalid json', {
                        'localstorage.layersEnabled': serialized.slice(0, 1000),
                    });
                }
            }
            // restore custom layers;
            // custom layers can be upgraded in loadCustomLayerFromString and their code will change
            const storedLayersEnabled2 = {};
            for (let [code, isEnabled] of Object.entries(storedLayersEnabled)) {
                let newCode = this.loadCustomLayerFromString(code) || code;
                storedLayersEnabled2[newCode] = isEnabled;
            }

            for (let layer of [...this._allLayers, ...this._customLayers()]) {
                let enabled = storedLayersEnabled2[layer.layer.options.code];
                // if storage is empty enable only default layers
                // if new default layer appears it will be enabled
                if (typeof enabled === 'undefined') {
                    enabled = layer.isDefault;
                }
                layer.enabled = enabled;
                layer.checked = ko.observable(enabled);
                layer.description = layer.description || '';
            }
            this.updateEnabledLayers();
        },

        _onConfigButtonClick: function() {
            this.showLayersSelectWindow();
        },

        _initLayersSelectWindow: function() {
            if (this._configWindow) {
                return;
            }

            const container = (this._configWindow = L.DomUtil.create('div', 'leaflet-layers-dialog-wrapper'));
            L.DomEvent.disableClickPropagation(container).disableScrollPropagation(container);
            container.innerHTML = `
<div class="leaflet-layers-select-window">
    <form>
        <!-- ko foreach: _allLayersGroups -->
            <div class="section-header" data-bind="html: group"></div>
            <!-- ko foreach: layers -->
                <label>
                    <input type="checkbox" data-bind="checked: checked"/>
                    <span data-bind="text: title">
                    </span><!--  ko if: description -->
                    <span data-bind="html: description || ''"></span>
                    <!-- /ko -->
                </label>
            <!-- /ko -->
        <!-- /ko -->
        <div data-bind="if: _customLayers().length" class="section-header">Custom layers</div>
        <!-- ko foreach: _customLayers -->
                <label>
                    <input type="checkbox" data-bind="checked: checked"/>
                    <span data-bind="text: title"></span>
                </label>
        <!-- /ko -->
    </form>
    <div class="buttons-row">
        <div href="#" class="button" data-bind="click: onSelectWindowOkClicked">Ok</div>
        <div href="#" class="button" data-bind="click: onSelectWindowCancelClicked">Cancel</div>
        <div href="#" class="button" data-bind="click: onSelectWindowResetClicked">Reset</div>
    </div>            
</div>
                `;
            ko.applyBindings(this, container);
        },

        showLayersSelectWindow: function() {
            if (this._configWindowVisible || this._customLayerWindow) {
                return;
            }
            [...this._allLayers, ...this._customLayers()].forEach((layer) => layer.checked(layer.enabled));
            this._initLayersSelectWindow();
            this._map._controlContainer.appendChild(this._configWindow);
            this._configWindowVisible = true;
        },

        hideSelectWindow: function() {
            if (!this._configWindowVisible) {
                return;
            }
            this._map._controlContainer.removeChild(this._configWindow);
            this._configWindowVisible = false;
        },

        onSelectWindowCancelClicked: function() {
            this.hideSelectWindow();
        },

        onSelectWindowResetClicked: function() {
            if (!this._configWindow) {
                return;
            }
            [...this._allLayers, ...this._customLayers()].forEach((layer) => layer.checked(layer.isDefault));
        },

        onSelectWindowOkClicked: function() {
            const newEnabledLayers = [];
            for (let layer of [...this._allLayers, ...this._customLayers()]) {
                if (layer.checked()) {
                    if (!layer.enabled) {
                        newEnabledLayers.push(layer);
                    }
                    layer.enabled = true;
                } else {
                    layer.enabled = false;
                }
            }
            this.updateEnabledLayers(newEnabledLayers);
            this.hideSelectWindow();
        },

        onCustomLayerCreateClicked: function() {
            this.showCustomLayerForm(
                [
                    {
                        caption: 'Add layer',
                        callback: (fieldValues) => this.onCustomLayerAddClicked(fieldValues),
                    },
                    {
                        caption: 'Cancel',
                        callback: () => this.onCustomLayerCancelClicked(),
                    },
                ],
                {
                    name: 'Custom layer',
                    url: '',
                    tms: false,
                    maxZoom: 18,
                    isOverlay: false,
                    scaleDependent: false,
                    isTop: true,
                    type: 'tiles',
                    wmsLayers: '',
                    wmsFormat: '',
                    wmsTransparent: true,
                }
            );
        },

        updateEnabledLayers: function(addedLayers) {
            const disabledLayers = [...this._allLayers, ...this._customLayers()].filter((l) => !l.enabled);
            disabledLayers.forEach((l) => this._map.removeLayer(l.layer));
            [...this._layers].forEach((l) => this.removeLayer(l.layer));

            let hasBaselayerOnMap = false;
            const enabledLayers = [...this._allLayers, ...this._customLayers()].filter((l) => l.enabled);
            enabledLayers.sort((l1, l2) => l1.order - l2.order);
            enabledLayers.forEach((l) => {
                l.layer._justAdded = addedLayers && addedLayers.includes(l);
                const {
                    layer: {
                        options: {isOverlay},
                    },
                } = l;
                if (isOverlay) {
                    this.addOverlay(l.layer, l.title);
                } else {
                    this.addBaseLayer(l.layer, l.title);
                }
                if (!isOverlay && this._map.hasLayer(l.layer)) {
                    hasBaselayerOnMap = true;
                }
            });
            // если нет активного базового слоя, включить первый, если он есть
            if (!hasBaselayerOnMap) {
                for (let layer of enabledLayers) {
                    if (!layer.layer.options.isOverlay) {
                        this._map.addLayer(layer.layer);
                        break;
                    }
                }
            }
            this.storeEnabledLayers();
        },

        storeEnabledLayers: function() {
            const layersState = {};
            for (let layer of [...this._allLayers, ...this._customLayers()]) {
                if (layer.isDefault || layer.enabled || layer.isCustom) {
                    layersState[layer.layer.options.code] = layer.enabled;
                }
            }
            const serialized = JSON.stringify(layersState);
            safeLocalStorage.setItem('layersEnabled', serialized);
        },

        unserializeState: function(values) {
            if (values) {
                values = values.map((code) => {
                    let newCode = this.loadCustomLayerFromString(code);
                    return newCode || code;
                });
                for (let layer of [...this._allLayers, ...this._customLayers()]) {
                    if (layer.layer.options && values.includes(layer.layer.options.code)) {
                        layer.enabled = true;
                    }
                }
                this.updateEnabledLayers();
            }
            this.storeEnabledLayers();
            return originalUnserializeState.call(this, values);
        },

        showCustomLayerForm: function(buttons, fieldValues) {
            if (this._customLayerWindow || this._configWindowVisible) {
                return;
            }
            this._customLayerWindow = L.DomUtil.create(
                'div',
                'leaflet-layers-dialog-wrapper',
                this._map._controlContainer
            );

            L.DomEvent.disableClickPropagation(this._customLayerWindow).disableScrollPropagation(
                this._customLayerWindow
            );

            let customLayerWindow = L.DomUtil.create('div', 'custom-layers-window', this._customLayerWindow);
            let form = L.DomUtil.create('form', '', customLayerWindow);
            L.DomEvent.on(form, 'submit', L.DomEvent.preventDefault);

            const dialogModel = {
                name: ko.observable(fieldValues.name),
                url: ko.observable(fieldValues.url),
                tms: ko.observable(fieldValues.tms),
                scaleDependent: ko.observable(fieldValues.scaleDependent),
                maxZoom: ko.observable(fieldValues.maxZoom),
                isOverlay: ko.observable(fieldValues.isOverlay),
                isTop: ko.observable(fieldValues.isTop),
                type: ko.observable(fieldValues.type),
                wmsLayers: ko.observable(fieldValues.wmsLayers),
                wmsFormat: ko.observable(fieldValues.wmsFormat),
                wmsTransparent: ko.observable(fieldValues.wmsTransparent),
                buttons: buttons,
                availableWmsData: {
                    layers: ko.observableArray(),
                    formats: ko.observableArray(),
                    selectedLayer: ko.observable(),
                    selectedFormat: ko.observable(),
                    received: ko.observable(false),
                    error: ko.observable(''),
                },
                buttonClicked: function buttonClicked(callbackN) {
                    const fieldValues = {
                        name: dialogModel.name().trim(),
                        url: dialogModel.url().trim(),
                        tms: dialogModel.tms(),
                        scaleDependent: dialogModel.scaleDependent(),
                        maxZoom: dialogModel.maxZoom(),
                        isOverlay: dialogModel.isOverlay(),
                        isTop: dialogModel.isTop(),
                        type: dialogModel.type(),
                        wmsLayers: dialogModel.wmsLayers(),
                        wmsFormat: dialogModel.wmsFormat(),
                        wmsTransparent: dialogModel.wmsTransparent(),
                    };
                    buttons[callbackN].callback(fieldValues);
                },
                isWMS: function() {
                    return this.type() === 'wms';
                },
                testWMS: function() {
                    const url = `${dialogModel.url().split('?')[0]}?request=GetCapabilities&service=WMS`;
                    fetch(url)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
                        .then((data) => {
                            const mapData = data.getElementsByTagName('GetMap')[0];
                            if (mapData) {
                                const formats = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml'];
                                const formatElements = mapData.getElementsByTagName('Format');
                                for (const formatElement of formatElements) {
                                    const format = formatElement.textContent;
                                    if (formats.includes(format)) {
                                        dialogModel.availableWmsData.formats.push(format);
                                    }
                                }
                                const layerElements = data.getElementsByTagName('Layer');
                                for (let layerElement of layerElements) {
                                    if (layerElement.getAttribute('queryable') === '1') {
                                        const name = layerElement.getElementsByTagName('Name')[0].textContent,
                                            title = ''
                                                .concat(
                                                    layerElement.getElementsByTagName('Title')[0].textContent,
                                                    ' - '
                                                )
                                                .concat(name);
                                        dialogModel.availableWmsData.layers.push({
                                            name: name,
                                            title: title,
                                        });
                                    }
                                }
                                dialogModel.availableWmsData.error('');
                                dialogModel.availableWmsData.received(true);
                            } else {
                                dialogModel.availableWmsData.error('Failed to get WMS capabilities');
                            }
                        })
                        .catch(() => {
                            dialogModel.availableWmsData.error('Failed to get WMS capabilities');
                            dialogModel.availableWmsData.received(false);
                        });
                },
                wmsSetFormat: function() {
                    const selectedFormat = dialogModel.availableWmsData.selectedFormat();
                    if (selectedFormat) {
                        dialogModel.wmsFormat(selectedFormat);
                    }
                },
                wmsAppendLayer: function() {
                    const selectedLayer = dialogModel.availableWmsData.selectedLayer();
                    if (selectedLayer) {
                        let currentLayers = dialogModel.wmsLayers();
                        if (currentLayers) {
                            currentLayers += `,${selectedLayer}`;
                        } else {
                            currentLayers = selectedLayer;
                        }
                        dialogModel.wmsLayers(currentLayers);
                    }
                },
            };

            /* eslint-disable max-len */
            const formHtml = `
<p><a class="doc-link" href="https://leafletjs.com/reference-1.0.3.html#tilelayer" target="_blank">See Leaflet TileLayer documentation for url format</a></p>
<label>Layer name<br/>
<span class="hint">Maximum 40 characters</span><br/>
<input maxlength="40" class="layer-name" data-bind="value: name"/></label><br/>
<label><input type="radio" name="map_type" value="tiles" data-bind="checked: type">Tile Layer</label>
<label><input type="radio" name="map_type" value="wms" data-bind="checked: type">WMS</label>
<br/>
<label>Tile url template<br/><textarea data-bind="value: url" class="layer-url"></textarea></label><br/>
<label><input type="radio" name="overlay" data-bind="checked: isOverlay, checkedValue: false">Base layer</label><br/>
<label><input type="radio" name="overlay" data-bind="checked: isOverlay, checkedValue: true">Overlay</label><br/>
<hr/>
<label><input type="radio" name="top-or-bottom"
        data-bind="checked: isTop, checkedValue: false, enable: isOverlay">Place below other layers</label><br/>
<label><input type="radio" name="top-or-bottom"
        data-bind="checked: isTop, checkedValue: true, enable: isOverlay">Place above other layers</label><br/>
<hr/>
<div data-bind="hidden: isWMS()">
<label><input type="checkbox" data-bind="checked: scaleDependent"/>Content depends on scale(like OSM or Google maps)</label><br/>
<label><input type="checkbox" data-bind="checked: tms" />TMS rows order</label><br />

<label>Max zoom<br>
<select data-bind="options: [9,10,11,12,13,14,15,16,17,18], value: maxZoom"></select></label>
</div>
<div data-bind="visible: isWMS()" style="display: none;">
<b>WMS Settings</b><div class="button button-text button-sm button-right" data-bind="visible: isWMS(), click: testWMS.bind(null)" style="display: none;">Get capabilities</div><br>
<div data-bind="visible: availableWmsData.error" style="display: none;">
<span class="error" data-bind="text: availableWmsData.error"></span>
</div>
<label>Layers<br>
<input maxlength="120" class="layer-name" data-bind="value: wmsLayers"></label>
<div data-bind="visible: availableWmsData.received" style="display: none;">
    <select data-bind="options: availableWmsData.layers(), optionsValue: 'name', optionsText: 'title', value: availableWmsData.selectedLayer"></select>
    <div class="button button-sm button-plus" data-bind="click: wmsAppendLayer.bind(null)">+</div><br>
</div>
<label>Format<br>
<input maxlength="80" class="layer-name" placeholder="image/jpeg" data-bind="value: wmsFormat"></label>
<div data-bind="visible: availableWmsData.received" style="display: none;">
<select data-bind="options: availableWmsData.formats(), value: availableWmsData.selectedFormat"></select>
<div class="button button-sm button-plus" data-bind="click: wmsSetFormat.bind(null)">Set</div><br>
</div>
<label><input type="checkbox" data-bind="checked: wmsTransparent"> Transparent</label><br>
<br>
</div>
<div data-bind="foreach: buttons">
    <a class="button" data-bind="click: $root.buttonClicked.bind(null, $index()), text: caption"></a>
</div>
`;
            /* eslint-enable max-len */
            form.innerHTML = formHtml;
            ko.applyBindings(dialogModel, form);
        },

        _addItem: function(obj) {
            var label = originalAddItem.call(this, obj);
            if (obj.layer.__customLayer) {
                const editButton = L.DomUtil.create('div', 'custom-layer-edit-button icon-edit', label.children[0]);
                editButton.title = 'Edit layer';
                L.DomEvent.on(editButton, 'click', (e) => this.onCustomLayerEditClicked(obj.layer.__customLayer, e));
            }
            if (obj.layer._justAdded) {
                L.DomUtil.addClass(label, 'leaflet-layers-configure-just-added-1');
                setTimeout(() => {
                    L.DomUtil.addClass(label, 'leaflet-layers-configure-just-added-2');
                }, 0);
            }
            return label;
        },

        serializeCustomLayer: function(fieldValues) {
            let s = JSON.stringify(fieldValues);
            s = s.replace(/[\u007f-\uffff]/gu, function(c) {
                return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
            });

            function encodeUrlSafeBase64(s) {
                return btoa(s).replace(/\+/gu, '-').replace(/\//gu, '_');
            }

            return '-cs' + encodeUrlSafeBase64(s);
        },

        customLayerExists: function(fieldValues, ignoreLayer) {
            const serialized = this.serializeCustomLayer(fieldValues);
            for (let layer of this._customLayers()) {
                if (layer !== ignoreLayer && layer.serialized === serialized) {
                    return layer;
                }
            }
            return false;
        },

        checkCustomLayerValues: function(fieldValues) {
            if (!fieldValues.url) {
                return {error: 'Url is empty'};
            }
            if (!fieldValues.name) {
                return {error: 'Name is empty'};
            }
            return {};
        },

        onCustomLayerAddClicked: function(fieldValues) {
            const error = this.checkCustomLayerValues(fieldValues).error;
            if (error) {
                notify(error);
                return;
            }

            const duplicateLayer = this.customLayerExists(fieldValues);
            if (duplicateLayer) {
                let msg = 'Same layer already exists';
                if (!duplicateLayer.enabled) {
                    msg += ' but it is hidden. You can enable it in layers setting.';
                }
                notify(msg);
                return;
            }

            const layer = this.createCustomLayer(fieldValues);
            layer.enabled = true;
            layer.checked = ko.observable(true);
            this._customLayers.push(layer);
            this.hideCustomLayerForm();
            this.updateEnabledLayers();
        },

        createCustomLayer: function(fieldValues) {
            const serialized = this.serializeCustomLayer(fieldValues);
            let tileLayer;
            // Check if the layer type is WMS
            if (fieldValues.type === 'wms') {
                // Configuration specific to WMS layers
                const wmsOptions = {
                    isOverlay: fieldValues.isOverlay,
                    maxNativeZoom: fieldValues.maxZoom,
                    // maxZoom: L.default.maxZoom,
                    layers: fieldValues.wmsLayers,
                    format: fieldValues.wmsFormat,
                    transparent: fieldValues.wmsTransparent,
                };

                // Clean up undefined or empty options
                Object.keys(wmsOptions).forEach((key) => {
                    if (wmsOptions[key] === '') {
                        delete wmsOptions[key];
                    }
                });

                tileLayer = L.tileLayer.wms(fieldValues.url.split('?')[0], wmsOptions);
                delete tileLayer.wmsParams.isOverlay;
                delete tileLayer.wmsParams.maxNativeZoom;
                // delete tileLayer.wmsParams.maxZoom;
                delete tileLayer.wmsParams.code;
            } else {
                tileLayer = new L.Layer.CustomLayer(fieldValues.url, {
                    isOverlay: fieldValues.isOverlay,
                    tms: fieldValues.tms,
                    maxNativeZoom: fieldValues.maxZoom,
                    scaleDependent: fieldValues.scaleDependent,
                    print: true,
                    jnx: true,
                    code: serialized,
                    noCors: true,
                    isTop: fieldValues.isTop,
                });
            }
            const customLayer = {
                title: fieldValues.name,
                isDefault: false,
                isCustom: true,
                serialized: serialized,
                layer: tileLayer,
                order: fieldValues.isOverlay && fieldValues.isTop ? customLayersOrder.top : customLayersOrder.bottom,
                fieldValues: fieldValues,
                enabled: true,
                checked: ko.observable(true),
            };
            tileLayer.__customLayer = customLayer;
            return customLayer;
        },

        onCustomLayerCancelClicked: function() {
            this.hideCustomLayerForm();
        },

        hideCustomLayerForm: function() {
            if (!this._customLayerWindow) {
                return;
            }
            this._customLayerWindow.parentNode.removeChild(this._customLayerWindow);
            this._customLayerWindow = null;
        },

        onCustomLayerEditClicked: function(layer, e) {
            L.DomEvent.stop(e);
            this.showCustomLayerForm(
                [
                    {
                        caption: 'Save',
                        callback: (fieldValues) => this.onCustomLayerChangeClicked(layer, fieldValues),
                    },
                    {caption: 'Delete', callback: () => this.onCustomLayerDeletelClicked(layer)},
                    {caption: 'Cancel', callback: () => this.onCustomLayerCancelClicked()},
                ],
                layer.fieldValues
            );
        },

        onCustomLayerChangeClicked: function(layer, newFieldValues) {
            const error = this.checkCustomLayerValues(newFieldValues).error;
            if (error) {
                notify(error);
                return;
            }
            const duplicateLayer = this.customLayerExists(newFieldValues, layer);
            if (duplicateLayer) {
                let msg = 'Same layer already exists';
                if (!duplicateLayer.enabled) {
                    msg += ' but it is hidden. You can enable it in layers setting.';
                }
                notify(msg);
                return;
            }

            const layerPos = this._customLayers.indexOf(layer);
            this._customLayers.remove(layer);

            const newLayer = this.createCustomLayer(newFieldValues);
            this._customLayers.splice(layerPos, 0, newLayer);
            const newLayerVisible =
                this._map.hasLayer(layer.layer) &&
                // turn off layer if changing from overlay to baselayer
                (!layer.layer.options.isOverlay || newLayer.layer.options.isOverlay);
            if (newLayerVisible) {
                this._map.addLayer(newLayer.layer);
            }
            this._map.removeLayer(layer.layer);
            this.updateEnabledLayers();
            if (newLayerVisible) {
                newLayer.layer.fire('add');
            }
            this.hideCustomLayerForm();
        },

        onCustomLayerDeletelClicked: function(layer) {
            this._map.removeLayer(layer.layer);
            this._customLayers.remove(layer);
            this.updateEnabledLayers();
            this.hideCustomLayerForm();
        },

        loadCustomLayerFromString: function(s) {
            let fieldValues;
            const m = s.match(/^-cs(.+)$/u);
            if (m) {
                s = m[1].replace(/-/gu, '+').replace(/_/gu, '/');
                try {
                    s = atob(s);
                    fieldValues = JSON.parse(s);
                } catch (e) {
                    // ignore malformed data
                }

                if (fieldValues) {
                    // upgrade
                    if (fieldValues.isTop === undefined) {
                        fieldValues.isTop = true;
                    }
                    if (!this.customLayerExists(fieldValues)) {
                        this._customLayers.push(this.createCustomLayer(fieldValues));
                    }
                    return this.serializeCustomLayer(fieldValues);
                }
            }
            return null;
        },
    });
    if (control._map) {
        control.__injectConfigButton();
    }
    control._initializeLayersState();
}

export default enableConfig;
