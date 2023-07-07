!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t(require("three")))
    : "function" == typeof define && define.amd
    ? define(["three"], t)
    : "object" == typeof exports
    ? (exports.THREEx = t(require("three")))
    : (e.THREEx = t(e.THREE));
})(this, function (e) {
  return (() => {
    "use strict";
    var t = {
        381: (t) => {
          t.exports = e;
        },
      },
      i = {};
    function n(e) {
      var o = i[e];
      if (void 0 !== o) return o.exports;
      var s = (i[e] = { exports: {} });
      return t[e](s, s.exports, n), s.exports;
    }
    (n.d = (e, t) => {
      for (var i in t) n.o(t, i) && !n.o(e, i) && Object.defineProperty(e, i, { enumerable: !0, get: t[i] });
    }),
      (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
      (n.r = (e) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
      });
    var o = {};
    return (
      (() => {
        n.r(o), n.d(o, { DeviceOrientationControls: () => l, LocationBased: () => t, WebcamRenderer: () => s });
        class e {
          constructor() {
            (this.EARTH = 40075016.68), (this.HALF_EARTH = 20037508.34);
          }
          project(e, t) {
            return [this.lonToSphMerc(e), this.latToSphMerc(t)];
          }
          unproject(e) {
            return [this.sphMercToLon(e[0]), this.sphMercToLat(e[1])];
          }
          lonToSphMerc(e) {
            return (e / 180) * this.HALF_EARTH;
          }
          latToSphMerc(e) {
            return ((Math.log(Math.tan(((90 + e) * Math.PI) / 360)) / (Math.PI / 180)) * this.HALF_EARTH) / 180;
          }
          sphMercToLon(e) {
            return (e / this.HALF_EARTH) * 180;
          }
          sphMercToLat(e) {
            var t = (e / this.HALF_EARTH) * 180;
            return (180 / Math.PI) * (2 * Math.atan(Math.exp((t * Math.PI) / 180)) - Math.PI / 2);
          }
          getID() {
            return "epsg:3857";
          }
        }
        class t {
          constructor(t, i, n = {}) {
            (this._scene = t),
              (this._camera = i),
              (this._proj = new e()),
              (this._eventHandlers = {}),
              (this._lastCoords = null),
              (this._gpsMinDistance = 0),
              (this._gpsMinAccuracy = 1e3),
              (this._watchPositionId = null),
              this.setGpsOptions(n);
          }
          setProjection(e) {
            this._proj = e;
          }
          setGpsOptions(e = {}) {
            void 0 !== e.gpsMinDistance && (this._gpsMinDistance = e.gpsMinDistance), void 0 !== e.gpsMinAccuracy && (this._gpsMinAccuracy = e.gpsMinAccuracy);
          }
          startGps(e = 0) {
            return (
              null === this._watchPositionId &&
              ((this._watchPositionId = navigator.geolocation.watchPosition(
                (e) => {
                  this._gpsReceived(e);
                },
                (e) => {
                  this._eventHandlers.gpserror ? this._eventHandlers.gpserror(e.code) : alert(`GPS error: code ${e.code}`);
                },
                { enableHighAccuracy: !0, maximumAge: e }
              )),
              !0)
            );
          }
          stopGps() {
            return null !== this._watchPositionId && (navigator.geolocation.clearWatch(this._watchPositionId), (this._watchPositionId = null), !0);
          }
          fakeGps(e, t, i = null, n = 0) {
            null !== i && this.setElevation(i), this._gpsReceived({ coords: { longitude: e, latitude: t, accuracy: n } });
          }
          lonLatToWorldCoords(e, t) {
            const i = this._proj.project(e, t);
            return [i[0], -i[1]];
          }
          add(e, t, i, n) {
            this.setWorldPosition(e, t, i, n), this._scene.add(e);
          }
          setWorldPosition(e, t, i, n) {
            const o = this.lonLatToWorldCoords(t, i);
            ([e.position.x, e.position.z] = o), void 0 !== n && (e.position.y = n);
          }
          setElevation(e) {
            this._camera.position.y = e;
          }
          on(e, t) {
            this._eventHandlers[e] = t;
          }
          _gpsReceived(e) {
            let t = Number.MAX_VALUE;
            e.coords.accuracy <= this._gpsMinAccuracy &&
              (null === this._lastCoords ? (this._lastCoords = { latitude: e.coords.latitude, longitude: e.coords.longitude }) : (t = this._haversineDist(this._lastCoords, e.coords)),
              t >= this._gpsMinDistance &&
                ((this._lastCoords.longitude = e.coords.longitude),
                (this._lastCoords.latitude = e.coords.latitude),
                this.setWorldPosition(this._camera, e.coords.longitude, e.coords.latitude),
                this._eventHandlers.gpsupdate && this._eventHandlers.gpsupdate(e, t)));
          }
          _haversineDist(e, t) {
            const i = THREE.Math.degToRad(t.longitude - e.longitude),
              n = THREE.Math.degToRad(t.latitude - e.latitude),
              o = Math.sin(n / 2) * Math.sin(n / 2) + Math.cos(THREE.Math.degToRad(e.latitude)) * Math.cos(THREE.Math.degToRad(t.latitude)) * (Math.sin(i / 2) * Math.sin(i / 2));
            return 2 * Math.atan2(Math.sqrt(o), Math.sqrt(1 - o)) * 6371e3;
          }
        }
        var i = n(381);
        class s {
          constructor(e, t) {
            let n;
            (this.renderer = e),
              (this.renderer.autoClear = !1),
              (this.sceneWebcam = new i.Scene()),
              void 0 === t
                ? ((n = document.createElement("video")), n.setAttribute("autoplay", !0), n.setAttribute("playsinline", !0), (n.style.display = "none"), document.body.appendChild(n))
                : (n = document.querySelector(t)),
              (this.geom = new i.PlaneBufferGeometry()),
              (this.texture = new i.VideoTexture(n)),
              (this.material = new i.MeshBasicMaterial({ map: this.texture }));
            const o = new i.Mesh(this.geom, this.material);
            if ((this.sceneWebcam.add(o), (this.cameraWebcam = new i.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10)), navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
              const e = { video: { width: 1280, height: 720, facingMode: "environment" } };
              navigator.mediaDevices
                .getUserMedia(e)
                .then((e) => {
                  console.log("using the webcam successfully..."), (n.srcObject = e), n.play();
                })
                .catch((e) => {
                  alert(`Webcam error: ${e}`);
                });
            } else alert("sorry - media devices API not supported");
          }
          update() {
            this.renderer.clear(), this.renderer.render(this.sceneWebcam, this.cameraWebcam), this.renderer.clearDepth();
          }
          dispose() {
            this.material.dispose(), this.texture.dispose(), this.geom.dispose();
          }
        }
        const r = new i.Vector3(0, 0, 1),
          a = new i.Euler(),
          c = new i.Quaternion(),
          d = new i.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)),
          h = { type: "change" };
        class l extends i.EventDispatcher {
          constructor(e) {
            super(), !1 === window.isSecureContext && console.error("THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)");
            const t = this,
              n = new i.Quaternion();
            (this.object = e),
              this.object.rotation.reorder("YXZ"),
              (this.enabled = !0),
              (this.deviceOrientation = {}),
              (this.screenOrientation = 0),
              (this.alphaOffset = 0),
              (this.orientationChangeEventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation");
            const o = function (e) {
                t.deviceOrientation = e;
              },
              s = function () {
                t.screenOrientation = window.orientation || 0;
              };
            (this.connect = function () {
              s(),
                void 0 !== window.DeviceOrientationEvent && "function" == typeof window.DeviceOrientationEvent.requestPermission
                  ? window.DeviceOrientationEvent.requestPermission()
                      .then(function (e) {
                        "granted" == e && (window.addEventListener("orientationchange", s), window.addEventListener(this.orientationChangeEventName, o));
                      })
                      .catch(function (e) {
                        console.error("THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:", e);
                      })
                  : (window.addEventListener("orientationchange", s), window.addEventListener(this.orientationChangeEventName, o)),
                (t.enabled = !0);
            }),
              (this.disconnect = function () {
                window.removeEventListener("orientationchange", s), window.removeEventListener(this.orientationChangeEventName, o), (t.enabled = !1);
              }),
              (this.update = function () {
                if (!1 === t.enabled) return;
                const e = t.deviceOrientation;
                if (e) {
                  const o = e.alpha ? i.Math.degToRad(e.alpha) + t.alphaOffset : 0,
                    s = e.beta ? i.Math.degToRad(e.beta) : 0,
                    l = e.gamma ? i.Math.degToRad(e.gamma) : 0,
                    u = t.screenOrientation ? i.Math.degToRad(t.screenOrientation) : 0;
                  !(function (e, t, i, n, o) {
                    a.set(i, t, -n, "YXZ"), e.setFromEuler(a), e.multiply(d), e.multiply(c.setFromAxisAngle(r, -o));
                  })(t.object.quaternion, o, s, l, u),
                    8 * (1 - n.dot(t.object.quaternion)) > 1e-6 && (n.copy(t.object.quaternion), t.dispatchEvent(h));
                }
              }),
              (this.dispose = function () {
                t.disconnect();
              }),
              this.connect();
          }
        }
      })(),
      o
    );
  })();
});
