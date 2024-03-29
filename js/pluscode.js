! function(e, t) {
  "function" == typeof define && define.amd ? define(["b"], function(r) {
    return e.returnExportsGlobal = t(r)
  }) : "object" == typeof module && module.exports ? module.exports = t(require("b")) : e.OpenLocationCode = t()
}(this, function() {
  var e = {};
  e.CODE_PRECISION_NORMAL = 10, e.CODE_PRECISION_EXTRA = 11;
  var t = "+",
    r = 8,
    n = "0",
    i = "23456789CFGHJMPQRVWX",
    o = i.length,
    a = 90,
    u = 180,
    f = 10,
    l = [20, 1, .05, .0025, 125e-6],
    d = 4,
    h = 5,
    s = 125e-6,
    c = 6,
    g = (e.getAlphabet = function() {
      return i
    }, e.isValid = function(e) {
      if (!e || "string" != typeof e) return !1;
      if (-1 == e.indexOf(t)) return !1;
      if (e.indexOf(t) != e.lastIndexOf(t)) return !1;
      if (1 == e.length) return !1;
      if (e.indexOf(t) > r || e.indexOf(t) % 2 == 1) return !1;
      if (e.indexOf(n) > -1) {
        if (0 == e.indexOf(n)) return !1;
        var o = e.match(new RegExp("(" + n + "+)", "g"));
        if (o.length > 1 || o[0].length % 2 == 1 || o[0].length > r - 2) return !1;
        if (e.charAt(e.length - 1) != t) return !1
      }
      if (e.length - e.indexOf(t) - 1 == 1) return !1;
      e = e.replace(new RegExp("\\" + t + "+"), "").replace(new RegExp(n + "+"), "");
      for (var a = 0, u = e.length; u > a; a++) {
        var f = e.charAt(a).toUpperCase();
        if (f != t && -1 == i.indexOf(f)) return !1
      }
      return !0
    }),
    p = e.isShort = function(e) {
      return g(e) && e.indexOf(t) >= 0 && e.indexOf(t) < r ? !0 : !1
    },
    C = e.isFull = function(e) {
      if (!g(e)) return !1;
      if (p(e)) return !1;
      var t = i.indexOf(e.charAt(0).toUpperCase()) * o;
      if (t >= 2 * a) return !1;
      if (e.length > 1) {
        var r = i.indexOf(e.charAt(1).toUpperCase()) * o;
        if (r >= 2 * u) return !1
      }
      return !0
    },
    x = e.encode = function(t, n, i) {
      if (t = Number(t), n = Number(n), i = "undefined" == typeof i ? e.CODE_PRECISION_NORMAL : Number(i), isNaN(t) || isNaN(n) || isNaN(i)) throw "ValueError: Parameters are not numbers";
      if (2 > i || r > i && i % 2 == 1) throw "IllegalArgumentException: Invalid Open Location Code length";
      t = N(t), n = m(n), 90 == t && (t -= v(i));
      var o = b(t, n, Math.min(i, f));
      return i > f && (o += M(t, n, i - f)), o
    },
    O = e.decode = function(e) {
      if (!C(e)) throw "IllegalArgumentException: Passed Open Location Code is not a valid full code: " + e;
      e = e.replace(t, ""), e = e.replace(new RegExp(n + "+"), ""), e = e.toUpperCase();
      var r = E(e.substring(0, f));
      if (e.length <= f) return r;
      var i = A(e.substring(f));
      return L(r.latitudeLo + i.latitudeLo, r.longitudeLo + i.longitudeLo, r.latitudeLo + i.latitudeHi, r.longitudeLo + i.longitudeHi, r.codeLength + i.codeLength)
    },
    N = (e.recoverNearest = function(e, n, i) {
      if (!p(e)) {
        if (C(e)) return e;
        throw "ValueError: Passed short code is not valid: " + e
      }
      if (n = Number(n), i = Number(i), isNaN(n) || isNaN(i)) throw "ValueError: Reference position are not numbers";
      n = N(n), i = m(i), e = e.toUpperCase();
      var o = r - e.indexOf(t),
        a = Math.pow(20, 2 - o / 2),
        u = a / 2,
        f = O(x(n, i).substr(0, o) + e),
        l = f.latitudeCenter - n;
      return l > u ? f.latitudeCenter -= a : -u > l && (f.latitudeCenter += a), l = f.longitudeCenter - i, l > u ? f.longitudeCenter -= a : -u > l && (f.longitudeCenter += a), x(f.latitudeCenter, f.longitudeCenter, f.codeLength)
    }, e.shorten = function(e, t, r) {
      if (!C(e)) throw "ValueError: Passed code is not valid and full: " + e;
      if (-1 != e.indexOf(n)) throw "ValueError: Cannot shorten padded codes: " + e;
      var e = e.toUpperCase(),
        i = O(e);
      if (i.codeLength < c) throw "ValueError: Code length must be at least " + c;
      if (t = Number(t), r = Number(r), isNaN(t) || isNaN(r)) throw "ValueError: Reference position are not numbers";
      t = N(t), r = m(r);
      for (var o = Math.max(Math.abs(i.latitudeCenter - t), Math.abs(i.longitudeCenter - r)), a = l.length - 2; a >= 1; a--)
        if (o < .3 * l[a]) return e.substring(2 * (a + 1));
      return e
    }, function(e) {
      return Math.min(90, Math.max(-90, e))
    }),
    v = function(e) {
      return 10 >= e ? Math.pow(20, Math.floor(e / -2 + 2)) : Math.pow(20, -3) / Math.pow(h, e - 10)
    },
    m = function(e) {
      for (; - 180 > e;) e += 360;
      for (; e >= 180;) e -= 360;
      return e
    },
    b = function(e, o, f) {
      for (var d = "", h = e + a, s = o + u, c = 0; f > c;) {
        var g = l[Math.floor(c / 2)],
          p = Math.floor(h / g);
        h -= p * g, d += i.charAt(p), c += 1, p = Math.floor(s / g), s -= p * g, d += i.charAt(p), c += 1, c == r && f > c && (d += t)
      }
      return d.length < r && (d += Array(r - d.length + 1).join(n)), d.length == r && (d += t), d
    },
    M = function(e, t, r) {
      for (var n = "", o = s, f = s, l = (e + a) % o, c = (t + u) % f, g = 0; r > g; g++) {
        var p = Math.floor(l / (o / h)),
          C = Math.floor(c / (f / d));
        o /= h, f /= d, l -= p * o, c -= C * f, n += i.charAt(p * d + C)
      }
      return n
    },
    E = function(e) {
      var t = w(e, 0),
        r = w(e, 1);
      return new L(t[0] - a, r[0] - u, t[1] - a, r[1] - u, e.length)
    },
    w = function(e, t) {
      for (var r = 0, n = 0; 2 * r + t < e.length;) n += i.indexOf(e.charAt(2 * r + t)) * l[r], r += 1;
      return [n, n + l[r - 1]]
    },
    A = function(e) {
      for (var t = 0, r = 0, n = s, o = s, a = 0; a < e.length;) {
        var u = i.indexOf(e.charAt(a)),
          f = Math.floor(u / d),
          l = u % d;
        n /= h, o /= d, t += f * n, r += l * o, a += 1
      }
      return L(t, r, t + n, r + o, e.length)
    },
    L = e.CodeArea = function(t, r, n, i, o) {
      return new e.CodeArea.fn.init(t, r, n, i, o)
    };
  return L.fn = L.prototype = {
    init: function(e, t, r, n, i) {
      this.latitudeLo = e, this.longitudeLo = t, this.latitudeHi = r, this.longitudeHi = n, this.codeLength = i, this.latitudeCenter = Math.min(e + (r - e) / 2, a), this.longitudeCenter = Math.min(t + (n - t) / 2, u)
    }
  }, L.fn.init.prototype = L.fn, e
});



var pc = ''; // pc = PlusCode
var area = OpenLocationCode.decode(pc);
var original_code = OpenLocationCode.encode(area.latitudeCenter, area.longitudeCenter, area.codeLength);

console.log(original_code);
