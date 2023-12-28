import L from "leaflet";
import '~/lib/leaflet.layer.yandex';
import '~/lib/leaflet.layer.google';
import {BingLayer} from '~/lib/leaflet.layer.bing';
import config from './config';
import '~/lib/leaflet.layer.soviet-topomaps-grid';
import '~/lib/leaflet.layer.westraPasses';
import '~/lib/leaflet.layer.wikimapia';
import {GeocachingSu} from '~/lib/leaflet.layer.geocaching-su';
import {RetinaTileLayer} from '~/lib/leaflet.layer.RetinaTileLayer';
import urlViaCorsProxy from '~/lib/CORSProxy';
import '~/lib/leaflet.layer.TileLayer.cutline';
import {getCutline} from '~/lib/layers-cutlines';
import {LayerCutlineOverview} from '~/lib/leaflet.layer.LayerCutlineOverview';

class LayerGroupWithOptions extends L.LayerGroup {
    constructor(layers, options) {
        super(layers);
        L.setOptions(this, options);
    }
}

    const layersDefs = [
                {
                    title: 'OpenStreetMap',
                    description: '(OSM default style)',
                    isDefault: true,
                    layer: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        {
                            code: 'O',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'osm',
                            attribution: '<a href="https://www.openstreetmap.org/copyright">' +
                                '&copy; OpenStreetMap contributors</a>',
                        }
                    )
                },
                {
                    title: 'OpenStreetMap Humanitarian',
                    isDefault: true,
                    layer: L.tileLayer('https://tile-a.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                        {
                            code: 'OH',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'osmh',
                            attribution: '<a href="https://www.openstreetmap.org/copyright">' +
                                '&copy; OpenStreetMap contributors</a>',
                        }
                    )
                },
                {
                    title: 'OpenStreetMap OPNVKarte',
                    description: 'OpenStreetMap Transport',
                    isDefault: false,
                    layer: L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
                        {
                            code: 'OK',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'osmk',
                            attribution: '<a href="https://www.openstreetmap.org/copyright">' +
                                '&copy; OpenStreetMap contributors</a>',
                        }
                    )
                },
                {
                    title: 'CyclOSM',
                    description: '(OSM cycling/outdoors style)',
                    isDefault: true,
                    layer: L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
                        {
                            code: 'Co',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'cyclosm',
                            attribution:
                                '<a href="https://www.openstreetmap.org/copyright">' +
                                '&copy; OpenStreetMap contributors</a>. ' +
                                'Tiles style by <a href="https://www.cyclosm.org/">CyclOSM</a>',
                        }
                    )
                },
                {
                    title: 'NZ NZTOPO50',
                    description: ' (current series)',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://tiles-cdn.koordinates.com/services;key=08ed433a5d3d4f77a35e04c1ae3c8756/' +
                        'tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png',
                        {
                            code: 'NZ50',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            shortName: 'NZTOPO50',
                            attribution:
                                '<a href="https://www.linz.govt.nz/copyright">' +
                                'Toitū Te Whenua Land Information New Zealand</a>',
                        }
                    )
                },
                {
                    title: 'NZ NZTOPO250',
                    description: ' (current series)',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://tiles-cdn.koordinates.com/services;key=08ed433a5d3d4f77a35e04c1ae3c8756/' +
                        'tiles/v4/layer=50798/EPSG:3857/{z}/{x}/{y}.png',
                        {
                            code: 'NZ25',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 14,
                            print: true,
                            jnx: true,
                            shortName: 'NZTOPO250',
                            attribution:
                                '<a href="https://www.linz.govt.nz/copyright">' +
                                'Toitū Te Whenua Land Information New Zealand</a>',
                        }
                    )
                },
                {
                    title: 'NZ NZMS260 1:50,000',
                    description: ' (1979-1997)',
                    isDefault: true,
                    layer: L.tileLayer(
                        'http://au.mapspast.org.nz/3857/nzms260-1999/{z}/{x}/{y}.png',
                        {
                            code: 'NZ260',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            shortName: 'NZMS260',
                            attribution:
                                '<a href="https://www.linz.govt.nz/copyright">' +
                                'Toitū Te Whenua Land Information New Zealand and MapPast</a>',
                        }
                    )
                },
                 {
                    title: 'NZ NZMS1 1:63,360',
                    description: ' (1939-1979)',
                    isDefault: true,
                    layer: L.tileLayer(
                        'http://au.mapspast.org.nz/3857/nzms1-1979/{z}/{x}/{y}.png/',
                        {
                            code: 'NZ1',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            shortName: 'NZMS1',
                            attribution:
                                '<a href="https://www.linz.govt.nz/copyright">' +
                                'Toitū Te Whenua Land Information New Zealand and MapPast</a>',
                        }
                    )
                },   
                {
                    title: 'NZ Imagery Base Map',
                    description: ' (current imagery)',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://basemaps.linz.govt.nz/v1/tiles/aerial/WebMercatorQuad/' +
                        '{z}/{x}/{y}.webp?api=c01hdfhb6kd146t51zfc2p4sckt',
                        {
                            code: 'NZi',
                            isOverlay: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'NZimagery',
                            attribution:
                                '<a href="https://www.linz.govt.nz/copyright">' +
                                'Toitū Te Whenua Land Information New Zealand</a>',
                        }
                    )
                },
                {
                    title: 'ESRI Satellite',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'E',
                            isOverlay: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'esri',
                            attribution:
                                '<a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">' +
                                'ESRI World Imagery for ArcGIS</a>',
                        }
                        )
                },
                {
                    title: 'AU/QLD Imagery Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://gisservices.information.qld.gov.au/arcgis/rest/services/Imagery/' +
                        'QldBase_AllUsers/ImageServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'qldi',
                            isOverlay: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'qldimg',
                            attribution:
                                '<a href="https://www.resources.qld.gov.au/legal/copyright">' +
                                'QTOPO © State of Queensland 2023</a>',
                        }
                    )
                },
                {
                    title: 'AU/QLD QTOPO Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://gisservices.information.qld.gov.au/arcgis/rest/services/Basemaps/' +
                        'QldMap_Topo/MapServer/Tile/{z}/{y}/{x}',
                        {
                            code: 'qldq',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 16,
                            print: true,
                            jnx: true,
                            shortName: 'qldqtopo',
                            attribution:
                                '<a href="https://www.resources.qld.gov.au/legal/copyright">' +
                                'QTOPO © State of Queensland 2023</a>',
                        }
                    )
                },
                {
                    title: 'AU/QLD Road Names',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Basemaps/QldImageryLabel/' +
                        'MapServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'qldn',
                            isOverlay: true,
                            isOverlayTransparent: true,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'qldnames',
                            attribution:
                                '<a href="https://www.resources.qld.gov.au/legal/copyright">' +
                                'QTOPO © State of Queensland 2023</a>',
                        }
                   )
                },
                {
                    title: 'AU/QLD Road Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://basemap.geohub.sa.gov.au/server/rest/services/BaseMaps/' +
                        'StreetMapCased_wmas/MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'qldrbm',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'qldroadname',
                            attribution:
                                '<a href="https://www.resources.qld.gov.au/legal/copyright">' +
                                'QTOPO © State of Queensland 2023</a>',
                        }
                    )
                },
                {
                    title: 'AU/VIC Emergency Services Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://maps.em.vic.gov.au/tms_cache/mapscape_vic_merc_color_ed8/{z}/{x}/{y}.png',
                        {
                            code: 'VICe',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'VICemergency',
                            attribution:
                                '<a href="https://emergency.vic.gov.au/about-this-site/terms-of-use">' +
                                '© Emergency Management Victoria</a>',
                        }
                    )
                },
                {
                    title: 'AU/NSW Imagery',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps/LPI_Imagery_Best/' +
                        'MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'NSWi',
                            isOverlay: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'NSWimagery',
                            attribution:
                                '<a href="https://maps.six.nsw.gov.au/js/sixmaps/app/coreTerms.html">' +
                                '© Department of Customer Service 2020</a>',
                        }
                    )
                },
                {
                    title: 'AU/NSW LPI Topographic',
                    isDefault: true,
                    layer: L.tileLayer(
                        'http://maps.six.nsw.gov.au/arcgis/rest/services/sixmaps/LPIMap/' +
                        'MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'NSWt',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'NSWtopo',
                            attribution:
                                '<a href="https://maps.six.nsw.gov.au/js/sixmaps/app/coreTerms.html">' +
                                '© Department of Customer Service 2020</a>',
                        }
                    )
                },
                {
                    title: 'AU/NSW LPI Map Sheets',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/' +
                        'MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'NSWms',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 16,
                            print: true,
                            jnx: true,
                            shortName: 'NSWmapsheets',
                            attribution:
                                '<a href="https://maps.six.nsw.gov.au/js/sixmaps/app/coreTerms.html">' +
                                '© Department of Customer Service 2020</a>',
                       }
                    )
                },
                {
                    title: 'AU/TAS Imagery Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.thelist.tas.gov.au/arcgis/rest/services/Basemaps/Orthophoto/' +
                        'MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'TASi',
                            isOverlay: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'TASimagery',
                            attribution:
                                '<a href="https://www.tasmap.tas.gov.au/copyrightPage.do?staticpage=' +
                                'copyrightPage.do"> © State of Tasmania (Creative Commons BY-NC-ND 3.0 AU)</a>',
                       }
                    )
                },
                {
                    title: 'AU/TAS Topographic Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.thelist.tas.gov.au/arcgis/rest/services/Basemaps/Topographic/' +
                        'MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'TASt',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'TAStopo',
                            attribution:
                                '<a href="https://www.tasmap.tas.gov.au/copyrightPage.do?staticpage=' +
                                'copyrightPage.do"> © State of Tasmania (Creative Commons BY 3.0 AU)</a>',
                         }
                    )
                },
                {
                    title: 'AU/TAS Emergency Services Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.thelist.tas.gov.au/arcgis/rest/services/Basemaps/ESgisMapBookPUBLIC/' +
                        'MapServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'TASes',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            shortName: 'TASemergency',
                            attribution:
                                '<a href="https://www.tasmap.tas.gov.au/copyrightPage.do?staticpage=' +
                                'copyrightPage.do"> © State of Tasmania (Creative Commons BY-NC-ND 3.0 AU)</a>',
                        }
                    )
                },
                {
                    title: 'AU/TAS Tasmap Raster',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.thelist.tas.gov.au/arcgis/rest/services/Basemaps/TasmapRaster/' +
                        'MapServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'TASr',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 16,
                            print: true,
                            jnx: true,
                            shortName: 'TASraster',
                            attribution:
                                '<a href="https://www.tasmap.tas.gov.au/copyrightPage.do?staticpage=' +
                                'copyrightPage.do"> © State of Tasmania (Creative Commons BY-NC-ND 3.0 AU)</a>',
                        }
                    )
                },
                {
                    title: 'AU/SA Imagery Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://imagemap.geohub.sa.gov.au/mapproxy/wmts/PublicMosaic/webmercator_22/{z}/{x}/{y}.png',
                        {
                            code: 'SAi',
                            isOverlay: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'SAimagery',
                            attribution:
                                '<a href="https://creativecommons.org/licenses/by/4.0/">' +
                                '© Government of South Australia (Creative Commons Attribution 4.0 Licence)</a>',
                        }
                    )
                },
                {
                    title: 'AU/SA Topographic Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://basemap.geohub.sa.gov.au/server/rest/services/BaseMaps/Topographic_wmas/' +
                        'MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'SAt',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'SAtopo',
                            attribution:
                                '<a href="https://creativecommons.org/licenses/by/4.0/">' +
                                '© Government of South Australia (Creative Commons Attribution 4.0 Licence)</a>',
                         }
                    )
               },
                {
                    title: 'AU/SA Road Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://basemap.geohub.sa.gov.au/server/rest/services/BaseMaps/StreetMapCased_wmas/' +
                        'MapServer/tile/{z}/{y}/{x}',
                        {
                            code: 'SAr',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'SAroad',
                            attribution:
                                '<a href="https://creativecommons.org/licenses/by/4.0/">' +
                                '© Government of South Australia (Creative Commons Attribution 4.0 Licence)</a>',
                         }
                    )
               },
                {
                    title: 'AU Get Lost Maps',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://live.getlost.com.au/{z}/{x}/{y}.jpg',
                        {
                            code: 'getlost',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 18,
                            print: true,
                            jnx: true,
                            shortName: 'getlostmaps',
                            attribution:
                                '<a href="https://www.getlost.com.au/">' +
                                'GetLost Maps</a>',
                         }
                    )
                },
                {
                    title: 'AU Geoscience National Base Map',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.ga.gov.au/gis/rest/services/NationalBaseMap/' +
                        'MapServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'GA1',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 16,
                            print: true,
                            jnx: true,
                            shortName: 'GAnbm',
                            attribution:
                                '<a href="https://www.ga.gov.au/copyright">' +
                                '© Commonwealth of Australia (Geoscience Australia) 2021</a>',
                         }
                    )
               },
                {
                    title: 'AU Geoscience Topographic',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.ga.gov.au/gis/rest/services/Topographic_Base_Map/' +
                        'MapServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'GA2',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 12,
                            print: true,
                            jnx: true,
                            shortName: 'GAtopo',
                            attribution:
                                '<a href="https://www.ga.gov.au/copyright">' +
                                '© Commonwealth of Australia (Geoscience Australia) 2021</a>',
                         }
                    )
               },
                {
                    title: 'AU NATMAP 1:250,000',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.ga.gov.au/gis/rest/services/NATMAP_Maps_250K_2008/' +
                        'MapServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'GS3',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 12,
                            print: true,
                            jnx: true,
                            shortName: 'ga250',
                            attribution:
                                '<a href="https://www.ga.gov.au/copyright">' +
                                '© Commonwealth of Australia (Geoscience Australia) 2021</a>',
                        }
                    )
                },
                {
                    title: 'AU NATMAP 1:100,000',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://services.ga.gov.au/gis/rest/services/NATMAP_Maps_250K_2008/' +
                        'MapServer/tile/{z}/{y}/{x}?blankTile=false',
                        {
                            code: 'GS4',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 12,
                            print: true,
                            jnx: true,
                            shortName: 'GA100',
                            attribution:
                                '<a href="https://www.ga.gov.au/copyright">' +
                                '© Commonwealth of Australia (Geoscience Australia) 2021</a>',
                         }
                    )
                },
                {
                    title: 'AU NATMAP 1:50,000 QLD',
                    isDefault: true,
                    layer: L.tileLayer(
                        'https://s3.eu-central-1.wasabisys.com/au-maps.track.guide/GA50k_QLD/{z}/{x}/{y}.png',
                        {
                            code: 'GS5',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 12,
                            print: true,
                            jnx: true,
                            shortName: 'GA50',
                            attribution:
                                '<a href="https://www.ga.gov.au/copyright">' +
                                '© Commonwealth of Australia (Geoscience Australia) 2021</a>',
                         }
                    )
                },
                {
                    title: 'Yandex Map',
                    description: '(English and Cyrillic)',
                    isDefault: false,
                    layer: new L.Layer.Yandex.Map(
                        {
                            scaleDependent: true,
                            code: 'Y',
                            isOverlay: false,
                            print: true,
                            jnx: true,
                            shortName: 'yandex',
                            attribution: '<a href="https://yandex.ru/maps/">Yandex</a>',
                        }
                    )
                },
                {
                    title: 'Yandex Satellite',
                    isDefault: false,
                    layer: new L.Layer.Yandex.Sat(
                        {
                            scaleDependent: false,
                            code: 'S',
                            isOverlay: false,
                            print: true,
                            jnx: true,
                            shortName: 'yandex_sat',
                            attribution: '<a href="https://yandex.ru/maps/?l=sat">Yandex</a>',
                        }
                    )
                },
                {
                    title: 'Google Map',
                    isDefault: true,
                    layer: new L.Layer.GoogleMap(
                        {
                            code: 'G',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'google',
                            attribution: '<a href="https://www.google.com/maps">Google</a>',
                        }
                    )
                },
                {
                    title: 'Google Hybrid',
                    isDefault: false,
                    layer: new L.Layer.GoogleHybrid(
                        {
                            code: 'Gh',
                            isOverlay: true,
                            scaleDependent: true,
                            print: true,
                            jnx: false,
                            shortName: 'google_hybrid',
                            isOverlayTransparent: true,
                            attribution: '<a href="https://www.google.com/maps/@43.0668619,60.5738071,13622628m' +
                                '/data=!3m1!1e3">Google</a>',
                        }
                    )
                },
                {
                    title: 'Google Satellite',
                    isDefault: true,
                    layer: new L.Layer.GoogleSat(
                        {
                            code: 'L',
                            isOverlay: false,
                            scaleDependent: false,
                            print: true,
                            jnx: true,
                            shortName: 'google_sat',
                            attribution: '<a href="https://www.google.com/maps/@43.0668619,60.5738071,13622628m' +
                                '/data=!3m1!1e3">Google</a>',
                        }
                    )
                },
                {
                    title: 'Google Terrain',
                    isDefault: true,
                    layer: new L.Layer.GoogleTerrain({
                            code: 'P',
                            isOverlay: false,
                            scaleDependent: false,
                            print: true,
                            jnx: true,
                            shortName: 'google_terrain',
                            attribution: '<a href="https://www.google.com/maps/@43.1203575,42.1105049,9.58z' +
                                '/data=!5m1!1e4">Google</a>',
                        }
                    )
                },
                {
                    title: 'Bing Satellite',
                    isDefault: true,
                    layer: new BingLayer(config.bingKey,
                        {
                            code: 'I',
                            isOverlay: false,
                            scaleDependent: false,
                            print: true,
                            jnx: true,
                            shortName: 'bing_sat'
                        }
                    )
                },
                {
                    title: 'Topomapper 1:100,000',
                    description: ' (Soviet sheets with English POIs)',
                    isDefault: false,
                    layer: L.tileLayer(
                        urlViaCorsProxy(
                            'http://88.99.52.155/cgi-bin/tapp/tilecache.py/1.0.0/topomapper_v2/{z}/{x}/{y}.jpg'
                        ),
                        {
                            code: 'T',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            scaleDependent: false,
                            maxNativeZoom: 13,
                            noCors: false,
                            print: true,
                            jnx: true,
                            shortName: 'topomapper_1k',
                            attribution: '<a href="https://play.google.com/store/apps/' +
                                'details?id=com.atlogis.sovietmaps.free&hl=en&gl=US">Russian Topo Maps</a>',
                        }
                    )
                },
                {
                    title: 'Topo 1:1,000,000',
                    description: ' (Soviet sheets in Cyrillic 1970-90)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/topo001m/{z}/{x}/{y}",
                        {
                            code: 'D',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 9,
                            print: true,
                            jnx: true,
                            shortName: 'topo_10k'
                        }
                    )
                },
                {
                    title: 'GGC Topographic 1:200,000',
                    description: ' (Russia in Cyrillic 2002-2007)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/ggc2000/{z}/{x}/{y}",
                        {
                            code: 'N',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 12,
                            print: true,
                            jnx: true,
                            shortName: 'ggc_2k'
                        }
                    )
                },
                {
                    title: 'ArbaletMO',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/ArbaletMO/{z}/{x}/{y}",
                        {
                            code: 'A',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 13,
                            print: true,
                            jnx: true,
                            shortName: 'arbalet',
                            attribution:
                                '<a href="http://www.velozona.ru/forums/showmessage.php?id=3370">Arbalet (2004)</a>',
                        }
                    )
                },
                {
                    title: 'Slazav mountains',
                    isDefault: false,
                    layer: L.tileLayer("https://slazav.xyz/tiles/hr/{x}-{y}-{z}.png",
                        {
                            code: 'Q',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: false,
                            scaleDependent: false,
                            maxNativeZoom: 13,
                            noCors: true,
                            print: true,
                            jnx: true,
                            shortName: 'slazav_mountains',
                            attribution: '<a href="http://slazav.xyz/maps">Vladislav Zavjalov</a>',
                        }
                    )
                },
                {
                    title: 'GGC Topographic 1:100,000',
                    description: ' (Russia in Cyrillic 2002-2007)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/ggc1000/{z}/{x}/{y}",
                        {
                            code: 'J',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 13,
                            print: true,
                            jnx: true,
                            shortName: 'ggc_1k'
                        }
                    )
                },
                {
                    title: 'Topo 1:100,000',
                    description: ' (Soviet sheets in Cyrillic 1970-90)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/topo1000/{z}/{x}/{y}",
                        {
                            code: 'C',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 13,
                            print: true,
                            jnx: true,
                            shortName: 'topo_1k'
                        }
                    )
                },
                {
                    title: 'GGC Topographic 1:50,000',
                    description: ' (Russia in Cyrillic 2002-2007)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/ggc500/{z}/{x}/{y}",
                        {
                            code: 'F',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 14,
                            print: true,
                            jnx: true,
                            shortName: 'ggc_500'
                        }
                    )
                },
                {
                    title: 'Topo 1:50,000',
                    description: ' (Soviet sheets in Cyrillic 1970-90)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/topo500/{z}/{x}/{y}",
                        {
                            code: 'B',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 14,
                            print: true,
                            jnx: true,
                            shortName: 'topo_500'
                        }
                    )
                },
                {
                    title: 'GGC Topographic 1:25,000',
                    description: ' (Russia in Cyrillic 2002-2007)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/ggc250/{z}/{x}/{y}",
                        {
                            code: 'K',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            shortName: 'ggc_250'
                        }
                    )
                },
                {
                    title: 'Slazav Moscow region map',
                    isDefault: false,
                    layer: L.tileLayer("https://slazav.xyz/tiles/podm/{x}-{y}-{z}.png",
                        {
                            code: 'Z',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: false,
                            scaleDependent: false,
                            maxNativeZoom: 14,
                            noCors: true,
                            print: true,
                            jnx: true,
                            shortName: 'slazav',
                            attribution: '<a href="http://slazav.xyz/maps">Vladislav Zavjalov</a>',
                        }
                    )
                },
                {
                    title: 'Races',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/adraces/{z}/{x}/{y}",
                        {
                            code: 'U',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            shortName: 'races'
                        }
                    )
                },
                {
                    title: 'O-sport',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/osport/{z}/{x}/{y}",
                        {
                            code: 'R',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 17,
                            print: true,
                            jnx: true,
                            shortName: 'osport'
                        }
                    )
                },
                {
                    title: 'Soviet topo maps grid',
                    isDefault: false,
                    layer: new L.Layer.SovietTopoGrid({
                        code: 'Ng',
                        isOverlay: true,
                        print: false,
                        jnx: false
                    })
                },
                {
                    title: 'Wikimapia',
                    isDefault: false,
                    layer: new L.Wikimapia({
                        code: 'W',
                        isOverlay: true,
                        print: false,
                        jnx: false,
                        attribution: '<a href="https://wikimapia.org/">Wikimapia</a>',
                        tilesBaseUrl: config.wikimapiaTilesBaseUrl,
                    })
                },
                {
                    title: 'Mountain passes (Westra)',
                    isDefault: false,
                    layer: new L.Layer.WestraPasses(config.westraDataBaseUrl, {
                        code: 'Wp',
                        print: true,
                        jnx: false,
                        scaleDependent: true,
                        isOverlay: true,
                        isOverlayTransparent: true,
                        shortName: 'passes',
                        markersOptions: {
                            isOverlay: true,
                            isOverlayTransparent: true,
                            shortName: 'passes'
                        },
                        attribution: '<a href="http://westra.ru/passes/">Westra passes catalog</a>',
                    })
                },
                {
                    title: 'OpenTopoMap',
                    description: ' (OSM Topographic style)',
                    isDefault: true,
                    layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                        {
                            code: 'Otm',
                            isOverlay: false,
                            maxNativeZoom: 16,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            noCors: false,
                            shortName: 'opentopo',
                            attribution: '<a href="https://opentopomap.org/">OpenTopoMap</a>',
                            hotkey: 'V',
                        }
                    )
                },
                {
                    title: 'OpenCycleMap',
                    description: ' (OSM/Thunderforest Cycling style)',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
                            '?apikey=cf406f30bfc54296a9d573ced1e9d6cf',
                            'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}@2x.png' +
                            '?apikey=cf406f30bfc54296a9d573ced1e9d6cf',
                        ],
                        {
                            code: 'Ocm',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'opencyclemap',
                            attribution: '<a href="https://www.opencyclemap.org/">Thunderforest OpenCycleMap</a>',
                        }
                    )
                },
                {
                    title: 'OSM Outdoors',
                    description: ' (OSM/Thunderforest Outdoors style)',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png' +
                            '?apikey=cf406f30bfc54296a9d573ced1e9d6cf',
                            'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}@2x.png' +
                            '?apikey=cf406f30bfc54296a9d573ced1e9d6cf',
                        ],
                        {
                            code: 'Oso',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'osm_outdoors',
                            attribution:
                                '<a href="https://www.thunderforest.com/maps/outdoors/">Thunderforest Outdoors</a>',
                        }
                    )
                },
                {
                    title: 'OSM Atlas',
                    description: ' (OSM/Thunderforest Atlas style)',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            'https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png' +
                            '?apikey=cf406f30bfc54296a9d573ced1e9d6cf',
                            'https://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}@2x.png' +
                            '?apikey=cf406f30bfc54296a9d573ced1e9d6cf',
                        ],
                        {
                            code: 'Osa',
                            isOverlay: false,
                            scaleDependent: true,
                            print: true,
                            jnx: true,
                            shortName: 'osm_atlas',
                            attribution:
                                '<a href="https://www.thunderforest.com/maps/atlas/">Thunderforest Atlas</a>',
                        }
                    )
                },
                {
                    title: 'Eurasia 1:2,500,000',
                    description: ' (Soviet sheets in Cyrillic 1975-80)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/eurasia25km/{z}/{x}/{y}",
                        {
                            code: 'E25m',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            maxNativeZoom: 9,
                            print: true,
                            jnx: true,
                            scaleDependent: false,
                            shortName: 'eurasia_25k'
                        }
                    )
                },
                {
                    title: 'Caucasus 1:100,000',
                    description: ' (Russia sheets in Cyrillic)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/new_gsh_100k/{z}/{x}/{y}",
                        {
                            code: 'NT1',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            maxNativeZoom: 14,
                            print: true,
                            jnx: true,
                            scaleDependent: false,
                            shortName: 'caucasus_1k',
                            attribution: '<a href="http://genshtab-yuga.narod.ru/">Topo maps (2006)</a>',
                        }
                    )
                },
                {
                    title: 'Caucasus 1:50,000',
                    description: ' (Russia sheets in Cyrillic)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/new_gsh_050k/{z}/{x}/{y}",
                        {
                            code: 'NT5',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            scaleDependent: false,
                            shortName: 'caucasus_500',
                            attribution: '<a href="http://genshtab-yuga.narod.ru/">Topo maps (1998 - 2003)</a>',
                        }
                    )
                },
                {
                    title: 'Topo 1:25,000',
                    description: ' (Soviet sheets in Cyrillic)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/topo250/{z}/{x}/{y}",
                        {
                            code: 'T25',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            scaleDependent: false,
                            shortName: 'topo_250'
                        }
                    )
                },
                {
                    title: 'Montenegro 1:25,000',
                    description: ' (Cyrillic 1970-72)',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/montenegro250m/{z}/{x}/{y}",
                        {
                            code: 'MN25',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            maxNativeZoom: 15,
                            print: true,
                            jnx: true,
                            scaleDependent: false,
                            shortName: 'montenegro_250'
                        }
                    )
                },
                {
                    title: 'Mountains by Aleksey Tsvetkov',
                    description:
                        'Tian Shan, Dzungaria, <a href="http://pereval.g-utka.ru/">http://pereval.g-utka.ru/</a>',
                    isDefault: false,
                    layer: new LayerGroupWithOptions(
                        [
                            L.tileLayer(
                                urlViaCorsProxy(
                                    'http://nakartetiles.s3-website.eu-central-1.amazonaws.com/{z}/{x}/{y}.png'
                                ),
                                {
                                    isOverlay: true,
                                    isOverlayTransparent: false,
                                    tms: false,
                                    minZoom: 2,
                                    maxNativeZoom: 15,
                                    print: true,
                                    jnx: true,
                                    scaleDependent: false,
                                    noCors: false,
                                    shortName: 'tsvetkov_mountains',
                                    cutline: getCutline('tsvetkov_mountains'),
                                    bounds: [
                                        [40.66664, 71.00007],
                                        [45.33338, 81.00001],
                                    ],
                                    attribution: '<a href="http://pereval.g-utka.ru/">Aleksey Tsvetkov</a>',
                                }
                            ),
                            new LayerCutlineOverview(getCutline('tsvetkov_mountains'), 6,
                                'Mountains by Aleksey Tsvetkov'),
                        ],
                        {
                            code: 'Mt',
                            isOverlay: true,
                            isWrapper: true,
                        }
                    ),
                },
                {
                    title: 'geocaching.su',
                    isDefault: false,
                    layer: new GeocachingSu(config.geocachingSuUrl, {
                        code: 'Gc',
                        isOverlay: true,
                        isOverlayTransparent: true,
                        print: true,
                        jnx: false,
                        shortName: 'geocaching',
                        attribution: '<a href="https://geocaching.su/">geocaching.su</a>',
                    })
                },
                {
                    title: 'OpenStreetMap GPS traces',
                    isDefault: false,
                    layer: L.tileLayer('https://{s}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png',
                        {
                            code: 'Ot',
                            isOverlay: true,
                            isOverlayTransparent: true,
                            scaleDependent: true,
                            print: true,
                            jnx: false,
                            shortName: 'osm_gps_traces',
                            attribution: '<a href="https://www.openstreetmap.org/#&layers=G">' +
                                'OpenStreetMap public GPS traces</a>',
                        }
                    )
                },
                {
                    title: 'Strava heatmap (all)',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/all/hot/{z}/{x}/{y}.png?px=256'
                            ),
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/all/hot/{z}/{x}/{y}.png?px=512'
                            ),
                        ],
                        {
                            code: 'Sa',
                            isOverlay: true,
                            isOverlayTransparent: true,
                            scaleDependent: false,
                            print: true,
                            jnx: false,
                            subdomains: 'abc',
                            noCors: true,
                            shortName: 'strava_all',
                            retinaOptionsOverrides: [{maxNativeZoom: 16}, {maxNativeZoom: 15}],
                            attribution: '<a href="https://www.strava.com/heatmap">Strava Global Heatmap</a>',
                            opacity: 0.75,
                        }
                    )
                },
                {
                    title: 'Strava heatmap (run)',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/run/hot/{z}/{x}/{y}.png?px=256'
                            ),
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/run/hot/{z}/{x}/{y}.png?px=512'
                            ),
                        ],
                        {
                            code: 'Sr',
                            isOverlay: true,
                            isOverlayTransparent: true,
                            scaleDependent: false,
                            print: true,
                            jnx: false,
                            subdomains: 'abc',
                            noCors: true,
                            shortName: 'strava_run',
                            retinaOptionsOverrides: [{maxNativeZoom: 16}, {maxNativeZoom: 15}],
                            attribution: '<a href="https://www.strava.com/heatmap">Strava Global Heatmap</a>',
                            opacity: 0.75,
                        }
                    )
                },
                {
                    title: 'Strava heatmap (ride)',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/ride/hot/{z}/{x}/{y}.png?px=256'
                            ),
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/ride/hot/{z}/{x}/{y}.png?px=512'
                            ),
                        ],
                        {
                            code: 'Sb',
                            isOverlay: true,
                            isOverlayTransparent: true,
                            scaleDependent: false,
                            print: true,
                            jnx: false,
                            subdomains: 'abc',
                            noCors: true,
                            shortName: 'strava_ride',
                            retinaOptionsOverrides: [{maxNativeZoom: 16}, {maxNativeZoom: 15}],
                            attribution: '<a href="https://www.strava.com/heatmap">Strava Global Heatmap</a>',
                            opacity: 0.75,
                        }
                    )
                },
                {
                    title: 'Strava heatmap (winter)',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/winter/hot/{z}/{x}/{y}.png?px=256'
                            ),
                            urlViaCorsProxy(
                                'https://heatmap-external-a.strava.com/tiles-auth/winter/hot/{z}/{x}/{y}.png?px=512'
                            ),
                        ],
                        {
                            code: 'Sw',
                            isOverlay: true,
                            isOverlayTransparent: true,
                            scaleDependent: false,
                            print: true,
                            jnx: false,
                            subdomains: 'abc',
                            noCors: true,
                            shortName: 'strava_winter',
                            retinaOptionsOverrides: [{maxNativeZoom: 16}, {maxNativeZoom: 15}],
                            attribution: '<a href="https://www.strava.com/heatmap">Strava Global Heatmap</a>',
                            opacity: 0.75,
                        }
                    )
                },
                {
                    title: 'Norway Topographic Sheets',
                    isDefault: false,
                    layer: new L.TileLayer(
                        'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=toporaster4&zoom={z}&x={x}&y={y}', // eslint-disable-line max-len
                        {
                            code: 'Np',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            maxNativeZoom: 16,
                            tms: false,
                            print: true,
                            jnx: true,
                            scaleDependent: true,
                            noCors: false,
                            shortName: 'norway_paper',
                            bounds: [[57.81324, 4.19674], [71.27961, 31.56094]],
                            attribution: '<a href="https://www.geonorge.no/aktuelt/om-geonorge/brukerveiledning' +
                                '/#!#se_paa_kart">Geonorge</a>',
                        }
                    )
                },
                {
                    title: 'Norway Topographic',
                    isDefault: false,
                    layer: new L.TileLayer(
                        'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}',
                        {
                            code: 'Nm',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: false,
                            print: true,
                            jnx: true,
                            scaleDependent: true,
                            noCors: false,
                            shortName: 'norway_topo',
                            bounds: [[57.81324, 4.19674], [71.27961, 31.56094]],
                            attribution: '<a href="https://www.geonorge.no/aktuelt/om-geonorge/brukerveiledning' +
                                '/#!#se_paa_kart">Geonorge</a>',
                        }
                    )
                },
                {
                    // Вместо 404 отдают 500 для отсутствующих тайлов
                    title: 'Norway Roads',
                    description: '<a href="https://kart.finn.no/">https://kart.finn.no/</a>',
                    isDefault: false,
                    layer: L.tileLayer("https://maptiles1.finncdn.no/tileService/1.0.3/normap/{z}/{x}/{y}.png",
                        {
                            code: 'Nr',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: false,
                            print: true,
                            jnx: true,
                            scaleDependent: true,
                            noCors: false,
                            shortName: 'norway_roads',
                            bounds: [[57.81324, 4.19674], [71.27961, 31.56094]],
                            cutline: getCutline('norway'),
                            attribution: '<a href="https://kart.finn.no/">finn.no</a>',
                        }
                    )
                },
                {
                    title: 'Finland Topographic',
                    isDefault: false,
                    layer: L.tileLayer(
                        "https://proxy.laji.fi/mml_wmts/maasto/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/" +
                        "{z}/{y}/{x}.png",
                        {
                            code: 'Fmk',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: false,
                            print: true,
                            jnx: true,
                            scaleDependent: true,
                            noCors: false,
                            shortName: 'finland_topo',
                            bound: [[59.45416, 19.08321], [70.09211, 31.58671]],
                            cutline: getCutline('finland'),
                            attribution: '<a href="https://laji.fi/en/map/">LAJI.FI</a>',
                        }
                    )
                },
                {
                    title: 'France Topographic',
                    isDefault: false,
                    layer: new LayerGroupWithOptions(
                        [
                            L.tileLayer(
                                'https://wxs.ign.fr/an7nvfzojv5wa96dsga5nk8w/geoportail/wmts?' +
                                'layer=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR.CV&style=normal&tilematrixset=PM&' +
                                'Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&' +
                                'TileMatrix={z}&TileCol={x}&TileRow={y}',
                                {
                                    minZoom: 6,
                                    maxNativeZoom: 16,
                                    bounds: [
                                        [-46.44072, -178.18694],
                                        [51.12562, 77.61086],
                                    ],
                                    isOverlay: true,
                                    isOverlayTransparent: false,
                                    tms: false,
                                    print: true,
                                    jnx: true,
                                    scaleDependent: false,
                                    shortName: 'france_topo_25k',
                                    cutline: getCutline('france'),
                                    attribution: '<a href="https://www.geoportail.gouv.fr/carte">' +
                                        'IGN (France) topographic map</a>',
                                }
                            ),
                            new LayerCutlineOverview(getCutline('france'), 5, 'France Topo 250m (zoom ≥ 6)'),
                        ],
                        {
                            code: 'Ft',
                            isOverlay: true,
                            isWrapper: true,
                        }
                    ),
                },
                {
                    title: 'Great Britain Topographic',
                    isDefault: false,
                    layer: new LayerGroupWithOptions(
                        [
                            new BingLayer(config.bingKey, {
                                type: 'OrdnanceSurvey',
                                minZoom: 12,
                                maxNativeZoom: 16,
                                bounds: [
                                    [49.83793, -7.75643],
                                    [60.87164, 1.82356],
                                ],
                                isOverlay: true,
                                isOverlayTransparent: false,
                                scaleDependent: true,
                                print: true,
                                jnx: true,
                                shortName: 'england_topo',
                                cutline: getCutline('great_britain'),
                                attribution: '<a href="https://docs.microsoft.com/en-us/bingmaps/v8-web-control/' +
                                    'map-control-api/maptypeid-enumeration">Ordnance Survey</a>',
                            }),
                            new LayerCutlineOverview(getCutline('great_britain'), 11, 'Great Britain Topo (zoom ≥ 12)'),
                        ],
                        {
                            code: 'Gbt',
                            isOverlay: true,
                            isWrapper: true,
                        }
                    ),
                },
                {
                    title: 'Waymarked Cycling Trails',
                    description:
                        '<a href="https://cycling.waymarkedtrails.org/">https://cycling.waymarkedtrails.org</a>',
                    isDefault: false,
                    layer: L.tileLayer('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png',
                        {
                            code: 'Wc',
                            isOverlay: true,
                            tms: false,
                            print: true,
                            jnx: false,
                            scaleDependent: true,
                            shortName: 'cycling_trails',
                            isOverlayTransparent: true,
                            attribution: '<a href="https://cycling.waymarkedtrails.org/">Waymarked Cycling Trails</a>',
                        }
                    )
                },
                {
                    title: 'Waymarked Hiking Trails',
                    description: '<a href="https://hiking.waymarkedtrails.org/">https://hiking.waymarkedtrails.org</a>',
                    isDefault: false,
                    layer: L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png',
                        {
                            code: 'Wh',
                            isOverlay: true,
                            tms: false,
                            print: true,
                            jnx: false,
                            scaleDependent: true,
                            shortName: 'hiking_trails',
                            isOverlayTransparent: true,
                            attribution: '<a href="https://hiking.waymarkedtrails.org/">Waymarked Hiking Trails</a>',
                        }
                    )
                },
                {
                    title: 'Slovakia Topographic',
                    description: '<a href="https://mapy.hiking.sk">https://mapy.hiking.sk/</a>',
                    isDefault: false,
                    layer: new LayerGroupWithOptions(
                        [
                            L.tileLayer('https://static.mapy.hiking.sk/topo/{z}/{x}/{y}.png', {
                                isOverlay: true,
                                tms: false,
                                print: true,
                                jnx: true,
                                scaleDependent: true,
                                shortName: 'slovakia_topo',
                                isOverlayTransparent: false,
                                maxNativeZoom: 15,
                                minZoom: 10,
                                bounds: [
                                    [47.5172, 16.74316],
                                    [49.91343, 22.74837],
                                ],
                                noCors: true,
                                cutline: getCutline('slovakia'),
                                attribution: '<a href="https://mapy.hiking.sk/">mapy.hiking.sk</a>',
                            }),
                            new LayerCutlineOverview(getCutline('slovakia'), 9, 'Slovakia topo (zoom ≥ 10)'),
                        ],
                        {
                            code: 'St',
                            isOverlay: true,
                            isWrapper: true,
                        }
                    ),
                },
                {
                    title: 'Yandex tracks (zoom ≥ 10)',
                    isDefault: false,
                    layer: new L.Layer.Yandex.Tracks(
                        {
                            scaleDependent: true,
                            code: 'Ytr',
                            isOverlay: true,
                            isOverlayTransparent: true,
                            print: true,
                            jnx: false,
                            shortName: 'yandex_tracks',
                            noCors: true,
                            attribution: '<a href="https://n.maps.yandex.ru/">Yandex Map Editor</a>',
                        }
                    )
                },
                {
                    title: 'Spain Topographic',
                    isDefault: false,
                    layer: L.tileLayer(
                            'https://www.ign.es/wmts/mapa-raster?layer=MTN&style=default&' +
                            'tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&' +
                            'Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}',
                            {
                                code: 'Sp',
                                isOverlay: true,
                                tms: false,
                                print: true,
                                jnx: true,
                                scaleDependent: true,
                                shortName: 'spain_topo',
                                isOverlayTransparent: false,
                                bounds: [[35.9024, -9.51828], [43.8375, 4.50439]],
                                noCors: false,
                                cutline: getCutline('spain'),
                                attribution: '<a href="https://www.ign.es/iberpix2/visor/">' +
                                    'IGN (Spain) topographic map</a>'
                            }
                    )
                },
                {
                    title: 'Switzerland Topographic',
                    isDefault: false,
                    layer: new RetinaTileLayer(
                        [
                            null,
                            urlViaCorsProxy(
                                'https:///wmts10.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/' +
                                '3857/{z}/{x}/{y}.jpeg'
                            ),
                        ],

                        {
                                code: 'Si',
                                isOverlay: true,
                                tms: false,
                                print: true,
                                jnx: true,
                                scaleDependent: true,
                                shortName: 'swiss_topo',
                                isOverlayTransparent: false,
                                bounds: [[45.80269, 5.87352], [47.86445, 10.6847]],
                                noCors: false,
                                maxNativeZoom: 16,
                                tileSize: 128,
                                zoomOffset: 1,
                                cutline: getCutline('switzerland'),
                                attribution: '<a href="https://map.geo.admin.ch/?topic=swisstopo&lang=en&bgLayer=' +
                                    'ch.swisstopo.pixelkarte-farbe&E=2586000.76&N=1202020.96&zoom=1">Swisstopo'
                            }, true
                    )
                },
                {
                    title: 'Mountains by Alexander Purikov',
                    isDefault: false,
                    layer: L.tileLayer("https://{s}.tiles.nakarte.me/purikov/{z}/{x}/{y}",
                        {
                            code: 'Pur',
                            isOverlay: true,
                            isOverlayTransparent: false,
                            tms: true,
                            scaleDependent: false,
                            maxNativeZoom: 14,
                            noCors: false,
                            print: true,
                            jnx: true,
                            shortName: 'purikov_mountains',
                            attribution: '<a href="https://westra.ru/reports/">Alexander Purikov</a>',
                        }
                    )
                },
    ];

    const groupsDefs = [
        {
            title: 'OpenStreetMap',
            layers: [
                'OpenStreetMap',
                'OpenStreetMap Humanitarian',
                'OpenTopoMap',
                'CyclOSM',
                'OpenCycleMap',
                'OSM Outdoors',
                'OSM Atlas',
                'OpenStreetMap OPNVKarte',
            ],
        },
        {
            title: 'Global Maps',
            layers: [
                'Google Map',
                'Google Satellite',
                'Google Terrain',
                'Google Hybrid',
                'Bing Satellite',
                'ESRI Satellite',
                'Yandex Map',
                'Yandex Satellite',
            ],
        },
        {
            title: 'New Zealand',
            layers: [
                'NZ NZTOPO50',
                'NZ NZTOPO250',
                'NZ NZMS260 1:50,000',
                'NZ NZMS1 1:63,360',
                'NZ Imagery Base Map',
            ],
        },
        {
            title: 'Australia',
            layers: [
                'AU/QLD Imagery Base Map',
                'AU/QLD QTOPO Base Map',
                'AU/QLD Road Names',
                'AU/QLD Road Base Map',
                'AU/VIC Emergency Services Base Map',
                'AU/NSW Imagery',
                'AU/NSW LPI Topographic',
                'AU/NSW LPI Map Sheets',
                'AU/TAS Imagery Base Map',
                'AU/TAS Topographic Base Map',
                'AU/TAS Emergency Services Map',
                'AU/TAS Tasmap Raster',
                'AU/SA Imagery Base Map',
                'AU/SA Topographic Base Map',
                'AU/SA Road Base Map',
                'AU Get Lost Maps',
                'AU Geoscience National Base Map',
                'AU Geoscience Topographic',
                'AU NATMAP 1:250,000',
                'AU NATMAP 1:100,000',
                'AU NATMAP 1:50,000 QLD',
                        ],
        },
       {
            title: 'Europe',
            layers: [
                'Finland Topographic',
                'France Topographic',
                'Great Britain Topographic',
                 'Montenegro 1:25,000',
                'Norway Topographic Sheets',
                'Norway Topographic',
                'Norway Roads',
                'Slovakia Topographic',
                'Spain Topographic',
                'Switzerland Topographic',
            ],
        },
       {
            title: 'Russia',
            layers: [
                'Caucasus 1:100,000',
                'Caucasus 1:50,000',
                'GGC Topographic 1:25,000',
                'GGC Topographic 1:50,000',
                'GGC Topographic 1:100,000',
                'GGC Topographic 1:200,000',
                'ArbaletMO',
                'Mountains by Aleksey Tsvetkov',
                'Slazav mountains',
                'Slazav Moscow region map',
                'Races',
                'O-sport',
                'Wikimapia',
                'Mountain passes (Westra)',
                'Mountains by Alexander Purikov',
                'geocaching.su',
            ],
        },
       {
            title: 'Soviet Mapping',
            layers: [
                'Eurasia 1:2,500,000',
                'Topo 1:25,000',
                'Topo 1:50,000',
                'Topo 1:100,000',
                'Topo 1:1,000,000',
                'Topomapper 1:100,000',
                'Soviet topo maps grid',
            ],
        },
        {
            title: 'Routes and traces',
            layers: [
                'Waymarked Hiking Trails',
                'Waymarked Cycling Trails',
                'OpenStreetMap GPS traces',
                'Strava heatmap (all)',
                'Strava heatmap (run)',
                'Strava heatmap (ride)',
                'Strava heatmap (winter)',
                'Yandex tracks (zoom ≥ 10)',
            ],

        },
    ];

    const titlesByOrder = [
        // common base layers
        // OSM
        'OpenStreetMap',
        'CyclOSM',
        'OpenTopoMap',
        'OpenStreetMap Humanitarian',
        'OpenCycleMap',
        'OSM Outdoors',
        'OSM Atlas',
        'OpenStreetMap OPNVKarte',
        // Satellite
        'ESRI Satellite',
        'Google Satellite',
        'Bing Satellite',
        'Yandex Satellite',
        'NZ Imagery Base Map',
        'AU/QLD Imagery Base Map',
        'AU/NSW Imagery',
        'AU/SA Imagery Base Map',
        'AU/TAS Imagery Base Map',
        // Commercial maps
        'Google Map',
        'Google Terrain',
        'Yandex Map',
        // Topo maps
        'NZ NZTOPO50',
        'NZ NZTOPO250',
        'NZ NZMS260 1:50,000',
        'NZ NZMS1 1:63,360',
        'AU/QLD QTOPO Base Map',
        'AU/QLD Road Names',
        'AU/QLD Road Base Map',
        'AU/VIC Emergency Services Base Map',
        'AU/NSW LPI Topographic',
        'AU/NSW LPI Map Sheets',
        'AU/TAS Topographic Base Map',
        'AU/TAS Emergency Services Map',
        'AU/TAS Tasmap Raster',
        'AU/SA Topographic Base Map',
        'AU/SA Road Base Map',
        'AU Get Lost Maps',
        'AU Geoscience National Base Map',
        'AU Geoscience Topographic',
        'AU NATMAP 1:250,000',
        'AU NATMAP 1:100,000',
        'AU NATMAP 1:50,000 QLD',

        // local base layers

        // map overlays
        '#custom-bottom',
        'Eurasia 1:2,500,000',
        'Finland Topographic',
        'France Topographic',

        'GGC Topographic 1:25,000',
        'GGC Topographic 1:50,000',
        'GGC Topographic 1:100,000',
        'GGC Topographic 1:200,000',
        'Great Britain Topographic',
        'Montenegro 1:25,000',
        'Norway Topographic Sheets',
        'Norway Topographic',
        'Norway Roads',
        'Slovakia Topographic',
        'Spain Topographic',
        'Switzerland Topographic',
        'Mountains by Alexander Purikov',
        'Mountains by Aleksey Tsvetkov',
        'Slazav mountains',
        'Topo 1:25,000',
        'Topo 1:50,000',
        'Topo 1:100,000',
        'Topo 1:1,000,000',
        'Topomapper 1:100,000',
        'Caucasus 1:50,000',
        'Caucasus 1:100,000',
        'ArbaletMO',
        'Slazav Moscow region map',
        'Races',
        'O-sport',
        '#custom-top',

        // line overlays
        'Google Hybrid',
        'Waymarked Hiking Trails',
        'Waymarked Cycling Trails',
        'OpenStreetMap GPS traces',
        'Strava heatmap (all)',
        'Strava heatmap (run)',
        'Strava heatmap (ride)',
        'Strava heatmap (winter)',
        'Yandex tracks (zoom ≥ 10)',
        'Soviet topo maps grid',
        'Wikimapia',

        // point overlays
        'Mountain passes (Westra)',
        'geocaching.su',
    ];

function getLayers() {
    // set metadata
    for (let layer of layersDefs) {
        layer.layer.meta = {title: layer.title};
    }

    // assign order to layers
    const orderByTitle = {};
    for (let i = 0; i < titlesByOrder.length; i++) {
        let title = titlesByOrder[i];
        orderByTitle[title] = i + 1;
    }

    for (let layer of layersDefs) {
        const title = layer.title;
        layer.order = orderByTitle[title];
        if (!layer.order) {
            throw new Error(`Layer title not found in titlesByOrder list: ${title}`);
        }
    }

    // divide layers by groups
    const grouppedLayers = [];
    const layersByTitle = {};
    for (let layer of layersDefs) {
        layersByTitle[layer.title] = layer;
    }
    for (let groupDef of groupsDefs) {
        let group = {group: groupDef.title, layers: []};
        grouppedLayers.push(group);
        for (let title of groupDef.layers) {
            let layer = layersByTitle[title];
            group.layers.push(layer);
        }
    }

    return {
        layers: grouppedLayers,
        customLayersOrder: {
            top: orderByTitle['#custom-top'],
            bottom: orderByTitle['#custom-bottom'],

        }
    };
}

export {getLayers, layersDefs, groupsDefs, titlesByOrder};
