import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.fill";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.index-of";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.array.map";
import "core-js/modules/es.array.slice";
import "core-js/modules/es.array.splice";
import "core-js/modules/es.object.assign";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.promise";
import "core-js/modules/es.regexp.constructor";
import "core-js/modules/es.regexp.exec";
import "core-js/modules/es.regexp.to-string";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.string.pad-start";
import "core-js/modules/es.string.replace";
import "core-js/modules/es.string.search";
import "core-js/modules/es.string.sub";
import "core-js/modules/web.dom-collections.for-each";
import "core-js/modules/web.dom-collections.iterator";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * iro.js v5.1.5
 * 2016-2020 James Daniel
 * Licensed under MPL 2.0
 * github.com/jaames/iro.js
 */
!function (n, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (n = n || self).iro = t();
}(this, function () {
  "use strict";

  var m,
      s,
      t,
      i,
      o,
      k = {},
      M = [],
      r = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

  function j(n, t) {
    for (var i in t) {
      n[i] = t[i];
    }

    return n;
  }

  function y(n) {
    var t = n.parentNode;
    t && t.removeChild(n);
  }

  function d(n, t, i) {
    var r,
        e,
        u,
        o,
        l = arguments;
    if (t = j({}, t), 3 < arguments.length) for (i = [i], r = 3; r < arguments.length; r++) {
      i.push(l[r]);
    }
    if (null != i && (t.children = i), null != n && null != n.defaultProps) for (e in n.defaultProps) {
      void 0 === t[e] && (t[e] = n.defaultProps[e]);
    }
    return o = t.key, null != (u = t.ref) && delete t.ref, null != o && delete t.key, c(n, t, o, u);
  }

  function c(n, t, i, r) {
    var e = {
      type: n,
      props: t,
      key: i,
      ref: r,
      n: null,
      i: null,
      e: 0,
      o: null,
      l: null,
      c: null,
      constructor: void 0
    };
    return m.vnode && m.vnode(e), e;
  }

  function O(n) {
    return n.children;
  }

  function I(n, t) {
    this.props = n, this.context = t;
  }

  function w(n, t) {
    if (null == t) return n.i ? w(n.i, n.i.n.indexOf(n) + 1) : null;

    for (var i; t < n.n.length; t++) {
      if (null != (i = n.n[t]) && null != i.o) return i.o;
    }

    return "function" == typeof n.type ? w(n) : null;
  }

  function f(n) {
    var t, i;

    if (null != (n = n.i) && null != n.c) {
      for (n.o = n.c.base = null, t = 0; t < n.n.length; t++) {
        if (null != (i = n.n[t]) && null != i.o) {
          n.o = n.c.base = i.o;
          break;
        }
      }

      return f(n);
    }
  }

  function e(n) {
    (!n.f && (n.f = !0) && 1 === s.push(n) || i !== m.debounceRendering) && (i = m.debounceRendering, (m.debounceRendering || t)(u));
  }

  function u() {
    var n, t, i, r, e, u, o, l;

    for (s.sort(function (n, t) {
      return t.p.e - n.p.e;
    }); n = s.pop();) {
      n.f && (r = i = void 0, u = (e = (t = n).p).o, o = t.w, l = t.u, t.u = !1, o && (i = [], r = x(o, e, j({}, e), t.m, void 0 !== o.ownerSVGElement, null, i, l, null == u ? w(e) : u), v(i, e), r != u && f(e)));
    }
  }

  function A(t, i, n, r, e, u, o, l, s) {
    var c,
        f,
        a,
        h,
        v,
        d,
        p,
        g = n && n.n || M,
        b = g.length;
    if (l == k && (l = null != u ? u[0] : b ? w(n, 0) : null), c = 0, i.n = S(i.n, function (n) {
      if (null != n) {
        if (n.i = i, n.e = i.e + 1, null === (a = g[c]) || a && n.key == a.key && n.type === a.type) g[c] = void 0;else for (f = 0; f < b; f++) {
          if ((a = g[f]) && n.key == a.key && n.type === a.type) {
            g[f] = void 0;
            break;
          }

          a = null;
        }

        if (h = x(t, n, a = a || k, r, e, u, o, null, l, s), (f = n.ref) && a.ref != f && (p = p || []).push(f, n.c || h, n), null != h) {
          if (null == d && (d = h), null != n.l) h = n.l, n.l = null;else if (u == a || h != l || null == h.parentNode) {
            n: if (null == l || l.parentNode !== t) t.appendChild(h);else {
              for (v = l, f = 0; (v = v.nextSibling) && f < b; f += 2) {
                if (v == h) break n;
              }

              t.insertBefore(h, l);
            }

            "option" == i.type && (t.value = "");
          }
          l = h.nextSibling, "function" == typeof i.type && (i.l = h);
        }
      }

      return c++, n;
    }), i.o = d, null != u && "function" != typeof i.type) for (c = u.length; c--;) {
      null != u[c] && y(u[c]);
    }

    for (c = b; c--;) {
      null != g[c] && R(g[c], g[c]);
    }

    if (p) for (c = 0; c < p.length; c++) {
      N(p[c], p[++c], p[++c]);
    }
  }

  function S(n, t, i) {
    if (null == i && (i = []), null == n || "boolean" == typeof n) t && i.push(t(null));else if (Array.isArray(n)) for (var r = 0; r < n.length; r++) {
      S(n[r], t, i);
    } else i.push(t ? t(function (n) {
      if (null == n || "boolean" == typeof n) return null;
      if ("string" == typeof n || "number" == typeof n) return c(null, n, null, null);
      if (null == n.o && null == n.c) return n;
      var t = c(n.type, n.props, n.key, null);
      return t.o = n.o, t;
    }(n)) : n);
    return i;
  }

  function a(n, t, i) {
    "-" === t[0] ? n.setProperty(t, i) : n[t] = "number" == typeof i && !1 === r.test(t) ? i + "px" : null == i ? "" : i;
  }

  function E(n, t, i, r, e) {
    var u, o, l, s, c;
    if ("key" === (t = e ? "className" === t ? "class" : t : "class" === t ? "className" : t) || "children" === t) ;else if ("style" === t) {
      if (u = n.style, "string" == typeof i) u.cssText = i;else {
        if ("string" == typeof r && (u.cssText = "", r = null), r) for (o in r) {
          i && o in i || a(u, o, "");
        }
        if (i) for (l in i) {
          r && i[l] === r[l] || a(u, l, i[l]);
        }
      }
    } else "o" === t[0] && "n" === t[1] ? (s = t !== (t = t.replace(/Capture$/, "")), t = ((c = t.toLowerCase()) in n ? c : t).slice(2), i ? (r || n.addEventListener(t, h, s), (n.t || (n.t = {}))[t] = i) : n.removeEventListener(t, h, s)) : "list" !== t && "tagName" !== t && "form" !== t && !e && t in n ? n[t] = null == i ? "" : i : "function" != typeof i && "dangerouslySetInnerHTML" !== t && (t !== (t = t.replace(/^xlink:?/, "")) ? null == i || !1 === i ? n.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), i) : null == i || !1 === i ? n.removeAttribute(t) : n.setAttribute(t, i));
  }

  function h(n) {
    return this.t[n.type](m.event ? m.event(n) : n);
  }

  function x(n, t, i, r, e, u, o, l, s, c) {
    var f,
        a,
        h,
        v,
        d,
        p,
        g,
        b,
        y,
        w,
        x = t.type;
    if (void 0 !== t.constructor) return null;
    (f = m.e) && f(t);

    try {
      n: if ("function" == typeof x) {
        if (b = t.props, y = (f = x.contextType) && r[f.c], w = f ? y ? y.props.value : f.i : r, i.c ? g = (a = t.c = i.c).i = a.k : ("prototype" in x && x.prototype.render ? t.c = a = new x(b, w) : (t.c = a = new I(b, w), a.constructor = x, a.render = _), y && y.sub(a), a.props = b, a.state || (a.state = {}), a.context = w, a.m = r, h = a.f = !0, a.M = []), null == a.j && (a.j = a.state), null != x.getDerivedStateFromProps && j(a.j == a.state ? a.j = j({}, a.j) : a.j, x.getDerivedStateFromProps(b, a.j)), h) null == x.getDerivedStateFromProps && null != a.componentWillMount && a.componentWillMount(), null != a.componentDidMount && o.push(a);else {
          if (null == x.getDerivedStateFromProps && null == l && null != a.componentWillReceiveProps && a.componentWillReceiveProps(b, w), !l && null != a.shouldComponentUpdate && !1 === a.shouldComponentUpdate(b, a.j, w)) {
            for (a.props = b, a.state = a.j, a.f = !1, (a.p = t).o = null != s ? s !== i.o ? s : i.o : null, t.n = i.n, f = 0; f < t.n.length; f++) {
              t.n[f] && (t.n[f].i = t);
            }

            break n;
          }

          null != a.componentWillUpdate && a.componentWillUpdate(b, a.j, w);
        }

        for (v = a.props, d = a.state, a.context = w, a.props = b, a.state = a.j, (f = m.O) && f(t), a.f = !1, a.p = t, a.w = n, f = a.render(a.props, a.state, a.context), t.n = S(null != f && f.type == O && null == f.key ? f.props.children : f), null != a.getChildContext && (r = j(j({}, r), a.getChildContext())), h || null == a.getSnapshotBeforeUpdate || (p = a.getSnapshotBeforeUpdate(v, d)), A(n, t, i, r, e, u, o, s, c), a.base = t.o; f = a.M.pop();) {
          a.j && (a.state = a.j), f.call(a);
        }

        h || null == v || null == a.componentDidUpdate || a.componentDidUpdate(v, d, p), g && (a.k = a.i = null);
      } else t.o = function (n, t, i, r, e, u, o, l) {
        var s,
            c,
            f,
            a,
            h = i.props,
            v = t.props;
        if (e = "svg" === t.type || e, null == n && null != u) for (s = 0; s < u.length; s++) {
          if (null != (c = u[s]) && (null === t.type ? 3 === c.nodeType : c.localName === t.type)) {
            n = c, u[s] = null;
            break;
          }
        }

        if (null == n) {
          if (null === t.type) return document.createTextNode(v);
          n = e ? document.createElementNS("http://www.w3.org/2000/svg", t.type) : document.createElement(t.type), u = null;
        }

        return null === t.type ? h !== v && (null != u && (u[u.indexOf(n)] = null), n.data = v) : t !== i && (null != u && (u = M.slice.call(n.childNodes)), f = (h = i.props || k).dangerouslySetInnerHTML, a = v.dangerouslySetInnerHTML, l || (a || f) && (a && f && a.I == f.I || (n.innerHTML = a && a.I || "")), function (n, t, i, r, e) {
          var u;

          for (u in i) {
            u in t || E(n, u, null, i[u], r);
          }

          for (u in t) {
            e && "function" != typeof t[u] || "value" === u || "checked" === u || i[u] === t[u] || E(n, u, t[u], i[u], r);
          }
        }(n, v, h, e, l), t.n = t.props.children, a || A(n, t, i, r, "foreignObject" !== t.type && e, u, o, k, l), l || ("value" in v && void 0 !== v.value && v.value !== n.value && (n.value = null == v.value ? "" : v.value), "checked" in v && void 0 !== v.checked && v.checked !== n.checked && (n.checked = v.checked))), n;
      }(i.o, t, i, r, e, u, o, c);

      (f = m.diffed) && f(t);
    } catch (n) {
      m.o(n, t, i);
    }

    return t.o;
  }

  function v(n, t) {
    for (var i; i = n.pop();) {
      try {
        i.componentDidMount();
      } catch (n) {
        m.o(n, i.p);
      }
    }

    m.c && m.c(t);
  }

  function N(n, t, i) {
    try {
      "function" == typeof n ? n(t) : n.current = t;
    } catch (n) {
      m.o(n, i);
    }
  }

  function R(n, t, i) {
    var r, e, u;

    if (m.unmount && m.unmount(n), (r = n.ref) && N(r, null, t), i || "function" == typeof n.type || (i = null != (e = n.o)), n.o = n.l = null, null != (r = n.c)) {
      if (r.componentWillUnmount) try {
        r.componentWillUnmount();
      } catch (n) {
        m.o(n, t);
      }
      r.base = r.w = null;
    }

    if (r = n.n) for (u = 0; u < r.length; u++) {
      r[u] && R(r[u], t, i);
    }
    null != e && y(e);
  }

  function _(n, t, i) {
    return this.constructor(n, i);
  }

  m = {}, I.prototype.setState = function (n, t) {
    var i = this.j !== this.state && this.j || (this.j = j({}, this.state));
    "function" == typeof n && !(n = n(i, this.props)) || j(i, n), null != n && this.p && (this.u = !1, t && this.M.push(t), e(this));
  }, I.prototype.forceUpdate = function (n) {
    this.p && (n && this.M.push(n), this.u = !0, e(this));
  }, I.prototype.render = O, s = [], t = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, i = m.debounceRendering, m.o = function (n, t, i) {
    for (var r; t = t.i;) {
      if ((r = t.c) && !r.i) try {
        if (r.constructor && null != r.constructor.getDerivedStateFromError) r.setState(r.constructor.getDerivedStateFromError(n));else {
          if (null == r.componentDidCatch) continue;
          r.componentDidCatch(n);
        }
        return e(r.k = r);
      } catch (t) {
        n = t;
      }
    }

    throw n;
  }, o = k;
  var n = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",
      l = "[\\s|\\(]+(" + n + ")[,|\\s]+(" + n + ")[,|\\s]+(" + n + ")\\s*\\)?",
      p = "[\\s|\\(]+(" + n + ")[,|\\s]+(" + n + ")[,|\\s]+(" + n + ")[,|\\s]+(" + n + ")\\s*\\)?",
      g = new RegExp("rgb" + l),
      b = new RegExp("rgba" + p),
      P = new RegExp("hsl" + l),
      z = new RegExp("hsla" + p),
      C = "^(?:#?|0x?)",
      H = "([0-9a-fA-F]{1})",
      T = "([0-9a-fA-F]{2})",
      W = new RegExp(C + H + H + H + "$"),
      $ = new RegExp(C + H + H + H + H + "$"),
      B = new RegExp(C + T + T + T + "$"),
      D = new RegExp(C + T + T + T + T + "$"),
      F = Math.log,
      G = Math.round,
      L = Math.floor;

  function U(n, t) {
    var i = -1 < n.indexOf("%"),
        r = parseFloat(n);
    return i ? t / 100 * r : r;
  }

  function q(n) {
    return parseInt(n, 16);
  }

  function J(n) {
    return n.toString(16).padStart(2, "0");
  }

  var K = function K(n, t) {
    this.$ = {
      h: 0,
      s: 0,
      v: 0,
      a: 1
    }, n && this.set(n), this.onChange = t, this.initialValue = Object.assign({}, this.$);
  },
      Q = {
    hsv: {
      configurable: !0
    },
    hsva: {
      configurable: !0
    },
    hue: {
      configurable: !0
    },
    saturation: {
      configurable: !0
    },
    value: {
      configurable: !0
    },
    alpha: {
      configurable: !0
    },
    kelvin: {
      configurable: !0
    },
    rgb: {
      configurable: !0
    },
    rgba: {
      configurable: !0
    },
    hsl: {
      configurable: !0
    },
    hsla: {
      configurable: !0
    },
    rgbString: {
      configurable: !0
    },
    rgbaString: {
      configurable: !0
    },
    hexString: {
      configurable: !0
    },
    hex8String: {
      configurable: !0
    },
    hslString: {
      configurable: !0
    },
    hslaString: {
      configurable: !0
    }
  };

  K.prototype.set = function (n) {
    if ("string" == typeof n) /^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(n) ? this.hexString = n : /^rgba?/.test(n) ? this.rgbString = n : /^hsla?/.test(n) && (this.hslString = n);else {
      if ("object" != _typeof(n)) throw new Error("Invalid color value");
      n instanceof K ? this.hsv = n.hsv : "object" == _typeof(n) && "r" in n && "g" in n && "b" in n ? this.rgb = n : "object" == _typeof(n) && "h" in n && "s" in n && "v" in n ? this.hsv = n : "object" == _typeof(n) && "h" in n && "s" in n && "l" in n && (this.hsl = n);
    }
  }, K.prototype.setChannel = function (n, t, i) {
    var r;
    this[n] = Object.assign({}, this[n], ((r = {})[t] = i, r));
  }, K.prototype.reset = function () {
    this.hsva = this.initialValue;
  }, K.prototype.clone = function () {
    return new K(this);
  }, K.prototype.unbind = function () {
    this.onChange = void 0;
  }, K.hsvToRgb = function (n) {
    var t = n.h / 60,
        i = n.s / 100,
        r = n.v / 100,
        e = L(t),
        u = t - e,
        o = r * (1 - i),
        l = r * (1 - u * i),
        s = r * (1 - (1 - u) * i),
        c = e % 6;
    return {
      r: 255 * [r, l, o, o, s, r][c],
      g: 255 * [s, r, r, l, o, o][c],
      b: 255 * [o, o, s, r, r, l][c]
    };
  }, K.rgbToHsv = function (n) {
    var t = n.r / 255,
        i = n.g / 255,
        r = n.b / 255,
        e = Math.max(t, i, r),
        u = Math.min(t, i, r),
        o = e - u,
        l = 0,
        s = e,
        c = 0 === e ? 0 : o / e;

    switch (e) {
      case u:
        l = 0;
        break;

      case t:
        l = (i - r) / o + (i < r ? 6 : 0);
        break;

      case i:
        l = (r - t) / o + 2;
        break;

      case r:
        l = (t - i) / o + 4;
    }

    return {
      h: 60 * l,
      s: 100 * c,
      v: 100 * s
    };
  }, K.hsvToHsl = function (n) {
    var t = n.s / 100,
        i = n.v / 100,
        r = (2 - t) * i,
        e = r <= 1 ? r : 2 - r,
        u = e < 1e-9 ? 0 : t * i / e;
    return {
      h: n.h,
      s: 100 * u,
      l: 50 * r
    };
  }, K.hslToHsv = function (n) {
    var t = 2 * n.l,
        i = n.s * (t <= 100 ? t : 200 - t) / 100,
        r = t + i < 1e-9 ? 0 : 2 * i / (t + i);
    return {
      h: n.h,
      s: 100 * r,
      v: (t + i) / 2
    };
  }, K.kelvinToRgb = function (n) {
    var t,
        i,
        r,
        e = n / 100;
    return r = e < 66 ? (t = 255, i = -155.25485562709179 - .44596950469579133 * (i = e - 2) + 104.49216199393888 * F(i), e < 20 ? 0 : .8274096064007395 * (r = e - 10) - 254.76935184120902 + 115.67994401066147 * F(r)) : (t = 351.97690566805693 + .114206453784165 * (t = e - 55) - 40.25366309332127 * F(t), i = 325.4494125711974 + .07943456536662342 * (i = e - 50) - 28.0852963507957 * F(i), 255), {
      r: L(t),
      g: L(i),
      b: L(r)
    };
  }, K.rgbToKelvin = function (n) {
    for (var t, i = n.r, r = n.b, e = 1e3, u = 4e4; .4 < u - e;) {
      t = .5 * (u + e);
      var o = K.kelvinToRgb(t);
      o.b / o.r >= r / i ? u = t : e = t;
    }

    return t;
  }, Q.hsv.get = function () {
    var n = this.$;
    return {
      h: n.h,
      s: n.s,
      v: n.v
    };
  }, Q.hsv.set = function (n) {
    var t = this.$;

    if (n = Object.assign({}, t, n), this.onChange) {
      var i = {
        h: !1,
        v: !1,
        s: !1,
        a: !1
      };

      for (var r in t) {
        i[r] = n[r] != t[r];
      }

      this.$ = n, (i.h || i.s || i.v || i.a) && this.onChange(this, i);
    } else this.$ = n;
  }, Q.hsva.get = function () {
    return Object.assign({}, this.$);
  }, Q.hsva.set = function (n) {
    this.hsv = n;
  }, Q.hue.get = function () {
    return this.$.h;
  }, Q.hue.set = function (n) {
    this.hsv = {
      h: n
    };
  }, Q.saturation.get = function () {
    return this.$.s;
  }, Q.saturation.set = function (n) {
    this.hsv = {
      s: n
    };
  }, Q.value.get = function () {
    return this.$.v;
  }, Q.value.set = function (n) {
    this.hsv = {
      v: n
    };
  }, Q.alpha.get = function () {
    return this.$.a;
  }, Q.alpha.set = function (n) {
    this.hsv = Object.assign({}, this.hsv, {
      a: n
    });
  }, Q.kelvin.get = function () {
    return K.rgbToKelvin(this.rgb);
  }, Q.kelvin.set = function (n) {
    this.rgb = K.kelvinToRgb(n);
  }, Q.rgb.get = function () {
    var n = K.hsvToRgb(this.$),
        t = n.r,
        i = n.g,
        r = n.b;
    return {
      r: G(t),
      g: G(i),
      b: G(r)
    };
  }, Q.rgb.set = function (n) {
    this.hsv = Object.assign({}, K.rgbToHsv(n), {
      a: void 0 === n.a ? 1 : n.a
    });
  }, Q.rgba.get = function () {
    return Object.assign({}, this.rgb, {
      a: this.alpha
    });
  }, Q.rgba.set = function (n) {
    this.rgb = n;
  }, Q.hsl.get = function () {
    var n = K.hsvToHsl(this.$),
        t = n.h,
        i = n.s,
        r = n.l;
    return {
      h: G(t),
      s: G(i),
      l: G(r)
    };
  }, Q.hsl.set = function (n) {
    this.hsv = Object.assign({}, K.hslToHsv(n), {
      a: void 0 === n.a ? 1 : n.a
    });
  }, Q.hsla.get = function () {
    return Object.assign({}, this.hsl, {
      a: this.alpha
    });
  }, Q.hsla.set = function (n) {
    this.hsl = n;
  }, Q.rgbString.get = function () {
    var n = this.rgb;
    return "rgb(" + n.r + ", " + n.g + ", " + n.b + ")";
  }, Q.rgbString.set = function (n) {
    var t,
        i,
        r,
        e,
        u = 1;
    if ((t = g.exec(n)) ? (i = U(t[1], 255), r = U(t[2], 255), e = U(t[3], 255)) : (t = b.exec(n)) && (i = U(t[1], 255), r = U(t[2], 255), e = U(t[3], 255), u = U(t[4], 1)), !t) throw new Error("Invalid rgb string");
    this.rgb = {
      r: i,
      g: r,
      b: e,
      a: u
    };
  }, Q.rgbaString.get = function () {
    var n = this.rgba;
    return "rgba(" + n.r + ", " + n.g + ", " + n.b + ", " + n.a + ")";
  }, Q.rgbaString.set = function (n) {
    this.rgbString = n;
  }, Q.hexString.get = function () {
    var n = this.rgb;
    return "#" + J(n.r) + J(n.g) + J(n.b);
  }, Q.hexString.set = function (n) {
    var t,
        i,
        r,
        e,
        u = 255;
    if ((t = W.exec(n)) ? (i = 17 * q(t[1]), r = 17 * q(t[2]), e = 17 * q(t[3])) : (t = $.exec(n)) ? (i = 17 * q(t[1]), r = 17 * q(t[2]), e = 17 * q(t[3]), u = 17 * q(t[4])) : (t = B.exec(n)) ? (i = q(t[1]), r = q(t[2]), e = q(t[3])) : (t = D.exec(n)) && (i = q(t[1]), r = q(t[2]), e = q(t[3]), u = q(t[4])), !t) throw new Error("Invalid hex string");
    this.rgb = {
      r: i,
      g: r,
      b: e,
      a: u / 255
    };
  }, Q.hex8String.get = function () {
    var n = this.rgba;
    return "#" + J(n.r) + J(n.g) + J(n.b) + J(L(255 * n.a));
  }, Q.hex8String.set = function (n) {
    this.hexString = n;
  }, Q.hslString.get = function () {
    var n = this.hsl;
    return "hsl(" + n.h + ", " + n.s + "%, " + n.l + "%)";
  }, Q.hslString.set = function (n) {
    var t,
        i,
        r,
        e,
        u = 1;
    if ((t = P.exec(n)) ? (i = U(t[1], 360), r = U(t[2], 100), e = U(t[3], 100)) : (t = z.exec(n)) && (i = U(t[1], 360), r = U(t[2], 100), e = U(t[3], 100), u = U(t[4], 1)), !t) throw new Error("Invalid hsl string");
    this.hsl = {
      h: i,
      s: r,
      l: e,
      a: u
    };
  }, Q.hslaString.get = function () {
    var n = this.hsla;
    return "hsl(" + n.h + ", " + n.s + "%, " + n.l + "%, " + n.a + ")";
  }, Q.hslaString.set = function (n) {
    this.hslString = n;
  }, Object.defineProperties(K.prototype, Q);

  function V(n) {
    var t = n.width,
        i = n.sliderSize,
        r = n.borderWidth,
        e = n.handleRadius,
        u = n.padding,
        o = n.sliderShape,
        l = "horizontal" === n.layoutDirection;
    return i = i || 2 * u + 2 * e + 2 * r, "circle" === o ? {
      handleStart: n.padding + n.handleRadius,
      handleRange: t - 2 * u - 2 * e - 2 * r,
      width: t,
      height: t,
      cx: t / 2,
      cy: t / 2,
      radius: t / 2 - r / 2
    } : {
      handleStart: i / 2,
      handleRange: t - i,
      radius: i / 2,
      x: 0,
      y: 0,
      width: l ? i : t,
      height: l ? t : i
    };
  }

  function X(n, t) {
    var i = V(n),
        r = i.width,
        e = i.height,
        u = i.handleRange,
        o = i.handleStart,
        l = "horizontal" === n.layoutDirection,
        s = l ? r / 2 : e / 2,
        c = o + function (n, t) {
      var i = t.hsva;

      switch (n.sliderType) {
        case "alpha":
          return 100 * i.a;

        case "kelvin":
          var r = n.minTemperature,
              e = n.maxTemperature - r,
              u = (t.kelvin - r) / e * 100;
          return Math.max(0, Math.min(u, 100));

        case "hue":
          return i.h /= 3.6;

        case "saturation":
          return i.s;

        case "value":
        default:
          return i.v;
      }
    }(n, t) / 100 * u;

    return l && (c = -1 * c + u + 2 * o), {
      x: l ? s : c,
      y: l ? c : s
    };
  }

  function Y(n) {
    var t = n.width / 2;
    return {
      width: n.width,
      radius: t - n.borderWidth,
      cx: t,
      cy: t
    };
  }

  function Z(n, t, i) {
    var r = n.wheelAngle,
        e = n.wheelDirection;
    return ((t = !i && "clockwise" === e || i && "anticlockwise" === e ? (i ? 180 : 360) - (r - t) : r + t) % 360 + 360) % 360;
  }

  function nn(n, t, i) {
    var r = Y(n),
        e = r.cx,
        u = r.cy,
        o = n.width / 2 - n.padding - n.handleRadius - n.borderWidth;
    t = e - t, i = u - i;
    var l = Z(n, Math.atan2(-i, -t) * (180 / Math.PI)),
        s = Math.min(Math.sqrt(t * t + i * i), o);
    return {
      h: Math.round(l),
      s: Math.round(100 / o * s)
    };
  }

  function tn(n) {
    var t = n.width;
    return {
      width: t,
      height: t,
      radius: n.padding + n.handleRadius
    };
  }

  function rn(n, t, i) {
    var r = tn(n),
        e = r.width,
        u = r.height,
        o = r.radius,
        l = (t - o) / (e - 2 * o) * 100,
        s = (i - o) / (u - 2 * o) * 100;
    return {
      s: Math.max(0, Math.min(l, 100)),
      v: Math.max(0, Math.min(100 - s, 100))
    };
  }

  var en = document.getElementsByTagName("base");

  function un(n) {
    var t = window.navigator.userAgent,
        i = /^((?!chrome|android).)*safari/i.test(t),
        r = /iPhone|iPod|iPad/i.test(t),
        e = window.location;
    return (i || r) && 0 < en.length ? e.protocol + "//" + e.host + e.pathname + e.search + n : n;
  }

  function on(n, t, i, r) {
    for (var e = 0; e < r.length; e++) {
      var u = r[e].x - t,
          o = r[e].y - i;
      if (Math.sqrt(u * u + o * o) < n.handleRadius) return e;
    }

    return null;
  }

  var ln = ["mousemove", "touchmove", "mouseup", "touchend"],
      sn = function (t) {
    function n(n) {
      t.call(this, n), this.uid = (Math.random() + 1).toString(36).substring(5);
    }

    return t && (n.__proto__ = t), ((n.prototype = Object.create(t && t.prototype)).constructor = n).prototype.render = function (n) {
      var t = this.handleEvent.bind(this),
          i = {
        onMouseDown: t,
        onTouchStart: t
      },
          r = "horizontal" === n.layoutDirection,
          e = null === n.margin ? n.sliderMargin : n.margin,
          u = {
        overflow: "visible",
        display: r ? "inline-block" : "block"
      };
      return 0 < n.index && (u[r ? "marginLeft" : "marginTop"] = e), d(O, null, n.children(this.uid, i, u));
    }, n.prototype.handleEvent = function (n) {
      var t = this,
          i = this.props.onInput,
          r = this.base.getBoundingClientRect();
      n.preventDefault();
      var e = n.touches ? n.changedTouches[0] : n,
          u = e.clientX - r.left,
          o = e.clientY - r.top;

      switch (n.type) {
        case "mousedown":
        case "touchstart":
          ln.forEach(function (n) {
            document.addEventListener(n, t, {
              passive: !1
            });
          }), i(u, o, 0);
          break;

        case "mousemove":
        case "touchmove":
          i(u, o, 1);
          break;

        case "mouseup":
        case "touchend":
          i(u, o, 2), ln.forEach(function (n) {
            document.removeEventListener(n, t);
          });
      }
    }, n;
  }(I);

  function cn(n) {
    var t = n.r,
        i = n.url;
    return d("svg", {
      className: "IroHandle IroHandle--" + n.index + " " + (n.isActive ? "IroHandle--isActive" : ""),
      x: n.x,
      y: n.y,
      style: {
        overflow: "visible"
      }
    }, i && d("use", Object.assign({
      xlinkHref: un(i)
    }, n.props)), !i && d("circle", {
      r: t,
      fill: "none",
      "stroke-width": 2,
      stroke: "#000"
    }), !i && d("circle", {
      r: t - 2,
      fill: n.fill,
      "stroke-width": 2,
      stroke: "#fff"
    }));
  }

  cn.defaultProps = {
    fill: "none",
    x: 0,
    y: 0,
    r: 8,
    url: null,
    props: {
      x: 0,
      y: 0
    }
  };
  var fn = Array.apply(null, {
    length: 360
  }).map(function (n, t) {
    return t;
  });

  function an(e) {
    var n = Y(e),
        r = n.width,
        u = n.radius,
        o = n.cx,
        l = n.cy,
        s = e.colors,
        c = e.borderWidth,
        f = e.parent,
        a = e.color,
        h = a.hsv,
        v = s.map(function (n) {
      return function (n, t) {
        var i = t.hsv,
            r = Y(n),
            e = r.cx,
            u = r.cy,
            o = n.width / 2 - n.padding - n.handleRadius - n.borderWidth,
            l = (180 + Z(n, i.h, !0)) * (Math.PI / 180),
            s = i.s / 100 * o,
            c = "clockwise" === n.wheelDirection ? -1 : 1;
        return {
          x: e + s * Math.cos(l) * c,
          y: u + s * Math.sin(l) * c
        };
      }(e, n);
    });
    return d(sn, Object.assign({}, e, {
      onInput: function onInput(n, t, i) {
        if (0 === i) {
          var r = on(e, n, t, v);
          null !== r ? f.setActiveColor(r) : (f.inputActive = !0, a.hsv = nn(e, n, t), e.onInput(i));
        } else 1 === i && (f.inputActive = !0, a.hsv = nn(e, n, t));

        e.onInput(i);
      }
    }), function (n, t, i) {
      return d("svg", Object.assign({}, t, {
        className: "IroWheel",
        width: r,
        height: r,
        style: i
      }), d("defs", null, d("radialGradient", {
        id: n
      }, d("stop", {
        offset: "0%",
        "stop-color": "#fff"
      }), d("stop", {
        offset: "100%",
        "stop-color": "#fff",
        "stop-opacity": "0"
      }))), d("g", {
        className: "IroWheelHue",
        "stroke-width": u,
        fill: "none"
      }, fn.map(function (n) {
        return d("path", {
          key: n,
          d: function (n, t, i, r, e) {
            var u = e - r <= 180 ? 0 : 1;
            return r *= Math.PI / 180, e *= Math.PI / 180, "M " + (n + i * Math.cos(e)) + " " + (t + i * Math.sin(e)) + " A " + i + " " + i + " 0 " + u + " 0 " + (n + i * Math.cos(r)) + " " + (t + i * Math.sin(r));
          }(o, l, u / 2, n, n + 1.5),
          stroke: "hsl(" + Z(e, n) + ", 100%, 50%)"
        });
      })), d("circle", {
        className: "IroWheelSaturation",
        cx: o,
        cy: l,
        r: u,
        fill: "url(" + un("#" + n) + ")"
      }), e.wheelLightness && d("circle", {
        className: "IroWheelLightness",
        cx: o,
        cy: l,
        r: u,
        fill: "#000",
        opacity: 1 - h.v / 100
      }), d("circle", {
        className: "IroWheelBorder",
        cx: o,
        cy: l,
        r: u,
        fill: "none",
        stroke: e.borderColor,
        "stroke-width": c
      }), s.filter(function (n) {
        return n !== a;
      }).map(function (n) {
        return d(cn, {
          isActive: !1,
          index: n.index,
          fill: n.hslString,
          r: e.handleRadius,
          url: e.handleSvg,
          props: e.handleProps,
          x: v[n.index].x,
          y: v[n.index].y
        });
      }), d(cn, {
        isActive: !0,
        index: a.index,
        fill: a.hslString,
        r: e.handleRadius,
        url: e.handleSvg,
        props: e.handleProps,
        x: v[a.index].x,
        y: v[a.index].y
      }));
    });
  }

  function hn(e) {
    var u = e.color,
        n = V(e),
        r = n.width,
        o = n.height,
        l = n.radius,
        s = X(e, u),
        c = function (n, t) {
      var i = t.hsv;

      switch (n.sliderType) {
        case "alpha":
          var r = t.rgb;
          return [[0, "rgba(" + r.r + "," + r.g + "," + r.b + ",0)"], [100, "rgb(" + r.r + "," + r.g + "," + r.b + ")"]];

        case "kelvin":
          for (var e = [], u = n.minTemperature, o = n.maxTemperature, l = o - u, s = u, c = 0; s < o; s += l / 8, c += 1) {
            var f = K.kelvinToRgb(s),
                a = f.r,
                h = f.g,
                v = f.b;
            e.push([12.5 * c, "rgb(" + a + "," + h + "," + v + ")"]);
          }

          return e;

        case "hue":
          return [[0, "#f00"], [16.666, "#ff0"], [33.333, "#0f0"], [50, "#0ff"], [66.666, "#00f"], [83.333, "#f0f"], [100, "#f00"]];

        case "saturation":
          var d = K.hsvToHsl({
            h: i.h,
            s: 0,
            v: i.v
          }),
              p = K.hsvToHsl({
            h: i.h,
            s: 100,
            v: i.v
          });
          return [[0, "hsl(" + d.h + "," + d.s + "%," + d.l + "%)"], [100, "hsl(" + p.h + "," + p.s + "%," + p.l + "%)"]];

        case "value":
        default:
          var g = K.hsvToHsl({
            h: i.h,
            s: i.s,
            v: 100
          });
          return [[0, "#000"], [100, "hsl(" + g.h + "," + g.s + "%," + g.l + "%)"]];
      }
    }(e, u),
        f = "alpha" === e.sliderType;

    return d(sn, Object.assign({}, e, {
      onInput: function onInput(n, t, i) {
        var r = function (n, t, i) {
          var r,
              e = V(n),
              u = e.handleRange,
              o = e.handleStart;
          r = "horizontal" === n.layoutDirection ? -1 * i + u + o : t - o, r = Math.max(Math.min(r, u), 0);
          var l = Math.round(100 / u * r);

          switch (n.sliderType) {
            case "kelvin":
              var s = n.minTemperature;
              return s + l / 100 * (n.maxTemperature - s);

            case "alpha":
              return l / 100;

            case "hue":
              return 3.6 * l;

            default:
              return l;
          }
        }(e, n, t);

        e.parent.inputActive = !0, u[e.sliderType] = r, e.onInput(i);
      }
    }), function (n, t, i) {
      return d("svg", Object.assign({}, t, {
        className: "IroSlider",
        width: r,
        height: o,
        style: i
      }), d("defs", null, d("linearGradient", Object.assign({
        id: "g" + n
      }, function (n) {
        var t = "horizontal" === n.layoutDirection;
        return {
          x1: "0%",
          y1: t ? "100%" : "0%",
          x2: t ? "0%" : "100%",
          y2: "0%"
        };
      }(e)), c.map(function (n) {
        return d("stop", {
          offset: n[0] + "%",
          "stop-color": n[1]
        });
      })), f && d("pattern", {
        id: "b" + n,
        width: "8",
        height: "8",
        patternUnits: "userSpaceOnUse"
      }, d("rect", {
        x: "0",
        y: "0",
        width: "8",
        height: "8",
        fill: "#fff"
      }), d("rect", {
        x: "0",
        y: "0",
        width: "4",
        height: "4",
        fill: "#ccc"
      }), d("rect", {
        x: "4",
        y: "4",
        width: "4",
        height: "4",
        fill: "#ccc"
      })), f && d("pattern", {
        id: "f" + n,
        width: "100%",
        height: "100%"
      }, d("rect", {
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        fill: "url(" + un("#b" + n) + ")"
      }), " }", d("rect", {
        x: "0",
        y: "0",
        width: "100%",
        height: "100%",
        fill: "url(" + un("#g" + n) + ")"
      }))), d("rect", {
        className: "IroSliderBg",
        rx: l,
        ry: l,
        x: e.borderWidth / 2,
        y: e.borderWidth / 2,
        width: r - e.borderWidth,
        height: o - e.borderWidth,
        "stroke-width": e.borderWidth,
        stroke: e.borderColor,
        fill: "url(" + un((f ? "#f" : "#g") + n) + ")"
      }), d(cn, {
        isActive: !0,
        index: u.index,
        r: e.handleRadius,
        url: e.handleSvg,
        props: e.handleProps,
        x: s.x,
        y: s.y
      }));
    });
  }

  hn.defaultProps = Object.assign({}, {
    sliderShape: "bar",
    sliderType: "value",
    minTemperature: 2200,
    maxTemperature: 11e3
  });

  var vn = function (i) {
    function n(n) {
      var t = this;
      i.call(this, n), this.colors = [], this.inputActive = !1, this.events = {}, this.activeEvents = {}, this.deferredEvents = {}, this.id = n.id, (0 < n.colors.length ? n.colors : [n.color]).forEach(function (n) {
        return t.addColor(n);
      }), this.setActiveColor(0), this.state = Object.assign({}, n, {
        color: this.color,
        colors: this.colors,
        layout: n.layout
      });
    }

    return i && (n.__proto__ = i), ((n.prototype = Object.create(i && i.prototype)).constructor = n).prototype.addColor = function (n, t) {
      void 0 === t && (t = this.colors.length);
      var i = new K(n, this.onColorChange.bind(this));
      this.colors.splice(t, 0, i), this.colors.forEach(function (n, t) {
        return n.index = t;
      }), this.state && this.setState({
        colors: this.colors
      }), this.deferredEmit("color:init", i);
    }, n.prototype.removeColor = function (n) {
      var t = this.colors.splice(n, 1)[0];
      t.unbind(), this.colors.forEach(function (n, t) {
        return n.index = t;
      }), this.state && this.setState({
        colors: this.colors
      }), t.index === this.color.index && this.setActiveColor(0), this.emit("color:remove", t);
    }, n.prototype.setActiveColor = function (n) {
      this.color = this.colors[n], this.state && this.setState({
        color: this.color
      }), this.emit("color:setActive", this.color);
    }, n.prototype.setColors = function (n) {
      var t = this;
      this.colors.forEach(function (n) {
        return n.unbind();
      }), this.colors = [], n.forEach(function (n) {
        return t.addColor(n);
      }), this.setActiveColor(0), this.emit("color:setAll", this.colors);
    }, n.prototype.on = function (n, t) {
      var i = this,
          r = this.events;
      (Array.isArray(n) ? n : [n]).forEach(function (n) {
        (r[n] || (r[n] = [])).push(t), i.deferredEvents[n] && (i.deferredEvents[n].forEach(function (n) {
          t.apply(null, n);
        }), i.deferredEvents[n] = []);
      });
    }, n.prototype.off = function (n, i) {
      var r = this;
      (Array.isArray(n) ? n : [n]).forEach(function (n) {
        var t = r.events[n];
        t && t.splice(t.indexOf(i), 1);
      });
    }, n.prototype.emit = function (n) {
      for (var t = this, i = [], r = arguments.length - 1; 0 < r--;) {
        i[r] = arguments[r + 1];
      }

      var e = this.activeEvents;
      !!e.hasOwnProperty(n) && e[n] || (e[n] = !0, (this.events[n] || []).forEach(function (n) {
        return n.apply(t, i);
      }), e[n] = !1);
    }, n.prototype.deferredEmit = function (n) {
      for (var t, i = [], r = arguments.length - 1; 0 < r--;) {
        i[r] = arguments[r + 1];
      }

      var e = this.deferredEvents;
      (t = this).emit.apply(t, [n].concat(i)), (e[n] || (e[n] = [])).push(i);
    }, n.prototype.setOptions = function (n) {
      this.setState(Object.assign({}, this.state, n));
    }, n.prototype.resize = function (n) {
      this.setOptions({
        width: n
      });
    }, n.prototype.reset = function () {
      this.colors.forEach(function (n) {
        return n.reset();
      }), this.setState({
        colors: this.colors
      });
    }, n.prototype.onMount = function (n) {
      this.el = n, this.deferredEmit("mount", this);
    }, n.prototype.onColorChange = function (n, t) {
      this.setState({
        color: this.color
      }), this.inputActive && (this.inputActive = !1, this.emit("input:change", n, t)), this.emit("color:change", n, t);
    }, n.prototype.emitInputEvent = function (n) {
      0 === n ? this.emit("input:start", this.color) : 1 === n ? this.emit("input:move", this.color) : 2 === n && this.emit("input:end", this.color);
    }, n.prototype.render = function (n, e) {
      var u = this,
          t = e.layout;
      return Array.isArray(t) || (t = [{
        component: an
      }, {
        component: hn
      }], e.transparency && t.push({
        component: hn,
        options: {
          sliderType: "alpha"
        }
      })), d("div", {
        "class": "IroColorPicker",
        id: e.id,
        style: {
          display: e.display
        }
      }, t.map(function (n, t) {
        var i = n.component,
            r = n.options;
        return d(i, Object.assign({}, e, r, {
          ref: void 0,
          onInput: u.emitInputEvent.bind(u),
          parent: u,
          index: t
        }));
      }));
    }, n;
  }(I);

  vn.defaultProps = Object.assign({}, {
    width: 300,
    height: 300,
    handleRadius: 8,
    handleSvg: null,
    handleProps: {
      x: 0,
      y: 0
    },
    color: "#fff",
    colors: [],
    borderColor: "#fff",
    borderWidth: 0,
    wheelLightness: !0,
    wheelAngle: 0,
    wheelDirection: "anticlockwise",
    layoutDirection: "vertical",
    sliderSize: null,
    sliderMargin: 12,
    padding: 6
  }, {
    colors: [],
    display: "block",
    id: null,
    layout: "default",
    margin: null
  });
  var dn,
      pn = (gn.prototype = (dn = vn).prototype, Object.assign(gn, dn), gn.A = dn, gn);

  function gn(t, n) {
    var i,
        r = document.createElement("div");

    function e() {
      var n = t instanceof Element ? t : document.querySelector(t);
      n.appendChild(i.base), i.onMount(n);
    }

    return function (n, t, i) {
      var r, e, u;
      m.i && m.i(n, t), e = (r = i === o) ? null : i && i.n || t.n, n = d(O, null, [n]), u = [], x(t, r ? t.n = n : (i || t).n = n, e || k, k, void 0 !== t.ownerSVGElement, i && !r ? [i] : e ? null : M.slice.call(t.childNodes), u, !1, i || k, r), v(u, n);
    }(d(dn, Object.assign({}, {
      ref: function ref(n) {
        return i = n;
      }
    }, n)), r), "loading" !== document.readyState ? e() : document.addEventListener("DOMContentLoaded", e), i;
  }

  return {
    Color: K,
    ColorPicker: pn,
    ui: {
      h: d,
      ComponentBase: sn,
      Handle: cn,
      Slider: hn,
      Wheel: an,
      Box: function Box(e) {
        var n = tn(e),
            r = n.width,
            u = n.height,
            o = n.radius,
            l = e.colors,
            s = e.parent,
            c = e.color,
            f = function (n, t) {
          return [[[0, "#fff"], [100, "hsl(" + t.hue + ",100%,50%)"]], [[0, "rgba(0,0,0,0)"], [100, "#000"]]];
        }(0, c),
            a = l.map(function (n) {
          return function (n, t) {
            var i = tn(n),
                r = i.width,
                e = i.height,
                u = i.radius,
                o = t.hsv,
                l = u,
                s = r - 2 * u,
                c = e - 2 * u;
            return {
              x: l + o.s / 100 * s,
              y: l + (c - o.v / 100 * c)
            };
          }(e, n);
        });

        return d(sn, Object.assign({}, e, {
          onInput: function onInput(n, t, i) {
            if (0 === i) {
              var r = on(e, n, t, a);
              null !== r ? s.setActiveColor(r) : (s.inputActive = !0, c.hsv = rn(e, n, t), e.onInput(i));
            } else 1 === i && (s.inputActive = !0, c.hsv = rn(e, n, t));

            e.onInput(i);
          }
        }), function (n, t, i) {
          return d("svg", Object.assign({}, t, {
            className: "IroBox",
            width: r,
            height: u,
            style: i
          }), d("defs", null, d("linearGradient", {
            id: "s" + n,
            x1: "0%",
            y1: "0%",
            x2: "100%",
            y2: "0%"
          }, f[0].map(function (n) {
            return d("stop", {
              offset: n[0] + "%",
              "stop-color": n[1]
            });
          })), d("linearGradient", {
            id: "l" + n,
            x1: "0%",
            y1: "0%",
            x2: "0%",
            y2: "100%"
          }, f[1].map(function (n) {
            return d("stop", {
              offset: n[0] + "%",
              "stop-color": n[1]
            });
          })), d("pattern", {
            id: "f" + n,
            width: "100%",
            height: "100%"
          }, d("rect", {
            x: "0",
            y: "0",
            width: "100%",
            height: "100%",
            fill: "url(" + un("#s" + n) + ")"
          }), " }", d("rect", {
            x: "0",
            y: "0",
            width: "100%",
            height: "100%",
            fill: "url(" + un("#l" + n) + ")"
          }))), d("rect", {
            rx: o,
            ry: o,
            x: e.borderWidth / 2,
            y: e.borderWidth / 2,
            width: r - e.borderWidth,
            height: u - e.borderWidth,
            "stroke-width": e.borderWidth,
            stroke: e.borderColor,
            fill: "url(" + un("#f" + n) + ")"
          }), l.filter(function (n) {
            return n !== c;
          }).map(function (n) {
            return d(cn, {
              isActive: !1,
              index: n.index,
              fill: n.hslString,
              r: e.handleRadius,
              url: e.handleSvg,
              props: e.handleProps,
              x: a[n.index].x,
              y: a[n.index].y
            });
          }), d(cn, {
            isActive: !0,
            index: c.index,
            fill: c.hslString,
            r: e.handleRadius,
            url: e.handleSvg,
            props: e.handleProps,
            x: a[c.index].x,
            y: a[c.index].y
          }));
        });
      }
    },
    version: "5.1.5"
  };
});