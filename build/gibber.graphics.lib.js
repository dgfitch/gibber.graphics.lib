!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Gibber=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* MIT license */
var convert = _dereq_("color-convert"),
    string = _dereq_("color-string");

module.exports = function(cssString) {
   return new Color(cssString);
};

var Color = function(cssString) {
   this.values = {
      rgb: [0, 0, 0],
      hsl: [0, 0, 0],
      hsv: [0, 0, 0],
      hwb: [0, 0, 0],
      cmyk: [0, 0, 0, 0],
      alpha: 1
   }

   // parse Color() argument
   if (typeof cssString == "string") {
      var vals = string.getRgba(cssString);
      if (vals) {
         this.setValues("rgb", vals);
      }
      else if(vals = string.getHsla(cssString)) {
         this.setValues("hsl", vals);
      }
      else if(vals = string.getHwb(cssString)) {
         this.setValues("hwb", vals);
      }
      else {
        throw new Error("Unable to parse color from string " + cssString);
      }
   }
   else if (typeof cssString == "object") {
      var vals = cssString;
      if(vals["r"] !== undefined || vals["red"] !== undefined) {
         this.setValues("rgb", vals)
      }
      else if(vals["l"] !== undefined || vals["lightness"] !== undefined) {
         this.setValues("hsl", vals)
      }
      else if(vals["v"] !== undefined || vals["value"] !== undefined) {
         this.setValues("hsv", vals)
      }
      else if(vals["w"] !== undefined || vals["whiteness"] !== undefined) {
         this.setValues("hwb", vals)
      }
      else if(vals["c"] !== undefined || vals["cyan"] !== undefined) {
         this.setValues("cmyk", vals)
      }
      else {
        throw new Error("Unable to parse color from object " + JSON.stringify(cssString));
      }
   }
}

Color.prototype = {
   rgb: function (vals) {
      return this.setSpace("rgb", arguments);
   },
   hsl: function(vals) {
      return this.setSpace("hsl", arguments);
   },
   hsv: function(vals) {
      return this.setSpace("hsv", arguments);
   },
   hwb: function(vals) {
      return this.setSpace("hwb", arguments);
   },
   cmyk: function(vals) {
      return this.setSpace("cmyk", arguments);
   },

   rgbArray: function() {
      return this.values.rgb;
   },
   hslArray: function() {
      return this.values.hsl;
   },
   hsvArray: function() {
      return this.values.hsv;
   },
   hwbArray: function() {
      if (this.values.alpha !== 1) {
        return this.values.hwb.concat([this.values.alpha])
      }
      return this.values.hwb;
   },
   cmykArray: function() {
      return this.values.cmyk;
   },
   rgbaArray: function() {
      var rgb = this.values.rgb;
      return rgb.concat([this.values.alpha]);
   },
   hslaArray: function() {
      var hsl = this.values.hsl;
      return hsl.concat([this.values.alpha]);
   },
   alpha: function(val) {
      if (val === undefined) {
         return this.values.alpha;
      }
      this.setValues("alpha", val);
      return this;
   },

   red: function(val) {
      return this.setChannel("rgb", 0, val);
   },
   green: function(val) {
      return this.setChannel("rgb", 1, val);
   },
   blue: function(val) {
      return this.setChannel("rgb", 2, val);
   },
   hue: function(val) {
      return this.setChannel("hsl", 0, val);
   },
   saturation: function(val) {
      return this.setChannel("hsl", 1, val);
   },
   lightness: function(val) {
      return this.setChannel("hsl", 2, val);
   },
   saturationv: function(val) {
      return this.setChannel("hsv", 1, val);
   },
   whiteness: function(val) {
      return this.setChannel("hwb", 1, val);
   },
   blackness: function(val) {
      return this.setChannel("hwb", 2, val);
   },
   value: function(val) {
      return this.setChannel("hsv", 2, val);
   },
   cyan: function(val) {
      return this.setChannel("cmyk", 0, val);
   },
   magenta: function(val) {
      return this.setChannel("cmyk", 1, val);
   },
   yellow: function(val) {
      return this.setChannel("cmyk", 2, val);
   },
   black: function(val) {
      return this.setChannel("cmyk", 3, val);
   },

   hexString: function() {
      return string.hexString(this.values.rgb);
   },
   rgbString: function() {
      return string.rgbString(this.values.rgb, this.values.alpha);
   },
   rgbaString: function() {
      return string.rgbaString(this.values.rgb, this.values.alpha);
   },
   percentString: function() {
      return string.percentString(this.values.rgb, this.values.alpha);
   },
   hslString: function() {
      return string.hslString(this.values.hsl, this.values.alpha);
   },
   hslaString: function() {
      return string.hslaString(this.values.hsl, this.values.alpha);
   },
   hwbString: function() {
      return string.hwbString(this.values.hwb, this.values.alpha);
   },
   keyword: function() {
      return string.keyword(this.values.rgb, this.values.alpha);
   },

   luminosity: function() {
      // http://www.w3.org/TR/WCAG20/#relativeluminancedef
      var rgb = this.values.rgb;
      var lum = [];
      for (var i = 0; i < rgb.length; i++) {
         var chan = rgb[i] / 255;
         lum[i] = (chan <= 0.03928) ? chan / 12.92
                  : Math.pow(((chan + 0.055) / 1.055), 2.4)
      }
      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
   },

   contrast: function(color2) {
      // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
      var lum1 = this.luminosity();
      var lum2 = color2.luminosity();
      if (lum1 > lum2) {
         return (lum1 + 0.05) / (lum2 + 0.05)
      };
      return (lum2 + 0.05) / (lum1 + 0.05);
   },

   level: function(color2) {
     var contrastRatio = this.contrast(color2);
     return (contrastRatio >= 7.1)
       ? 'AAA'
       : (contrastRatio >= 4.5)
        ? 'AA'
        : '';
   },

   dark: function() {
      // YIQ equation from http://24ways.org/2010/calculating-color-contrast
      var rgb = this.values.rgb,
          yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
   	return yiq < 128;
   },

   light: function() {
      return !this.dark();
   },

   negate: function() {
      var rgb = []
      for (var i = 0; i < 3; i++) {
         rgb[i] = 255 - this.values.rgb[i];
      }
      this.setValues("rgb", rgb);
      return this;
   },

   lighten: function(ratio) {
      this.values.hsl[2] += this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   darken: function(ratio) {
      this.values.hsl[2] -= this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   saturate: function(ratio) {
      this.values.hsl[1] += this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   desaturate: function(ratio) {
      this.values.hsl[1] -= this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   whiten: function(ratio) {
      this.values.hwb[1] += this.values.hwb[1] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
   },

   blacken: function(ratio) {
      this.values.hwb[2] += this.values.hwb[2] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
   },

   greyscale: function() {
      var rgb = this.values.rgb;
      // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
      this.setValues("rgb", [val, val, val]);
      return this;
   },

   clearer: function(ratio) {
      this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio));
      return this;
   },

   opaquer: function(ratio) {
      this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio));
      return this;
   },

   rotate: function(degrees) {
      var hue = this.values.hsl[0];
      hue = (hue + degrees) % 360;
      hue = hue < 0 ? 360 + hue : hue;
      this.values.hsl[0] = hue;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   mix: function(color2, weight) {
      weight = 1 - (weight == null ? 0.5 : weight);

      // algorithm from Sass's mix(). Ratio of first color in mix is
      // determined by the alphas of both colors and the weight
      var t1 = weight * 2 - 1,
          d = this.alpha() - color2.alpha();

      var weight1 = (((t1 * d == -1) ? t1 : (t1 + d) / (1 + t1 * d)) + 1) / 2;
      var weight2 = 1 - weight1;

      var rgb = this.rgbArray();
      var rgb2 = color2.rgbArray();

      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = rgb[i] * weight1 + rgb2[i] * weight2;
      }
      this.setValues("rgb", rgb);

      var alpha = this.alpha() * weight + color2.alpha() * (1 - weight);
      this.setValues("alpha", alpha);

      return this;
   },

   toJSON: function() {
     return this.rgb();
   },

   clone: function() {
     return new Color(this.rgb());
   }
}


Color.prototype.getValues = function(space) {
   var vals = {};
   for (var i = 0; i < space.length; i++) {
      vals[space[i]] = this.values[space][i];
   }
   if (this.values.alpha != 1) {
      vals["a"] = this.values.alpha;
   }
   // {r: 255, g: 255, b: 255, a: 0.4}
   return vals;
}

Color.prototype.setValues = function(space, vals) {
   var spaces = {
      "rgb": ["red", "green", "blue"],
      "hsl": ["hue", "saturation", "lightness"],
      "hsv": ["hue", "saturation", "value"],
      "hwb": ["hue", "whiteness", "blackness"],
      "cmyk": ["cyan", "magenta", "yellow", "black"]
   };

   var maxes = {
      "rgb": [255, 255, 255],
      "hsl": [360, 100, 100],
      "hsv": [360, 100, 100],
      "hwb": [360, 100, 100],
      "cmyk": [100, 100, 100, 100]
   };

   var alpha = 1;
   if (space == "alpha") {
      alpha = vals;
   }
   else if (vals.length) {
      // [10, 10, 10]
      this.values[space] = vals.slice(0, space.length);
      alpha = vals[space.length];
   }
   else if (vals[space[0]] !== undefined) {
      // {r: 10, g: 10, b: 10}
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[space[i]];
      }
      alpha = vals.a;
   }
   else if (vals[spaces[space][0]] !== undefined) {
      // {red: 10, green: 10, blue: 10}
      var chans = spaces[space];
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[chans[i]];
      }
      alpha = vals.alpha;
   }
   this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha) ));
   if (space == "alpha") {
      return;
   }

   // cap values of the space prior converting all values
   for (var i = 0; i < space.length; i++) {
      var capped = Math.max(0, Math.min(maxes[space][i], this.values[space][i]));
      this.values[space][i] = Math.round(capped);
   }

   // convert to all the other color spaces
   for (var sname in spaces) {
      if (sname != space) {
         this.values[sname] = convert[space][sname](this.values[space])
      }

      // cap values
      for (var i = 0; i < sname.length; i++) {
         var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
         this.values[sname][i] = Math.round(capped);
      }
   }
   return true;
}

Color.prototype.setSpace = function(space, args) {
   var vals = args[0];
   if (vals === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof vals == "number") {
      vals = Array.prototype.slice.call(args);
   }
   this.setValues(space, vals);
   return this;
}

Color.prototype.setChannel = function(space, index, val) {
   if (val === undefined) {
      // color.red()
      return this.values[space][index];
   }
   // color.red(100)
   this.values[space][index] = val;
   this.setValues(space, this.values[space]);
   return this;
}

},{"color-convert":3,"color-string":4}],2:[function(_dereq_,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0]
      w = 1/255 * Math.min(r, Math.min(g, b))
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k);
  m = (1 - g - k) / (1 - k);
  y = (1 - b - k) / (1 - k);
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;
  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],3:[function(_dereq_,module,exports){
var conversions = _dereq_("./conversions");

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;
},{"./conversions":2}],4:[function(_dereq_,module,exports){
/* MIT license */
var convert = _dereq_("color-convert");

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*(?:,\s*([\d\.]+)\s*)?\)$/,
       keyword = /(\D+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = convert.keyword2rgb(match[1]);
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb.push(a);
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*(\d+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(parseFloat(match[4]) || 1, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*(\d+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(parseFloat(match[4]) || 1, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
   return convert.rgb2keyword(rgb.slice(0, 3));
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}

},{"color-convert":3}],5:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join("\n")

};

},{}],6:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DotScreenPass = function ( center, angle, scale, mix ) {

	if ( THREE.DotScreenShader === undefined )
		console.error( "THREE.DotScreenPass relies on THREE.DotScreenShader" );

	var shader = THREE.DotScreenShader;

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	if ( center !== undefined ) this.uniforms[ "center" ].value.copy( center );
	if ( angle !== undefined ) this.uniforms[ "angle"].value = angle;
	if ( scale !== undefined ) this.uniforms[ "scale"].value = scale;
	if ( mix !== undefined )	this.uniforms[ "mix" ].value   = mix;

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.enabled = true;
	this.renderToScreen = false;
	this.needsSwap = true;

};

THREE.DotScreenPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer;
		this.uniforms[ "tSize" ].value.set( readBuffer.width, readBuffer.height );

		THREE.EffectComposer.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera );

		} else {

			renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, writeBuffer, false );

		}

	}

};

},{}],7:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var width = window.innerWidth || 1;
		var height = window.innerHeight || 1;
		var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

		renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

THREE.EffectComposer.prototype = {

	swapBuffers: function() {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	render: function ( delta ) {

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( !pass.enabled ) continue;

			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.context;

					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

					context.stencilFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( pass instanceof THREE.MaskPass ) {

				maskActive = true;

			} else if ( pass instanceof THREE.ClearMaskPass ) {

				maskActive = false;

			}

		}

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			renderTarget = this.renderTarget1.clone();

			renderTarget.width = window.innerWidth;
			renderTarget.height = window.innerHeight;

		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		var renderTarget = this.renderTarget1.clone();

		renderTarget.width = width;
		renderTarget.height = height;

		this.reset( renderTarget );

	}

};

// shared ortho camera

THREE.EffectComposer.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

THREE.EffectComposer.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );

THREE.EffectComposer.scene = new THREE.Scene();
THREE.EffectComposer.scene.add( THREE.EffectComposer.quad );

},{}],8:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.FilmPass = function ( noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale ) {

	if ( THREE.FilmShader === undefined )
		console.error( "THREE.FilmPass relies on THREE.FilmShader" );

	var shader = THREE.FilmShader;

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	if ( grayscale !== undefined )	this.uniforms.grayscale.value = grayscale;
	if ( noiseIntensity !== undefined ) this.uniforms.nIntensity.value = noiseIntensity;
	if ( scanlinesIntensity !== undefined ) this.uniforms.sIntensity.value = scanlinesIntensity;
	if ( scanlinesCount !== undefined ) this.uniforms.sCount.value = scanlinesCount;

	this.enabled = true;
	this.renderToScreen = false;
	this.needsSwap = true;

};

THREE.FilmPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer;
		this.uniforms[ "time" ].value += delta;

		THREE.EffectComposer.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera );

		} else {

			renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, writeBuffer, false );

		}

	}

};

},{}],9:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MaskPass = function ( scene, camera ) {

	this.scene = scene;
	this.camera = camera;

	this.enabled = true;
	this.clear = true;
	this.needsSwap = false;

	this.inverse = false;

};

THREE.MaskPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		var context = renderer.context;

		// don't update color or depth

		context.colorMask( false, false, false, false );
		context.depthMask( false );

		// set up stencil

		var writeValue, clearValue;

		if ( this.inverse ) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		context.enable( context.STENCIL_TEST );
		context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
		context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
		context.clearStencil( clearValue );

		// draw into the stencil buffer

		renderer.render( this.scene, this.camera, readBuffer, this.clear );
		renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		// re-enable update of color and depth

		context.colorMask( true, true, true, true );
		context.depthMask( true );

		// only render where stencil is set to 1

		context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
		context.stencilOp( context.KEEP, context.KEEP, context.KEEP );

	}

};


THREE.ClearMaskPass = function () {

	this.enabled = true;

};

THREE.ClearMaskPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		var context = renderer.context;

		context.disable( context.STENCIL_TEST );

	}

};

},{}],10:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.enabled = true;
	this.clear = true;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		this.scene.overrideMaterial = this.overrideMaterial;

		if ( this.clearColor ) {

			this.oldClearColor.copy( renderer.getClearColor() );
			this.oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		renderer.render( this.scene, this.camera, readBuffer, this.clear );

		if ( this.clearColor ) {

			renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

		}

		this.scene.overrideMaterial = null;

	}

};

},{}],11:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.renderToScreen = false;

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;

};

THREE.ShaderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		THREE.EffectComposer.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera );

		} else {

			renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, writeBuffer, this.clear );

		}

	}

};

},{}],12:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Bleach bypass shader [http://en.wikipedia.org/wiki/Bleach_bypass]
 * - based on Nvidia example
 * http://developer.download.nvidia.com/shaderlibrary/webpages/shader_library.html#post_bleach_bypass
 */

THREE.BleachBypassShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 base = texture2D( tDiffuse, vUv );",

			"vec3 lumCoeff = vec3( 0.25, 0.65, 0.1 );",
			"float lum = dot( lumCoeff, base.rgb );",
			"vec3 blend = vec3( lum );",

			"float L = min( 1.0, max( 0.0, 10.0 * ( lum - 0.45 ) ) );",

			"vec3 result1 = 2.0 * base.rgb * blend;",
			"vec3 result2 = 1.0 - 2.0 * ( 1.0 - blend ) * ( 1.0 - base.rgb );",

			"vec3 newColor = mix( result1, result2, L );",

			"float A2 = opacity * base.a;",
			"vec3 mixRGB = A2 * newColor.rgb;",
			"mixRGB += ( ( 1.0 - A2 ) * base.rgb );",

			"gl_FragColor = vec4( mixRGB, base.a );",

		"}"

	].join("\n")

};

},{}],13:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Colorify shader
 */

THREE.ColorifyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"color":    { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec3 color;",
		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

			"vec3 luma = vec3( 0.299, 0.587, 0.114 );",
			"float v = dot( texel.xyz, luma );",

			"gl_FragColor = vec4( v * color, texel.w );",

		"}"

	].join("\n")

};

},{}],14:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

THREE.DotScreenShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"tSize":    { type: "v2", value: new THREE.Vector2( 256, 256 ) },
		"center":   { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
		"angle":    { type: "f", value: 1.57 },
		"scale":    { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec2 center;",
		"uniform float angle;",
		"uniform float scale;",
		"uniform vec2 tSize;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"float pattern() {",

			"float s = sin( angle ), c = cos( angle );",

			"vec2 tex = vUv * tSize - center;",
			"vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",

			"return ( sin( point.x ) * sin( point.y ) ) * 4.0;",

		"}",

		"void main() {",

			"vec4 color = texture2D( tDiffuse, vUv );",

			"float average = ( color.r + color.g + color.b ) / 3.0;",

			"gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );",

		"}"

	].join("\n")

};

},{}],15:[function(_dereq_,module,exports){
/**
 * @author zz85 / https://github.com/zz85 | https://www.lab4games.net/zz85/blog
 *
 * Edge Detection Shader using Frei-Chen filter
 * Based on http://rastergrid.com/blog/2011/01/frei-chen-edge-detector
 *
 * aspect: vec2 of (1/width, 1/height)
 */

THREE.EdgeShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"aspect":    { type: "v2", value: new THREE.Vector2( 512, 512 ) },
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",

		"uniform vec2 aspect;",

		"vec2 texel = vec2(1.0 / aspect.x, 1.0 / aspect.y);",


		"mat3 G[9];",

		// hard coded matrix values!!!! as suggested in https://github.com/neilmendoza/ofxPostProcessing/blob/master/src/EdgePass.cpp#L45

		"const mat3 g0 = mat3( 0.3535533845424652, 0, -0.3535533845424652, 0.5, 0, -0.5, 0.3535533845424652, 0, -0.3535533845424652 );",
		"const mat3 g1 = mat3( 0.3535533845424652, 0.5, 0.3535533845424652, 0, 0, 0, -0.3535533845424652, -0.5, -0.3535533845424652 );",
		"const mat3 g2 = mat3( 0, 0.3535533845424652, -0.5, -0.3535533845424652, 0, 0.3535533845424652, 0.5, -0.3535533845424652, 0 );",
		"const mat3 g3 = mat3( 0.5, -0.3535533845424652, 0, -0.3535533845424652, 0, 0.3535533845424652, 0, 0.3535533845424652, -0.5 );",
		"const mat3 g4 = mat3( 0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5, 0 );",
		"const mat3 g5 = mat3( -0.5, 0, 0.5, 0, 0, 0, 0.5, 0, -0.5 );",
		"const mat3 g6 = mat3( 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.6666666865348816, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204 );",
		"const mat3 g7 = mat3( -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, 0.6666666865348816, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408 );",
		"const mat3 g8 = mat3( 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408 );",

		"void main(void)",
		"{",

			"G[0] = g0,",
			"G[1] = g1,",
			"G[2] = g2,",
			"G[3] = g3,",
			"G[4] = g4,",
			"G[5] = g5,",
			"G[6] = g6,",
			"G[7] = g7,",
			"G[8] = g8;",

			"mat3 I;",
			"float cnv[9];",
			"vec3 sample;",

			/* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
			"for (float i=0.0; i<3.0; i++) {",
				"for (float j=0.0; j<3.0; j++) {",
					"sample = texture2D(tDiffuse, vUv + texel * vec2(i-1.0,j-1.0) ).rgb;",
					"I[int(i)][int(j)] = length(sample);",
				"}",
			"}",

			/* calculate the convolution values for all the masks */
			"for (int i=0; i<9; i++) {",
				"float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);",
				"cnv[i] = dp3 * dp3;",
			"}",

			"float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);",
			"float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M);",

			"gl_FragColor = vec4(vec3(sqrt(M/S)), 1.0);",
		"}",

	].join("\n")
};

},{}],16:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Film grain & scanlines shader
 *
 * - ported from HLSL to WebGL / GLSL
 * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 *
 * Screen Space Static Postprocessor
 *
 * Produces an analogue noise overlay similar to a film grain / TV static
 *
 * Original implementation and noise algorithm
 * Pat 'Hawthorne' Shearon
 *
 * Optimized scanlines + noise version with intensity scaling
 * Georg 'Leviathan' Steinrohder
 *
 * This version is provided under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by/3.0/
 */

THREE.FilmShader = {

	uniforms: {

		"tDiffuse":   { type: "t", value: null },
		"time":       { type: "f", value: 0.0 },
		"nIntensity": { type: "f", value: 0.5 },
		"sIntensity": { type: "f", value: 0.05 },
		"sCount":     { type: "f", value: 4096 },
		"grayscale":  { type: "i", value: 1 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		// control parameter
		"uniform float time;",

		"uniform bool grayscale;",

		// noise effect intensity value (0 = no effect, 1 = full effect)
		"uniform float nIntensity;",

		// scanlines effect intensity value (0 = no effect, 1 = full effect)
		"uniform float sIntensity;",

		// scanlines effect count value (0 = no effect, 4096 = full effect)
		"uniform float sCount;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			// sample the source
			"vec4 cTextureScreen = texture2D( tDiffuse, vUv );",

			// make some noise
			"float x = vUv.x * vUv.y * time *  1000.0;",
			"x = mod( x, 13.0 ) * mod( x, 123.0 );",
			"float dx = mod( x, 0.01 );",

			// add noise
			"vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );",

			// get us a sine and cosine
			"vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",

			// add scanlines
			"cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",

			// interpolate between source and result by intensity
			"cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",

			// convert to grayscale if desired
			"if( grayscale ) {",

				"cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );",

			"}",

			"gl_FragColor =  vec4( cResult, cTextureScreen.a );",

		"}"

	].join("\n")

};

},{}],17:[function(_dereq_,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 */

THREE.FocusShader = {

	uniforms : {

		"tDiffuse":       { type: "t", value: null },
		"screenWidth":    { type: "f", value: 1024 },
		"screenHeight":   { type: "f", value: 1024 },
		"sampleDistance": { type: "f", value: 0.94 },
		"waveFactor":     { type: "f", value: 0.00125 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float screenWidth;",
		"uniform float screenHeight;",
		"uniform float sampleDistance;",
		"uniform float waveFactor;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 color, org, tmp, add;",
			"float sample_dist, f;",
			"vec2 vin;",
			"vec2 uv = vUv;",

			"add = color = org = texture2D( tDiffuse, uv );",

			"vin = ( uv - vec2( 0.5 ) ) * vec2( 1.4 );",
			"sample_dist = dot( vin, vin ) * 2.0;",

			"f = ( waveFactor * 100.0 + sample_dist ) * sampleDistance * 4.0;",

			"vec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2( f );",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.111964, 0.993712 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.846724, 0.532032 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.943883, -0.330279 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.330279, -0.943883 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( -0.532032, -0.846724 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( -0.993712, -0.111964 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( -0.707107, 0.707107 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"color = color * vec4( 2.0 ) - ( add / vec4( 8.0 ) );",
			"color = color + ( add / vec4( 8.0 ) - color ) * ( vec4( 1.0 ) - vec4( sample_dist * 0.5 ) );",

			"gl_FragColor = vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );",

		"}"


	].join("\n")
};

},{}],18:[function(_dereq_,module,exports){
/**
 * @author felixturner / http://airtight.cc/
 *
 * Kaleidoscope Shader
 * Radial reflection around center point
 * Ported from: http://pixelshaders.com/editor/
 * by Toby Schachman / http://tobyschachman.com/
 *
 * sides: number of reflections
 * angle: initial angle in radians
 */

THREE.KaleidoShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"sides":    { type: "f", value: 6.0 },
		"angle":    { type: "f", value: 0.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float sides;",
		"uniform float angle;",
		
		"varying vec2 vUv;",

		"void main() {",

			"vec2 p = vUv - 0.5;",
			"float r = length(p);",
			"float a = atan(p.y, p.x) + angle;",
			"float tau = 2. * 3.1416 ;",
			"a = mod(a, tau/sides);",
			"a = abs(a - tau/sides/2.) ;",
			"p = r * vec2(cos(a), sin(a));",
			"vec4 color = texture2D(tDiffuse, p + 0.5);",
			"gl_FragColor = color;",

		"}"

	].join("\n")

};

},{}],19:[function(_dereq_,module,exports){
/**
 * @author huwb / http://huwbowles.com/
 *
 * God-rays (crepuscular rays)
 *
 * Similar implementation to the one used by Crytek for CryEngine 2 [Sousa2008].
 * Blurs a mask generated from the depth map along radial lines emanating from the light
 * source. The blur repeatedly applies a blur filter of increasing support but constant
 * sample count to produce a blur filter with large support.
 *
 * My implementation performs 3 passes, similar to the implementation from Sousa. I found
 * just 6 samples per pass produced acceptible results. The blur is applied three times,
 * with decreasing filter support. The result is equivalent to a single pass with
 * 6*6*6 = 216 samples.
 *
 * References:
 *
 * Sousa2008 - Crysis Next Gen Effects, GDC2008, http://www.crytek.com/sites/default/files/GDC08_SousaT_CrysisEffects.ppt
 */

THREE.ShaderGodRays = {

	/**
	 * The god-ray generation shader.
	 *
	 * First pass:
	 *
	 * The input is the depth map. I found that the output from the
	 * THREE.MeshDepthMaterial material was directly suitable without
	 * requiring any treatment whatsoever.
	 *
	 * The depth map is blurred along radial lines towards the "sun". The
	 * output is written to a temporary render target (I used a 1/4 sized
	 * target).
	 *
	 * Pass two & three:
	 *
	 * The results of the previous pass are re-blurred, each time with a
	 * decreased distance between samples.
	 */

	'godrays_generate': {

		uniforms: {

			tInput: {
				type: "t",
				value: null
			},

			fStepSize: {
				type: "f",
				value: 1.0
			},

			vSunPositionScreenSpace: {
				type: "v2",
				value: new THREE.Vector2( 0.5, 0.5 )
			}

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"#define TAPS_PER_PASS 6.0",

			"varying vec2 vUv;",

			"uniform sampler2D tInput;",

			"uniform vec2 vSunPositionScreenSpace;",
			"uniform float fStepSize;", // filter step size

			"void main() {",

				// delta from current pixel to "sun" position

				"vec2 delta = vSunPositionScreenSpace - vUv;",
				"float dist = length( delta );",

				// Step vector (uv space)

				"vec2 stepv = fStepSize * delta / dist;",

				// Number of iterations between pixel and sun

				"float iters = dist/fStepSize;",

				"vec2 uv = vUv.xy;",
				"float col = 0.0;",

				// This breaks ANGLE in Chrome 22
				//	- see http://code.google.com/p/chromium/issues/detail?id=153105

				/*
				// Unrolling didnt do much on my hardware (ATI Mobility Radeon 3450),
				// so i've just left the loop

				"for ( float i = 0.0; i < TAPS_PER_PASS; i += 1.0 ) {",

					// Accumulate samples, making sure we dont walk past the light source.

					// The check for uv.y < 1 would not be necessary with "border" UV wrap
					// mode, with a black border colour. I don't think this is currently
					// exposed by three.js. As a result there might be artifacts when the
					// sun is to the left, right or bottom of screen as these cases are
					// not specifically handled.

					"col += ( i <= iters && uv.y < 1.0 ? texture2D( tInput, uv ).r : 0.0 );",
					"uv += stepv;",

				"}",
				*/

				// Unrolling loop manually makes it work in ANGLE

				"if ( 0.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 1.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 2.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 3.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 4.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				"if ( 5.0 <= iters && uv.y < 1.0 ) col += texture2D( tInput, uv ).r;",
				"uv += stepv;",

				// Should technically be dividing by 'iters', but 'TAPS_PER_PASS' smooths out
				// objectionable artifacts, in particular near the sun position. The side
				// effect is that the result is darker than it should be around the sun, as
				// TAPS_PER_PASS is greater than the number of samples actually accumulated.
				// When the result is inverted (in the shader 'godrays_combine', this produces
				// a slight bright spot at the position of the sun, even when it is occluded.

				"gl_FragColor = vec4( col/TAPS_PER_PASS );",
				"gl_FragColor.a = 1.0;",

			"}"

		].join("\n")

	},

	/**
	 * Additively applies god rays from texture tGodRays to a background (tColors).
	 * fGodRayIntensity attenuates the god rays.
	 */

	'godrays_combine': {

		uniforms: {

			tColors: {
				type: "t",
				value: null
			},

			tGodRays: {
				type: "t",
				value: null
			},

			fGodRayIntensity: {
				type: "f",
				value: 0.69
			},

			vSunPositionScreenSpace: {
				type: "v2",
				value: new THREE.Vector2( 0.5, 0.5 )
			}

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

			].join("\n"),

		fragmentShader: [

			"varying vec2 vUv;",

			"uniform sampler2D tColors;",
			"uniform sampler2D tGodRays;",

			"uniform vec2 vSunPositionScreenSpace;",
			"uniform float fGodRayIntensity;",

			"void main() {",

				// Since THREE.MeshDepthMaterial renders foreground objects white and background
				// objects black, the god-rays will be white streaks. Therefore value is inverted
				// before being combined with tColors

				"gl_FragColor = texture2D( tColors, vUv ) + fGodRayIntensity * vec4( 1.0 - texture2D( tGodRays, vUv ).r );",
				"gl_FragColor.a = 1.0;",

			"}"

		].join("\n")

	},


	/**
	 * A dodgy sun/sky shader. Makes a bright spot at the sun location. Would be
	 * cheaper/faster/simpler to implement this as a simple sun sprite.
	 */

	'godrays_fake_sun': {

		uniforms: {

			vSunPositionScreenSpace: {
				type: "v2",
				value: new THREE.Vector2( 0.5, 0.5 )
			},

			fAspect: {
				type: "f",
				value: 1.0
			},

			sunColor: {
				type: "c",
				value: new THREE.Color( 0xffee00 )
			},

			bgColor: {
				type: "c",
				value: new THREE.Color( 0x000000 )
			}

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"varying vec2 vUv;",

			"uniform vec2 vSunPositionScreenSpace;",
			"uniform float fAspect;",

			"uniform vec3 sunColor;",
			"uniform vec3 bgColor;",

			"void main() {",

				"vec2 diff = vUv - vSunPositionScreenSpace;",

				// Correct for aspect ratio

				"diff.x *= fAspect;",

				"float prop = clamp( length( diff ) / 0.5, 0.0, 1.0 );",
				"prop = 0.35 * pow( 1.0 - prop, 3.0 );",

				"gl_FragColor.xyz = mix( sunColor, bgColor, 1.0 - prop );",
				"gl_FragColor.w = 1.0;",

			"}"

		].join("\n")

	}

};

},{}],20:[function(_dereq_,module,exports){
// three.js - http://github.com/mrdoob/three.js

!function(){
'use strict';var THREE= window.THREE = THREE||{REVISION:"58"};self.console=self.console||{info:function(){},log:function(){},debug:function(){},warn:function(){},error:function(){}};self.Int32Array=self.Int32Array||Array;self.Float32Array=self.Float32Array||Array;String.prototype.trim=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")};
THREE.extend=function(a,b){if(Object.keys)for(var c=Object.keys(b),d=0,e=c.length;d<e;d++){var f=c[d];Object.defineProperty(a,f,Object.getOwnPropertyDescriptor(b,f))}else for(f in c={}.hasOwnProperty,b)c.call(b,f)&&(a[f]=b[f]);return a};
(function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];void 0===window.requestAnimationFrame&&(window.requestAnimationFrame=function(b){var c=Date.now(),f=Math.max(0,16-(c-a)),g=window.setTimeout(function(){b(c+f)},f);a=c+f;return g});window.cancelAnimationFrame=window.cancelAnimationFrame||
function(a){window.clearTimeout(a)}})();THREE.CullFaceNone=0;THREE.CullFaceBack=1;THREE.CullFaceFront=2;THREE.CullFaceFrontBack=3;THREE.FrontFaceDirectionCW=0;THREE.FrontFaceDirectionCCW=1;THREE.BasicShadowMap=0;THREE.PCFShadowMap=1;THREE.PCFSoftShadowMap=2;THREE.FrontSide=0;THREE.BackSide=1;THREE.DoubleSide=2;THREE.NoShading=0;THREE.FlatShading=1;THREE.SmoothShading=2;THREE.NoColors=0;THREE.FaceColors=1;THREE.VertexColors=2;THREE.NoBlending=0;THREE.NormalBlending=1;THREE.AdditiveBlending=2;
THREE.SubtractiveBlending=3;THREE.MultiplyBlending=4;THREE.CustomBlending=5;THREE.AddEquation=100;THREE.SubtractEquation=101;THREE.ReverseSubtractEquation=102;THREE.ZeroFactor=200;THREE.OneFactor=201;THREE.SrcColorFactor=202;THREE.OneMinusSrcColorFactor=203;THREE.SrcAlphaFactor=204;THREE.OneMinusSrcAlphaFactor=205;THREE.DstAlphaFactor=206;THREE.OneMinusDstAlphaFactor=207;THREE.DstColorFactor=208;THREE.OneMinusDstColorFactor=209;THREE.SrcAlphaSaturateFactor=210;THREE.MultiplyOperation=0;
THREE.MixOperation=1;THREE.AddOperation=2;THREE.UVMapping=function(){};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.RepeatWrapping=1E3;THREE.ClampToEdgeWrapping=1001;THREE.MirroredRepeatWrapping=1002;THREE.NearestFilter=1003;THREE.NearestMipMapNearestFilter=1004;THREE.NearestMipMapLinearFilter=1005;THREE.LinearFilter=1006;THREE.LinearMipMapNearestFilter=1007;
THREE.LinearMipMapLinearFilter=1008;THREE.UnsignedByteType=1009;THREE.ByteType=1010;THREE.ShortType=1011;THREE.UnsignedShortType=1012;THREE.IntType=1013;THREE.UnsignedIntType=1014;THREE.FloatType=1015;THREE.UnsignedShort4444Type=1016;THREE.UnsignedShort5551Type=1017;THREE.UnsignedShort565Type=1018;THREE.AlphaFormat=1019;THREE.RGBFormat=1020;THREE.RGBAFormat=1021;THREE.LuminanceFormat=1022;THREE.LuminanceAlphaFormat=1023;THREE.RGB_S3TC_DXT1_Format=2001;THREE.RGBA_S3TC_DXT1_Format=2002;
THREE.RGBA_S3TC_DXT3_Format=2003;THREE.RGBA_S3TC_DXT5_Format=2004;THREE.Color=function(a){void 0!==a&&this.set(a);return this};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,set:function(a){a instanceof THREE.Color?this.copy(a):"number"===typeof a?this.setHex(a):"string"===typeof a&&this.setStyle(a);return this},setHex:function(a){a=Math.floor(a);this.r=(a>>16&255)/255;this.g=(a>>8&255)/255;this.b=(a&255)/255;return this},setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;return this},setHSL:function(a,b,c){if(0===b)this.r=this.g=this.b=c;else{var d=function(a,b,c){0>c&&(c+=1);1<c&&(c-=1);return c<1/6?a+6*(b-a)*
c:0.5>c?b:c<2/3?a+6*(b-a)*(2/3-c):a},b=0.5>=c?c*(1+b):c+b-c*b,c=2*c-b;this.r=d(c,b,a+1/3);this.g=d(c,b,a);this.b=d(c,b,a-1/3)}return this},setStyle:function(a){if(/^rgb\((\d+),(\d+),(\d+)\)$/i.test(a))return a=/^rgb\((\d+),(\d+),(\d+)\)$/i.exec(a),this.r=Math.min(255,parseInt(a[1],10))/255,this.g=Math.min(255,parseInt(a[2],10))/255,this.b=Math.min(255,parseInt(a[3],10))/255,this;if(/^rgb\((\d+)\%,(\d+)\%,(\d+)\%\)$/i.test(a))return a=/^rgb\((\d+)\%,(\d+)\%,(\d+)\%\)$/i.exec(a),this.r=Math.min(100,
parseInt(a[1],10))/100,this.g=Math.min(100,parseInt(a[2],10))/100,this.b=Math.min(100,parseInt(a[3],10))/100,this;if(/^\#([0-9a-f]{6})$/i.test(a))return a=/^\#([0-9a-f]{6})$/i.exec(a),this.setHex(parseInt(a[1],16)),this;if(/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(a))return a=/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(a),this.setHex(parseInt(a[1]+a[1]+a[2]+a[2]+a[3]+a[3],16)),this;if(/^(\w+)$/i.test(a))return this.setHex(THREE.ColorKeywords[a]),this},copy:function(a){this.r=a.r;this.g=a.g;this.b=
a.b;return this},copyGammaToLinear:function(a){this.r=a.r*a.r;this.g=a.g*a.g;this.b=a.b*a.b;return this},copyLinearToGamma:function(a){this.r=Math.sqrt(a.r);this.g=Math.sqrt(a.g);this.b=Math.sqrt(a.b);return this},convertGammaToLinear:function(){var a=this.r,b=this.g,c=this.b;this.r=a*a;this.g=b*b;this.b=c*c;return this},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);this.g=Math.sqrt(this.g);this.b=Math.sqrt(this.b);return this},getHex:function(){return 255*this.r<<16^255*this.g<<8^255*
this.b<<0},getHexString:function(){return("000000"+this.getHex().toString(16)).slice(-6)},getHSL:function(){var a={h:0,s:0,l:0};return function(){var b=this.r,c=this.g,d=this.b,e=Math.max(b,c,d),f=Math.min(b,c,d),g,h=(f+e)/2;if(f===e)f=g=0;else{var i=e-f,f=0.5>=h?i/(e+f):i/(2-e-f);switch(e){case b:g=(c-d)/i+(c<d?6:0);break;case c:g=(d-b)/i+2;break;case d:g=(b-c)/i+4}g/=6}a.h=g;a.s=f;a.l=h;return a}}(),getStyle:function(){return"rgb("+(255*this.r|0)+","+(255*this.g|0)+","+(255*this.b|0)+")"},offsetHSL:function(a,
b,c){var d=this.getHSL();d.h+=a;d.s+=b;d.l+=c;this.setHSL(d.h,d.s,d.l);return this},add:function(a){this.r+=a.r;this.g+=a.g;this.b+=a.b;return this},addColors:function(a,b){this.r=a.r+b.r;this.g=a.g+b.g;this.b=a.b+b.b;return this},addScalar:function(a){this.r+=a;this.g+=a;this.b+=a;return this},multiply:function(a){this.r*=a.r;this.g*=a.g;this.b*=a.b;return this},multiplyScalar:function(a){this.r*=a;this.g*=a;this.b*=a;return this},lerp:function(a,b){this.r+=(a.r-this.r)*b;this.g+=(a.g-this.g)*b;
this.b+=(a.b-this.b)*b;return this},equals:function(a){return a.r===this.r&&a.g===this.g&&a.b===this.b},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}};
THREE.ColorKeywords={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,
darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,
grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,
lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,
palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,
tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};THREE.Quaternion=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=void 0!==d?d:1};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w;return this},setFromEuler:function(a,b){var c=Math.cos(a.x/2),d=Math.cos(a.y/2),e=Math.cos(a.z/2),f=Math.sin(a.x/2),g=Math.sin(a.y/2),h=Math.sin(a.z/2);void 0===b||"XYZ"===b?(this.x=f*d*e+c*g*h,this.y=c*g*e-f*d*h,this.z=c*d*h+f*g*e,this.w=c*d*e-f*g*h):"YXZ"===b?(this.x=f*d*e+c*g*h,this.y=c*g*e-f*d*h,this.z=c*d*
h-f*g*e,this.w=c*d*e+f*g*h):"ZXY"===b?(this.x=f*d*e-c*g*h,this.y=c*g*e+f*d*h,this.z=c*d*h+f*g*e,this.w=c*d*e-f*g*h):"ZYX"===b?(this.x=f*d*e-c*g*h,this.y=c*g*e+f*d*h,this.z=c*d*h-f*g*e,this.w=c*d*e+f*g*h):"YZX"===b?(this.x=f*d*e+c*g*h,this.y=c*g*e+f*d*h,this.z=c*d*h-f*g*e,this.w=c*d*e-f*g*h):"XZY"===b&&(this.x=f*d*e-c*g*h,this.y=c*g*e-f*d*h,this.z=c*d*h+f*g*e,this.w=c*d*e+f*g*h);return this},setFromAxisAngle:function(a,b){var c=b/2,d=Math.sin(c);this.x=a.x*d;this.y=a.y*d;this.z=a.z*d;this.w=Math.cos(c);
return this},setFromRotationMatrix:function(a){var b=a.elements,c=b[0],a=b[4],d=b[8],e=b[1],f=b[5],g=b[9],h=b[2],i=b[6],b=b[10],j=c+f+b;0<j?(c=0.5/Math.sqrt(j+1),this.w=0.25/c,this.x=(i-g)*c,this.y=(d-h)*c,this.z=(e-a)*c):c>f&&c>b?(c=2*Math.sqrt(1+c-f-b),this.w=(i-g)/c,this.x=0.25*c,this.y=(a+e)/c,this.z=(d+h)/c):f>b?(c=2*Math.sqrt(1+f-c-b),this.w=(d-h)/c,this.x=(a+e)/c,this.y=0.25*c,this.z=(g+i)/c):(c=2*Math.sqrt(1+b-c-f),this.w=(e-a)/c,this.x=(d+h)/c,this.y=(g+i)/c,this.z=0.25*c);return this},inverse:function(){this.conjugate().normalize();
return this},conjugate:function(){this.x*=-1;this.y*=-1;this.z*=-1;return this},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var a=this.length();0===a?(this.z=this.y=this.x=0,this.w=1):(a=1/a,this.x*=a,this.y*=a,this.z*=a,this.w*=a);return this},multiply:function(a,b){return void 0!==b?(console.warn("DEPRECATED: Quaternion's .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),
this.multiplyQuaternions(a,b)):this.multiplyQuaternions(this,a)},multiplyQuaternions:function(a,b){var c=a.x,d=a.y,e=a.z,f=a.w,g=b.x,h=b.y,i=b.z,j=b.w;this.x=c*j+f*g+d*i-e*h;this.y=d*j+f*h+e*g-c*i;this.z=e*j+f*i+c*h-d*g;this.w=f*j-c*g-d*h-e*i;return this},multiplyVector3:function(a){console.warn("DEPRECATED: Quaternion's .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.");return a.applyQuaternion(this)},slerp:function(a,b){var c=this.x,d=this.y,e=this.z,
f=this.w,g=f*a.w+c*a.x+d*a.y+e*a.z;0>g?(this.w=-a.w,this.x=-a.x,this.y=-a.y,this.z=-a.z,g=-g):this.copy(a);if(1<=g)return this.w=f,this.x=c,this.y=d,this.z=e,this;var h=Math.acos(g),i=Math.sqrt(1-g*g);if(0.001>Math.abs(i))return this.w=0.5*(f+this.w),this.x=0.5*(c+this.x),this.y=0.5*(d+this.y),this.z=0.5*(e+this.z),this;g=Math.sin((1-b)*h)/i;h=Math.sin(b*h)/i;this.w=f*g+this.w*h;this.x=c*g+this.x*h;this.y=d*g+this.y*h;this.z=e*g+this.z*h;return this},equals:function(a){return a.x===this.x&&a.y===
this.y&&a.z===this.z&&a.w===this.w},fromArray:function(a){this.x=a[0];this.y=a[1];this.z=a[2];this.w=a[3];return this},toArray:function(){return[this.x,this.y,this.z,this.w]},clone:function(){return new THREE.Quaternion(this.x,this.y,this.z,this.w)}};THREE.Quaternion.slerp=function(a,b,c,d){return c.copy(a).slerp(b,d)};THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(a,b){this.x=a;this.y=b;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;default:throw Error("index is out of range: "+a);}},copy:function(a){this.x=a.x;this.y=a.y;return this},add:function(a,
b){if(void 0!==b)return console.warn("DEPRECATED: Vector2's .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(a,b);this.x+=a.x;this.y+=a.y;return this},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},addScalar:function(a){this.x+=a;this.y+=a;return this},sub:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector2's .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(a,b);this.x-=a.x;this.y-=
a.y;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;return this},divideScalar:function(a){0!==a?(this.x/=a,this.y/=a):this.set(0,0);return this},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=a.y);return this},clamp:function(a,b){this.x<a.x?this.x=a.x:this.x>b.x&&(this.x=b.x);this.y<a.y?this.y=a.y:this.y>b.y&&(this.y=b.y);return this},
negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,a=this.y-a.y;return b*b+a*a},setLength:function(a){var b=this.length();0!==b&&a!==b&&this.multiplyScalar(a/
b);return this},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y},fromArray:function(a){this.x=a[0];this.y=a[1];return this},toArray:function(){return[this.x,this.y]},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;case 2:this.z=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("index is out of range: "+
a);}},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(a,b);this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},sub:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),
this.subVectors(a,b);this.x-=a.x;this.y-=a.y;this.z-=a.z;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},multiply:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(a,b);this.x*=a.x;this.y*=a.y;this.z*=a.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},multiplyVectors:function(a,b){this.x=a.x*
b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},applyMatrix3:function(a){var b=this.x,c=this.y,d=this.z,a=a.elements;this.x=a[0]*b+a[3]*c+a[6]*d;this.y=a[1]*b+a[4]*c+a[7]*d;this.z=a[2]*b+a[5]*c+a[8]*d;return this},applyMatrix4:function(a){var b=this.x,c=this.y,d=this.z,a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d+a[12];this.y=a[1]*b+a[5]*c+a[9]*d+a[13];this.z=a[2]*b+a[6]*c+a[10]*d+a[14];return this},applyProjection:function(a){var b=this.x,c=this.y,d=this.z,a=a.elements,e=1/(a[3]*b+a[7]*c+a[11]*d+a[15]);
this.x=(a[0]*b+a[4]*c+a[8]*d+a[12])*e;this.y=(a[1]*b+a[5]*c+a[9]*d+a[13])*e;this.z=(a[2]*b+a[6]*c+a[10]*d+a[14])*e;return this},applyQuaternion:function(a){var b=this.x,c=this.y,d=this.z,e=a.x,f=a.y,g=a.z,a=a.w,h=a*b+f*d-g*c,i=a*c+g*b-e*d,j=a*d+e*c-f*b,b=-e*b-f*c-g*d;this.x=h*a+b*-e+i*-g-j*-f;this.y=i*a+b*-f+j*-e-h*-g;this.z=j*a+b*-g+h*-f-i*-e;return this},transformDirection:function(a){var b=this.x,c=this.y,d=this.z,a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d;this.y=a[1]*b+a[5]*c+a[9]*d;this.z=a[2]*
b+a[6]*c+a[10]*d;this.normalize();return this},divide:function(a){this.x/=a.x;this.y/=a.y;this.z/=a.z;return this},divideScalar:function(a){0!==a?(this.x/=a,this.y/=a,this.z/=a):this.z=this.y=this.x=0;return this},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);this.z>a.z&&(this.z=a.z);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=a.y);this.z<a.z&&(this.z=a.z);return this},clamp:function(a,b){this.x<a.x?this.x=a.x:this.x>b.x&&(this.x=b.x);this.y<a.y?this.y=
a.y:this.y>b.y&&(this.y=b.y);this.z<a.z?this.z=a.z:this.z>b.z&&(this.z=b.z);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},setLength:function(a){var b=
this.length();0!==b&&a!==b&&this.multiplyScalar(a/b);return this},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;return this},cross:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(a,b);var c=this.x,d=this.y,e=this.z;this.x=d*a.z-e*a.y;this.y=e*a.x-c*a.z;this.z=c*a.y-d*a.x;return this},crossVectors:function(a,b){this.x=a.y*b.z-a.z*b.y;this.y=
a.z*b.x-a.x*b.z;this.z=a.x*b.y-a.y*b.x;return this},angleTo:function(a){a=this.dot(a)/(this.length()*a.length());return Math.acos(THREE.Math.clamp(a,-1,1))},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,c=this.y-a.y,a=this.z-a.z;return b*b+c*c+a*a},setEulerFromRotationMatrix:function(a,b){function c(a){return Math.min(Math.max(a,-1),1)}var d=a.elements,e=d[0],f=d[4],g=d[8],h=d[1],i=d[5],j=d[9],m=d[2],p=d[6],d=d[10];void 0===b||"XYZ"===
b?(this.y=Math.asin(c(g)),0.99999>Math.abs(g)?(this.x=Math.atan2(-j,d),this.z=Math.atan2(-f,e)):(this.x=Math.atan2(p,i),this.z=0)):"YXZ"===b?(this.x=Math.asin(-c(j)),0.99999>Math.abs(j)?(this.y=Math.atan2(g,d),this.z=Math.atan2(h,i)):(this.y=Math.atan2(-m,e),this.z=0)):"ZXY"===b?(this.x=Math.asin(c(p)),0.99999>Math.abs(p)?(this.y=Math.atan2(-m,d),this.z=Math.atan2(-f,i)):(this.y=0,this.z=Math.atan2(h,e))):"ZYX"===b?(this.y=Math.asin(-c(m)),0.99999>Math.abs(m)?(this.x=Math.atan2(p,d),this.z=Math.atan2(h,
e)):(this.x=0,this.z=Math.atan2(-f,i))):"YZX"===b?(this.z=Math.asin(c(h)),0.99999>Math.abs(h)?(this.x=Math.atan2(-j,i),this.y=Math.atan2(-m,e)):(this.x=0,this.y=Math.atan2(g,d))):"XZY"===b&&(this.z=Math.asin(-c(f)),0.99999>Math.abs(f)?(this.x=Math.atan2(p,i),this.y=Math.atan2(g,e)):(this.x=Math.atan2(-j,d),this.y=0));return this},setEulerFromQuaternion:function(a,b){function c(a){return Math.min(Math.max(a,-1),1)}var d=a.x*a.x,e=a.y*a.y,f=a.z*a.z,g=a.w*a.w;void 0===b||"XYZ"===b?(this.x=Math.atan2(2*
(a.x*a.w-a.y*a.z),g-d-e+f),this.y=Math.asin(c(2*(a.x*a.z+a.y*a.w))),this.z=Math.atan2(2*(a.z*a.w-a.x*a.y),g+d-e-f)):"YXZ"===b?(this.x=Math.asin(c(2*(a.x*a.w-a.y*a.z))),this.y=Math.atan2(2*(a.x*a.z+a.y*a.w),g-d-e+f),this.z=Math.atan2(2*(a.x*a.y+a.z*a.w),g-d+e-f)):"ZXY"===b?(this.x=Math.asin(c(2*(a.x*a.w+a.y*a.z))),this.y=Math.atan2(2*(a.y*a.w-a.z*a.x),g-d-e+f),this.z=Math.atan2(2*(a.z*a.w-a.x*a.y),g-d+e-f)):"ZYX"===b?(this.x=Math.atan2(2*(a.x*a.w+a.z*a.y),g-d-e+f),this.y=Math.asin(c(2*(a.y*a.w-a.x*
a.z))),this.z=Math.atan2(2*(a.x*a.y+a.z*a.w),g+d-e-f)):"YZX"===b?(this.x=Math.atan2(2*(a.x*a.w-a.z*a.y),g-d+e-f),this.y=Math.atan2(2*(a.y*a.w-a.x*a.z),g+d-e-f),this.z=Math.asin(c(2*(a.x*a.y+a.z*a.w)))):"XZY"===b&&(this.x=Math.atan2(2*(a.x*a.w+a.y*a.z),g-d+e-f),this.y=Math.atan2(2*(a.x*a.z+a.y*a.w),g+d-e-f),this.z=Math.asin(c(2*(a.z*a.w-a.x*a.y))));return this},getPositionFromMatrix:function(a){this.x=a.elements[12];this.y=a.elements[13];this.z=a.elements[14];return this},getScaleFromMatrix:function(a){var b=
this.set(a.elements[0],a.elements[1],a.elements[2]).length(),c=this.set(a.elements[4],a.elements[5],a.elements[6]).length(),a=this.set(a.elements[8],a.elements[9],a.elements[10]).length();this.x=b;this.y=c;this.z=a;return this},getColumnFromMatrix:function(a,b){var c=4*a,d=b.elements;this.x=d[c];this.y=d[c+1];this.z=d[c+2];return this},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},fromArray:function(a){this.x=a[0];this.y=a[1];this.z=a[2];return this},toArray:function(){return[this.x,
this.y,this.z]},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};
THREE.extend(THREE.Vector3.prototype,{applyEuler:function(){var a=new THREE.Quaternion;return function(b,c){var d=a.setFromEuler(b,c);this.applyQuaternion(d);return this}}(),applyAxisAngle:function(){var a=new THREE.Quaternion;return function(b,c){var d=a.setFromAxisAngle(b,c);this.applyQuaternion(d);return this}}(),projectOnVector:function(){var a=new THREE.Vector3;return function(b){a.copy(b).normalize();b=this.dot(a);return this.copy(a).multiplyScalar(b)}}(),projectOnPlane:function(){var a=new THREE.Vector3;
return function(b){a.copy(this).projectOnVector(b);return this.sub(a)}}(),reflect:function(){var a=new THREE.Vector3;return function(b){a.copy(this).projectOnVector(b).multiplyScalar(2);return this.subVectors(a,this)}}()});THREE.Vector4=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=void 0!==d?d:1};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},setW:function(a){this.w=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;case 2:this.z=b;break;case 3:this.w=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;
case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("index is out of range: "+a);}},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=void 0!==a.w?a.w:1;return this},add:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector4's .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(a,b);this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;this.w+=a;return this},
addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},sub:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector4's .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(a,b);this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;this.w*=a;return this},
applyMatrix4:function(a){var b=this.x,c=this.y,d=this.z,e=this.w,a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d+a[12]*e;this.y=a[1]*b+a[5]*c+a[9]*d+a[13]*e;this.z=a[2]*b+a[6]*c+a[10]*d+a[14]*e;this.w=a[3]*b+a[7]*c+a[11]*d+a[15]*e;return this},divideScalar:function(a){0!==a?(this.x/=a,this.y/=a,this.z/=a,this.w/=a):(this.z=this.y=this.x=0,this.w=1);return this},setAxisAngleFromQuaternion:function(a){this.w=2*Math.acos(a.w);var b=Math.sqrt(1-a.w*a.w);1E-4>b?(this.x=1,this.z=this.y=0):(this.x=a.x/b,this.y=
a.y/b,this.z=a.z/b);return this},setAxisAngleFromRotationMatrix:function(a){var b,c,d,a=a.elements,e=a[0];d=a[4];var f=a[8],g=a[1],h=a[5],i=a[9];c=a[2];b=a[6];var j=a[10];if(0.01>Math.abs(d-g)&&0.01>Math.abs(f-c)&&0.01>Math.abs(i-b)){if(0.1>Math.abs(d+g)&&0.1>Math.abs(f+c)&&0.1>Math.abs(i+b)&&0.1>Math.abs(e+h+j-3))return this.set(1,0,0,0),this;a=Math.PI;e=(e+1)/2;h=(h+1)/2;j=(j+1)/2;d=(d+g)/4;f=(f+c)/4;i=(i+b)/4;e>h&&e>j?0.01>e?(b=0,d=c=0.707106781):(b=Math.sqrt(e),c=d/b,d=f/b):h>j?0.01>h?(b=0.707106781,
c=0,d=0.707106781):(c=Math.sqrt(h),b=d/c,d=i/c):0.01>j?(c=b=0.707106781,d=0):(d=Math.sqrt(j),b=f/d,c=i/d);this.set(b,c,d,a);return this}a=Math.sqrt((b-i)*(b-i)+(f-c)*(f-c)+(g-d)*(g-d));0.001>Math.abs(a)&&(a=1);this.x=(b-i)/a;this.y=(f-c)/a;this.z=(g-d)/a;this.w=Math.acos((e+h+j-1)/2);return this},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);this.z>a.z&&(this.z=a.z);this.w>a.w&&(this.w=a.w);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=a.y);this.z<a.z&&
(this.z=a.z);this.w<a.w&&(this.w=a.w);return this},clamp:function(a,b){this.x<a.x?this.x=a.x:this.x>b.x&&(this.x=b.x);this.y<a.y?this.y=a.y:this.y>b.y&&(this.y=b.y);this.z<a.z?this.z=a.z:this.z>b.z&&(this.z=b.z);this.w<a.w?this.w=a.w:this.w>b.w&&(this.w=b.w);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w},length:function(){return Math.sqrt(this.x*
this.x+this.y*this.y+this.z*this.z+this.w*this.w)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)},normalize:function(){return this.divideScalar(this.length())},setLength:function(a){var b=this.length();0!==b&&a!==b&&this.multiplyScalar(a/b);return this},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;this.w+=(a.w-this.w)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z&&
a.w===this.w},fromArray:function(a){this.x=a[0];this.y=a[1];this.z=a[2];this.w=a[3];return this},toArray:function(){return[this.x,this.y,this.z,this.w]},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)}};THREE.Line3=function(a,b){this.start=void 0!==a?a:new THREE.Vector3;this.end=void 0!==b?b:new THREE.Vector3};
THREE.Line3.prototype={constructor:THREE.Line3,set:function(a,b){this.start.copy(a);this.end.copy(b);return this},copy:function(a){this.start.copy(a.start);this.end.copy(a.end);return this},center:function(a){return(a||new THREE.Vector3).addVectors(this.start,this.end).multiplyScalar(0.5)},delta:function(a){return(a||new THREE.Vector3).subVectors(this.end,this.start)},distanceSq:function(){return this.start.distanceToSquared(this.end)},distance:function(){return this.start.distanceTo(this.end)},at:function(a,
b){var c=b||new THREE.Vector3;return this.delta(c).multiplyScalar(a).add(this.start)},closestPointToPointParameter:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c,d){a.subVectors(c,this.start);b.subVectors(this.end,this.start);var e=b.dot(b),e=b.dot(a)/e;d&&(e=THREE.Math.clamp(e,0,1));return e}}(),closestPointToPoint:function(a,b,c){a=this.closestPointToPointParameter(a,b);c=c||new THREE.Vector3;return this.delta(c).multiplyScalar(a).add(this.start)},applyMatrix4:function(a){this.start.applyMatrix4(a);
this.end.applyMatrix4(a);return this},equals:function(a){return a.start.equals(this.start)&&a.end.equals(this.end)},clone:function(){return(new THREE.Line3).copy(this)}};THREE.Box2=function(a,b){this.min=void 0!==a?a:new THREE.Vector2(Infinity,Infinity);this.max=void 0!==b?b:new THREE.Vector2(-Infinity,-Infinity)};
THREE.Box2.prototype={constructor:THREE.Box2,set:function(a,b){this.min.copy(a);this.max.copy(b);return this},setFromPoints:function(a){if(0<a.length){var b=a[0];this.min.copy(b);this.max.copy(b);for(var c=1,d=a.length;c<d;c++)b=a[c],b.x<this.min.x?this.min.x=b.x:b.x>this.max.x&&(this.max.x=b.x),b.y<this.min.y?this.min.y=b.y:b.y>this.max.y&&(this.max.y=b.y)}else this.makeEmpty();return this},setFromCenterAndSize:function(){var a=new THREE.Vector2;return function(b,c){var d=a.copy(c).multiplyScalar(0.5);
this.min.copy(b).sub(d);this.max.copy(b).add(d);return this}}(),copy:function(a){this.min.copy(a.min);this.max.copy(a.max);return this},makeEmpty:function(){this.min.x=this.min.y=Infinity;this.max.x=this.max.y=-Infinity;return this},empty:function(){return this.max.x<this.min.x||this.max.y<this.min.y},center:function(a){return(a||new THREE.Vector2).addVectors(this.min,this.max).multiplyScalar(0.5)},size:function(a){return(a||new THREE.Vector2).subVectors(this.max,this.min)},expandByPoint:function(a){this.min.min(a);
this.max.max(a);return this},expandByVector:function(a){this.min.sub(a);this.max.add(a);return this},expandByScalar:function(a){this.min.addScalar(-a);this.max.addScalar(a);return this},containsPoint:function(a){return a.x<this.min.x||a.x>this.max.x||a.y<this.min.y||a.y>this.max.y?!1:!0},containsBox:function(a){return this.min.x<=a.min.x&&a.max.x<=this.max.x&&this.min.y<=a.min.y&&a.max.y<=this.max.y?!0:!1},getParameter:function(a){return new THREE.Vector2((a.x-this.min.x)/(this.max.x-this.min.x),
(a.y-this.min.y)/(this.max.y-this.min.y))},isIntersectionBox:function(a){return a.max.x<this.min.x||a.min.x>this.max.x||a.max.y<this.min.y||a.min.y>this.max.y?!1:!0},clampPoint:function(a,b){return(b||new THREE.Vector2).copy(a).clamp(this.min,this.max)},distanceToPoint:function(){var a=new THREE.Vector2;return function(b){return a.copy(b).clamp(this.min,this.max).sub(b).length()}}(),intersect:function(a){this.min.max(a.min);this.max.min(a.max);return this},union:function(a){this.min.min(a.min);this.max.max(a.max);
return this},translate:function(a){this.min.add(a);this.max.add(a);return this},equals:function(a){return a.min.equals(this.min)&&a.max.equals(this.max)},clone:function(){return(new THREE.Box2).copy(this)}};THREE.Box3=function(a,b){this.min=void 0!==a?a:new THREE.Vector3(Infinity,Infinity,Infinity);this.max=void 0!==b?b:new THREE.Vector3(-Infinity,-Infinity,-Infinity)};
THREE.Box3.prototype={constructor:THREE.Box3,set:function(a,b){this.min.copy(a);this.max.copy(b);return this},setFromPoints:function(a){if(0<a.length){var b=a[0];this.min.copy(b);this.max.copy(b);for(var c=1,d=a.length;c<d;c++)b=a[c],b.x<this.min.x?this.min.x=b.x:b.x>this.max.x&&(this.max.x=b.x),b.y<this.min.y?this.min.y=b.y:b.y>this.max.y&&(this.max.y=b.y),b.z<this.min.z?this.min.z=b.z:b.z>this.max.z&&(this.max.z=b.z)}else this.makeEmpty();return this},setFromCenterAndSize:function(){var a=new THREE.Vector3;
return function(b,c){var d=a.copy(c).multiplyScalar(0.5);this.min.copy(b).sub(d);this.max.copy(b).add(d);return this}}(),copy:function(a){this.min.copy(a.min);this.max.copy(a.max);return this},makeEmpty:function(){this.min.x=this.min.y=this.min.z=Infinity;this.max.x=this.max.y=this.max.z=-Infinity;return this},empty:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z},center:function(a){return(a||new THREE.Vector3).addVectors(this.min,this.max).multiplyScalar(0.5)},
size:function(a){return(a||new THREE.Vector3).subVectors(this.max,this.min)},expandByPoint:function(a){this.min.min(a);this.max.max(a);return this},expandByVector:function(a){this.min.sub(a);this.max.add(a);return this},expandByScalar:function(a){this.min.addScalar(-a);this.max.addScalar(a);return this},containsPoint:function(a){return a.x<this.min.x||a.x>this.max.x||a.y<this.min.y||a.y>this.max.y||a.z<this.min.z||a.z>this.max.z?!1:!0},containsBox:function(a){return this.min.x<=a.min.x&&a.max.x<=
this.max.x&&this.min.y<=a.min.y&&a.max.y<=this.max.y&&this.min.z<=a.min.z&&a.max.z<=this.max.z?!0:!1},getParameter:function(a){return new THREE.Vector3((a.x-this.min.x)/(this.max.x-this.min.x),(a.y-this.min.y)/(this.max.y-this.min.y),(a.z-this.min.z)/(this.max.z-this.min.z))},isIntersectionBox:function(a){return a.max.x<this.min.x||a.min.x>this.max.x||a.max.y<this.min.y||a.min.y>this.max.y||a.max.z<this.min.z||a.min.z>this.max.z?!1:!0},clampPoint:function(a,b){return(b||new THREE.Vector3).copy(a).clamp(this.min,
this.max)},distanceToPoint:function(){var a=new THREE.Vector3;return function(b){return a.copy(b).clamp(this.min,this.max).sub(b).length()}}(),getBoundingSphere:function(){var a=new THREE.Vector3;return function(b){b=b||new THREE.Sphere;b.center=this.center();b.radius=0.5*this.size(a).length();return b}}(),intersect:function(a){this.min.max(a.min);this.max.min(a.max);return this},union:function(a){this.min.min(a.min);this.max.max(a.max);return this},applyMatrix4:function(){var a=[new THREE.Vector3,
new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];return function(b){a[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(b);a[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(b);a[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(b);a[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(b);a[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(b);a[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(b);a[6].set(this.max.x,
this.max.y,this.min.z).applyMatrix4(b);a[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(b);this.makeEmpty();this.setFromPoints(a);return this}}(),translate:function(a){this.min.add(a);this.max.add(a);return this},equals:function(a){return a.min.equals(this.min)&&a.max.equals(this.max)},clone:function(){return(new THREE.Box3).copy(this)}};THREE.Matrix3=function(a,b,c,d,e,f,g,h,i){this.elements=new Float32Array(9);this.set(void 0!==a?a:1,b||0,c||0,d||0,void 0!==e?e:1,f||0,g||0,h||0,void 0!==i?i:1)};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,set:function(a,b,c,d,e,f,g,h,i){var j=this.elements;j[0]=a;j[3]=b;j[6]=c;j[1]=d;j[4]=e;j[7]=f;j[2]=g;j[5]=h;j[8]=i;return this},identity:function(){this.set(1,0,0,0,1,0,0,0,1);return this},copy:function(a){a=a.elements;this.set(a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8]);return this},multiplyVector3:function(a){console.warn("DEPRECATED: Matrix3's .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.");return a.applyMatrix3(this)},
multiplyVector3Array:function(){var a=new THREE.Vector3;return function(b){for(var c=0,d=b.length;c<d;c+=3)a.x=b[c],a.y=b[c+1],a.z=b[c+2],a.applyMatrix3(this),b[c]=a.x,b[c+1]=a.y,b[c+2]=a.z;return b}}(),multiplyScalar:function(a){var b=this.elements;b[0]*=a;b[3]*=a;b[6]*=a;b[1]*=a;b[4]*=a;b[7]*=a;b[2]*=a;b[5]*=a;b[8]*=a;return this},determinant:function(){var a=this.elements,b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],i=a[7],a=a[8];return b*f*a-b*g*i-c*e*a+c*g*h+d*e*i-d*f*h},getInverse:function(a,
b){var c=a.elements,d=this.elements;d[0]=c[10]*c[5]-c[6]*c[9];d[1]=-c[10]*c[1]+c[2]*c[9];d[2]=c[6]*c[1]-c[2]*c[5];d[3]=-c[10]*c[4]+c[6]*c[8];d[4]=c[10]*c[0]-c[2]*c[8];d[5]=-c[6]*c[0]+c[2]*c[4];d[6]=c[9]*c[4]-c[5]*c[8];d[7]=-c[9]*c[0]+c[1]*c[8];d[8]=c[5]*c[0]-c[1]*c[4];c=c[0]*d[0]+c[1]*d[3]+c[2]*d[6];if(0===c){if(b)throw Error("Matrix3.getInverse(): can't invert matrix, determinant is 0");console.warn("Matrix3.getInverse(): can't invert matrix, determinant is 0");this.identity();return this}this.multiplyScalar(1/
c);return this},transpose:function(){var a,b=this.elements;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},getNormalMatrix:function(a){this.getInverse(a).transpose();return this},transposeIntoArray:function(a){var b=this.elements;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this},clone:function(){var a=this.elements;return new THREE.Matrix3(a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8])}};THREE.Matrix4=function(a,b,c,d,e,f,g,h,i,j,m,p,l,r,s,n){var q=this.elements=new Float32Array(16);q[0]=void 0!==a?a:1;q[4]=b||0;q[8]=c||0;q[12]=d||0;q[1]=e||0;q[5]=void 0!==f?f:1;q[9]=g||0;q[13]=h||0;q[2]=i||0;q[6]=j||0;q[10]=void 0!==m?m:1;q[14]=p||0;q[3]=l||0;q[7]=r||0;q[11]=s||0;q[15]=void 0!==n?n:1};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(a,b,c,d,e,f,g,h,i,j,m,p,l,r,s,n){var q=this.elements;q[0]=a;q[4]=b;q[8]=c;q[12]=d;q[1]=e;q[5]=f;q[9]=g;q[13]=h;q[2]=i;q[6]=j;q[10]=m;q[14]=p;q[3]=l;q[7]=r;q[11]=s;q[15]=n;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){a=a.elements;this.set(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15]);return this},extractPosition:function(a){console.warn("DEPRECATED: Matrix4's .extractPosition() has been renamed to .copyPosition().");
return this.copyPosition(a)},copyPosition:function(a){var b=this.elements,a=a.elements;b[12]=a[12];b[13]=a[13];b[14]=a[14];return this},extractRotation:function(){var a=new THREE.Vector3;return function(b){var c=this.elements,b=b.elements,d=1/a.set(b[0],b[1],b[2]).length(),e=1/a.set(b[4],b[5],b[6]).length(),f=1/a.set(b[8],b[9],b[10]).length();c[0]=b[0]*d;c[1]=b[1]*d;c[2]=b[2]*d;c[4]=b[4]*e;c[5]=b[5]*e;c[6]=b[6]*e;c[8]=b[8]*f;c[9]=b[9]*f;c[10]=b[10]*f;return this}}(),setRotationFromEuler:function(a,
b){console.warn("DEPRECATED: Matrix4's .setRotationFromEuler() has been deprecated in favor of makeRotationFromEuler.  Please update your code.");return this.makeRotationFromEuler(a,b)},makeRotationFromEuler:function(a,b){var c=this.elements,d=a.x,e=a.y,f=a.z,g=Math.cos(d),d=Math.sin(d),h=Math.cos(e),e=Math.sin(e),i=Math.cos(f),f=Math.sin(f);if(void 0===b||"XYZ"===b){var j=g*i,m=g*f,p=d*i,l=d*f;c[0]=h*i;c[4]=-h*f;c[8]=e;c[1]=m+p*e;c[5]=j-l*e;c[9]=-d*h;c[2]=l-j*e;c[6]=p+m*e;c[10]=g*h}else"YXZ"===b?
(j=h*i,m=h*f,p=e*i,l=e*f,c[0]=j+l*d,c[4]=p*d-m,c[8]=g*e,c[1]=g*f,c[5]=g*i,c[9]=-d,c[2]=m*d-p,c[6]=l+j*d,c[10]=g*h):"ZXY"===b?(j=h*i,m=h*f,p=e*i,l=e*f,c[0]=j-l*d,c[4]=-g*f,c[8]=p+m*d,c[1]=m+p*d,c[5]=g*i,c[9]=l-j*d,c[2]=-g*e,c[6]=d,c[10]=g*h):"ZYX"===b?(j=g*i,m=g*f,p=d*i,l=d*f,c[0]=h*i,c[4]=p*e-m,c[8]=j*e+l,c[1]=h*f,c[5]=l*e+j,c[9]=m*e-p,c[2]=-e,c[6]=d*h,c[10]=g*h):"YZX"===b?(j=g*h,m=g*e,p=d*h,l=d*e,c[0]=h*i,c[4]=l-j*f,c[8]=p*f+m,c[1]=f,c[5]=g*i,c[9]=-d*i,c[2]=-e*i,c[6]=m*f+p,c[10]=j-l*f):"XZY"===b&&
(j=g*h,m=g*e,p=d*h,l=d*e,c[0]=h*i,c[4]=-f,c[8]=e*i,c[1]=j*f+l,c[5]=g*i,c[9]=m*f-p,c[2]=p*f-m,c[6]=d*i,c[10]=l*f+j);c[3]=0;c[7]=0;c[11]=0;c[12]=0;c[13]=0;c[14]=0;c[15]=1;return this},setRotationFromQuaternion:function(a){console.warn("DEPRECATED: Matrix4's .setRotationFromQuaternion() has been deprecated in favor of makeRotationFromQuaternion.  Please update your code.");return this.makeRotationFromQuaternion(a)},makeRotationFromQuaternion:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=a.w,g=
c+c,h=d+d,i=e+e,a=c*g,j=c*h,c=c*i,m=d*h,d=d*i,e=e*i,g=f*g,h=f*h,f=f*i;b[0]=1-(m+e);b[4]=j-f;b[8]=c+h;b[1]=j+f;b[5]=1-(a+e);b[9]=d-g;b[2]=c-h;b[6]=d+g;b[10]=1-(a+m);b[3]=0;b[7]=0;b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return this},lookAt:function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Vector3;return function(d,e,f){var g=this.elements;c.subVectors(d,e).normalize();0===c.length()&&(c.z=1);a.crossVectors(f,c).normalize();0===a.length()&&(c.x+=1E-4,a.crossVectors(f,c).normalize());
b.crossVectors(c,a);g[0]=a.x;g[4]=b.x;g[8]=c.x;g[1]=a.y;g[5]=b.y;g[9]=c.y;g[2]=a.z;g[6]=b.z;g[10]=c.z;return this}}(),multiply:function(a,b){return void 0!==b?(console.warn("DEPRECATED: Matrix4's .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(a,b)):this.multiplyMatrices(this,a)},multiplyMatrices:function(a,b){var c=a.elements,d=b.elements,e=this.elements,f=c[0],g=c[4],h=c[8],i=c[12],j=c[1],m=c[5],p=c[9],l=c[13],r=c[2],s=c[6],n=c[10],q=c[14],
y=c[3],u=c[7],x=c[11],c=c[15],t=d[0],E=d[4],J=d[8],F=d[12],z=d[1],H=d[5],K=d[9],G=d[13],L=d[2],B=d[6],V=d[10],C=d[14],I=d[3],M=d[7],R=d[11],d=d[15];e[0]=f*t+g*z+h*L+i*I;e[4]=f*E+g*H+h*B+i*M;e[8]=f*J+g*K+h*V+i*R;e[12]=f*F+g*G+h*C+i*d;e[1]=j*t+m*z+p*L+l*I;e[5]=j*E+m*H+p*B+l*M;e[9]=j*J+m*K+p*V+l*R;e[13]=j*F+m*G+p*C+l*d;e[2]=r*t+s*z+n*L+q*I;e[6]=r*E+s*H+n*B+q*M;e[10]=r*J+s*K+n*V+q*R;e[14]=r*F+s*G+n*C+q*d;e[3]=y*t+u*z+x*L+c*I;e[7]=y*E+u*H+x*B+c*M;e[11]=y*J+u*K+x*V+c*R;e[15]=y*F+u*G+x*C+c*d;return this},
multiplyToArray:function(a,b,c){var d=this.elements;this.multiplyMatrices(a,b);c[0]=d[0];c[1]=d[1];c[2]=d[2];c[3]=d[3];c[4]=d[4];c[5]=d[5];c[6]=d[6];c[7]=d[7];c[8]=d[8];c[9]=d[9];c[10]=d[10];c[11]=d[11];c[12]=d[12];c[13]=d[13];c[14]=d[14];c[15]=d[15];return this},multiplyScalar:function(a){var b=this.elements;b[0]*=a;b[4]*=a;b[8]*=a;b[12]*=a;b[1]*=a;b[5]*=a;b[9]*=a;b[13]*=a;b[2]*=a;b[6]*=a;b[10]*=a;b[14]*=a;b[3]*=a;b[7]*=a;b[11]*=a;b[15]*=a;return this},multiplyVector3:function(a){console.warn("DEPRECATED: Matrix4's .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.");
return a.applyProjection(this)},multiplyVector4:function(a){console.warn("DEPRECATED: Matrix4's .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.");return a.applyMatrix4(this)},multiplyVector3Array:function(){var a=new THREE.Vector3;return function(b){for(var c=0,d=b.length;c<d;c+=3)a.x=b[c],a.y=b[c+1],a.z=b[c+2],a.applyProjection(this),b[c]=a.x,b[c+1]=a.y,b[c+2]=a.z;return b}}(),rotateAxis:function(a){console.warn("DEPRECATED: Matrix4's .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.");
a.transformDirection(this)},crossVector:function(a){console.warn("DEPRECATED: Matrix4's .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.");return a.applyMatrix4(this)},determinant:function(){var a=this.elements,b=a[0],c=a[4],d=a[8],e=a[12],f=a[1],g=a[5],h=a[9],i=a[13],j=a[2],m=a[6],p=a[10],l=a[14];return a[3]*(+e*h*m-d*i*m-e*g*p+c*i*p+d*g*l-c*h*l)+a[7]*(+b*h*l-b*i*p+e*f*p-d*f*l+d*i*j-e*h*j)+a[11]*(+b*i*m-b*g*l-e*f*m+c*f*l+e*g*j-c*i*j)+a[15]*(-d*g*j-b*h*m+b*g*p+d*f*m-c*f*
p+c*h*j)},transpose:function(){var a=this.elements,b;b=a[1];a[1]=a[4];a[4]=b;b=a[2];a[2]=a[8];a[8]=b;b=a[6];a[6]=a[9];a[9]=b;b=a[3];a[3]=a[12];a[12]=b;b=a[7];a[7]=a[13];a[13]=b;b=a[11];a[11]=a[14];a[14]=b;return this},flattenToArray:function(a){var b=this.elements;a[0]=b[0];a[1]=b[1];a[2]=b[2];a[3]=b[3];a[4]=b[4];a[5]=b[5];a[6]=b[6];a[7]=b[7];a[8]=b[8];a[9]=b[9];a[10]=b[10];a[11]=b[11];a[12]=b[12];a[13]=b[13];a[14]=b[14];a[15]=b[15];return a},flattenToArrayOffset:function(a,b){var c=this.elements;
a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];a[b+9]=c[9];a[b+10]=c[10];a[b+11]=c[11];a[b+12]=c[12];a[b+13]=c[13];a[b+14]=c[14];a[b+15]=c[15];return a},getPosition:function(){var a=new THREE.Vector3;return function(){console.warn("DEPRECATED: Matrix4's .getPosition() has been removed. Use Vector3.getPositionFromMatrix( matrix ) instead.");var b=this.elements;return a.set(b[12],b[13],b[14])}}(),setPosition:function(a){var b=this.elements;
b[12]=a.x;b[13]=a.y;b[14]=a.z;return this},getInverse:function(a,b){var c=this.elements,d=a.elements,e=d[0],f=d[4],g=d[8],h=d[12],i=d[1],j=d[5],m=d[9],p=d[13],l=d[2],r=d[6],s=d[10],n=d[14],q=d[3],y=d[7],u=d[11],x=d[15];c[0]=m*n*y-p*s*y+p*r*u-j*n*u-m*r*x+j*s*x;c[4]=h*s*y-g*n*y-h*r*u+f*n*u+g*r*x-f*s*x;c[8]=g*p*y-h*m*y+h*j*u-f*p*u-g*j*x+f*m*x;c[12]=h*m*r-g*p*r-h*j*s+f*p*s+g*j*n-f*m*n;c[1]=p*s*q-m*n*q-p*l*u+i*n*u+m*l*x-i*s*x;c[5]=g*n*q-h*s*q+h*l*u-e*n*u-g*l*x+e*s*x;c[9]=h*m*q-g*p*q-h*i*u+e*p*u+g*i*x-
e*m*x;c[13]=g*p*l-h*m*l+h*i*s-e*p*s-g*i*n+e*m*n;c[2]=j*n*q-p*r*q+p*l*y-i*n*y-j*l*x+i*r*x;c[6]=h*r*q-f*n*q-h*l*y+e*n*y+f*l*x-e*r*x;c[10]=f*p*q-h*j*q+h*i*y-e*p*y-f*i*x+e*j*x;c[14]=h*j*l-f*p*l-h*i*r+e*p*r+f*i*n-e*j*n;c[3]=m*r*q-j*s*q-m*l*y+i*s*y+j*l*u-i*r*u;c[7]=f*s*q-g*r*q+g*l*y-e*s*y-f*l*u+e*r*u;c[11]=g*j*q-f*m*q-g*i*y+e*m*y+f*i*u-e*j*u;c[15]=f*m*l-g*j*l+g*i*r-e*m*r-f*i*s+e*j*s;c=d[0]*c[0]+d[1]*c[4]+d[2]*c[8]+d[3]*c[12];if(0==c){if(b)throw Error("Matrix4.getInverse(): can't invert matrix, determinant is 0");
console.warn("Matrix4.getInverse(): can't invert matrix, determinant is 0");this.identity();return this}this.multiplyScalar(1/c);return this},translate:function(){console.warn("DEPRECATED: Matrix4's .translate() has been removed.")},rotateX:function(){console.warn("DEPRECATED: Matrix4's .rotateX() has been removed.")},rotateY:function(){console.warn("DEPRECATED: Matrix4's .rotateY() has been removed.")},rotateZ:function(){console.warn("DEPRECATED: Matrix4's .rotateZ() has been removed.")},rotateByAxis:function(){console.warn("DEPRECATED: Matrix4's .rotateByAxis() has been removed.")},
scale:function(a){var b=this.elements,c=a.x,d=a.y,a=a.z;b[0]*=c;b[4]*=d;b[8]*=a;b[1]*=c;b[5]*=d;b[9]*=a;b[2]*=c;b[6]*=d;b[10]*=a;b[3]*=c;b[7]*=d;b[11]*=a;return this},getMaxScaleOnAxis:function(){var a=this.elements;return Math.sqrt(Math.max(a[0]*a[0]+a[1]*a[1]+a[2]*a[2],Math.max(a[4]*a[4]+a[5]*a[5]+a[6]*a[6],a[8]*a[8]+a[9]*a[9]+a[10]*a[10])))},makeTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},makeRotationX:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(1,
0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},makeRotationY:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},makeRotationZ:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},makeRotationAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,h=a.z,i=e*f,j=e*g;this.set(i*f+c,i*g-d*h,i*h+d*g,0,i*g+d*h,j*g+c,j*h-d*f,0,i*h-d*g,j*h+d*f,e*h*h+c,0,0,0,0,1);return this},makeScale:function(a,b,c){this.set(a,
0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},compose:function(a,b,c){console.warn("DEPRECATED: Matrix4's .compose() has been deprecated in favor of makeFromPositionQuaternionScale. Please update your code.");return this.makeFromPositionQuaternionScale(a,b,c)},makeFromPositionQuaternionScale:function(a,b,c){this.makeRotationFromQuaternion(b);this.scale(c);this.setPosition(a);return this},makeFromPositionEulerScale:function(a,b,c,d){this.makeRotationFromEuler(b,c);this.scale(d);this.setPosition(a);return this},
makeFrustum:function(a,b,c,d,e,f){var g=this.elements;g[0]=2*e/(b-a);g[4]=0;g[8]=(b+a)/(b-a);g[12]=0;g[1]=0;g[5]=2*e/(d-c);g[9]=(d+c)/(d-c);g[13]=0;g[2]=0;g[6]=0;g[10]=-(f+e)/(f-e);g[14]=-2*f*e/(f-e);g[3]=0;g[7]=0;g[11]=-1;g[15]=0;return this},makePerspective:function(a,b,c,d){var a=c*Math.tan(THREE.Math.degToRad(0.5*a)),e=-a;return this.makeFrustum(e*b,a*b,e,a,c,d)},makeOrthographic:function(a,b,c,d,e,f){var g=this.elements,h=b-a,i=c-d,j=f-e;g[0]=2/h;g[4]=0;g[8]=0;g[12]=-((b+a)/h);g[1]=0;g[5]=2/
i;g[9]=0;g[13]=-((c+d)/i);g[2]=0;g[6]=0;g[10]=-2/j;g[14]=-((f+e)/j);g[3]=0;g[7]=0;g[11]=0;g[15]=1;return this},clone:function(){var a=this.elements;return new THREE.Matrix4(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15])}};
THREE.extend(THREE.Matrix4.prototype,{decompose:function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Vector3,d=new THREE.Matrix4;return function(e,f,g){var h=this.elements;a.set(h[0],h[1],h[2]);b.set(h[4],h[5],h[6]);c.set(h[8],h[9],h[10]);e=e instanceof THREE.Vector3?e:new THREE.Vector3;f=f instanceof THREE.Quaternion?f:new THREE.Quaternion;g=g instanceof THREE.Vector3?g:new THREE.Vector3;g.x=a.length();g.y=b.length();g.z=c.length();e.x=h[12];e.y=h[13];e.z=h[14];d.copy(this);d.elements[0]/=
g.x;d.elements[1]/=g.x;d.elements[2]/=g.x;d.elements[4]/=g.y;d.elements[5]/=g.y;d.elements[6]/=g.y;d.elements[8]/=g.z;d.elements[9]/=g.z;d.elements[10]/=g.z;f.setFromRotationMatrix(d);return[e,f,g]}}()});THREE.Ray=function(a,b){this.origin=void 0!==a?a:new THREE.Vector3;this.direction=void 0!==b?b:new THREE.Vector3};
THREE.Ray.prototype={constructor:THREE.Ray,set:function(a,b){this.origin.copy(a);this.direction.copy(b);return this},copy:function(a){this.origin.copy(a.origin);this.direction.copy(a.direction);return this},at:function(a,b){return(b||new THREE.Vector3).copy(this.direction).multiplyScalar(a).add(this.origin)},recast:function(){var a=new THREE.Vector3;return function(b){this.origin.copy(this.at(b,a));return this}}(),closestPointToPoint:function(a,b){var c=b||new THREE.Vector3;c.subVectors(a,this.origin);
var d=c.dot(this.direction);return c.copy(this.direction).multiplyScalar(d).add(this.origin)},distanceToPoint:function(){var a=new THREE.Vector3;return function(b){var c=a.subVectors(b,this.origin).dot(this.direction);a.copy(this.direction).multiplyScalar(c).add(this.origin);return a.distanceTo(b)}}(),isIntersectionSphere:function(a){return this.distanceToPoint(a.center)<=a.radius},isIntersectionPlane:function(a){return 0!=a.normal.dot(this.direction)||0==a.distanceToPoint(this.origin)?!0:!1},distanceToPlane:function(a){var b=
a.normal.dot(this.direction);if(0==b){if(0==a.distanceToPoint(this.origin))return 0}else return-(this.origin.dot(a.normal)+a.constant)/b},intersectPlane:function(a,b){var c=this.distanceToPlane(a);return void 0===c?void 0:this.at(c,b)},applyMatrix4:function(a){this.direction.add(this.origin).applyMatrix4(a);this.origin.applyMatrix4(a);this.direction.sub(this.origin);return this},equals:function(a){return a.origin.equals(this.origin)&&a.direction.equals(this.direction)},clone:function(){return(new THREE.Ray).copy(this)}};THREE.Sphere=function(a,b){this.center=void 0!==a?a:new THREE.Vector3;this.radius=void 0!==b?b:0};
THREE.Sphere.prototype={constructor:THREE.Sphere,set:function(a,b){this.center.copy(a);this.radius=b;return this},setFromCenterAndPoints:function(a,b){for(var c=0,d=0,e=b.length;d<e;d++)var f=a.distanceToSquared(b[d]),c=Math.max(c,f);this.center=a;this.radius=Math.sqrt(c);return this},copy:function(a){this.center.copy(a.center);this.radius=a.radius;return this},empty:function(){return 0>=this.radius},containsPoint:function(a){return a.distanceToSquared(this.center)<=this.radius*this.radius},distanceToPoint:function(a){return a.distanceTo(this.center)-
this.radius},intersectsSphere:function(a){var b=this.radius+a.radius;return a.center.distanceToSquared(this.center)<=b*b},clampPoint:function(a,b){var c=this.center.distanceToSquared(a),d=b||new THREE.Vector3;d.copy(a);c>this.radius*this.radius&&(d.sub(this.center).normalize(),d.multiplyScalar(this.radius).add(this.center));return d},getBoundingBox:function(a){a=a||new THREE.Box3;a.set(this.center,this.center);a.expandByScalar(this.radius);return a},applyMatrix4:function(a){this.center.applyMatrix4(a);
this.radius*=a.getMaxScaleOnAxis();return this},translate:function(a){this.center.add(a);return this},equals:function(a){return a.center.equals(this.center)&&a.radius===this.radius},clone:function(){return(new THREE.Sphere).copy(this)}};THREE.Frustum=function(a,b,c,d,e,f){this.planes=[void 0!==a?a:new THREE.Plane,void 0!==b?b:new THREE.Plane,void 0!==c?c:new THREE.Plane,void 0!==d?d:new THREE.Plane,void 0!==e?e:new THREE.Plane,void 0!==f?f:new THREE.Plane]};
THREE.Frustum.prototype={constructor:THREE.Frustum,set:function(a,b,c,d,e,f){var g=this.planes;g[0].copy(a);g[1].copy(b);g[2].copy(c);g[3].copy(d);g[4].copy(e);g[5].copy(f);return this},copy:function(a){for(var b=this.planes,c=0;6>c;c++)b[c].copy(a.planes[c]);return this},setFromMatrix:function(a){var b=this.planes,c=a.elements,a=c[0],d=c[1],e=c[2],f=c[3],g=c[4],h=c[5],i=c[6],j=c[7],m=c[8],p=c[9],l=c[10],r=c[11],s=c[12],n=c[13],q=c[14],c=c[15];b[0].setComponents(f-a,j-g,r-m,c-s).normalize();b[1].setComponents(f+
a,j+g,r+m,c+s).normalize();b[2].setComponents(f+d,j+h,r+p,c+n).normalize();b[3].setComponents(f-d,j-h,r-p,c-n).normalize();b[4].setComponents(f-e,j-i,r-l,c-q).normalize();b[5].setComponents(f+e,j+i,r+l,c+q).normalize();return this},intersectsObject:function(){var a=new THREE.Vector3;return function(b){var c=b.matrixWorld,d=this.planes,b=-b.geometry.boundingSphere.radius*c.getMaxScaleOnAxis();a.getPositionFromMatrix(c);for(c=0;6>c;c++)if(d[c].distanceToPoint(a)<b)return!1;return!0}}(),intersectsSphere:function(a){for(var b=
this.planes,c=a.center,a=-a.radius,d=0;6>d;d++)if(b[d].distanceToPoint(c)<a)return!1;return!0},containsPoint:function(a){for(var b=this.planes,c=0;6>c;c++)if(0>b[c].distanceToPoint(a))return!1;return!0},clone:function(){return(new THREE.Frustum).copy(this)}};THREE.Plane=function(a,b){this.normal=void 0!==a?a:new THREE.Vector3(1,0,0);this.constant=void 0!==b?b:0};
THREE.Plane.prototype={constructor:THREE.Plane,set:function(a,b){this.normal.copy(a);this.constant=b;return this},setComponents:function(a,b,c,d){this.normal.set(a,b,c);this.constant=d;return this},setFromNormalAndCoplanarPoint:function(a,b){this.normal.copy(a);this.constant=-b.dot(this.normal);return this},setFromCoplanarPoints:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c,d,e){d=a.subVectors(e,d).cross(b.subVectors(c,d)).normalize();this.setFromNormalAndCoplanarPoint(d,
c);return this}}(),copy:function(a){this.normal.copy(a.normal);this.constant=a.constant;return this},normalize:function(){var a=1/this.normal.length();this.normal.multiplyScalar(a);this.constant*=a;return this},negate:function(){this.constant*=-1;this.normal.negate();return this},distanceToPoint:function(a){return this.normal.dot(a)+this.constant},distanceToSphere:function(a){return this.distanceToPoint(a.center)-a.radius},projectPoint:function(a,b){return this.orthoPoint(a,b).sub(a).negate()},orthoPoint:function(a,
b){var c=this.distanceToPoint(a);return(b||new THREE.Vector3).copy(this.normal).multiplyScalar(c)},isIntersectionLine:function(a){var b=this.distanceToPoint(a.start),a=this.distanceToPoint(a.end);return 0>b&&0<a||0>a&&0<b},intersectLine:function(){var a=new THREE.Vector3;return function(b,c){var d=c||new THREE.Vector3,e=b.delta(a),f=this.normal.dot(e);if(0==f){if(0==this.distanceToPoint(b.start))return d.copy(b.start)}else return f=-(b.start.dot(this.normal)+this.constant)/f,0>f||1<f?void 0:d.copy(e).multiplyScalar(f).add(b.start)}}(),
coplanarPoint:function(a){return(a||new THREE.Vector3).copy(this.normal).multiplyScalar(-this.constant)},applyMatrix4:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c,d){var d=d||(new THREE.Matrix3).getNormalMatrix(c),e=a.copy(this.normal).applyMatrix3(d),f=this.coplanarPoint(b);f.applyMatrix4(c);this.setFromNormalAndCoplanarPoint(e,f);return this}}(),translate:function(a){this.constant-=a.dot(this.normal);return this},equals:function(a){return a.normal.equals(this.normal)&&
a.constant==this.constant},clone:function(){return(new THREE.Plane).copy(this)}};THREE.Math={clamp:function(a,b,c){return a<b?b:a>c?c:a},clampBottom:function(a,b){return a<b?b:a},mapLinear:function(a,b,c,d,e){return d+(a-b)*(e-d)/(c-b)},smoothstep:function(a,b,c){if(a<=b)return 0;if(a>=c)return 1;a=(a-b)/(c-b);return a*a*(3-2*a)},smootherstep:function(a,b,c){if(a<=b)return 0;if(a>=c)return 1;a=(a-b)/(c-b);return a*a*a*(a*(6*a-15)+10)},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,
b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(0.5-Math.random())},sign:function(a){return 0>a?-1:0<a?1:0},degToRad:function(){var a=Math.PI/180;return function(b){return b*a}}(),radToDeg:function(){var a=180/Math.PI;return function(b){return b*a}}()};THREE.Spline=function(a){function b(a,b,c,d,e,f,g){a=0.5*(c-a);d=0.5*(d-b);return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b}this.points=a;var c=[],d={x:0,y:0,z:0},e,f,g,h,i,j,m,p,l;this.initFromArray=function(a){this.points=[];for(var b=0;b<a.length;b++)this.points[b]={x:a[b][0],y:a[b][1],z:a[b][2]}};this.getPoint=function(a){e=(this.points.length-1)*a;f=Math.floor(e);g=e-f;c[0]=0===f?f:f-1;c[1]=f;c[2]=f>this.points.length-2?this.points.length-1:f+1;c[3]=f>this.points.length-3?this.points.length-1:
f+2;j=this.points[c[0]];m=this.points[c[1]];p=this.points[c[2]];l=this.points[c[3]];h=g*g;i=g*h;d.x=b(j.x,m.x,p.x,l.x,g,h,i);d.y=b(j.y,m.y,p.y,l.y,g,h,i);d.z=b(j.z,m.z,p.z,l.z,g,h,i);return d};this.getControlPointsArray=function(){var a,b,c=this.points.length,d=[];for(a=0;a<c;a++)b=this.points[a],d[a]=[b.x,b.y,b.z];return d};this.getLength=function(a){var b,c,d,e=b=b=0,f=new THREE.Vector3,g=new THREE.Vector3,h=[],i=0;h[0]=0;a||(a=100);c=this.points.length*a;f.copy(this.points[0]);for(a=1;a<c;a++)b=
a/c,d=this.getPoint(b),g.copy(d),i+=g.distanceTo(f),f.copy(d),b*=this.points.length-1,b=Math.floor(b),b!=e&&(h[b]=i,e=b);h[h.length]=i;return{chunks:h,total:i}};this.reparametrizeByArcLength=function(a){var b,c,d,e,f,g,h=[],i=new THREE.Vector3,j=this.getLength();h.push(i.copy(this.points[0]).clone());for(b=1;b<this.points.length;b++){c=j.chunks[b]-j.chunks[b-1];g=Math.ceil(a*c/j.total);e=(b-1)/(this.points.length-1);f=b/(this.points.length-1);for(c=1;c<g-1;c++)d=e+c*(1/g)*(f-e),d=this.getPoint(d),
h.push(i.copy(d).clone());h.push(i.copy(this.points[b]).clone())}this.points=h}};THREE.Triangle=function(a,b,c){this.a=void 0!==a?a:new THREE.Vector3;this.b=void 0!==b?b:new THREE.Vector3;this.c=void 0!==c?c:new THREE.Vector3};THREE.Triangle.normal=function(){var a=new THREE.Vector3;return function(b,c,d,e){e=e||new THREE.Vector3;e.subVectors(d,c);a.subVectors(b,c);e.cross(a);b=e.lengthSq();return 0<b?e.multiplyScalar(1/Math.sqrt(b)):e.set(0,0,0)}}();
THREE.Triangle.barycoordFromPoint=function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Vector3;return function(d,e,f,g,h){a.subVectors(g,e);b.subVectors(f,e);c.subVectors(d,e);var d=a.dot(a),e=a.dot(b),f=a.dot(c),i=b.dot(b),g=b.dot(c),j=d*i-e*e,h=h||new THREE.Vector3;if(0==j)return h.set(-2,-1,-1);j=1/j;i=(i*f-e*g)*j;d=(d*g-e*f)*j;return h.set(1-i-d,d,i)}}();
THREE.Triangle.containsPoint=function(){var a=new THREE.Vector3;return function(b,c,d,e){b=THREE.Triangle.barycoordFromPoint(b,c,d,e,a);return 0<=b.x&&0<=b.y&&1>=b.x+b.y}}();
THREE.Triangle.prototype={constructor:THREE.Triangle,set:function(a,b,c){this.a.copy(a);this.b.copy(b);this.c.copy(c);return this},setFromPointsAndIndices:function(a,b,c,d){this.a.copy(a[b]);this.b.copy(a[c]);this.c.copy(a[d]);return this},copy:function(a){this.a.copy(a.a);this.b.copy(a.b);this.c.copy(a.c);return this},area:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(){a.subVectors(this.c,this.b);b.subVectors(this.a,this.b);return 0.5*a.cross(b).length()}}(),midpoint:function(a){return(a||
new THREE.Vector3).addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)},normal:function(a){return THREE.Triangle.normal(this.a,this.b,this.c,a)},plane:function(a){return(a||new THREE.Plane).setFromCoplanarPoints(this.a,this.b,this.c)},barycoordFromPoint:function(a,b){return THREE.Triangle.barycoordFromPoint(a,this.a,this.b,this.c,b)},containsPoint:function(a){return THREE.Triangle.containsPoint(a,this.a,this.b,this.c)},equals:function(a){return a.a.equals(this.a)&&a.b.equals(this.b)&&a.c.equals(this.c)},
clone:function(){return(new THREE.Triangle).copy(this)}};THREE.Vertex=function(a){console.warn("THREE.Vertex has been DEPRECATED. Use THREE.Vector3 instead.");return a};THREE.UV=function(a,b){console.warn("THREE.UV has been DEPRECATED. Use THREE.Vector2 instead.");return new THREE.Vector2(a,b)};THREE.Clock=function(a){this.autoStart=void 0!==a?a:!0;this.elapsedTime=this.oldTime=this.startTime=0;this.running=!1};
THREE.Clock.prototype={constructor:THREE.Clock,start:function(){this.oldTime=this.startTime=void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now();this.running=!0},stop:function(){this.getElapsedTime();this.running=!1},getElapsedTime:function(){this.getDelta();return this.elapsedTime},getDelta:function(){var a=0;this.autoStart&&!this.running&&this.start();if(this.running){var b=void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():
Date.now(),a=0.001*(b-this.oldTime);this.oldTime=b;this.elapsedTime+=a}return a}};THREE.EventDispatcher=function(){};
THREE.EventDispatcher.prototype={constructor:THREE.EventDispatcher,addEventListener:function(a,b){void 0===this._listeners&&(this._listeners={});var c=this._listeners;void 0===c[a]&&(c[a]=[]);-1===c[a].indexOf(b)&&c[a].push(b)},hasEventListener:function(a,b){if(void 0===this._listeners)return!1;var c=this._listeners;return void 0!==c[a]&&-1!==c[a].indexOf(b)?!0:!1},removeEventListener:function(a,b){if(void 0!==this._listeners){var c=this._listeners,d=c[a].indexOf(b);-1!==d&&c[a].splice(d,1)}},dispatchEvent:function(a){if(void 0!==
this._listeners){var b=this._listeners[a.type];if(void 0!==b){a.target=this;for(var c=0,d=b.length;c<d;c++)b[c].call(this,a)}}}};(function(a){a.Raycaster=function(b,c,d,e){this.ray=new a.Ray(b,c);0<this.ray.direction.lengthSq()&&this.ray.direction.normalize();this.near=d||0;this.far=e||Infinity};var b=new a.Sphere,c=new a.Ray,d=new a.Plane,e=new a.Vector3,f=new a.Vector3,g=new a.Matrix4,h=function(a,b){return a.distance-b.distance},i=function(h,j,l){if(h instanceof a.Particle){f.getPositionFromMatrix(h.matrixWorld);var r=j.ray.distanceToPoint(f);if(r>h.scale.x)return l;l.push({distance:r,point:h.position,face:null,object:h})}else if(h instanceof
a.LOD)f.getPositionFromMatrix(h.matrixWorld),r=j.ray.origin.distanceTo(f),i(h.getObjectForDistance(r),j,l);else if(h instanceof a.Mesh){f.getPositionFromMatrix(h.matrixWorld);b.set(f,h.geometry.boundingSphere.radius*h.matrixWorld.getMaxScaleOnAxis());if(!j.ray.isIntersectionSphere(b))return l;var r=h.geometry,s=r.vertices,n=h.material instanceof a.MeshFaceMaterial,q=!0===n?h.material.materials:null,y=h.material.side,u,x,t,E=j.precision;g.getInverse(h.matrixWorld);c.copy(j.ray).applyMatrix4(g);for(var J=
0,F=r.faces.length;J<F;J++){var z=r.faces[J],y=!0===n?q[z.materialIndex]:h.material;if(void 0!==y){d.setFromNormalAndCoplanarPoint(z.normal,s[z.a]);var H=c.distanceToPlane(d);if(!(Math.abs(H)<E)&&!(0>H)){y=y.side;if(y!==a.DoubleSide&&(u=c.direction.dot(d.normal),!(y===a.FrontSide?0>u:0<u)))continue;if(!(H<j.near||H>j.far)){e=c.at(H,e);if(z instanceof a.Face3){if(y=s[z.a],u=s[z.b],x=s[z.c],!a.Triangle.containsPoint(e,y,u,x))continue}else if(z instanceof a.Face4){if(y=s[z.a],u=s[z.b],x=s[z.c],t=s[z.d],
!a.Triangle.containsPoint(e,y,u,t)&&!a.Triangle.containsPoint(e,u,x,t))continue}else throw Error("face type not supported");l.push({distance:H,point:j.ray.at(H),face:z,faceIndex:J,object:h})}}}}}},j=function(a,b,c){for(var a=a.getDescendants(),d=0,e=a.length;d<e;d++)i(a[d],b,c)};a.Raycaster.prototype.precision=1E-4;a.Raycaster.prototype.set=function(a,b){this.ray.set(a,b);0<this.ray.direction.length()&&this.ray.direction.normalize()};a.Raycaster.prototype.intersectObject=function(a,b){var c=[];!0===
b&&j(a,this,c);i(a,this,c);c.sort(h);return c};a.Raycaster.prototype.intersectObjects=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)i(a[d],this,c),!0===b&&j(a[d],this,c);c.sort(h);return c}})(THREE);THREE.Object3D=function(){this.id=THREE.Object3DIdCount++;this.name="";this.parent=void 0;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.eulerOrder=THREE.Object3D.defaultEulerOrder;this.scale=new THREE.Vector3(1,1,1);this.renderDepth=null;this.rotationAutoUpdate=!0;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixWorldNeedsUpdate=this.matrixAutoUpdate=!0;this.quaternion=new THREE.Quaternion;this.useQuaternion=
!1;this.visible=!0;this.receiveShadow=this.castShadow=!1;this.frustumCulled=!0;this.userData={}};
THREE.Object3D.prototype={constructor:THREE.Object3D,applyMatrix:function(){var a=new THREE.Matrix4;return function(b){this.matrix.multiplyMatrices(b,this.matrix);this.position.getPositionFromMatrix(this.matrix);this.scale.getScaleFromMatrix(this.matrix);a.extractRotation(this.matrix);!0===this.useQuaternion?this.quaternion.setFromRotationMatrix(a):this.rotation.setEulerFromRotationMatrix(a,this.eulerOrder)}}(),rotateOnAxis:function(){var a=new THREE.Quaternion,b=new THREE.Quaternion;return function(c,
d){a.setFromAxisAngle(c,d);!0===this.useQuaternion?this.quaternion.multiply(a):(b.setFromEuler(this.rotation,this.eulerOrder),b.multiply(a),this.rotation.setEulerFromQuaternion(b,this.eulerOrder));return this}}(),translateOnAxis:function(){var a=new THREE.Vector3;return function(b,c){a.copy(b);!0===this.useQuaternion?a.applyQuaternion(this.quaternion):a.applyEuler(this.rotation,this.eulerOrder);this.position.add(a.multiplyScalar(c));return this}}(),translate:function(a,b){console.warn("DEPRECATED: Object3D's .translate() has been removed. Use .translateOnAxis( axis, distance ) instead. Note args have been changed.");
return this.translateOnAxis(b,a)},translateX:function(){var a=new THREE.Vector3(1,0,0);return function(b){return this.translateOnAxis(a,b)}}(),translateY:function(){var a=new THREE.Vector3(0,1,0);return function(b){return this.translateOnAxis(a,b)}}(),translateZ:function(){var a=new THREE.Vector3(0,0,1);return function(b){return this.translateOnAxis(a,b)}}(),localToWorld:function(a){return a.applyMatrix4(this.matrixWorld)},worldToLocal:function(){var a=new THREE.Matrix4;return function(b){return b.applyMatrix4(a.getInverse(this.matrixWorld))}}(),
lookAt:function(){var a=new THREE.Matrix4;return function(b){a.lookAt(b,this.position,this.up);!0===this.useQuaternion?this.quaternion.setFromRotationMatrix(a):this.rotation.setEulerFromRotationMatrix(a,this.eulerOrder)}}(),add:function(a){if(a===this)console.warn("THREE.Object3D.add: An object can't be added as a child of itself.");else if(a instanceof THREE.Object3D){void 0!==a.parent&&a.parent.remove(a);a.parent=this;this.children.push(a);for(var b=this;void 0!==b.parent;)b=b.parent;void 0!==b&&
b instanceof THREE.Scene&&b.__addObject(a)}},remove:function(a){var b=this.children.indexOf(a);if(-1!==b){a.parent=void 0;this.children.splice(b,1);for(b=this;void 0!==b.parent;)b=b.parent;void 0!==b&&b instanceof THREE.Scene&&b.__removeObject(a)}},traverse:function(a){a(this);for(var b=0,c=this.children.length;b<c;b++)this.children[b].traverse(a)},getObjectById:function(a,b){for(var c=0,d=this.children.length;c<d;c++){var e=this.children[c];if(e.id===a||!0===b&&(e=e.getObjectById(a,b),void 0!==e))return e}},
getObjectByName:function(a,b){for(var c=0,d=this.children.length;c<d;c++){var e=this.children[c];if(e.name===a||!0===b&&(e=e.getObjectByName(a,b),void 0!==e))return e}},getChildByName:function(a,b){console.warn("DEPRECATED: Object3D's .getChildByName() has been renamed to .getObjectByName().");return this.getObjectByName(a,b)},getDescendants:function(a){void 0===a&&(a=[]);Array.prototype.push.apply(a,this.children);for(var b=0,c=this.children.length;b<c;b++)this.children[b].getDescendants(a);return a},
updateMatrix:function(){!1===this.useQuaternion?this.matrix.makeFromPositionEulerScale(this.position,this.rotation,this.eulerOrder,this.scale):this.matrix.makeFromPositionQuaternionScale(this.position,this.quaternion,this.scale);this.matrixWorldNeedsUpdate=!0},updateMatrixWorld:function(a){!0===this.matrixAutoUpdate&&this.updateMatrix();if(!0===this.matrixWorldNeedsUpdate||!0===a)void 0===this.parent?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),
this.matrixWorldNeedsUpdate=!1,a=!0;for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)},clone:function(a){void 0===a&&(a=new THREE.Object3D);a.name=this.name;a.up.copy(this.up);a.position.copy(this.position);a.rotation instanceof THREE.Vector3&&a.rotation.copy(this.rotation);a.eulerOrder=this.eulerOrder;a.scale.copy(this.scale);a.renderDepth=this.renderDepth;a.rotationAutoUpdate=this.rotationAutoUpdate;a.matrix.copy(this.matrix);a.matrixWorld.copy(this.matrixWorld);a.matrixAutoUpdate=
this.matrixAutoUpdate;a.matrixWorldNeedsUpdate=this.matrixWorldNeedsUpdate;a.quaternion.copy(this.quaternion);a.useQuaternion=this.useQuaternion;a.visible=this.visible;a.castShadow=this.castShadow;a.receiveShadow=this.receiveShadow;a.frustumCulled=this.frustumCulled;a.userData=JSON.parse(JSON.stringify(this.userData));for(var b=0;b<this.children.length;b++)a.add(this.children[b].clone());return a}};THREE.Object3D.defaultEulerOrder="XYZ";THREE.Object3DIdCount=0;THREE.Projector=function(){function a(){if(f===h){var a=new THREE.RenderableObject;g.push(a);h++;f++;return a}return g[f++]}function b(){if(j===p){var a=new THREE.RenderableVertex;m.push(a);p++;j++;return a}return m[j++]}function c(a,b){return b.z-a.z}function d(a,b){var c=0,d=1,e=a.z+a.w,f=b.z+b.w,g=-a.z+a.w,h=-b.z+b.w;if(0<=e&&0<=f&&0<=g&&0<=h)return!0;if(0>e&&0>f||0>g&&0>h)return!1;0>e?c=Math.max(c,e/(e-f)):0>f&&(d=Math.min(d,e/(e-f)));0>g?c=Math.max(c,g/(g-h)):0>h&&(d=Math.min(d,g/(g-h)));if(d<
c)return!1;a.lerp(b,c);b.lerp(a,1-d);return!0}var e,f,g=[],h=0,i,j,m=[],p=0,l,r,s=[],n=0,q,y=[],u=0,x,t,E=[],J=0,F,z,H=[],K=0,G={objects:[],sprites:[],lights:[],elements:[]},L=new THREE.Vector3,B=new THREE.Vector4,V=new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1)),C=new THREE.Box3,I=Array(3),M=Array(4),R=new THREE.Matrix4,ea=new THREE.Matrix4,wa,Ma=new THREE.Matrix4,A=new THREE.Matrix3,ca=new THREE.Matrix3,ja=new THREE.Vector3,na=new THREE.Frustum,N=new THREE.Vector4,fa=new THREE.Vector4;
this.projectVector=function(a,b){b.matrixWorldInverse.getInverse(b.matrixWorld);ea.multiplyMatrices(b.projectionMatrix,b.matrixWorldInverse);return a.applyProjection(ea)};this.unprojectVector=function(a,b){b.projectionMatrixInverse.getInverse(b.projectionMatrix);ea.multiplyMatrices(b.matrixWorld,b.projectionMatrixInverse);return a.applyProjection(ea)};this.pickingRay=function(a,b){a.z=-1;var c=new THREE.Vector3(a.x,a.y,1);this.unprojectVector(a,b);this.unprojectVector(c,b);c.sub(a).normalize();return new THREE.Raycaster(a,
c)};this.projectScene=function(g,h,p,Ka){var qa=!1,pa,Z,ga,W,da,la,ha,ia,Qa,kb,oa,Xa,Ra;z=t=q=r=0;G.elements.length=0;!0===g.autoUpdate&&g.updateMatrixWorld();void 0===h.parent&&h.updateMatrixWorld();R.copy(h.matrixWorldInverse.getInverse(h.matrixWorld));ea.multiplyMatrices(h.projectionMatrix,R);ca.getNormalMatrix(R);na.setFromMatrix(ea);f=0;G.objects.length=0;G.sprites.length=0;G.lights.length=0;var Aa=function(b){for(var c=0,d=b.children.length;c<d;c++){var f=b.children[c];if(!1!==f.visible){if(f instanceof
THREE.Light)G.lights.push(f);else if(f instanceof THREE.Mesh||f instanceof THREE.Line){if(!1===f.frustumCulled||!0===na.intersectsObject(f))e=a(),e.object=f,null!==f.renderDepth?e.z=f.renderDepth:(L.getPositionFromMatrix(f.matrixWorld),L.applyProjection(ea),e.z=L.z),G.objects.push(e)}else f instanceof THREE.Sprite||f instanceof THREE.Particle?(e=a(),e.object=f,null!==f.renderDepth?e.z=f.renderDepth:(L.getPositionFromMatrix(f.matrixWorld),L.applyProjection(ea),e.z=L.z),G.sprites.push(e)):(e=a(),e.object=
f,null!==f.renderDepth?e.z=f.renderDepth:(L.getPositionFromMatrix(f.matrixWorld),L.applyProjection(ea),e.z=L.z),G.objects.push(e));Aa(f)}}};Aa(g);!0===p&&G.objects.sort(c);g=0;for(p=G.objects.length;g<p;g++)if(ia=G.objects[g].object,wa=ia.matrixWorld,j=0,ia instanceof THREE.Mesh){Qa=ia.geometry;ga=Qa.vertices;kb=Qa.faces;Qa=Qa.faceVertexUvs;A.getNormalMatrix(wa);Xa=ia.material instanceof THREE.MeshFaceMaterial;Ra=!0===Xa?ia.material:null;pa=0;for(Z=ga.length;pa<Z;pa++)i=b(),i.positionWorld.copy(ga[pa]).applyMatrix4(wa),
i.positionScreen.copy(i.positionWorld).applyMatrix4(ea),i.positionScreen.x/=i.positionScreen.w,i.positionScreen.y/=i.positionScreen.w,i.positionScreen.z/=i.positionScreen.w,i.visible=!(-1>i.positionScreen.x||1<i.positionScreen.x||-1>i.positionScreen.y||1<i.positionScreen.y||-1>i.positionScreen.z||1<i.positionScreen.z);ga=0;for(pa=kb.length;ga<pa;ga++){Z=kb[ga];var Sa=!0===Xa?Ra.materials[Z.materialIndex]:ia.material;if(void 0!==Sa){la=Sa.side;if(Z instanceof THREE.Face3)if(W=m[Z.a],da=m[Z.b],ha=m[Z.c],
I[0]=W.positionScreen,I[1]=da.positionScreen,I[2]=ha.positionScreen,!0===W.visible||!0===da.visible||!0===ha.visible||V.isIntersectionBox(C.setFromPoints(I)))if(qa=0>(ha.positionScreen.x-W.positionScreen.x)*(da.positionScreen.y-W.positionScreen.y)-(ha.positionScreen.y-W.positionScreen.y)*(da.positionScreen.x-W.positionScreen.x),la===THREE.DoubleSide||qa===(la===THREE.FrontSide))r===n?(oa=new THREE.RenderableFace3,s.push(oa),n++,r++,l=oa):l=s[r++],l.v1.copy(W),l.v2.copy(da),l.v3.copy(ha);else continue;
else continue;else if(Z instanceof THREE.Face4)if(W=m[Z.a],da=m[Z.b],ha=m[Z.c],oa=m[Z.d],M[0]=W.positionScreen,M[1]=da.positionScreen,M[2]=ha.positionScreen,M[3]=oa.positionScreen,!0===W.visible||!0===da.visible||!0===ha.visible||!0===oa.visible||V.isIntersectionBox(C.setFromPoints(M)))if(qa=0>(oa.positionScreen.x-W.positionScreen.x)*(da.positionScreen.y-W.positionScreen.y)-(oa.positionScreen.y-W.positionScreen.y)*(da.positionScreen.x-W.positionScreen.x)||0>(da.positionScreen.x-ha.positionScreen.x)*
(oa.positionScreen.y-ha.positionScreen.y)-(da.positionScreen.y-ha.positionScreen.y)*(oa.positionScreen.x-ha.positionScreen.x),la===THREE.DoubleSide||qa===(la===THREE.FrontSide)){if(q===u){var sb=new THREE.RenderableFace4;y.push(sb);u++;q++;l=sb}else l=y[q++];l.v1.copy(W);l.v2.copy(da);l.v3.copy(ha);l.v4.copy(oa)}else continue;else continue;l.normalModel.copy(Z.normal);!1===qa&&(la===THREE.BackSide||la===THREE.DoubleSide)&&l.normalModel.negate();l.normalModel.applyMatrix3(A).normalize();l.normalModelView.copy(l.normalModel).applyMatrix3(ca);
l.centroidModel.copy(Z.centroid).applyMatrix4(wa);ha=Z.vertexNormals;W=0;for(da=ha.length;W<da;W++)oa=l.vertexNormalsModel[W],oa.copy(ha[W]),!1===qa&&(la===THREE.BackSide||la===THREE.DoubleSide)&&oa.negate(),oa.applyMatrix3(A).normalize(),l.vertexNormalsModelView[W].copy(oa).applyMatrix3(ca);l.vertexNormalsLength=ha.length;W=0;for(da=Qa.length;W<da;W++)if(oa=Qa[W][ga],void 0!==oa){la=0;for(ha=oa.length;la<ha;la++)l.uvs[W][la]=oa[la]}l.color=Z.color;l.material=Sa;ja.copy(l.centroidModel).applyProjection(ea);
l.z=ja.z;G.elements.push(l)}}}else if(ia instanceof THREE.Line){Ma.multiplyMatrices(ea,wa);ga=ia.geometry.vertices;W=b();W.positionScreen.copy(ga[0]).applyMatrix4(Ma);kb=ia.type===THREE.LinePieces?2:1;pa=1;for(Z=ga.length;pa<Z;pa++)W=b(),W.positionScreen.copy(ga[pa]).applyMatrix4(Ma),0<(pa+1)%kb||(da=m[j-2],N.copy(W.positionScreen),fa.copy(da.positionScreen),!0===d(N,fa)&&(N.multiplyScalar(1/N.w),fa.multiplyScalar(1/fa.w),t===J?(Qa=new THREE.RenderableLine,E.push(Qa),J++,t++,x=Qa):x=E[t++],x.v1.positionScreen.copy(N),
x.v2.positionScreen.copy(fa),x.z=Math.max(N.z,fa.z),x.material=ia.material,ia.material.vertexColors===THREE.VertexColors&&(x.vertexColors[0].copy(ia.geometry.colors[pa]),x.vertexColors[1].copy(ia.geometry.colors[pa-1])),G.elements.push(x)))}g=0;for(p=G.sprites.length;g<p;g++)ia=G.sprites[g].object,wa=ia.matrixWorld,ia instanceof THREE.Particle&&(B.set(wa.elements[12],wa.elements[13],wa.elements[14],1),B.applyMatrix4(ea),B.z/=B.w,0<B.z&&1>B.z&&(z===K?(qa=new THREE.RenderableParticle,H.push(qa),K++,
z++,F=qa):F=H[z++],F.object=ia,F.x=B.x/B.w,F.y=B.y/B.w,F.z=B.z,F.rotation=ia.rotation.z,F.scale.x=ia.scale.x*Math.abs(F.x-(B.x+h.projectionMatrix.elements[0])/(B.w+h.projectionMatrix.elements[12])),F.scale.y=ia.scale.y*Math.abs(F.y-(B.y+h.projectionMatrix.elements[5])/(B.w+h.projectionMatrix.elements[13])),F.material=ia.material,G.elements.push(F)));!0===Ka&&G.elements.sort(c);return G}};THREE.Face3=function(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.color=e instanceof THREE.Color?e:new THREE.Color;this.vertexColors=e instanceof Array?e:[];this.vertexTangents=[];this.materialIndex=void 0!==f?f:0;this.centroid=new THREE.Vector3};
THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var a=new THREE.Face3(this.a,this.b,this.c);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.Face4=function(a,b,c,d,e,f,g){this.a=a;this.b=b;this.c=c;this.d=d;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.color=f instanceof THREE.Color?f:new THREE.Color;this.vertexColors=f instanceof Array?f:[];this.vertexTangents=[];this.materialIndex=void 0!==g?g:0;this.centroid=new THREE.Vector3};
THREE.Face4.prototype={constructor:THREE.Face4,clone:function(){var a=new THREE.Face4(this.a,this.b,this.c,this.d);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.Geometry=function(){this.id=THREE.GeometryIdCount++;this.name="";this.vertices=[];this.colors=[];this.normals=[];this.faces=[];this.faceUvs=[[]];this.faceVertexUvs=[[]];this.morphTargets=[];this.morphColors=[];this.morphNormals=[];this.skinWeights=[];this.skinIndices=[];this.lineDistances=[];this.boundingSphere=this.boundingBox=null;this.hasTangents=!1;this.dynamic=!0;this.buffersNeedUpdate=this.lineDistancesNeedUpdate=this.colorsNeedUpdate=this.tangentsNeedUpdate=this.normalsNeedUpdate=this.uvsNeedUpdate=
this.elementsNeedUpdate=this.verticesNeedUpdate=!1};
THREE.Geometry.prototype={constructor:THREE.Geometry,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,applyMatrix:function(a){for(var b=(new THREE.Matrix3).getNormalMatrix(a),c=0,d=this.vertices.length;c<d;c++)this.vertices[c].applyMatrix4(a);c=0;for(d=this.faces.length;c<d;c++){var e=
this.faces[c];e.normal.applyMatrix3(b).normalize();for(var f=0,g=e.vertexNormals.length;f<g;f++)e.vertexNormals[f].applyMatrix3(b).normalize();e.centroid.applyMatrix4(a)}},computeCentroids:function(){var a,b,c;a=0;for(b=this.faces.length;a<b;a++)c=this.faces[a],c.centroid.set(0,0,0),c instanceof THREE.Face3?(c.centroid.add(this.vertices[c.a]),c.centroid.add(this.vertices[c.b]),c.centroid.add(this.vertices[c.c]),c.centroid.divideScalar(3)):c instanceof THREE.Face4&&(c.centroid.add(this.vertices[c.a]),
c.centroid.add(this.vertices[c.b]),c.centroid.add(this.vertices[c.c]),c.centroid.add(this.vertices[c.d]),c.centroid.divideScalar(4))},computeFaceNormals:function(){for(var a=new THREE.Vector3,b=new THREE.Vector3,c=0,d=this.faces.length;c<d;c++){var e=this.faces[c],f=this.vertices[e.a],g=this.vertices[e.b];a.subVectors(this.vertices[e.c],g);b.subVectors(f,g);a.cross(b);a.normalize();e.normal.copy(a)}},computeVertexNormals:function(a){var b,c,d,e;if(void 0===this.__tmpVertices){e=this.__tmpVertices=
Array(this.vertices.length);b=0;for(c=this.vertices.length;b<c;b++)e[b]=new THREE.Vector3;b=0;for(c=this.faces.length;b<c;b++)d=this.faces[b],d instanceof THREE.Face3?d.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]:d instanceof THREE.Face4&&(d.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3])}else{e=this.__tmpVertices;b=0;for(c=this.vertices.length;b<c;b++)e[b].set(0,0,0)}if(a){var f,g,h,i=new THREE.Vector3,j=new THREE.Vector3,m=new THREE.Vector3,
p=new THREE.Vector3,l=new THREE.Vector3;b=0;for(c=this.faces.length;b<c;b++)d=this.faces[b],d instanceof THREE.Face3?(a=this.vertices[d.a],f=this.vertices[d.b],g=this.vertices[d.c],i.subVectors(g,f),j.subVectors(a,f),i.cross(j),e[d.a].add(i),e[d.b].add(i),e[d.c].add(i)):d instanceof THREE.Face4&&(a=this.vertices[d.a],f=this.vertices[d.b],g=this.vertices[d.c],h=this.vertices[d.d],m.subVectors(h,f),j.subVectors(a,f),m.cross(j),e[d.a].add(m),e[d.b].add(m),e[d.d].add(m),p.subVectors(h,g),l.subVectors(f,
g),p.cross(l),e[d.b].add(p),e[d.c].add(p),e[d.d].add(p))}else{b=0;for(c=this.faces.length;b<c;b++)d=this.faces[b],d instanceof THREE.Face3?(e[d.a].add(d.normal),e[d.b].add(d.normal),e[d.c].add(d.normal)):d instanceof THREE.Face4&&(e[d.a].add(d.normal),e[d.b].add(d.normal),e[d.c].add(d.normal),e[d.d].add(d.normal))}b=0;for(c=this.vertices.length;b<c;b++)e[b].normalize();b=0;for(c=this.faces.length;b<c;b++)d=this.faces[b],d instanceof THREE.Face3?(d.vertexNormals[0].copy(e[d.a]),d.vertexNormals[1].copy(e[d.b]),
d.vertexNormals[2].copy(e[d.c])):d instanceof THREE.Face4&&(d.vertexNormals[0].copy(e[d.a]),d.vertexNormals[1].copy(e[d.b]),d.vertexNormals[2].copy(e[d.c]),d.vertexNormals[3].copy(e[d.d]))},computeMorphNormals:function(){var a,b,c,d,e;c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];e.__originalFaceNormal?e.__originalFaceNormal.copy(e.normal):e.__originalFaceNormal=e.normal.clone();e.__originalVertexNormals||(e.__originalVertexNormals=[]);a=0;for(b=e.vertexNormals.length;a<b;a++)e.__originalVertexNormals[a]?
e.__originalVertexNormals[a].copy(e.vertexNormals[a]):e.__originalVertexNormals[a]=e.vertexNormals[a].clone()}var f=new THREE.Geometry;f.faces=this.faces;a=0;for(b=this.morphTargets.length;a<b;a++){if(!this.morphNormals[a]){this.morphNormals[a]={};this.morphNormals[a].faceNormals=[];this.morphNormals[a].vertexNormals=[];var g=this.morphNormals[a].faceNormals,h=this.morphNormals[a].vertexNormals,i,j;c=0;for(d=this.faces.length;c<d;c++)e=this.faces[c],i=new THREE.Vector3,j=e instanceof THREE.Face3?
{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3}:{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3,d:new THREE.Vector3},g.push(i),h.push(j)}g=this.morphNormals[a];f.vertices=this.morphTargets[a].vertices;f.computeFaceNormals();f.computeVertexNormals();c=0;for(d=this.faces.length;c<d;c++)e=this.faces[c],i=g.faceNormals[c],j=g.vertexNormals[c],i.copy(e.normal),e instanceof THREE.Face3?(j.a.copy(e.vertexNormals[0]),j.b.copy(e.vertexNormals[1]),j.c.copy(e.vertexNormals[2])):(j.a.copy(e.vertexNormals[0]),
j.b.copy(e.vertexNormals[1]),j.c.copy(e.vertexNormals[2]),j.d.copy(e.vertexNormals[3]))}c=0;for(d=this.faces.length;c<d;c++)e=this.faces[c],e.normal=e.__originalFaceNormal,e.vertexNormals=e.__originalVertexNormals},computeTangents:function(){function a(a,b,c,d,e,f,z){h=a.vertices[b];i=a.vertices[c];j=a.vertices[d];m=g[e];p=g[f];l=g[z];r=i.x-h.x;s=j.x-h.x;n=i.y-h.y;q=j.y-h.y;y=i.z-h.z;u=j.z-h.z;x=p.x-m.x;t=l.x-m.x;E=p.y-m.y;J=l.y-m.y;F=1/(x*J-t*E);G.set((J*r-E*s)*F,(J*n-E*q)*F,(J*y-E*u)*F);L.set((x*
s-t*r)*F,(x*q-t*n)*F,(x*u-t*y)*F);H[b].add(G);H[c].add(G);H[d].add(G);K[b].add(L);K[c].add(L);K[d].add(L)}var b,c,d,e,f,g,h,i,j,m,p,l,r,s,n,q,y,u,x,t,E,J,F,z,H=[],K=[],G=new THREE.Vector3,L=new THREE.Vector3,B=new THREE.Vector3,V=new THREE.Vector3,C=new THREE.Vector3;b=0;for(c=this.vertices.length;b<c;b++)H[b]=new THREE.Vector3,K[b]=new THREE.Vector3;b=0;for(c=this.faces.length;b<c;b++)f=this.faces[b],g=this.faceVertexUvs[0][b],f instanceof THREE.Face3?a(this,f.a,f.b,f.c,0,1,2):f instanceof THREE.Face4&&
(a(this,f.a,f.b,f.d,0,1,3),a(this,f.b,f.c,f.d,1,2,3));var I=["a","b","c","d"];b=0;for(c=this.faces.length;b<c;b++){f=this.faces[b];for(d=0;d<f.vertexNormals.length;d++)C.copy(f.vertexNormals[d]),e=f[I[d]],z=H[e],B.copy(z),B.sub(C.multiplyScalar(C.dot(z))).normalize(),V.crossVectors(f.vertexNormals[d],z),e=V.dot(K[e]),e=0>e?-1:1,f.vertexTangents[d]=new THREE.Vector4(B.x,B.y,B.z,e)}this.hasTangents=!0},computeLineDistances:function(){for(var a=0,b=this.vertices,c=0,d=b.length;c<d;c++)0<c&&(a+=b[c].distanceTo(b[c-
1])),this.lineDistances[c]=a},computeBoundingBox:function(){null===this.boundingBox&&(this.boundingBox=new THREE.Box3);this.boundingBox.setFromPoints(this.vertices)},computeBoundingSphere:function(){null===this.boundingSphere&&(this.boundingSphere=new THREE.Sphere);this.boundingSphere.setFromCenterAndPoints(this.boundingSphere.center,this.vertices)},mergeVertices:function(){var a={},b=[],c=[],d,e=Math.pow(10,4),f,g,h,i,j;this.__tmpVertices=void 0;f=0;for(g=this.vertices.length;f<g;f++)d=this.vertices[f],
d=[Math.round(d.x*e),Math.round(d.y*e),Math.round(d.z*e)].join("_"),void 0===a[d]?(a[d]=f,b.push(this.vertices[f]),c[f]=b.length-1):c[f]=c[a[d]];e=[];f=0;for(g=this.faces.length;f<g;f++)if(a=this.faces[f],a instanceof THREE.Face3){a.a=c[a.a];a.b=c[a.b];a.c=c[a.c];h=[a.a,a.b,a.c];d=-1;for(i=0;3>i;i++)if(h[i]==h[(i+1)%3]){e.push(f);break}}else if(a instanceof THREE.Face4){a.a=c[a.a];a.b=c[a.b];a.c=c[a.c];a.d=c[a.d];h=[a.a,a.b,a.c,a.d];d=-1;for(i=0;4>i;i++)h[i]==h[(i+1)%4]&&(0<=d&&e.push(f),d=i);if(0<=
d){h.splice(d,1);var m=new THREE.Face3(h[0],h[1],h[2],a.normal,a.color,a.materialIndex);h=0;for(i=this.faceVertexUvs.length;h<i;h++)(j=this.faceVertexUvs[h][f])&&j.splice(d,1);a.vertexNormals&&0<a.vertexNormals.length&&(m.vertexNormals=a.vertexNormals,m.vertexNormals.splice(d,1));a.vertexColors&&0<a.vertexColors.length&&(m.vertexColors=a.vertexColors,m.vertexColors.splice(d,1));this.faces[f]=m}}for(f=e.length-1;0<=f;f--){this.faces.splice(f,1);h=0;for(i=this.faceVertexUvs.length;h<i;h++)this.faceVertexUvs[h].splice(f,
1)}c=this.vertices.length-b.length;this.vertices=b;return c},clone:function(){for(var a=new THREE.Geometry,b=this.vertices,c=0,d=b.length;c<d;c++)a.vertices.push(b[c].clone());b=this.faces;c=0;for(d=b.length;c<d;c++)a.faces.push(b[c].clone());b=this.faceVertexUvs[0];c=0;for(d=b.length;c<d;c++){for(var e=b[c],f=[],g=0,h=e.length;g<h;g++)f.push(new THREE.Vector2(e[g].x,e[g].y));a.faceVertexUvs[0].push(f)}return a},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.GeometryIdCount=0;THREE.BufferGeometry=function(){this.id=THREE.GeometryIdCount++;this.attributes={};this.dynamic=!1;this.offsets=[];this.boundingSphere=this.boundingBox=null;this.hasTangents=!1;this.morphTargets=[]};
THREE.BufferGeometry.prototype={constructor:THREE.BufferGeometry,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,applyMatrix:function(a){var b,c;this.attributes.position&&(b=this.attributes.position.array);this.attributes.normal&&(c=this.attributes.normal.array);void 0!==b&&(a.multiplyVector3Array(b),
this.verticesNeedUpdate=!0);void 0!==c&&((new THREE.Matrix3).getNormalMatrix(a).multiplyVector3Array(c),this.normalizeNormals(),this.normalsNeedUpdate=!0)},computeBoundingBox:function(){null===this.boundingBox&&(this.boundingBox=new THREE.Box3);var a=this.attributes.position.array;if(a){var b=this.boundingBox,c,d,e;3<=a.length&&(b.min.x=b.max.x=a[0],b.min.y=b.max.y=a[1],b.min.z=b.max.z=a[2]);for(var f=3,g=a.length;f<g;f+=3)c=a[f],d=a[f+1],e=a[f+2],c<b.min.x?b.min.x=c:c>b.max.x&&(b.max.x=c),d<b.min.y?
b.min.y=d:d>b.max.y&&(b.max.y=d),e<b.min.z?b.min.z=e:e>b.max.z&&(b.max.z=e)}if(void 0===a||0===a.length)this.boundingBox.min.set(0,0,0),this.boundingBox.max.set(0,0,0)},computeBoundingSphere:function(){null===this.boundingSphere&&(this.boundingSphere=new THREE.Sphere);var a=this.attributes.position.array;if(a){for(var b,c=0,d,e,f=0,g=a.length;f<g;f+=3)b=a[f],d=a[f+1],e=a[f+2],b=b*b+d*d+e*e,b>c&&(c=b);this.boundingSphere.radius=Math.sqrt(c)}},computeVertexNormals:function(){if(this.attributes.position){var a,
b,c,d;a=this.attributes.position.array.length;if(void 0===this.attributes.normal)this.attributes.normal={itemSize:3,array:new Float32Array(a),numItems:a};else{a=0;for(b=this.attributes.normal.array.length;a<b;a++)this.attributes.normal.array[a]=0}var e=this.attributes.position.array,f=this.attributes.normal.array,g,h,i,j,m,p,l=new THREE.Vector3,r=new THREE.Vector3,s=new THREE.Vector3,n=new THREE.Vector3,q=new THREE.Vector3;if(this.attributes.index){var y=this.attributes.index.array,u=this.offsets;
c=0;for(d=u.length;c<d;++c){b=u[c].start;g=u[c].count;var x=u[c].index;a=b;for(b+=g;a<b;a+=3)g=x+y[a],h=x+y[a+1],i=x+y[a+2],j=e[3*g],m=e[3*g+1],p=e[3*g+2],l.set(j,m,p),j=e[3*h],m=e[3*h+1],p=e[3*h+2],r.set(j,m,p),j=e[3*i],m=e[3*i+1],p=e[3*i+2],s.set(j,m,p),n.subVectors(s,r),q.subVectors(l,r),n.cross(q),f[3*g]+=n.x,f[3*g+1]+=n.y,f[3*g+2]+=n.z,f[3*h]+=n.x,f[3*h+1]+=n.y,f[3*h+2]+=n.z,f[3*i]+=n.x,f[3*i+1]+=n.y,f[3*i+2]+=n.z}}else{a=0;for(b=e.length;a<b;a+=9)j=e[a],m=e[a+1],p=e[a+2],l.set(j,m,p),j=e[a+
3],m=e[a+4],p=e[a+5],r.set(j,m,p),j=e[a+6],m=e[a+7],p=e[a+8],s.set(j,m,p),n.subVectors(s,r),q.subVectors(l,r),n.cross(q),f[a]=n.x,f[a+1]=n.y,f[a+2]=n.z,f[a+3]=n.x,f[a+4]=n.y,f[a+5]=n.z,f[a+6]=n.x,f[a+7]=n.y,f[a+8]=n.z}this.normalizeNormals();this.normalsNeedUpdate=!0}},normalizeNormals:function(){for(var a=this.attributes.normal.array,b,c,d,e=0,f=a.length;e<f;e+=3)b=a[e],c=a[e+1],d=a[e+2],b=1/Math.sqrt(b*b+c*c+d*d),a[e]*=b,a[e+1]*=b,a[e+2]*=b},computeTangents:function(){function a(a){wa.x=d[3*a];
wa.y=d[3*a+1];wa.z=d[3*a+2];Ma.copy(wa);ca=i[a];R.copy(ca);R.sub(wa.multiplyScalar(wa.dot(ca))).normalize();ea.crossVectors(Ma,ca);ja=ea.dot(j[a]);A=0>ja?-1:1;h[4*a]=R.x;h[4*a+1]=R.y;h[4*a+2]=R.z;h[4*a+3]=A}if(void 0===this.attributes.index||void 0===this.attributes.position||void 0===this.attributes.normal||void 0===this.attributes.uv)console.warn("Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");else{var b=this.attributes.index.array,c=this.attributes.position.array,
d=this.attributes.normal.array,e=this.attributes.uv.array,f=c.length/3;if(void 0===this.attributes.tangent){var g=4*f;this.attributes.tangent={itemSize:4,array:new Float32Array(g),numItems:g}}for(var h=this.attributes.tangent.array,i=[],j=[],g=0;g<f;g++)i[g]=new THREE.Vector3,j[g]=new THREE.Vector3;var m,p,l,r,s,n,q,y,u,x,t,E,J,F,z,f=new THREE.Vector3,g=new THREE.Vector3,H,K,G,L,B,V,C,I=this.offsets;G=0;for(L=I.length;G<L;++G){K=I[G].start;B=I[G].count;var M=I[G].index;H=K;for(K+=B;H<K;H+=3)B=M+b[H],
V=M+b[H+1],C=M+b[H+2],m=c[3*B],p=c[3*B+1],l=c[3*B+2],r=c[3*V],s=c[3*V+1],n=c[3*V+2],q=c[3*C],y=c[3*C+1],u=c[3*C+2],x=e[2*B],t=e[2*B+1],E=e[2*V],J=e[2*V+1],F=e[2*C],z=e[2*C+1],r-=m,m=q-m,s-=p,p=y-p,n-=l,l=u-l,E-=x,x=F-x,J-=t,t=z-t,z=1/(E*t-x*J),f.set((t*r-J*m)*z,(t*s-J*p)*z,(t*n-J*l)*z),g.set((E*m-x*r)*z,(E*p-x*s)*z,(E*l-x*n)*z),i[B].add(f),i[V].add(f),i[C].add(f),j[B].add(g),j[V].add(g),j[C].add(g)}var R=new THREE.Vector3,ea=new THREE.Vector3,wa=new THREE.Vector3,Ma=new THREE.Vector3,A,ca,ja;G=0;
for(L=I.length;G<L;++G){K=I[G].start;B=I[G].count;M=I[G].index;H=K;for(K+=B;H<K;H+=3)B=M+b[H],V=M+b[H+1],C=M+b[H+2],a(B),a(V),a(C)}this.tangentsNeedUpdate=this.hasTangents=!0}},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.Camera=function(){THREE.Object3D.call(this);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=new THREE.Matrix4;this.projectionMatrixInverse=new THREE.Matrix4};THREE.Camera.prototype=Object.create(THREE.Object3D.prototype);THREE.Camera.prototype.lookAt=function(){var a=new THREE.Matrix4;return function(b){a.lookAt(this.position,b,this.up);!0===this.useQuaternion?this.quaternion.setFromRotationMatrix(a):this.rotation.setEulerFromRotationMatrix(a,this.eulerOrder)}}();THREE.OrthographicCamera=function(a,b,c,d,e,f){THREE.Camera.call(this);this.left=a;this.right=b;this.top=c;this.bottom=d;this.near=void 0!==e?e:0.1;this.far=void 0!==f?f:2E3;this.updateProjectionMatrix()};THREE.OrthographicCamera.prototype=Object.create(THREE.Camera.prototype);THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix.makeOrthographic(this.left,this.right,this.top,this.bottom,this.near,this.far)};THREE.PerspectiveCamera=function(a,b,c,d){THREE.Camera.call(this);this.fov=void 0!==a?a:50;this.aspect=void 0!==b?b:1;this.near=void 0!==c?c:0.1;this.far=void 0!==d?d:2E3;this.updateProjectionMatrix()};THREE.PerspectiveCamera.prototype=Object.create(THREE.Camera.prototype);THREE.PerspectiveCamera.prototype.setLens=function(a,b){void 0===b&&(b=24);this.fov=2*THREE.Math.radToDeg(Math.atan(b/(2*a)));this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.setViewOffset=function(a,b,c,d,e,f){this.fullWidth=a;this.fullHeight=b;this.x=c;this.y=d;this.width=e;this.height=f;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var a=this.fullWidth/this.fullHeight,b=Math.tan(THREE.Math.degToRad(0.5*this.fov))*this.near,c=-b,d=a*c,a=Math.abs(a*b-d),c=Math.abs(b-c);this.projectionMatrix.makeFrustum(d+this.x*a/this.fullWidth,d+(this.x+this.width)*a/this.fullWidth,b-(this.y+this.height)*c/this.fullHeight,b-this.y*c/this.fullHeight,this.near,this.far)}else this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far)};THREE.Light=function(a){THREE.Object3D.call(this);this.color=new THREE.Color(a)};THREE.Light.prototype=Object.create(THREE.Object3D.prototype);THREE.Light.prototype.clone=function(a){void 0===a&&(a=new THREE.Light);THREE.Object3D.prototype.clone.call(this,a);a.color.copy(this.color);return a};THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=Object.create(THREE.Light.prototype);THREE.AmbientLight.prototype.clone=function(){var a=new THREE.AmbientLight;THREE.Light.prototype.clone.call(this,a);return a};THREE.AreaLight=function(a,b){THREE.Light.call(this,a);this.normal=new THREE.Vector3(0,-1,0);this.right=new THREE.Vector3(1,0,0);this.intensity=void 0!==b?b:1;this.height=this.width=1;this.constantAttenuation=1.5;this.linearAttenuation=0.5;this.quadraticAttenuation=0.1};THREE.AreaLight.prototype=Object.create(THREE.Light.prototype);THREE.DirectionalLight=function(a,b){THREE.Light.call(this,a);this.position.set(0,1,0);this.target=new THREE.Object3D;this.intensity=void 0!==b?b:1;this.onlyShadow=this.castShadow=!1;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraLeft=-500;this.shadowCameraTop=this.shadowCameraRight=500;this.shadowCameraBottom=-500;this.shadowCameraVisible=!1;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowCascade=!1;this.shadowCascadeOffset=new THREE.Vector3(0,
0,-1E3);this.shadowCascadeCount=2;this.shadowCascadeBias=[0,0,0];this.shadowCascadeWidth=[512,512,512];this.shadowCascadeHeight=[512,512,512];this.shadowCascadeNearZ=[-1,0.99,0.998];this.shadowCascadeFarZ=[0.99,0.998,1];this.shadowCascadeArray=[];this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.DirectionalLight.prototype=Object.create(THREE.Light.prototype);
THREE.DirectionalLight.prototype.clone=function(){var a=new THREE.DirectionalLight;THREE.Light.prototype.clone.call(this,a);a.target=this.target.clone();a.intensity=this.intensity;a.castShadow=this.castShadow;a.onlyShadow=this.onlyShadow;return a};THREE.HemisphereLight=function(a,b,c){THREE.Light.call(this,a);this.position.set(0,100,0);this.groundColor=new THREE.Color(b);this.intensity=void 0!==c?c:1};THREE.HemisphereLight.prototype=Object.create(THREE.Light.prototype);THREE.HemisphereLight.prototype.clone=function(){var a=new THREE.PointLight;THREE.Light.prototype.clone.call(this,a);a.groundColor.copy(this.groundColor);a.intensity=this.intensity;return a};THREE.PointLight=function(a,b,c){THREE.Light.call(this,a);this.intensity=void 0!==b?b:1;this.distance=void 0!==c?c:0};THREE.PointLight.prototype=Object.create(THREE.Light.prototype);THREE.PointLight.prototype.clone=function(){var a=new THREE.PointLight;THREE.Light.prototype.clone.call(this,a);a.intensity=this.intensity;a.distance=this.distance;return a};THREE.SpotLight=function(a,b,c,d,e){THREE.Light.call(this,a);this.position.set(0,1,0);this.target=new THREE.Object3D;this.intensity=void 0!==b?b:1;this.distance=void 0!==c?c:0;this.angle=void 0!==d?d:Math.PI/3;this.exponent=void 0!==e?e:10;this.onlyShadow=this.castShadow=!1;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraFov=50;this.shadowCameraVisible=!1;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowMatrix=this.shadowCamera=this.shadowMapSize=
this.shadowMap=null};THREE.SpotLight.prototype=Object.create(THREE.Light.prototype);THREE.SpotLight.prototype.clone=function(){var a=new THREE.SpotLight;THREE.Light.prototype.clone.call(this,a);a.target=this.target.clone();a.intensity=this.intensity;a.distance=this.distance;a.angle=this.angle;a.exponent=this.exponent;a.castShadow=this.castShadow;a.onlyShadow=this.onlyShadow;return a};THREE.Loader=function(a){this.statusDomElement=(this.showStatus=a)?THREE.Loader.prototype.addStatusElement():null;this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){}};
THREE.Loader.prototype={constructor:THREE.Loader,crossOrigin:"anonymous",addStatusElement:function(){var a=document.createElement("div");a.style.position="absolute";a.style.right="0px";a.style.top="0px";a.style.fontSize="0.8em";a.style.textAlign="left";a.style.background="rgba(0,0,0,0.25)";a.style.color="#fff";a.style.width="120px";a.style.padding="0.5em 0.5em 0.5em 0.5em";a.style.zIndex=1E3;a.innerHTML="Loading ...";return a},updateProgress:function(a){var b="Loaded ",b=a.total?b+((100*a.loaded/
a.total).toFixed(0)+"%"):b+((a.loaded/1E3).toFixed(2)+" KB");this.statusDomElement.innerHTML=b},extractUrlBase:function(a){a=a.split("/");a.pop();return(1>a.length?".":a.join("/"))+"/"},initMaterials:function(a,b){for(var c=[],d=0;d<a.length;++d)c[d]=THREE.Loader.prototype.createMaterial(a[d],b);return c},needsTangents:function(a){for(var b=0,c=a.length;b<c;b++)if(a[b]instanceof THREE.ShaderMaterial)return!0;return!1},createMaterial:function(a,b){function c(a){a=Math.log(a)/Math.LN2;return Math.floor(a)==
a}function d(a){a=Math.log(a)/Math.LN2;return Math.pow(2,Math.round(a))}function e(a,e,f,h,i,j,q){var y=/\.dds$/i.test(f),u=b+"/"+f;if(y){var x=THREE.ImageUtils.loadCompressedTexture(u);a[e]=x}else x=document.createElement("canvas"),a[e]=new THREE.Texture(x);a[e].sourceFile=f;h&&(a[e].repeat.set(h[0],h[1]),1!==h[0]&&(a[e].wrapS=THREE.RepeatWrapping),1!==h[1]&&(a[e].wrapT=THREE.RepeatWrapping));i&&a[e].offset.set(i[0],i[1]);j&&(f={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping},void 0!==
f[j[0]]&&(a[e].wrapS=f[j[0]]),void 0!==f[j[1]]&&(a[e].wrapT=f[j[1]]));q&&(a[e].anisotropy=q);if(!y){var t=a[e],a=new Image;a.onload=function(){if(!c(this.width)||!c(this.height)){var a=d(this.width),b=d(this.height);t.image.width=a;t.image.height=b;t.image.getContext("2d").drawImage(this,0,0,a,b)}else t.image=this;t.needsUpdate=!0};a.crossOrigin=g.crossOrigin;a.src=u}}function f(a){return(255*a[0]<<16)+(255*a[1]<<8)+255*a[2]}var g=this,h="MeshLambertMaterial",i={color:15658734,opacity:1,map:null,
lightMap:null,normalMap:null,bumpMap:null,wireframe:!1};if(a.shading){var j=a.shading.toLowerCase();"phong"===j?h="MeshPhongMaterial":"basic"===j&&(h="MeshBasicMaterial")}void 0!==a.blending&&void 0!==THREE[a.blending]&&(i.blending=THREE[a.blending]);if(void 0!==a.transparent||1>a.opacity)i.transparent=a.transparent;void 0!==a.depthTest&&(i.depthTest=a.depthTest);void 0!==a.depthWrite&&(i.depthWrite=a.depthWrite);void 0!==a.visible&&(i.visible=a.visible);void 0!==a.flipSided&&(i.side=THREE.BackSide);
void 0!==a.doubleSided&&(i.side=THREE.DoubleSide);void 0!==a.wireframe&&(i.wireframe=a.wireframe);void 0!==a.vertexColors&&("face"===a.vertexColors?i.vertexColors=THREE.FaceColors:a.vertexColors&&(i.vertexColors=THREE.VertexColors));a.colorDiffuse?i.color=f(a.colorDiffuse):a.DbgColor&&(i.color=a.DbgColor);a.colorSpecular&&(i.specular=f(a.colorSpecular));a.colorAmbient&&(i.ambient=f(a.colorAmbient));a.transparency&&(i.opacity=a.transparency);a.specularCoef&&(i.shininess=a.specularCoef);a.mapDiffuse&&
b&&e(i,"map",a.mapDiffuse,a.mapDiffuseRepeat,a.mapDiffuseOffset,a.mapDiffuseWrap,a.mapDiffuseAnisotropy);a.mapLight&&b&&e(i,"lightMap",a.mapLight,a.mapLightRepeat,a.mapLightOffset,a.mapLightWrap,a.mapLightAnisotropy);a.mapBump&&b&&e(i,"bumpMap",a.mapBump,a.mapBumpRepeat,a.mapBumpOffset,a.mapBumpWrap,a.mapBumpAnisotropy);a.mapNormal&&b&&e(i,"normalMap",a.mapNormal,a.mapNormalRepeat,a.mapNormalOffset,a.mapNormalWrap,a.mapNormalAnisotropy);a.mapSpecular&&b&&e(i,"specularMap",a.mapSpecular,a.mapSpecularRepeat,
a.mapSpecularOffset,a.mapSpecularWrap,a.mapSpecularAnisotropy);a.mapBumpScale&&(i.bumpScale=a.mapBumpScale);a.mapNormal?(h=THREE.ShaderLib.normalmap,j=THREE.UniformsUtils.clone(h.uniforms),j.tNormal.value=i.normalMap,a.mapNormalFactor&&j.uNormalScale.value.set(a.mapNormalFactor,a.mapNormalFactor),i.map&&(j.tDiffuse.value=i.map,j.enableDiffuse.value=!0),i.specularMap&&(j.tSpecular.value=i.specularMap,j.enableSpecular.value=!0),i.lightMap&&(j.tAO.value=i.lightMap,j.enableAO.value=!0),j.uDiffuseColor.value.setHex(i.color),
j.uSpecularColor.value.setHex(i.specular),j.uAmbientColor.value.setHex(i.ambient),j.uShininess.value=i.shininess,void 0!==i.opacity&&(j.uOpacity.value=i.opacity),h=new THREE.ShaderMaterial({fragmentShader:h.fragmentShader,vertexShader:h.vertexShader,uniforms:j,lights:!0,fog:!0}),i.transparent&&(h.transparent=!0)):h=new THREE[h](i);void 0!==a.DbgName&&(h.name=a.DbgName);return h}};THREE.ImageLoader=function(){this.crossOrigin=null};
THREE.ImageLoader.prototype={constructor:THREE.ImageLoader,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,load:function(a,b){var c=this;void 0===b&&(b=new Image);b.addEventListener("load",function(){c.dispatchEvent({type:"load",content:b})},!1);b.addEventListener("error",function(){c.dispatchEvent({type:"error",
message:"Couldn't load URL ["+a+"]"})},!1);c.crossOrigin&&(b.crossOrigin=c.crossOrigin);b.src=a}};THREE.JSONLoader=function(a){THREE.Loader.call(this,a);this.withCredentials=!1};THREE.JSONLoader.prototype=Object.create(THREE.Loader.prototype);THREE.JSONLoader.prototype.load=function(a,b,c){c=c&&"string"===typeof c?c:this.extractUrlBase(a);this.onLoadStart();this.loadAjaxJSON(this,a,b,c)};
THREE.JSONLoader.prototype.loadAjaxJSON=function(a,b,c,d,e){var f=new XMLHttpRequest,g=0;f.onreadystatechange=function(){if(f.readyState===f.DONE)if(200===f.status||0===f.status){if(f.responseText){var h=JSON.parse(f.responseText),h=a.parse(h,d);c(h.geometry,h.materials)}else console.warn("THREE.JSONLoader: ["+b+"] seems to be unreachable or file there is empty");a.onLoadComplete()}else console.error("THREE.JSONLoader: Couldn't load ["+b+"] ["+f.status+"]");else f.readyState===f.LOADING?e&&(0===g&&
(g=f.getResponseHeader("Content-Length")),e({total:g,loaded:f.responseText.length})):f.readyState===f.HEADERS_RECEIVED&&void 0!==e&&(g=f.getResponseHeader("Content-Length"))};f.open("GET",b,!0);f.withCredentials=this.withCredentials;f.send(null)};
THREE.JSONLoader.prototype.parse=function(a,b){var c=new THREE.Geometry,d=void 0!==a.scale?1/a.scale:1,e,f,g,h,i,j,m,p,l,r,s,n,q,y,u,x=a.faces;r=a.vertices;var t=a.normals,E=a.colors,J=0;for(e=0;e<a.uvs.length;e++)a.uvs[e].length&&J++;for(e=0;e<J;e++)c.faceUvs[e]=[],c.faceVertexUvs[e]=[];h=0;for(i=r.length;h<i;)j=new THREE.Vector3,j.x=r[h++]*d,j.y=r[h++]*d,j.z=r[h++]*d,c.vertices.push(j);h=0;for(i=x.length;h<i;){r=x[h++];j=r&1;g=r&2;e=r&4;f=r&8;p=r&16;m=r&32;s=r&64;r&=128;j?(n=new THREE.Face4,n.a=
x[h++],n.b=x[h++],n.c=x[h++],n.d=x[h++],j=4):(n=new THREE.Face3,n.a=x[h++],n.b=x[h++],n.c=x[h++],j=3);g&&(g=x[h++],n.materialIndex=g);g=c.faces.length;if(e)for(e=0;e<J;e++)q=a.uvs[e],l=x[h++],u=q[2*l],l=q[2*l+1],c.faceUvs[e][g]=new THREE.Vector2(u,l);if(f)for(e=0;e<J;e++){q=a.uvs[e];y=[];for(f=0;f<j;f++)l=x[h++],u=q[2*l],l=q[2*l+1],y[f]=new THREE.Vector2(u,l);c.faceVertexUvs[e][g]=y}p&&(p=3*x[h++],f=new THREE.Vector3,f.x=t[p++],f.y=t[p++],f.z=t[p],n.normal=f);if(m)for(e=0;e<j;e++)p=3*x[h++],f=new THREE.Vector3,
f.x=t[p++],f.y=t[p++],f.z=t[p],n.vertexNormals.push(f);s&&(m=x[h++],m=new THREE.Color(E[m]),n.color=m);if(r)for(e=0;e<j;e++)m=x[h++],m=new THREE.Color(E[m]),n.vertexColors.push(m);c.faces.push(n)}if(a.skinWeights){h=0;for(i=a.skinWeights.length;h<i;h+=2)x=a.skinWeights[h],t=a.skinWeights[h+1],c.skinWeights.push(new THREE.Vector4(x,t,0,0))}if(a.skinIndices){h=0;for(i=a.skinIndices.length;h<i;h+=2)x=a.skinIndices[h],t=a.skinIndices[h+1],c.skinIndices.push(new THREE.Vector4(x,t,0,0))}c.bones=a.bones;
c.animation=a.animation;if(void 0!==a.morphTargets){h=0;for(i=a.morphTargets.length;h<i;h++){c.morphTargets[h]={};c.morphTargets[h].name=a.morphTargets[h].name;c.morphTargets[h].vertices=[];E=c.morphTargets[h].vertices;J=a.morphTargets[h].vertices;x=0;for(t=J.length;x<t;x+=3)r=new THREE.Vector3,r.x=J[x]*d,r.y=J[x+1]*d,r.z=J[x+2]*d,E.push(r)}}if(void 0!==a.morphColors){h=0;for(i=a.morphColors.length;h<i;h++){c.morphColors[h]={};c.morphColors[h].name=a.morphColors[h].name;c.morphColors[h].colors=[];
t=c.morphColors[h].colors;E=a.morphColors[h].colors;d=0;for(x=E.length;d<x;d+=3)J=new THREE.Color(16755200),J.setRGB(E[d],E[d+1],E[d+2]),t.push(J)}}c.computeCentroids();c.computeFaceNormals();if(void 0===a.materials)return{geometry:c};d=this.initMaterials(a.materials,b);this.needsTangents(d)&&c.computeTangents();return{geometry:c,materials:d}};THREE.LoadingMonitor=function(){var a=this,b=0,c=0,d=function(){b++;a.dispatchEvent({type:"progress",loaded:b,total:c});b===c&&a.dispatchEvent({type:"load"})};this.add=function(a){c++;a.addEventListener("load",d,!1)}};THREE.LoadingMonitor.prototype={constructor:THREE.LoadingMonitor,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent};THREE.GeometryLoader=function(){};
THREE.GeometryLoader.prototype={constructor:THREE.GeometryLoader,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,load:function(a){var b=this,c=new XMLHttpRequest;c.addEventListener("load",function(a){a=b.parse(JSON.parse(a.target.responseText));b.dispatchEvent({type:"load",content:a})},
!1);c.addEventListener("progress",function(a){b.dispatchEvent({type:"progress",loaded:a.loaded,total:a.total})},!1);c.addEventListener("error",function(){b.dispatchEvent({type:"error",message:"Couldn't load URL ["+a+"]"})},!1);c.open("GET",a,!0);c.send(null)},parse:function(){}};THREE.MaterialLoader=function(){};
THREE.MaterialLoader.prototype={constructor:THREE.MaterialLoader,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,load:function(a){var b=this,c=new XMLHttpRequest;c.addEventListener("load",function(a){a=b.parse(JSON.parse(a.target.responseText));b.dispatchEvent({type:"load",content:a})},
!1);c.addEventListener("progress",function(a){b.dispatchEvent({type:"progress",loaded:a.loaded,total:a.total})},!1);c.addEventListener("error",function(){b.dispatchEvent({type:"error",message:"Couldn't load URL ["+a+"]"})},!1);c.open("GET",a,!0);c.send(null)},parse:function(a){var b;switch(a.type){case "MeshBasicMaterial":b=new THREE.MeshBasicMaterial({color:a.color,opacity:a.opacity,transparent:a.transparent,wireframe:a.wireframe});break;case "MeshLambertMaterial":b=new THREE.MeshLambertMaterial({color:a.color,
ambient:a.ambient,emissive:a.emissive,opacity:a.opacity,transparent:a.transparent,wireframe:a.wireframe});break;case "MeshPhongMaterial":b=new THREE.MeshPhongMaterial({color:a.color,ambient:a.ambient,emissive:a.emissive,specular:a.specular,shininess:a.shininess,opacity:a.opacity,transparent:a.transparent,wireframe:a.wireframe});break;case "MeshNormalMaterial":b=new THREE.MeshNormalMaterial({opacity:a.opacity,transparent:a.transparent,wireframe:a.wireframe});break;case "MeshDepthMaterial":b=new THREE.MeshDepthMaterial({opacity:a.opacity,
transparent:a.transparent,wireframe:a.wireframe})}return b}};THREE.SceneLoader=function(){this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){};this.callbackSync=function(){};this.callbackProgress=function(){};this.geometryHandlerMap={};this.hierarchyHandlerMap={};this.addGeometryHandler("ascii",THREE.JSONLoader)};THREE.SceneLoader.prototype.constructor=THREE.SceneLoader;
THREE.SceneLoader.prototype.load=function(a,b){var c=this,d=new XMLHttpRequest;d.onreadystatechange=function(){if(4===d.readyState)if(200===d.status||0===d.status){var e=JSON.parse(d.responseText);c.parse(e,b,a)}else console.error("THREE.SceneLoader: Couldn't load ["+a+"] ["+d.status+"]")};d.open("GET",a,!0);d.send(null)};THREE.SceneLoader.prototype.addGeometryHandler=function(a,b){this.geometryHandlerMap[a]={loaderClass:b}};
THREE.SceneLoader.prototype.addHierarchyHandler=function(a,b){this.hierarchyHandlerMap[a]={loaderClass:b}};
THREE.SceneLoader.prototype.parse=function(a,b,c){function d(a,b){return"relativeToHTML"==b?a:p+"/"+a}function e(){f(z.scene,K.objects)}function f(a,b){var c,e,g,i,j,p,n;for(n in b)if(void 0===z.objects[n]){var q=b[n],t=null;if(q.type&&q.type in m.hierarchyHandlerMap){if(void 0===q.loading){e={type:1,url:1,material:1,position:1,rotation:1,scale:1,visible:1,children:1,userData:1,skin:1,morph:1,mirroredLoop:1,duration:1};g={};for(var B in q)B in e||(g[B]=q[B]);r=z.materials[q.material];q.loading=!0;
e=m.hierarchyHandlerMap[q.type].loaderObject;e.options?e.load(d(q.url,K.urlBaseType),h(n,a,r,q)):e.load(d(q.url,K.urlBaseType),h(n,a,r,q),g)}}else if(void 0!==q.geometry){if(l=z.geometries[q.geometry]){t=!1;r=z.materials[q.material];t=r instanceof THREE.ShaderMaterial;g=q.position;i=q.rotation;j=q.scale;c=q.matrix;p=q.quaternion;q.material||(r=new THREE.MeshFaceMaterial(z.face_materials[q.geometry]));r instanceof THREE.MeshFaceMaterial&&0===r.materials.length&&(r=new THREE.MeshFaceMaterial(z.face_materials[q.geometry]));
if(r instanceof THREE.MeshFaceMaterial)for(e=0;e<r.materials.length;e++)t=t||r.materials[e]instanceof THREE.ShaderMaterial;t&&l.computeTangents();q.skin?t=new THREE.SkinnedMesh(l,r):q.morph?(t=new THREE.MorphAnimMesh(l,r),void 0!==q.duration&&(t.duration=q.duration),void 0!==q.time&&(t.time=q.time),void 0!==q.mirroredLoop&&(t.mirroredLoop=q.mirroredLoop),r.morphNormals&&l.computeMorphNormals()):t=new THREE.Mesh(l,r);t.name=n;c?(t.matrixAutoUpdate=!1,t.matrix.set(c[0],c[1],c[2],c[3],c[4],c[5],c[6],
c[7],c[8],c[9],c[10],c[11],c[12],c[13],c[14],c[15])):(t.position.set(g[0],g[1],g[2]),p?(t.quaternion.set(p[0],p[1],p[2],p[3]),t.useQuaternion=!0):t.rotation.set(i[0],i[1],i[2]),t.scale.set(j[0],j[1],j[2]));t.visible=q.visible;t.castShadow=q.castShadow;t.receiveShadow=q.receiveShadow;a.add(t);z.objects[n]=t}}else"DirectionalLight"===q.type||"PointLight"===q.type||"AmbientLight"===q.type?(u=void 0!==q.color?q.color:16777215,x=void 0!==q.intensity?q.intensity:1,"DirectionalLight"===q.type?(g=q.direction,
y=new THREE.DirectionalLight(u,x),y.position.set(g[0],g[1],g[2]),q.target&&(H.push({object:y,targetName:q.target}),y.target=null)):"PointLight"===q.type?(g=q.position,e=q.distance,y=new THREE.PointLight(u,x,e),y.position.set(g[0],g[1],g[2])):"AmbientLight"===q.type&&(y=new THREE.AmbientLight(u)),a.add(y),y.name=n,z.lights[n]=y,z.objects[n]=y):"PerspectiveCamera"===q.type||"OrthographicCamera"===q.type?(g=q.position,i=q.rotation,p=q.quaternion,"PerspectiveCamera"===q.type?s=new THREE.PerspectiveCamera(q.fov,
q.aspect,q.near,q.far):"OrthographicCamera"===q.type&&(s=new THREE.OrthographicCamera(q.left,q.right,q.top,q.bottom,q.near,q.far)),s.name=n,s.position.set(g[0],g[1],g[2]),void 0!==p?(s.quaternion.set(p[0],p[1],p[2],p[3]),s.useQuaternion=!0):void 0!==i&&s.rotation.set(i[0],i[1],i[2]),a.add(s),z.cameras[n]=s,z.objects[n]=s):(g=q.position,i=q.rotation,j=q.scale,p=q.quaternion,t=new THREE.Object3D,t.name=n,t.position.set(g[0],g[1],g[2]),p?(t.quaternion.set(p[0],p[1],p[2],p[3]),t.useQuaternion=!0):t.rotation.set(i[0],
i[1],i[2]),t.scale.set(j[0],j[1],j[2]),t.visible=void 0!==q.visible?q.visible:!1,a.add(t),z.objects[n]=t,z.empties[n]=t);if(t){if(void 0!==q.userData)for(var E in q.userData)t.userData[E]=q.userData[E];if(void 0!==q.groups)for(e=0;e<q.groups.length;e++)g=q.groups[e],void 0===z.groups[g]&&(z.groups[g]=[]),z.groups[g].push(n);void 0!==q.children&&f(t,q.children)}}}function g(a){return function(b,c){b.name=a;z.geometries[a]=b;z.face_materials[a]=c;e();t-=1;m.onLoadComplete();j()}}function h(a,b,c,d){return function(f){var f=
f.content?f.content:f.dae?f.scene:f,g=d.position,h=d.rotation,i=d.quaternion,l=d.scale;f.position.set(g[0],g[1],g[2]);i?(f.quaternion.set(i[0],i[1],i[2],i[3]),f.useQuaternion=!0):f.rotation.set(h[0],h[1],h[2]);f.scale.set(l[0],l[1],l[2]);c&&f.traverse(function(a){a.material=c});var p=void 0!==d.visible?d.visible:!0;f.traverse(function(a){a.visible=p});b.add(f);f.name=a;z.objects[a]=f;e();t-=1;m.onLoadComplete();j()}}function i(a){return function(b,c){b.name=a;z.geometries[a]=b;z.face_materials[a]=
c}}function j(){m.callbackProgress({totalModels:J,totalTextures:F,loadedModels:J-t,loadedTextures:F-E},z);m.onLoadProgress();if(0===t&&0===E){for(var a=0;a<H.length;a++){var c=H[a],d=z.objects[c.targetName];d?c.object.target=d:(c.object.target=new THREE.Object3D,z.scene.add(c.object.target));c.object.target.userData.targetInverse=c.object}b(z)}}var m=this,p=THREE.Loader.prototype.extractUrlBase(c),l,r,s,n,q,y,u,x,t,E,J,F,z,H=[],K=a,G;for(G in this.geometryHandlerMap)a=this.geometryHandlerMap[G].loaderClass,
this.geometryHandlerMap[G].loaderObject=new a;for(G in this.hierarchyHandlerMap)a=this.hierarchyHandlerMap[G].loaderClass,this.hierarchyHandlerMap[G].loaderObject=new a;E=t=0;z={scene:new THREE.Scene,geometries:{},face_materials:{},materials:{},textures:{},objects:{},cameras:{},lights:{},fogs:{},empties:{},groups:{}};if(K.transform&&(G=K.transform.position,a=K.transform.rotation,c=K.transform.scale,G&&z.scene.position.set(G[0],G[1],G[2]),a&&z.scene.rotation.set(a[0],a[1],a[2]),c&&z.scene.scale.set(c[0],
c[1],c[2]),G||a||c))z.scene.updateMatrix(),z.scene.updateMatrixWorld();G=function(a){return function(){E-=a;j();m.onLoadComplete()}};for(var L in K.fogs)a=K.fogs[L],"linear"===a.type?n=new THREE.Fog(0,a.near,a.far):"exp2"===a.type&&(n=new THREE.FogExp2(0,a.density)),a=a.color,n.color.setRGB(a[0],a[1],a[2]),z.fogs[L]=n;for(var B in K.geometries)n=K.geometries[B],n.type in this.geometryHandlerMap&&(t+=1,m.onLoadStart());for(var V in K.objects)n=K.objects[V],n.type&&n.type in this.hierarchyHandlerMap&&
(t+=1,m.onLoadStart());J=t;for(B in K.geometries)if(n=K.geometries[B],"cube"===n.type)l=new THREE.CubeGeometry(n.width,n.height,n.depth,n.widthSegments,n.heightSegments,n.depthSegments),l.name=B,z.geometries[B]=l;else if("plane"===n.type)l=new THREE.PlaneGeometry(n.width,n.height,n.widthSegments,n.heightSegments),l.name=B,z.geometries[B]=l;else if("sphere"===n.type)l=new THREE.SphereGeometry(n.radius,n.widthSegments,n.heightSegments),l.name=B,z.geometries[B]=l;else if("cylinder"===n.type)l=new THREE.CylinderGeometry(n.topRad,
n.botRad,n.height,n.radSegs,n.heightSegs),l.name=B,z.geometries[B]=l;else if("torus"===n.type)l=new THREE.TorusGeometry(n.radius,n.tube,n.segmentsR,n.segmentsT),l.name=B,z.geometries[B]=l;else if("icosahedron"===n.type)l=new THREE.IcosahedronGeometry(n.radius,n.subdivisions),l.name=B,z.geometries[B]=l;else if(n.type in this.geometryHandlerMap){V={};for(q in n)"type"!==q&&"url"!==q&&(V[q]=n[q]);this.geometryHandlerMap[n.type].loaderObject.load(d(n.url,K.urlBaseType),g(B),V)}else"embedded"===n.type&&
(V=K.embeds[n.id],V.metadata=K.metadata,V&&(V=this.geometryHandlerMap.ascii.loaderObject.parse(V,""),i(B)(V.geometry,V.materials)));for(var C in K.textures)if(B=K.textures[C],B.url instanceof Array){E+=B.url.length;for(q=0;q<B.url.length;q++)m.onLoadStart()}else E+=1,m.onLoadStart();F=E;for(C in K.textures){B=K.textures[C];void 0!==B.mapping&&void 0!==THREE[B.mapping]&&(B.mapping=new THREE[B.mapping]);if(B.url instanceof Array){V=B.url.length;n=[];for(q=0;q<V;q++)n[q]=d(B.url[q],K.urlBaseType);q=
(q=/\.dds$/i.test(n[0]))?THREE.ImageUtils.loadCompressedTextureCube(n,B.mapping,G(V)):THREE.ImageUtils.loadTextureCube(n,B.mapping,G(V))}else q=/\.dds$/i.test(B.url),V=d(B.url,K.urlBaseType),n=G(1),q=q?THREE.ImageUtils.loadCompressedTexture(V,B.mapping,n):THREE.ImageUtils.loadTexture(V,B.mapping,n),void 0!==THREE[B.minFilter]&&(q.minFilter=THREE[B.minFilter]),void 0!==THREE[B.magFilter]&&(q.magFilter=THREE[B.magFilter]),B.anisotropy&&(q.anisotropy=B.anisotropy),B.repeat&&(q.repeat.set(B.repeat[0],
B.repeat[1]),1!==B.repeat[0]&&(q.wrapS=THREE.RepeatWrapping),1!==B.repeat[1]&&(q.wrapT=THREE.RepeatWrapping)),B.offset&&q.offset.set(B.offset[0],B.offset[1]),B.wrap&&(V={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping},void 0!==V[B.wrap[0]]&&(q.wrapS=V[B.wrap[0]]),void 0!==V[B.wrap[1]]&&(q.wrapT=V[B.wrap[1]]));z.textures[C]=q}var I,M;for(I in K.materials){C=K.materials[I];for(M in C.parameters)"envMap"===M||"map"===M||"lightMap"===M||"bumpMap"===M?C.parameters[M]=z.textures[C.parameters[M]]:
"shading"===M?C.parameters[M]="flat"===C.parameters[M]?THREE.FlatShading:THREE.SmoothShading:"side"===M?C.parameters[M]="double"==C.parameters[M]?THREE.DoubleSide:"back"==C.parameters[M]?THREE.BackSide:THREE.FrontSide:"blending"===M?C.parameters[M]=C.parameters[M]in THREE?THREE[C.parameters[M]]:THREE.NormalBlending:"combine"===M?C.parameters[M]=C.parameters[M]in THREE?THREE[C.parameters[M]]:THREE.MultiplyOperation:"vertexColors"===M?"face"==C.parameters[M]?C.parameters[M]=THREE.FaceColors:C.parameters[M]&&
(C.parameters[M]=THREE.VertexColors):"wrapRGB"===M&&(G=C.parameters[M],C.parameters[M]=new THREE.Vector3(G[0],G[1],G[2]));void 0!==C.parameters.opacity&&1>C.parameters.opacity&&(C.parameters.transparent=!0);C.parameters.normalMap?(G=THREE.ShaderLib.normalmap,B=THREE.UniformsUtils.clone(G.uniforms),q=C.parameters.color,V=C.parameters.specular,n=C.parameters.ambient,L=C.parameters.shininess,B.tNormal.value=z.textures[C.parameters.normalMap],C.parameters.normalScale&&B.uNormalScale.value.set(C.parameters.normalScale[0],
C.parameters.normalScale[1]),C.parameters.map&&(B.tDiffuse.value=C.parameters.map,B.enableDiffuse.value=!0),C.parameters.envMap&&(B.tCube.value=C.parameters.envMap,B.enableReflection.value=!0,B.uReflectivity.value=C.parameters.reflectivity),C.parameters.lightMap&&(B.tAO.value=C.parameters.lightMap,B.enableAO.value=!0),C.parameters.specularMap&&(B.tSpecular.value=z.textures[C.parameters.specularMap],B.enableSpecular.value=!0),C.parameters.displacementMap&&(B.tDisplacement.value=z.textures[C.parameters.displacementMap],
B.enableDisplacement.value=!0,B.uDisplacementBias.value=C.parameters.displacementBias,B.uDisplacementScale.value=C.parameters.displacementScale),B.uDiffuseColor.value.setHex(q),B.uSpecularColor.value.setHex(V),B.uAmbientColor.value.setHex(n),B.uShininess.value=L,C.parameters.opacity&&(B.uOpacity.value=C.parameters.opacity),r=new THREE.ShaderMaterial({fragmentShader:G.fragmentShader,vertexShader:G.vertexShader,uniforms:B,lights:!0,fog:!0})):r=new THREE[C.type](C.parameters);r.name=I;z.materials[I]=
r}for(I in K.materials)if(C=K.materials[I],C.parameters.materials){M=[];for(q=0;q<C.parameters.materials.length;q++)M.push(z.materials[C.parameters.materials[q]]);z.materials[I].materials=M}e();z.cameras&&K.defaults.camera&&(z.currentCamera=z.cameras[K.defaults.camera]);z.fogs&&K.defaults.fog&&(z.scene.fog=z.fogs[K.defaults.fog]);m.callbackSync(z);j()};THREE.TextureLoader=function(){this.crossOrigin=null};
THREE.TextureLoader.prototype={constructor:THREE.TextureLoader,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,load:function(a){var b=this,c=new Image;c.addEventListener("load",function(){var a=new THREE.Texture(c);a.needsUpdate=!0;b.dispatchEvent({type:"load",content:a})},!1);c.addEventListener("error",
function(){b.dispatchEvent({type:"error",message:"Couldn't load URL ["+a+"]"})},!1);b.crossOrigin&&(c.crossOrigin=b.crossOrigin);c.src=a}};THREE.Material=function(){this.id=THREE.MaterialIdCount++;this.name="";this.side=THREE.FrontSide;this.opacity=1;this.transparent=!1;this.blending=THREE.NormalBlending;this.blendSrc=THREE.SrcAlphaFactor;this.blendDst=THREE.OneMinusSrcAlphaFactor;this.blendEquation=THREE.AddEquation;this.depthWrite=this.depthTest=!0;this.polygonOffset=!1;this.alphaTest=this.polygonOffsetUnits=this.polygonOffsetFactor=0;this.overdraw=!1;this.needsUpdate=this.visible=!0};
THREE.Material.prototype={constructor:THREE.Material,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,setValues:function(a){if(void 0!==a)for(var b in a){var c=a[b];if(void 0===c)console.warn("THREE.Material: '"+b+"' parameter is undefined.");else if(b in this){var d=this[b];d instanceof
THREE.Color?d.set(c):d instanceof THREE.Vector3&&c instanceof THREE.Vector3?d.copy(c):this[b]=c}}},clone:function(a){void 0===a&&(a=new THREE.Material);a.name=this.name;a.side=this.side;a.opacity=this.opacity;a.transparent=this.transparent;a.blending=this.blending;a.blendSrc=this.blendSrc;a.blendDst=this.blendDst;a.blendEquation=this.blendEquation;a.depthTest=this.depthTest;a.depthWrite=this.depthWrite;a.polygonOffset=this.polygonOffset;a.polygonOffsetFactor=this.polygonOffsetFactor;a.polygonOffsetUnits=
this.polygonOffsetUnits;a.alphaTest=this.alphaTest;a.overdraw=this.overdraw;a.visible=this.visible;return a},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.MaterialIdCount=0;THREE.LineBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.linewidth=1;this.linejoin=this.linecap="round";this.vertexColors=!1;this.fog=!0;this.setValues(a)};THREE.LineBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.LineBasicMaterial.prototype.clone=function(){var a=new THREE.LineBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.linewidth=this.linewidth;a.linecap=this.linecap;a.linejoin=this.linejoin;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};THREE.LineDashedMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.scale=this.linewidth=1;this.dashSize=3;this.gapSize=1;this.vertexColors=!1;this.fog=!0;this.setValues(a)};THREE.LineDashedMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.LineDashedMaterial.prototype.clone=function(){var a=new THREE.LineDashedMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.linewidth=this.linewidth;a.scale=this.scale;a.dashSize=this.dashSize;a.gapSize=this.gapSize;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};THREE.MeshBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.envMap=this.specularMap=this.lightMap=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refractionRatio=0.98;this.fog=!0;this.shading=THREE.SmoothShading;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.vertexColors=THREE.NoColors;this.morphTargets=this.skinning=!1;this.setValues(a)};
THREE.MeshBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshBasicMaterial.prototype.clone=function(){var a=new THREE.MeshBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.lightMap=this.lightMap;a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=
this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;return a};THREE.MeshLambertMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(16777215);this.emissive=new THREE.Color(0);this.wrapAround=!1;this.wrapRGB=new THREE.Vector3(1,1,1);this.envMap=this.specularMap=this.lightMap=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refractionRatio=0.98;this.fog=!0;this.shading=THREE.SmoothShading;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap=
"round";this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)};THREE.MeshLambertMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshLambertMaterial.prototype.clone=function(){var a=new THREE.MeshLambertMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.ambient.copy(this.ambient);a.emissive.copy(this.emissive);a.wrapAround=this.wrapAround;a.wrapRGB.copy(this.wrapRGB);a.map=this.map;a.lightMap=this.lightMap;a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;
a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;a.morphNormals=this.morphNormals;return a};THREE.MeshPhongMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(16777215);this.emissive=new THREE.Color(0);this.specular=new THREE.Color(1118481);this.shininess=30;this.metal=!1;this.perPixel=!0;this.wrapAround=!1;this.wrapRGB=new THREE.Vector3(1,1,1);this.bumpMap=this.lightMap=this.map=null;this.bumpScale=1;this.normalMap=null;this.normalScale=new THREE.Vector2(1,1);this.envMap=this.specularMap=null;this.combine=THREE.MultiplyOperation;
this.reflectivity=1;this.refractionRatio=0.98;this.fog=!0;this.shading=THREE.SmoothShading;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)};THREE.MeshPhongMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshPhongMaterial.prototype.clone=function(){var a=new THREE.MeshPhongMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.ambient.copy(this.ambient);a.emissive.copy(this.emissive);a.specular.copy(this.specular);a.shininess=this.shininess;a.metal=this.metal;a.perPixel=this.perPixel;a.wrapAround=this.wrapAround;a.wrapRGB.copy(this.wrapRGB);a.map=this.map;a.lightMap=this.lightMap;a.bumpMap=this.bumpMap;a.bumpScale=this.bumpScale;a.normalMap=this.normalMap;a.normalScale.copy(this.normalScale);
a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;a.morphNormals=this.morphNormals;return a};THREE.MeshDepthMaterial=function(a){THREE.Material.call(this);this.wireframe=!1;this.wireframeLinewidth=1;this.setValues(a)};THREE.MeshDepthMaterial.prototype=Object.create(THREE.Material.prototype);THREE.MeshDepthMaterial.prototype.clone=function(){var a=new THREE.MeshDepthMaterial;THREE.Material.prototype.clone.call(this,a);a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;return a};THREE.MeshNormalMaterial=function(a){THREE.Material.call(this,a);this.shading=THREE.FlatShading;this.wireframe=!1;this.wireframeLinewidth=1;this.morphTargets=!1;this.setValues(a)};THREE.MeshNormalMaterial.prototype=Object.create(THREE.Material.prototype);THREE.MeshNormalMaterial.prototype.clone=function(){var a=new THREE.MeshNormalMaterial;THREE.Material.prototype.clone.call(this,a);a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;return a};THREE.MeshFaceMaterial=function(a){this.materials=a instanceof Array?a:[]};THREE.MeshFaceMaterial.prototype.clone=function(){return new THREE.MeshFaceMaterial(this.materials.slice(0))};THREE.ParticleBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.map=null;this.size=1;this.sizeAttenuation=!0;this.vertexColors=!1;this.fog=!0;this.setValues(a)};THREE.ParticleBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.ParticleBasicMaterial.prototype.clone=function(){var a=new THREE.ParticleBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.size=this.size;a.sizeAttenuation=this.sizeAttenuation;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};THREE.ParticleCanvasMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.program=function(){};this.setValues(a)};THREE.ParticleCanvasMaterial.prototype=Object.create(THREE.Material.prototype);THREE.ParticleCanvasMaterial.prototype.clone=function(){var a=new THREE.ParticleCanvasMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.program=this.program;return a};THREE.ShaderMaterial=function(a){THREE.Material.call(this);this.vertexShader=this.fragmentShader="void main() {}";this.uniforms={};this.defines={};this.attributes=null;this.shading=THREE.SmoothShading;this.linewidth=1;this.wireframe=!1;this.wireframeLinewidth=1;this.lights=this.fog=!1;this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)};THREE.ShaderMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.ShaderMaterial.prototype.clone=function(){var a=new THREE.ShaderMaterial;THREE.Material.prototype.clone.call(this,a);a.fragmentShader=this.fragmentShader;a.vertexShader=this.vertexShader;a.uniforms=THREE.UniformsUtils.clone(this.uniforms);a.attributes=this.attributes;a.defines=this.defines;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.fog=this.fog;a.lights=this.lights;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=
this.morphTargets;a.morphNormals=this.morphNormals;return a};THREE.SpriteMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.map=new THREE.Texture;this.useScreenCoordinates=!0;this.depthTest=!this.useScreenCoordinates;this.sizeAttenuation=!this.useScreenCoordinates;this.scaleByViewport=!this.sizeAttenuation;this.alignment=THREE.SpriteAlignment.center.clone();this.fog=!1;this.uvOffset=new THREE.Vector2(0,0);this.uvScale=new THREE.Vector2(1,1);this.setValues(a);a=a||{};void 0===a.depthTest&&(this.depthTest=!this.useScreenCoordinates);
void 0===a.sizeAttenuation&&(this.sizeAttenuation=!this.useScreenCoordinates);void 0===a.scaleByViewport&&(this.scaleByViewport=!this.sizeAttenuation)};THREE.SpriteMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.SpriteMaterial.prototype.clone=function(){var a=new THREE.SpriteMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.useScreenCoordinates=this.useScreenCoordinates;a.sizeAttenuation=this.sizeAttenuation;a.scaleByViewport=this.scaleByViewport;a.alignment.copy(this.alignment);a.uvOffset.copy(this.uvOffset);a.uvScale.copy(this.uvScale);a.fog=this.fog;return a};THREE.SpriteAlignment={};THREE.SpriteAlignment.topLeft=new THREE.Vector2(1,-1);
THREE.SpriteAlignment.topCenter=new THREE.Vector2(0,-1);THREE.SpriteAlignment.topRight=new THREE.Vector2(-1,-1);THREE.SpriteAlignment.centerLeft=new THREE.Vector2(1,0);THREE.SpriteAlignment.center=new THREE.Vector2(0,0);THREE.SpriteAlignment.centerRight=new THREE.Vector2(-1,0);THREE.SpriteAlignment.bottomLeft=new THREE.Vector2(1,1);THREE.SpriteAlignment.bottomCenter=new THREE.Vector2(0,1);THREE.SpriteAlignment.bottomRight=new THREE.Vector2(-1,1);THREE.Texture=function(a,b,c,d,e,f,g,h,i){this.id=THREE.TextureIdCount++;this.name="";this.image=a;this.mipmaps=[];this.mapping=void 0!==b?b:new THREE.UVMapping;this.wrapS=void 0!==c?c:THREE.ClampToEdgeWrapping;this.wrapT=void 0!==d?d:THREE.ClampToEdgeWrapping;this.magFilter=void 0!==e?e:THREE.LinearFilter;this.minFilter=void 0!==f?f:THREE.LinearMipMapLinearFilter;this.anisotropy=void 0!==i?i:1;this.format=void 0!==g?g:THREE.RGBAFormat;this.type=void 0!==h?h:THREE.UnsignedByteType;this.offset=new THREE.Vector2(0,
0);this.repeat=new THREE.Vector2(1,1);this.generateMipmaps=!0;this.premultiplyAlpha=!1;this.flipY=!0;this.unpackAlignment=4;this.needsUpdate=!1;this.onUpdate=null};
THREE.Texture.prototype={constructor:THREE.Texture,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,clone:function(a){void 0===a&&(a=new THREE.Texture);a.image=this.image;a.mipmaps=this.mipmaps.slice(0);a.mapping=this.mapping;a.wrapS=this.wrapS;a.wrapT=this.wrapT;a.magFilter=this.magFilter;
a.minFilter=this.minFilter;a.anisotropy=this.anisotropy;a.format=this.format;a.type=this.type;a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.generateMipmaps=this.generateMipmaps;a.premultiplyAlpha=this.premultiplyAlpha;a.flipY=this.flipY;a.unpackAlignment=this.unpackAlignment;return a},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.TextureIdCount=0;THREE.CompressedTexture=function(a,b,c,d,e,f,g,h,i,j,m){THREE.Texture.call(this,null,f,g,h,i,j,d,e,m);this.image={width:b,height:c};this.mipmaps=a;this.generateMipmaps=!1};THREE.CompressedTexture.prototype=Object.create(THREE.Texture.prototype);THREE.CompressedTexture.prototype.clone=function(){var a=new THREE.CompressedTexture;THREE.Texture.prototype.clone.call(this,a);return a};THREE.DataTexture=function(a,b,c,d,e,f,g,h,i,j,m){THREE.Texture.call(this,null,f,g,h,i,j,d,e,m);this.image={data:a,width:b,height:c}};THREE.DataTexture.prototype=Object.create(THREE.Texture.prototype);THREE.DataTexture.prototype.clone=function(){var a=new THREE.DataTexture;THREE.Texture.prototype.clone.call(this,a);return a};THREE.Particle=function(a){THREE.Object3D.call(this);this.material=a};THREE.Particle.prototype=Object.create(THREE.Object3D.prototype);THREE.Particle.prototype.clone=function(a){void 0===a&&(a=new THREE.Particle(this.material));THREE.Object3D.prototype.clone.call(this,a);return a};THREE.ParticleSystem=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=void 0!==b?b:new THREE.ParticleBasicMaterial({color:16777215*Math.random()});this.sortParticles=!1;this.geometry&&null===this.geometry.boundingSphere&&this.geometry.computeBoundingSphere();this.frustumCulled=!1};THREE.ParticleSystem.prototype=Object.create(THREE.Object3D.prototype);
THREE.ParticleSystem.prototype.clone=function(a){void 0===a&&(a=new THREE.ParticleSystem(this.geometry,this.material));a.sortParticles=this.sortParticles;THREE.Object3D.prototype.clone.call(this,a);return a};THREE.Line=function(a,b,c){THREE.Object3D.call(this);this.geometry=a;this.material=void 0!==b?b:new THREE.LineBasicMaterial({color:16777215*Math.random()});this.type=void 0!==c?c:THREE.LineStrip;this.geometry&&(this.geometry.boundingSphere||this.geometry.computeBoundingSphere())};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=Object.create(THREE.Object3D.prototype);
THREE.Line.prototype.clone=function(a){void 0===a&&(a=new THREE.Line(this.geometry,this.material,this.type));THREE.Object3D.prototype.clone.call(this,a);return a};THREE.Mesh=function(a,b){THREE.Object3D.call(this);this.material=this.geometry=null;this.setGeometry(a);this.setMaterial(b)};THREE.Mesh.prototype=Object.create(THREE.Object3D.prototype);THREE.Mesh.prototype.setGeometry=function(a){void 0!==a&&(this.geometry=a,null===this.geometry.boundingSphere&&this.geometry.computeBoundingSphere(),this.updateMorphTargets())};THREE.Mesh.prototype.setMaterial=function(a){this.material=void 0!==a?a:new THREE.MeshBasicMaterial({color:16777215*Math.random(),wireframe:!0})};
THREE.Mesh.prototype.updateMorphTargets=function(){if(0<this.geometry.morphTargets.length){this.morphTargetBase=-1;this.morphTargetForcedOrder=[];this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var a=0,b=this.geometry.morphTargets.length;a<b;a++)this.morphTargetInfluences.push(0),this.morphTargetDictionary[this.geometry.morphTargets[a].name]=a}};
THREE.Mesh.prototype.getMorphTargetIndexByName=function(a){if(void 0!==this.morphTargetDictionary[a])return this.morphTargetDictionary[a];console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+a+" does not exist. Returning 0.");return 0};THREE.Mesh.prototype.clone=function(a){void 0===a&&(a=new THREE.Mesh(this.geometry,this.material));THREE.Object3D.prototype.clone.call(this,a);return a};THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4};THREE.Bone.prototype=Object.create(THREE.Object3D.prototype);THREE.Bone.prototype.update=function(a,b){this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixWorldNeedsUpdate)a?this.skinMatrix.multiplyMatrices(a,this.matrix):this.skinMatrix.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,b=!0;var c,d=this.children.length;for(c=0;c<d;c++)this.children[c].update(this.skinMatrix,b)};THREE.SkinnedMesh=function(a,b,c){THREE.Mesh.call(this,a,b);this.useVertexTexture=void 0!==c?c:!0;this.identityMatrix=new THREE.Matrix4;this.bones=[];this.boneMatrices=[];var d,e,f;if(this.geometry&&void 0!==this.geometry.bones){for(a=0;a<this.geometry.bones.length;a++)c=this.geometry.bones[a],d=c.pos,e=c.rotq,f=c.scl,b=this.addBone(),b.name=c.name,b.position.set(d[0],d[1],d[2]),b.quaternion.set(e[0],e[1],e[2],e[3]),b.useQuaternion=!0,void 0!==f?b.scale.set(f[0],f[1],f[2]):b.scale.set(1,1,1);for(a=
0;a<this.bones.length;a++)c=this.geometry.bones[a],b=this.bones[a],-1===c.parent?this.add(b):this.bones[c.parent].add(b);a=this.bones.length;this.useVertexTexture?(this.boneTextureHeight=this.boneTextureWidth=a=256<a?64:64<a?32:16<a?16:8,this.boneMatrices=new Float32Array(4*this.boneTextureWidth*this.boneTextureHeight),this.boneTexture=new THREE.DataTexture(this.boneMatrices,this.boneTextureWidth,this.boneTextureHeight,THREE.RGBAFormat,THREE.FloatType),this.boneTexture.minFilter=THREE.NearestFilter,
this.boneTexture.magFilter=THREE.NearestFilter,this.boneTexture.generateMipmaps=!1,this.boneTexture.flipY=!1):this.boneMatrices=new Float32Array(16*a);this.pose()}};THREE.SkinnedMesh.prototype=Object.create(THREE.Mesh.prototype);THREE.SkinnedMesh.prototype.addBone=function(a){void 0===a&&(a=new THREE.Bone(this));this.bones.push(a);return a};
THREE.SkinnedMesh.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a)this.parent?this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1;for(var a=0,b=this.children.length;a<b;a++){var c=this.children[a];c instanceof THREE.Bone?c.update(this.identityMatrix,!1):c.updateMatrixWorld(!0)}if(void 0==this.boneInverses){this.boneInverses=[];a=0;for(b=this.bones.length;a<
b;a++)c=new THREE.Matrix4,c.getInverse(this.bones[a].skinMatrix),this.boneInverses.push(c)}a=0;for(b=this.bones.length;a<b;a++)THREE.SkinnedMesh.offsetMatrix.multiplyMatrices(this.bones[a].skinMatrix,this.boneInverses[a]),THREE.SkinnedMesh.offsetMatrix.flattenToArrayOffset(this.boneMatrices,16*a);this.useVertexTexture&&(this.boneTexture.needsUpdate=!0)};
THREE.SkinnedMesh.prototype.pose=function(){this.updateMatrixWorld(!0);for(var a=0;a<this.geometry.skinIndices.length;a++){var b=this.geometry.skinWeights[a],c=1/b.lengthManhattan();Infinity!==c?b.multiplyScalar(c):b.set(1)}};THREE.SkinnedMesh.prototype.clone=function(a){void 0===a&&(a=new THREE.SkinnedMesh(this.geometry,this.material,this.useVertexTexture));THREE.Mesh.prototype.clone.call(this,a);return a};THREE.SkinnedMesh.offsetMatrix=new THREE.Matrix4;THREE.MorphAnimMesh=function(a,b){THREE.Mesh.call(this,a,b);this.duration=1E3;this.mirroredLoop=!1;this.currentKeyframe=this.lastKeyframe=this.time=0;this.direction=1;this.directionBackwards=!1;this.setFrameRange(0,this.geometry.morphTargets.length-1)};THREE.MorphAnimMesh.prototype=Object.create(THREE.Mesh.prototype);THREE.MorphAnimMesh.prototype.setFrameRange=function(a,b){this.startKeyframe=a;this.endKeyframe=b;this.length=this.endKeyframe-this.startKeyframe+1};
THREE.MorphAnimMesh.prototype.setDirectionForward=function(){this.direction=1;this.directionBackwards=!1};THREE.MorphAnimMesh.prototype.setDirectionBackward=function(){this.direction=-1;this.directionBackwards=!0};
THREE.MorphAnimMesh.prototype.parseAnimations=function(){var a=this.geometry;a.animations||(a.animations={});for(var b,c=a.animations,d=/([a-z]+)(\d+)/,e=0,f=a.morphTargets.length;e<f;e++){var g=a.morphTargets[e].name.match(d);if(g&&1<g.length){g=g[1];c[g]||(c[g]={start:Infinity,end:-Infinity});var h=c[g];e<h.start&&(h.start=e);e>h.end&&(h.end=e);b||(b=g)}}a.firstAnimation=b};
THREE.MorphAnimMesh.prototype.setAnimationLabel=function(a,b,c){this.geometry.animations||(this.geometry.animations={});this.geometry.animations[a]={start:b,end:c}};THREE.MorphAnimMesh.prototype.playAnimation=function(a,b){var c=this.geometry.animations[a];c?(this.setFrameRange(c.start,c.end),this.duration=1E3*((c.end-c.start)/b),this.time=0):console.warn("animation["+a+"] undefined")};
THREE.MorphAnimMesh.prototype.updateAnimation=function(a){var b=this.duration/this.length;this.time+=this.direction*a;if(this.mirroredLoop){if(this.time>this.duration||0>this.time)this.direction*=-1,this.time>this.duration&&(this.time=this.duration,this.directionBackwards=!0),0>this.time&&(this.time=0,this.directionBackwards=!1)}else this.time%=this.duration,0>this.time&&(this.time+=this.duration);a=this.startKeyframe+THREE.Math.clamp(Math.floor(this.time/b),0,this.length-1);a!==this.currentKeyframe&&
(this.morphTargetInfluences[this.lastKeyframe]=0,this.morphTargetInfluences[this.currentKeyframe]=1,this.morphTargetInfluences[a]=0,this.lastKeyframe=this.currentKeyframe,this.currentKeyframe=a);b=this.time%b/b;this.directionBackwards&&(b=1-b);this.morphTargetInfluences[this.currentKeyframe]=b;this.morphTargetInfluences[this.lastKeyframe]=1-b};
THREE.MorphAnimMesh.prototype.clone=function(a){void 0===a&&(a=new THREE.MorphAnimMesh(this.geometry,this.material));a.duration=this.duration;a.mirroredLoop=this.mirroredLoop;a.time=this.time;a.lastKeyframe=this.lastKeyframe;a.currentKeyframe=this.currentKeyframe;a.direction=this.direction;a.directionBackwards=this.directionBackwards;THREE.Mesh.prototype.clone.call(this,a);return a};THREE.Ribbon=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b};THREE.Ribbon.prototype=Object.create(THREE.Object3D.prototype);THREE.Ribbon.prototype.clone=function(a){void 0===a&&(a=new THREE.Ribbon(this.geometry,this.material));THREE.Object3D.prototype.clone.call(this,a);return a};THREE.LOD=function(){THREE.Object3D.call(this);this.objects=[]};THREE.LOD.prototype=Object.create(THREE.Object3D.prototype);THREE.LOD.prototype.addLevel=function(a,b){void 0===b&&(b=0);for(var b=Math.abs(b),c=0;c<this.objects.length&&!(b<this.objects[c].distance);c++);this.objects.splice(c,0,{distance:b,object:a});this.add(a)};THREE.LOD.prototype.getObjectForDistance=function(a){for(var b=1,c=this.objects.length;b<c&&!(a<this.objects[b].distance);b++);return this.objects[b-1].object};
THREE.LOD.prototype.update=function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c){if(1<this.objects.length){a.getPositionFromMatrix(c.matrixWorld);b.getPositionFromMatrix(this.matrixWorld);c=a.distanceTo(b);this.objects[0].object.visible=!0;for(var d=1,e=this.objects.length;d<e;d++)if(c>=this.objects[d].distance)this.objects[d-1].object.visible=!1,this.objects[d].object.visible=!0;else break;for(;d<e;d++)this.objects[d].object.visible=!1}}}();THREE.LOD.prototype.clone=function(){};THREE.Sprite=function(a){THREE.Object3D.call(this);this.material=void 0!==a?a:new THREE.SpriteMaterial;this.rotation3d=this.rotation;this.rotation=0};THREE.Sprite.prototype=Object.create(THREE.Object3D.prototype);THREE.Sprite.prototype.updateMatrix=function(){this.rotation3d.set(0,0,this.rotation);this.quaternion.setFromEuler(this.rotation3d,this.eulerOrder);this.matrix.makeFromPositionQuaternionScale(this.position,this.quaternion,this.scale);this.matrixWorldNeedsUpdate=!0};
THREE.Sprite.prototype.clone=function(a){void 0===a&&(a=new THREE.Sprite(this.material));THREE.Object3D.prototype.clone.call(this,a);return a};THREE.Scene=function(){THREE.Object3D.call(this);this.overrideMaterial=this.fog=null;this.autoUpdate=!0;this.matrixAutoUpdate=!1;this.__objects=[];this.__lights=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=Object.create(THREE.Object3D.prototype);
THREE.Scene.prototype.__addObject=function(a){if(a instanceof THREE.Light)-1===this.__lights.indexOf(a)&&this.__lights.push(a),a.target&&void 0===a.target.parent&&this.add(a.target);else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)&&-1===this.__objects.indexOf(a)){this.__objects.push(a);this.__objectsAdded.push(a);var b=this.__objectsRemoved.indexOf(a);-1!==b&&this.__objectsRemoved.splice(b,1)}for(b=0;b<a.children.length;b++)this.__addObject(a.children[b])};
THREE.Scene.prototype.__removeObject=function(a){if(a instanceof THREE.Light){var b=this.__lights.indexOf(a);-1!==b&&this.__lights.splice(b,1)}else a instanceof THREE.Camera||(b=this.__objects.indexOf(a),-1!==b&&(this.__objects.splice(b,1),this.__objectsRemoved.push(a),b=this.__objectsAdded.indexOf(a),-1!==b&&this.__objectsAdded.splice(b,1)));for(b=0;b<a.children.length;b++)this.__removeObject(a.children[b])};THREE.Fog=function(a,b,c){this.name="";this.color=new THREE.Color(a);this.near=void 0!==b?b:1;this.far=void 0!==c?c:1E3};THREE.Fog.prototype.clone=function(){return new THREE.Fog(this.color.getHex(),this.near,this.far)};THREE.FogExp2=function(a,b){this.name="";this.color=new THREE.Color(a);this.density=void 0!==b?b:2.5E-4};THREE.FogExp2.prototype.clone=function(){return new THREE.FogExp2(this.color.getHex(),this.density)};THREE.CanvasRenderer=function(a){function b(a){F!==a&&(F=t.globalAlpha=a)}function c(a){z!==a&&(a===THREE.NormalBlending?t.globalCompositeOperation="source-over":a===THREE.AdditiveBlending?t.globalCompositeOperation="lighter":a===THREE.SubtractiveBlending&&(t.globalCompositeOperation="darker"),z=a)}function d(a){G!==a&&(G=t.lineWidth=a)}function e(a){L!==a&&(L=t.lineCap=a)}function f(a){B!==a&&(B=t.lineJoin=a)}function g(a){H!==a&&(H=t.strokeStyle=a)}function h(a){K!==a&&(K=t.fillStyle=a)}function i(a,
b){if(V!==a||C!==b)t.setLineDash([a,b]),V=a,C=b}console.log("THREE.CanvasRenderer",THREE.REVISION);var j=THREE.Math.smoothstep,a=a||{},m=this,p,l,r,s=new THREE.Projector,n=void 0!==a.canvas?a.canvas:document.createElement("canvas"),q,y,u,x,t=n.getContext("2d"),E=new THREE.Color(0),J=0,F=1,z=0,H=null,K=null,G=null,L=null,B=null,V=null,C=0,I,M,R,ea,wa=new THREE.RenderableVertex,Ma=new THREE.RenderableVertex,A,ca,ja,na,N,fa,Wa,ab,fb,Ka,qa,pa,Z=new THREE.Color,ga=new THREE.Color,W=new THREE.Color,da=
new THREE.Color,la=new THREE.Color,ha=new THREE.Color,ia=new THREE.Color,Qa=new THREE.Color,kb={},oa={},Xa,Ra,Aa,Sa,sb,Nb,Kb,Ob,Tb,Ub,Ta=new THREE.Box2,ua=new THREE.Box2,Ja=new THREE.Box2,tb=new THREE.Color,Na=new THREE.Color,ra=new THREE.Color,bb=new THREE.Vector3,Ab,k,Bb,Ua,lb,Va,Cb=16;Ab=document.createElement("canvas");Ab.width=Ab.height=2;k=Ab.getContext("2d");k.fillStyle="rgba(0,0,0,1)";k.fillRect(0,0,2,2);Bb=k.getImageData(0,0,2,2);Ua=Bb.data;lb=document.createElement("canvas");lb.width=lb.height=
Cb;Va=lb.getContext("2d");Va.translate(-Cb/2,-Cb/2);Va.scale(Cb,Cb);Cb--;void 0===t.setLineDash&&(t.setLineDash=void 0!==t.mozDash?function(a){t.mozDash=null!==a[0]?a:null}:function(){});this.domElement=n;this.devicePixelRatio=void 0!==a.devicePixelRatio?a.devicePixelRatio:void 0!==window.devicePixelRatio?window.devicePixelRatio:1;this.sortElements=this.sortObjects=this.autoClear=!0;this.info={render:{vertices:0,faces:0}};this.supportsVertexTextures=function(){};this.setFaceCulling=function(){};this.setSize=
function(a,b,c){q=a*this.devicePixelRatio;y=b*this.devicePixelRatio;u=Math.floor(q/2);x=Math.floor(y/2);n.width=q;n.height=y;1!==this.devicePixelRatio&&!1!==c&&(n.style.width=a+"px",n.style.height=b+"px");Ta.set(new THREE.Vector2(-u,-x),new THREE.Vector2(u,x));ua.set(new THREE.Vector2(-u,-x),new THREE.Vector2(u,x));F=1;z=0;B=L=G=K=H=null};this.setClearColor=function(a,b){E.set(a);J=void 0!==b?b:1;ua.set(new THREE.Vector2(-u,-x),new THREE.Vector2(u,x))};this.setClearColorHex=function(a,b){console.warn("DEPRECATED: .setClearColorHex() is being removed. Use .setClearColor() instead.");
this.setClearColor(a,b)};this.getMaxAnisotropy=function(){return 0};this.clear=function(){t.setTransform(1,0,0,-1,u,x);!1===ua.empty()&&(ua.intersect(Ta),ua.expandByScalar(2),1>J&&t.clearRect(ua.min.x|0,ua.min.y|0,ua.max.x-ua.min.x|0,ua.max.y-ua.min.y|0),0<J&&(c(THREE.NormalBlending),b(1),h("rgba("+Math.floor(255*E.r)+","+Math.floor(255*E.g)+","+Math.floor(255*E.b)+","+J+")"),t.fillRect(ua.min.x|0,ua.min.y|0,ua.max.x-ua.min.x|0,ua.max.y-ua.min.y|0)),ua.makeEmpty())};this.render=function(a,n){function q(a,
b,c){for(var d=0,e=r.length;d<e;d++){var f=r[d];Qa.copy(f.color);if(f instanceof THREE.DirectionalLight){var g=bb.getPositionFromMatrix(f.matrixWorld).normalize(),h=b.dot(g);0>=h||(h*=f.intensity,c.add(Qa.multiplyScalar(h)))}else f instanceof THREE.PointLight&&(g=bb.getPositionFromMatrix(f.matrixWorld),h=b.dot(bb.subVectors(g,a).normalize()),0>=h||(h*=0==f.distance?1:1-Math.min(a.distanceTo(g)/f.distance,1),0!=h&&(h*=f.intensity,c.add(Qa.multiplyScalar(h)))))}}function z(a,d,e,f,g,h,k,i){m.info.render.vertices+=
3;m.info.render.faces++;b(i.opacity);c(i.blending);A=a.positionScreen.x;ca=a.positionScreen.y;ja=d.positionScreen.x;na=d.positionScreen.y;N=e.positionScreen.x;fa=e.positionScreen.y;y(A,ca,ja,na,N,fa);(i instanceof THREE.MeshLambertMaterial||i instanceof THREE.MeshPhongMaterial)&&null===i.map?(ha.copy(i.color),ia.copy(i.emissive),i.vertexColors===THREE.FaceColors&&ha.multiply(k.color),!1===i.wireframe&&i.shading==THREE.SmoothShading&&3==k.vertexNormalsLength?(ga.copy(tb),W.copy(tb),da.copy(tb),q(k.v1.positionWorld,
k.vertexNormalsModel[0],ga),q(k.v2.positionWorld,k.vertexNormalsModel[1],W),q(k.v3.positionWorld,k.vertexNormalsModel[2],da),ga.multiply(ha).add(ia),W.multiply(ha).add(ia),da.multiply(ha).add(ia),la.addColors(W,da).multiplyScalar(0.5),Aa=H(ga,W,da,la),J(A,ca,ja,na,N,fa,0,0,1,0,0,1,Aa)):(Z.copy(tb),q(k.centroidModel,k.normalModel,Z),Z.multiply(ha).add(ia),!0===i.wireframe?E(Z,i.wireframeLinewidth,i.wireframeLinecap,i.wireframeLinejoin):F(Z))):i instanceof THREE.MeshBasicMaterial||i instanceof THREE.MeshLambertMaterial||
i instanceof THREE.MeshPhongMaterial?null!==i.map?i.map.mapping instanceof THREE.UVMapping&&(Sa=k.uvs[0],C(A,ca,ja,na,N,fa,Sa[f].x,Sa[f].y,Sa[g].x,Sa[g].y,Sa[h].x,Sa[h].y,i.map)):null!==i.envMap?i.envMap.mapping instanceof THREE.SphericalReflectionMapping&&(bb.copy(k.vertexNormalsModelView[f]),sb=0.5*bb.x+0.5,Nb=0.5*bb.y+0.5,bb.copy(k.vertexNormalsModelView[g]),Kb=0.5*bb.x+0.5,Ob=0.5*bb.y+0.5,bb.copy(k.vertexNormalsModelView[h]),Tb=0.5*bb.x+0.5,Ub=0.5*bb.y+0.5,C(A,ca,ja,na,N,fa,sb,Nb,Kb,Ob,Tb,Ub,
i.envMap)):(Z.copy(i.color),i.vertexColors===THREE.FaceColors&&Z.multiply(k.color),!0===i.wireframe?E(Z,i.wireframeLinewidth,i.wireframeLinecap,i.wireframeLinejoin):F(Z)):i instanceof THREE.MeshDepthMaterial?(Xa=n.near,Ra=n.far,ga.r=ga.g=ga.b=1-j(a.positionScreen.z*a.positionScreen.w,Xa,Ra),W.r=W.g=W.b=1-j(d.positionScreen.z*d.positionScreen.w,Xa,Ra),da.r=da.g=da.b=1-j(e.positionScreen.z*e.positionScreen.w,Xa,Ra),la.addColors(W,da).multiplyScalar(0.5),Aa=H(ga,W,da,la),J(A,ca,ja,na,N,fa,0,0,1,0,0,
1,Aa)):i instanceof THREE.MeshNormalMaterial&&(i.shading==THREE.FlatShading?(a=k.normalModelView,Z.setRGB(a.x,a.y,a.z).multiplyScalar(0.5).addScalar(0.5),!0===i.wireframe?E(Z,i.wireframeLinewidth,i.wireframeLinecap,i.wireframeLinejoin):F(Z)):i.shading==THREE.SmoothShading&&(a=k.vertexNormalsModelView[f],ga.setRGB(a.x,a.y,a.z).multiplyScalar(0.5).addScalar(0.5),a=k.vertexNormalsModelView[g],W.setRGB(a.x,a.y,a.z).multiplyScalar(0.5).addScalar(0.5),a=k.vertexNormalsModelView[h],da.setRGB(a.x,a.y,a.z).multiplyScalar(0.5).addScalar(0.5),
la.addColors(W,da).multiplyScalar(0.5),Aa=H(ga,W,da,la),J(A,ca,ja,na,N,fa,0,0,1,0,0,1,Aa)))}function y(a,b,c,d,e,f){t.beginPath();t.moveTo(a,b);t.lineTo(c,d);t.lineTo(e,f);t.closePath()}function B(a,b,c,d,e,f,g,h){t.beginPath();t.moveTo(a,b);t.lineTo(c,d);t.lineTo(e,f);t.lineTo(g,h);t.closePath()}function E(a,b,c,h){d(b);e(c);f(h);g(a.getStyle());t.stroke();Ja.expandByScalar(2*b)}function F(a){h(a.getStyle());t.fill()}function C(a,b,c,d,e,f,g,i,k,xa,j,l,p){if(!(p instanceof THREE.DataTexture||void 0===
p.image||0==p.image.width)){if(!0===p.needsUpdate){var m=p.wrapS==THREE.RepeatWrapping,Ya=p.wrapT==THREE.RepeatWrapping;kb[p.id]=t.createPattern(p.image,!0===m&&!0===Ya?"repeat":!0===m&&!1===Ya?"repeat-x":!1===m&&!0===Ya?"repeat-y":"no-repeat");p.needsUpdate=!1}void 0===kb[p.id]?h("rgba(0,0,0,1)"):h(kb[p.id]);var m=p.offset.x/p.repeat.x,Ya=p.offset.y/p.repeat.y,n=p.image.width*p.repeat.x,q=p.image.height*p.repeat.y,g=(g+m)*n,i=(1-i+Ya)*q,c=c-a,d=d-b,e=e-a,f=f-b,k=(k+m)*n-g,xa=(1-xa+Ya)*q-i,j=(j+m)*
n-g,l=(1-l+Ya)*q-i,m=k*l-j*xa;0===m?(void 0===oa[p.id]&&(b=document.createElement("canvas"),b.width=p.image.width,b.height=p.image.height,b=b.getContext("2d"),b.drawImage(p.image,0,0),oa[p.id]=b.getImageData(0,0,p.image.width,p.image.height).data),b=oa[p.id],g=4*(Math.floor(g)+Math.floor(i)*p.image.width),Z.setRGB(b[g]/255,b[g+1]/255,b[g+2]/255),F(Z)):(m=1/m,p=(l*c-xa*e)*m,xa=(l*d-xa*f)*m,c=(k*e-j*c)*m,d=(k*f-j*d)*m,a=a-p*g-c*i,g=b-xa*g-d*i,t.save(),t.transform(p,xa,c,d,a,g),t.fill(),t.restore())}}
function J(a,b,c,d,e,f,g,h,i,k,xa,j,p){var m,l;m=p.width-1;l=p.height-1;g*=m;h*=l;c-=a;d-=b;e-=a;f-=b;i=i*m-g;k=k*l-h;xa=xa*m-g;j=j*l-h;l=1/(i*j-xa*k);m=(j*c-k*e)*l;k=(j*d-k*f)*l;c=(i*e-xa*c)*l;d=(i*f-xa*d)*l;a=a-m*g-c*h;b=b-k*g-d*h;t.save();t.transform(m,k,c,d,a,b);t.clip();t.drawImage(p,0,0);t.restore()}function H(a,b,c,d){Ua[0]=255*a.r|0;Ua[1]=255*a.g|0;Ua[2]=255*a.b|0;Ua[4]=255*b.r|0;Ua[5]=255*b.g|0;Ua[6]=255*b.b|0;Ua[8]=255*c.r|0;Ua[9]=255*c.g|0;Ua[10]=255*c.b|0;Ua[12]=255*d.r|0;Ua[13]=255*d.g|
0;Ua[14]=255*d.b|0;k.putImageData(Bb,0,0);Va.drawImage(Ab,0,0);return lb}function G(a,b){var c=b.x-a.x,d=b.y-a.y,e=c*c+d*d;0!==e&&(e=1/Math.sqrt(e),c*=e,d*=e,b.x+=c,b.y+=d,a.x-=c,a.y-=d)}if(!1===n instanceof THREE.Camera)console.error("THREE.CanvasRenderer.render: camera is not an instance of THREE.Camera.");else{!0===this.autoClear&&this.clear();t.setTransform(1,0,0,-1,u,x);m.info.render.vertices=0;m.info.render.faces=0;p=s.projectScene(a,n,this.sortObjects,this.sortElements);l=p.elements;r=p.lights;
tb.setRGB(0,0,0);Na.setRGB(0,0,0);ra.setRGB(0,0,0);for(var K=0,V=r.length;K<V;K++){var U=r[K],P=U.color;U instanceof THREE.AmbientLight?tb.add(P):U instanceof THREE.DirectionalLight?Na.add(P):U instanceof THREE.PointLight&&ra.add(P)}K=0;for(V=l.length;K<V;K++){var L=l[K],U=L.material;if(!(void 0===U||!1===U.visible)){Ja.makeEmpty();if(L instanceof THREE.RenderableParticle){I=L;I.x*=u;I.y*=x;P=I;b(U.opacity);c(U.blending);var xa=void 0,mb=void 0,Ya=void 0,vb=void 0,Pb=void 0,Oc=void 0,Pc=void 0;U instanceof
THREE.ParticleBasicMaterial?null===U.map?(Ya=L.object.scale.x,vb=L.object.scale.y,Ya*=L.scale.x*u,vb*=L.scale.y*x,Ja.min.set(P.x-Ya,P.y-vb),Ja.max.set(P.x+Ya,P.y+vb),!1===Ta.isIntersectionBox(Ja)?Ja.makeEmpty():(h(U.color.getStyle()),t.save(),t.translate(P.x,P.y),t.rotate(-L.rotation),t.scale(Ya,vb),t.fillRect(-1,-1,2,2),t.restore())):(Pb=U.map.image,Oc=Pb.width>>1,Pc=Pb.height>>1,Ya=L.scale.x*u,vb=L.scale.y*x,xa=Ya*Oc,mb=vb*Pc,Ja.min.set(P.x-xa,P.y-mb),Ja.max.set(P.x+xa,P.y+mb),!1===Ta.isIntersectionBox(Ja)?
Ja.makeEmpty():(t.save(),t.translate(P.x,P.y),t.rotate(-L.rotation),t.scale(Ya,-vb),t.translate(-Oc,-Pc),t.drawImage(Pb,0,0),t.restore())):U instanceof THREE.ParticleCanvasMaterial&&(xa=L.scale.x*u,mb=L.scale.y*x,Ja.min.set(P.x-xa,P.y-mb),Ja.max.set(P.x+xa,P.y+mb),!1===Ta.isIntersectionBox(Ja)?Ja.makeEmpty():(g(U.color.getStyle()),h(U.color.getStyle()),t.save(),t.translate(P.x,P.y),t.rotate(-L.rotation),t.scale(xa,mb),U.program(t),t.restore()))}else if(L instanceof THREE.RenderableLine){if(I=L.v1,
M=L.v2,I.positionScreen.x*=u,I.positionScreen.y*=x,M.positionScreen.x*=u,M.positionScreen.y*=x,Ja.setFromPoints([I.positionScreen,M.positionScreen]),!0===Ta.isIntersectionBox(Ja))if(P=I,xa=M,b(U.opacity),c(U.blending),t.beginPath(),t.moveTo(P.positionScreen.x,P.positionScreen.y),t.lineTo(xa.positionScreen.x,xa.positionScreen.y),U instanceof THREE.LineBasicMaterial){d(U.linewidth);e(U.linecap);f(U.linejoin);if(U.vertexColors!==THREE.VertexColors)g(U.color.getStyle());else if(mb=L.vertexColors[0].getStyle(),
L=L.vertexColors[1].getStyle(),mb===L)g(mb);else{try{var qc=t.createLinearGradient(P.positionScreen.x,P.positionScreen.y,xa.positionScreen.x,xa.positionScreen.y);qc.addColorStop(0,mb);qc.addColorStop(1,L)}catch(ed){qc=mb}g(qc)}t.stroke();Ja.expandByScalar(2*U.linewidth)}else U instanceof THREE.LineDashedMaterial&&(d(U.linewidth),e(U.linecap),f(U.linejoin),g(U.color.getStyle()),i(U.dashSize,U.gapSize),t.stroke(),Ja.expandByScalar(2*U.linewidth),i(null,null))}else if(L instanceof THREE.RenderableFace3){I=
L.v1;M=L.v2;R=L.v3;if(-1>I.positionScreen.z||1<I.positionScreen.z)continue;if(-1>M.positionScreen.z||1<M.positionScreen.z)continue;if(-1>R.positionScreen.z||1<R.positionScreen.z)continue;I.positionScreen.x*=u;I.positionScreen.y*=x;M.positionScreen.x*=u;M.positionScreen.y*=x;R.positionScreen.x*=u;R.positionScreen.y*=x;!0===U.overdraw&&(G(I.positionScreen,M.positionScreen),G(M.positionScreen,R.positionScreen),G(R.positionScreen,I.positionScreen));Ja.setFromPoints([I.positionScreen,M.positionScreen,
R.positionScreen]);!0===Ta.isIntersectionBox(Ja)&&z(I,M,R,0,1,2,L,U)}else if(L instanceof THREE.RenderableFace4){I=L.v1;M=L.v2;R=L.v3;ea=L.v4;if(-1>I.positionScreen.z||1<I.positionScreen.z)continue;if(-1>M.positionScreen.z||1<M.positionScreen.z)continue;if(-1>R.positionScreen.z||1<R.positionScreen.z)continue;if(-1>ea.positionScreen.z||1<ea.positionScreen.z)continue;I.positionScreen.x*=u;I.positionScreen.y*=x;M.positionScreen.x*=u;M.positionScreen.y*=x;R.positionScreen.x*=u;R.positionScreen.y*=x;ea.positionScreen.x*=
u;ea.positionScreen.y*=x;wa.positionScreen.copy(M.positionScreen);Ma.positionScreen.copy(ea.positionScreen);!0===U.overdraw&&(G(I.positionScreen,M.positionScreen),G(M.positionScreen,ea.positionScreen),G(ea.positionScreen,I.positionScreen),G(R.positionScreen,wa.positionScreen),G(R.positionScreen,Ma.positionScreen));Ja.setFromPoints([I.positionScreen,M.positionScreen,R.positionScreen,ea.positionScreen]);!0===Ta.isIntersectionBox(Ja)&&(P=I,xa=M,mb=R,Ya=ea,vb=wa,Pb=Ma,m.info.render.vertices+=4,m.info.render.faces++,
b(U.opacity),c(U.blending),void 0!==U.map&&null!==U.map||void 0!==U.envMap&&null!==U.envMap?(z(P,xa,Ya,0,1,3,L,U),z(vb,mb,Pb,1,2,3,L,U)):(A=P.positionScreen.x,ca=P.positionScreen.y,ja=xa.positionScreen.x,na=xa.positionScreen.y,N=mb.positionScreen.x,fa=mb.positionScreen.y,Wa=Ya.positionScreen.x,ab=Ya.positionScreen.y,fb=vb.positionScreen.x,Ka=vb.positionScreen.y,qa=Pb.positionScreen.x,pa=Pb.positionScreen.y,U instanceof THREE.MeshLambertMaterial||U instanceof THREE.MeshPhongMaterial?(ha.copy(U.color),
ia.copy(U.emissive),U.vertexColors===THREE.FaceColors&&ha.multiply(L.color),!1===U.wireframe&&U.shading==THREE.SmoothShading&&4==L.vertexNormalsLength?(ga.copy(tb),W.copy(tb),da.copy(tb),la.copy(tb),q(L.v1.positionWorld,L.vertexNormalsModel[0],ga),q(L.v2.positionWorld,L.vertexNormalsModel[1],W),q(L.v4.positionWorld,L.vertexNormalsModel[3],da),q(L.v3.positionWorld,L.vertexNormalsModel[2],la),ga.multiply(ha).add(ia),W.multiply(ha).add(ia),da.multiply(ha).add(ia),la.multiply(ha).add(ia),Aa=H(ga,W,da,
la),y(A,ca,ja,na,Wa,ab),J(A,ca,ja,na,Wa,ab,0,0,1,0,0,1,Aa),y(fb,Ka,N,fa,qa,pa),J(fb,Ka,N,fa,qa,pa,1,0,1,1,0,1,Aa)):(Z.copy(tb),q(L.centroidModel,L.normalModel,Z),Z.multiply(ha).add(ia),B(A,ca,ja,na,N,fa,Wa,ab),!0===U.wireframe?E(Z,U.wireframeLinewidth,U.wireframeLinecap,U.wireframeLinejoin):F(Z))):U instanceof THREE.MeshBasicMaterial?(Z.copy(U.color),U.vertexColors===THREE.FaceColors&&Z.multiply(L.color),B(A,ca,ja,na,N,fa,Wa,ab),!0===U.wireframe?E(Z,U.wireframeLinewidth,U.wireframeLinecap,U.wireframeLinejoin):
F(Z)):U instanceof THREE.MeshNormalMaterial?(P=void 0,U.shading==THREE.FlatShading?(P=L.normalModelView,Z.setRGB(P.x,P.y,P.z).multiplyScalar(0.5).addScalar(0.5),B(A,ca,ja,na,N,fa,Wa,ab),!0===U.wireframe?E(Z,U.wireframeLinewidth,U.wireframeLinecap,U.wireframeLinejoin):F(Z)):U.shading==THREE.SmoothShading&&(P=L.vertexNormalsModelView[0],ga.setRGB(P.x,P.y,P.z).multiplyScalar(0.5).addScalar(0.5),P=L.vertexNormalsModelView[1],W.setRGB(P.x,P.y,P.z).multiplyScalar(0.5).addScalar(0.5),P=L.vertexNormalsModelView[3],
da.setRGB(P.x,P.y,P.z).multiplyScalar(0.5).addScalar(0.5),P=L.vertexNormalsModelView[2],la.setRGB(P.x,P.y,P.z).multiplyScalar(0.5).addScalar(0.5),Aa=H(ga,W,da,la),y(A,ca,ja,na,Wa,ab),J(A,ca,ja,na,Wa,ab,0,0,1,0,0,1,Aa),y(fb,Ka,N,fa,qa,pa),J(fb,Ka,N,fa,qa,pa,1,0,1,1,0,1,Aa))):U instanceof THREE.MeshDepthMaterial&&(Xa=n.near,Ra=n.far,ga.r=ga.g=ga.b=1-j(P.positionScreen.z*P.positionScreen.w,Xa,Ra),W.r=W.g=W.b=1-j(xa.positionScreen.z*xa.positionScreen.w,Xa,Ra),da.r=da.g=da.b=1-j(Ya.positionScreen.z*Ya.positionScreen.w,
Xa,Ra),la.r=la.g=la.b=1-j(mb.positionScreen.z*mb.positionScreen.w,Xa,Ra),Aa=H(ga,W,da,la),y(A,ca,ja,na,Wa,ab),J(A,ca,ja,na,Wa,ab,0,0,1,0,0,1,Aa),y(fb,Ka,N,fa,qa,pa),J(fb,Ka,N,fa,qa,pa,1,0,1,1,0,1,Aa))))}ua.union(Ja)}}t.setTransform(1,0,0,1,0,0)}}};THREE.ShaderChunk={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",
envmap_pars_fragment:"#ifdef USE_ENVMAP\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform float flipEnvMap;\nuniform int combine;\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\nuniform bool useRefract;\nuniform float refractionRatio;\n#else\nvarying vec3 vReflect;\n#endif\n#endif",envmap_fragment:"#ifdef USE_ENVMAP\nvec3 reflectVec;\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\nvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\nif ( useRefract ) {\nreflectVec = refract( cameraToVertex, normal, refractionRatio );\n} else { \nreflectVec = reflect( cameraToVertex, normal );\n}\n#else\nreflectVec = vReflect;\n#endif\n#ifdef DOUBLE_SIDED\nfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\nvec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#else\nvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#endif\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\nif ( combine == 1 ) {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );\n} else if ( combine == 2 ) {\ngl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;\n} else {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );\n}\n#endif",
envmap_pars_vertex:"#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",worldpos_vertex:"#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n#ifdef USE_SKINNING\nvec4 worldPosition = modelMatrix * skinned;\n#endif\n#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\nvec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n#endif\n#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\nvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n#endif\n#endif",
envmap_vertex:"#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\nvec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;\nworldNormal = normalize( worldNormal );\nvec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\nif ( useRefract ) {\nvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n} else {\nvReflect = reflect( cameraToVertex, worldNormal );\n}\n#endif",map_particle_pars_fragment:"#ifdef USE_MAP\nuniform sampler2D map;\n#endif",
map_particle_fragment:"#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );\n#endif",map_pars_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",map_pars_fragment:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;\n#endif\n#ifdef USE_MAP\nuniform sampler2D map;\n#endif",
map_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",map_fragment:"#ifdef USE_MAP\nvec4 texelColor = texture2D( map, vUv );\n#ifdef GAMMA_INPUT\ntexelColor.xyz *= texelColor.xyz;\n#endif\ngl_FragColor = gl_FragColor * texelColor;\n#endif",lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",
lightmap_fragment:"#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",bumpmap_pars_fragment:"#ifdef USE_BUMPMAP\nuniform sampler2D bumpMap;\nuniform float bumpScale;\nvec2 dHdxy_fwd() {\nvec2 dSTdx = dFdx( vUv );\nvec2 dSTdy = dFdy( vUv );\nfloat Hll = bumpScale * texture2D( bumpMap, vUv ).x;\nfloat dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\nfloat dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\nreturn vec2( dBx, dBy );\n}\nvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\nvec3 vSigmaX = dFdx( surf_pos );\nvec3 vSigmaY = dFdy( surf_pos );\nvec3 vN = surf_norm;\nvec3 R1 = cross( vSigmaY, vN );\nvec3 R2 = cross( vN, vSigmaX );\nfloat fDet = dot( vSigmaX, R1 );\nvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\nreturn normalize( abs( fDet ) * surf_norm - vGrad );\n}\n#endif",
normalmap_pars_fragment:"#ifdef USE_NORMALMAP\nuniform sampler2D normalMap;\nuniform vec2 normalScale;\nvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\nvec3 q0 = dFdx( eye_pos.xyz );\nvec3 q1 = dFdy( eye_pos.xyz );\nvec2 st0 = dFdx( vUv.st );\nvec2 st1 = dFdy( vUv.st );\nvec3 S = normalize(  q0 * st1.t - q1 * st0.t );\nvec3 T = normalize( -q0 * st1.s + q1 * st0.s );\nvec3 N = normalize( surf_norm );\nvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\nmapN.xy = normalScale * mapN.xy;\nmat3 tsn = mat3( S, T, N );\nreturn normalize( tsn * mapN );\n}\n#endif",
specularmap_pars_fragment:"#ifdef USE_SPECULARMAP\nuniform sampler2D specularMap;\n#endif",specularmap_fragment:"float specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );\nspecularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif",lights_lambert_pars_vertex:"uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\nuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif",
lights_lambert_vertex:"vLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\nvLightBack = vec3( 0.0 );\n#endif\ntransformedNormal = normalize( transformedNormal );\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, dirVector );\nvec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\ndirectionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\ndirectionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n#ifdef DOUBLE_SIDED\nvLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n#endif\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\npointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\npointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n#ifdef DOUBLE_SIDED\nvLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\nif ( spotEffect > spotLightAngleCos[ i ] ) {\nspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\nspotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\nspotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n#ifdef DOUBLE_SIDED\nvLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\nvec3 lVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, lVector );\nfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\nfloat hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\nvLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n#ifdef DOUBLE_SIDED\nvLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n#endif\n}\n#endif\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n#ifdef DOUBLE_SIDED\nvLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n#endif",
lights_phong_pars_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvarying vec3 vWorldPosition;\n#endif",
lights_phong_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nvSpotLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvWorldPosition = worldPosition.xyz;\n#endif",
lights_phong_pars_fragment:"uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\nuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#else\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#else\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvarying vec3 vWorldPosition;\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
lights_phong_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\nnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse  = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );\nfloat lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\npointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\nvec3 pointHalfVector = normalize( lVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\npointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse  = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );\nfloat lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngleCos[ i ] ) {\nspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\nspotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\nvec3 spotHalfVector = normalize( lVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse  = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\ndirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nvec3 hemiDiffuse  = vec3( 0.0 );\nvec3 hemiSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\nvec3 lVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, lVector );\nfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\nhemiDiffuse += diffuse * hemiColor;\nvec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\nfloat hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\nfloat hemiSpecularWeightSky = specularStrength * max( pow( hemiDotNormalHalfSky, shininess ), 0.0 );\nvec3 lVectorGround = -lVector;\nvec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\nfloat hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\nfloat hemiSpecularWeightGround = specularStrength * max( pow( hemiDotNormalHalfGround, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );\nvec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );\nhemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\nhemiSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_HEMI_LIGHTS > 0\ntotalDiffuse += hemiDiffuse;\ntotalSpecular += hemiSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif",
color_pars_fragment:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_fragment:"#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",color_pars_vertex:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\n#ifdef GAMMA_INPUT\nvColor = color * color;\n#else\nvColor = color;\n#endif\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\n#ifdef BONE_TEXTURE\nuniform sampler2D boneTexture;\nmat4 getBoneMatrix( const in float i ) {\nfloat j = i * 4.0;\nfloat x = mod( j, N_BONE_PIXEL_X );\nfloat y = floor( j / N_BONE_PIXEL_X );\nconst float dx = 1.0 / N_BONE_PIXEL_X;\nconst float dy = 1.0 / N_BONE_PIXEL_Y;\ny = dy * ( y + 0.5 );\nvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\nvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\nvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\nvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\nmat4 bone = mat4( v1, v2, v3, v4 );\nreturn bone;\n}\n#else\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\nmat4 getBoneMatrix( const in float i ) {\nmat4 bone = boneGlobalMatrices[ int(i) ];\nreturn bone;\n}\n#endif\n#endif",
skinbase_vertex:"#ifdef USE_SKINNING\nmat4 boneMatX = getBoneMatrix( skinIndex.x );\nmat4 boneMatY = getBoneMatrix( skinIndex.y );\n#endif",skinning_vertex:"#ifdef USE_SKINNING\n#ifdef USE_MORPHTARGETS\nvec4 skinVertex = vec4( morphed, 1.0 );\n#else\nvec4 skinVertex = vec4( position, 1.0 );\n#endif\nvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\nskinned \t  += boneMatY * skinVertex * skinWeight.y;\n#endif",morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\n#ifndef USE_MORPHNORMALS\nuniform float morphTargetInfluences[ 8 ];\n#else\nuniform float morphTargetInfluences[ 4 ];\n#endif\n#endif",
morphtarget_vertex:"#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n#ifndef USE_MORPHNORMALS\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n#endif\nmorphed += position;\n#endif",
default_vertex:"vec4 mvPosition;\n#ifdef USE_SKINNING\nmvPosition = modelViewMatrix * skinned;\n#endif\n#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )\nmvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n#endif\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )\nmvPosition = modelViewMatrix * vec4( position, 1.0 );\n#endif\ngl_Position = projectionMatrix * mvPosition;",morphnormal_vertex:"#ifdef USE_MORPHNORMALS\nvec3 morphedNormal = vec3( 0.0 );\nmorphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\nmorphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\nmorphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\nmorphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\nmorphedNormal += normal;\n#endif",
skinnormal_vertex:"#ifdef USE_SKINNING\nmat4 skinMatrix = skinWeight.x * boneMatX;\nskinMatrix \t+= skinWeight.y * boneMatY;\n#ifdef USE_MORPHNORMALS\nvec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n#else\nvec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n#endif\n#endif",defaultnormal_vertex:"vec3 objectNormal;\n#ifdef USE_SKINNING\nobjectNormal = skinnedNormal.xyz;\n#endif\n#if !defined( USE_SKINNING ) && defined( USE_MORPHNORMALS )\nobjectNormal = morphedNormal;\n#endif\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHNORMALS )\nobjectNormal = normal;\n#endif\n#ifdef FLIP_SIDED\nobjectNormal = -objectNormal;\n#endif\nvec3 transformedNormal = normalMatrix * objectNormal;",
shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];\nuniform vec2 shadowMapSize[ MAX_SHADOWS ];\nuniform float shadowDarkness[ MAX_SHADOWS ];\nuniform float shadowBias[ MAX_SHADOWS ];\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\n#endif",shadowmap_fragment:"#ifdef USE_SHADOWMAP\n#ifdef SHADOWMAP_DEBUG\nvec3 frustumColors[3];\nfrustumColors[0] = vec3( 1.0, 0.5, 0.0 );\nfrustumColors[1] = vec3( 0.0, 1.0, 0.8 );\nfrustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n#endif\n#ifdef SHADOWMAP_CASCADE\nint inFrustumCount = 0;\n#endif\nfloat fDepth;\nvec3 shadowColor = vec3( 1.0 );\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\nbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\nbool inFrustum = all( inFrustumVec );\n#ifdef SHADOWMAP_CASCADE\ninFrustumCount += int( inFrustum );\nbvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n#else\nbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n#endif\nbool frustumTest = all( frustumTestVec );\nif ( frustumTest ) {\nshadowCoord.z += shadowBias[ i ];\n#if defined( SHADOWMAP_TYPE_PCF )\nfloat shadow = 0.0;\nconst float shadowDelta = 1.0 / 9.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.25 * xPixelOffset;\nfloat dy0 = -1.25 * yPixelOffset;\nfloat dx1 = 1.25 * xPixelOffset;\nfloat dy1 = 1.25 * yPixelOffset;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\nfloat shadow = 0.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.0 * xPixelOffset;\nfloat dy0 = -1.0 * yPixelOffset;\nfloat dx1 = 1.0 * xPixelOffset;\nfloat dy1 = 1.0 * yPixelOffset;\nmat3 shadowKernel;\nmat3 depthKernel;\ndepthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\ndepthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\ndepthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\ndepthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\ndepthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\ndepthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\ndepthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\ndepthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\ndepthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nvec3 shadowZ = vec3( shadowCoord.z );\nshadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\nshadowKernel[0] *= vec3(0.25);\nshadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\nshadowKernel[1] *= vec3(0.25);\nshadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\nshadowKernel[2] *= vec3(0.25);\nvec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\nshadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\nshadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\nvec4 shadowValues;\nshadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\nshadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\nshadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\nshadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\nshadow = dot( shadowValues, vec4( 1.0 ) );\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n#endif\n}\n#ifdef SHADOWMAP_DEBUG\n#ifdef SHADOWMAP_CASCADE\nif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n#else\nif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n#endif\n#endif\n}\n#ifdef GAMMA_OUTPUT\nshadowColor *= shadowColor;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n#endif",
shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",shadowmap_vertex:"#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n}\n#endif",alphatest_fragment:"#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif",linear_to_gamma_fragment:"#ifdef GAMMA_OUTPUT\ngl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif"};
THREE.UniformsUtils={merge:function(a){var b,c,d,e={};for(b=0;b<a.length;b++)for(c in d=this.clone(a[b]),d)e[c]=d[c];return e},clone:function(a){var b,c,d,e={};for(b in a)for(c in e[b]={},a[b])d=a[b][c],e[b][c]=d instanceof THREE.Color||d instanceof THREE.Vector2||d instanceof THREE.Vector3||d instanceof THREE.Vector4||d instanceof THREE.Matrix4||d instanceof THREE.Texture?d.clone():d instanceof Array?d.slice():d;return e}};
THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:null},specularMap:{type:"t",value:null},envMap:{type:"t",value:null},flipEnvMap:{type:"f",value:-1},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:0.98},combine:{type:"i",value:0},morphTargetInfluences:{type:"f",value:0}},bump:{bumpMap:{type:"t",
value:null},bumpScale:{type:"f",value:1}},normalmap:{normalMap:{type:"t",value:null},normalScale:{type:"v2",value:new THREE.Vector2(1,1)}},fog:{fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},hemisphereLightDirection:{type:"fv",value:[]},hemisphereLightSkyColor:{type:"fv",
value:[]},hemisphereLightGroundColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]},spotLightColor:{type:"fv",value:[]},spotLightPosition:{type:"fv",value:[]},spotLightDirection:{type:"fv",value:[]},spotLightDistance:{type:"fv1",value:[]},spotLightAngleCos:{type:"fv1",value:[]},spotLightExponent:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",
value:1},scale:{type:"f",value:1},map:{type:"t",value:null},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},shadowmap:{shadowMap:{type:"tv",value:[]},shadowMapSize:{type:"v2v",value:[]},shadowBias:{type:"fv1",value:[]},shadowDarkness:{type:"fv1",value:[]},shadowMatrix:{type:"m4v",value:[]}}};
THREE.ShaderLib={basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,
THREE.ShaderChunk.skinbase_vertex,"#ifdef USE_ENVMAP",THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"#endif",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,
THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,"void main() {\ngl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,
THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["#define LAMBERT\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",
THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_lambert_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,
THREE.ShaderChunk.defaultnormal_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.lights_lambert_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,
THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,"#ifdef DOUBLE_SIDED\nif ( gl_FrontFacing )\ngl_FragColor.xyz *= vLightFront;\nelse\ngl_FragColor.xyz *= vLightBack;\n#else\ngl_FragColor.xyz *= vLightFront;\n#endif",THREE.ShaderChunk.lightmap_fragment,
THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.bump,THREE.UniformsLib.normalmap,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},specular:{type:"c",
value:new THREE.Color(1118481)},shininess:{type:"f",value:30},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["#define PHONG\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,
"void main() {",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"vNormal = normalize( transformedNormal );",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,"vViewPosition = -mvPosition.xyz;",THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,
THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_phong_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,
THREE.ShaderChunk.bumpmap_pars_fragment,THREE.ShaderChunk.normalmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,THREE.ShaderChunk.lights_phong_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,
THREE.ShaderChunk.fog_fragment,"}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;",
THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( psColor, opacity );",THREE.ShaderChunk.map_particle_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.shadowmap_fragment,
THREE.ShaderChunk.fog_fragment,"}"].join("\n")},dashed:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,{scale:{type:"f",value:1},dashSize:{type:"f",value:1},totalSize:{type:"f",value:2}}]),vertexShader:["uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;",THREE.ShaderChunk.color_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"vLineDistance = scale * lineDistance;\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\n}"].join("\n"),
fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,"void main() {\nif ( mod( vLineDistance, totalSize ) > dashSize ) {\ndiscard;\n}\ngl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3},opacity:{type:"f",
value:1}},vertexShader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}"},normal:{uniforms:{opacity:{type:"f",value:1}},vertexShader:["varying vec3 vNormal;",THREE.ShaderChunk.morphtarget_pars_vertex,"void main() {\nvNormal = normalize( normalMatrix * normal );",
THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,"}"].join("\n"),fragmentShader:"uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}"},normalmap:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{enableAO:{type:"i",value:0},enableDiffuse:{type:"i",value:0},enableSpecular:{type:"i",value:0},enableReflection:{type:"i",value:0},enableDisplacement:{type:"i",
value:0},tDisplacement:{type:"t",value:null},tDiffuse:{type:"t",value:null},tCube:{type:"t",value:null},tNormal:{type:"t",value:null},tSpecular:{type:"t",value:null},tAO:{type:"t",value:null},uNormalScale:{type:"v2",value:new THREE.Vector2(1,1)},uDisplacementBias:{type:"f",value:0},uDisplacementScale:{type:"f",value:1},uDiffuseColor:{type:"c",value:new THREE.Color(16777215)},uSpecularColor:{type:"c",value:new THREE.Color(1118481)},uAmbientColor:{type:"c",value:new THREE.Color(16777215)},uShininess:{type:"f",
value:30},uOpacity:{type:"f",value:1},useRefract:{type:"i",value:0},uRefractionRatio:{type:"f",value:0.98},uReflectivity:{type:"f",value:0.5},uOffset:{type:"v2",value:new THREE.Vector2(0,0)},uRepeat:{type:"v2",value:new THREE.Vector2(1,1)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),fragmentShader:["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform vec2 uNormalScale;\nuniform bool useRefract;\nuniform float uRefractionRatio;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\nuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vWorldPosition;\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse ) {\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( tDiffuse, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n#endif\n}\nif( enableAO ) {\n#ifdef GAMMA_INPUT\nvec4 aoColor = texture2D( tAO, vUv );\naoColor.xyz *= aoColor.xyz;\ngl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n#endif\n}\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\nvec3 finalNormal = tsb * normalTex;\n#ifdef FLIP_SIDED\nfinalNormal = -finalNormal;\n#endif\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 pointVector = lPosition.xyz + vViewPosition.xyz;\nfloat pointDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\npointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );\npointVector = normalize( pointVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n#endif\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\nvec3 pointHalfVector = normalize( pointVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;\n#else\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 spotVector = lPosition.xyz + vViewPosition.xyz;\nfloat spotDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nspotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );\nspotVector = normalize( spotVector );\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngleCos[ i ] ) {\nspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );\n#endif\nspotDiffuse += spotDistance * spotLightColor[ i ] * uDiffuseColor * spotDiffuseWeight * spotEffect;\nvec3 spotHalfVector = normalize( spotVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( spotVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += spotDistance * spotLightColor[ i ] * uSpecularColor * spotSpecularWeight * spotDiffuseWeight * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\n#ifdef WRAP_AROUND\nfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\nfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n#endif\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nvec3 hemiDiffuse  = vec3( 0.0 );\nvec3 hemiSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\nvec3 lVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, lVector );\nfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\nhemiDiffuse += uDiffuseColor * hemiColor;\nvec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\nfloat hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\nfloat hemiSpecularWeightSky = specularTex.r * max( pow( hemiDotNormalHalfSky, uShininess ), 0.0 );\nvec3 lVectorGround = -lVector;\nvec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\nfloat hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\nfloat hemiSpecularWeightGround = specularTex.r * max( pow( hemiDotNormalHalfGround, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlickSky = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );\nvec3 schlickGround = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );\nhemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\nhemiSpecular += uSpecularColor * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_HEMI_LIGHTS > 0\ntotalDiffuse += hemiDiffuse;\ntotalSpecular += hemiSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor ) + totalSpecular;\n#endif\nif ( enableReflection ) {\nvec3 vReflect;\nvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\nif ( useRefract ) {\nvReflect = refract( cameraToVertex, normal, uRefractionRatio );\n} else {\nvReflect = reflect( cameraToVertex, normal );\n}\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * uReflectivity );\n}",
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n"),vertexShader:["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\nuniform bool enableDisplacement;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vWorldPosition;\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,"#ifdef USE_SKINNING\nvNormal = normalize( normalMatrix * skinnedNormal.xyz );\nvec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );\nvTangent = normalize( normalMatrix * skinnedTangent.xyz );\n#else\nvNormal = normalize( normalMatrix * normal );\nvTangent = normalize( normalMatrix * tangent.xyz );\n#endif\nvBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );\nvUv = uv * uRepeat + uOffset;\nvec3 displacedPosition;\n#ifdef VERTEX_TEXTURES\nif ( enableDisplacement ) {\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\ndisplacedPosition = position + normalize( normal ) * df;\n} else {\n#ifdef USE_SKINNING\nvec4 skinVertex = vec4( position, 1.0 );\nvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\nskinned \t  += boneMatY * skinVertex * skinWeight.y;\ndisplacedPosition  = skinned.xyz;\n#else\ndisplacedPosition = position;\n#endif\n}\n#else\n#ifdef USE_SKINNING\nvec4 skinVertex = vec4( position, 1.0 );\nvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\nskinned \t  += boneMatY * skinVertex * skinWeight.y;\ndisplacedPosition  = skinned.xyz;\n#else\ndisplacedPosition = position;\n#endif\n#endif\nvec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );\nvec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\nvWorldPosition = worldPosition.xyz;\nvViewPosition = -mvPosition.xyz;\n#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n}\n#endif\n}"].join("\n")},
cube:{uniforms:{tCube:{type:"t",value:null},tFlip:{type:"f",value:-1}},vertexShader:"varying vec3 vWorldPosition;\nvoid main() {\nvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\nvWorldPosition = worldPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vWorldPosition;\nvoid main() {\ngl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n}"},
depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,"void main() {",THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,"}"].join("\n"),fragmentShader:"vec4 pack_depth( const in float depth ) {\nconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\nconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bit_shift );\nres -= res.xxyz * bit_mask;\nreturn res;\n}\nvoid main() {\ngl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n}"}};THREE.WebGLRenderer=function(a){function b(a){if(a.__webglCustomAttributesList)for(var b in a.__webglCustomAttributesList)k.deleteBuffer(a.__webglCustomAttributesList[b].buffer)}function c(a,b){var c=a.vertices.length,d=b.material;if(d.attributes){void 0===a.__webglCustomAttributesList&&(a.__webglCustomAttributesList=[]);for(var e in d.attributes){var f=d.attributes[e];if(!f.__webglInitialized||f.createUniqueBuffers){f.__webglInitialized=!0;var g=1;"v2"===f.type?g=2:"v3"===f.type?g=3:"v4"===f.type?
g=4:"c"===f.type&&(g=3);f.size=g;f.array=new Float32Array(c*g);f.buffer=k.createBuffer();f.buffer.belongsToAttribute=e;f.needsUpdate=!0}a.__webglCustomAttributesList.push(f)}}}function d(a,b){var c=b.geometry,d=a.faces3,h=a.faces4,i=3*d.length+4*h.length,j=1*d.length+2*h.length,h=3*d.length+4*h.length,d=e(b,a),p=g(d),m=f(d),l=d.vertexColors?d.vertexColors:!1;a.__vertexArray=new Float32Array(3*i);m&&(a.__normalArray=new Float32Array(3*i));c.hasTangents&&(a.__tangentArray=new Float32Array(4*i));l&&
(a.__colorArray=new Float32Array(3*i));if(p){if(0<c.faceUvs.length||0<c.faceVertexUvs.length)a.__uvArray=new Float32Array(2*i);if(1<c.faceUvs.length||1<c.faceVertexUvs.length)a.__uv2Array=new Float32Array(2*i)}b.geometry.skinWeights.length&&b.geometry.skinIndices.length&&(a.__skinIndexArray=new Float32Array(4*i),a.__skinWeightArray=new Float32Array(4*i));a.__faceArray=new Uint16Array(3*j);a.__lineArray=new Uint16Array(2*h);if(a.numMorphTargets){a.__morphTargetsArrays=[];c=0;for(p=a.numMorphTargets;c<
p;c++)a.__morphTargetsArrays.push(new Float32Array(3*i))}if(a.numMorphNormals){a.__morphNormalsArrays=[];c=0;for(p=a.numMorphNormals;c<p;c++)a.__morphNormalsArrays.push(new Float32Array(3*i))}a.__webglFaceCount=3*j;a.__webglLineCount=2*h;if(d.attributes){void 0===a.__webglCustomAttributesList&&(a.__webglCustomAttributesList=[]);for(var n in d.attributes){var j=d.attributes[n],c={},q;for(q in j)c[q]=j[q];if(!c.__webglInitialized||c.createUniqueBuffers)c.__webglInitialized=!0,h=1,"v2"===c.type?h=2:
"v3"===c.type?h=3:"v4"===c.type?h=4:"c"===c.type&&(h=3),c.size=h,c.array=new Float32Array(i*h),c.buffer=k.createBuffer(),c.buffer.belongsToAttribute=n,j.needsUpdate=!0,c.__original=j;a.__webglCustomAttributesList.push(c)}}a.__inittedArrays=!0}function e(a,b){return a.material instanceof THREE.MeshFaceMaterial?a.material.materials[b.materialIndex]:a.material}function f(a){return a instanceof THREE.MeshBasicMaterial&&!a.envMap||a instanceof THREE.MeshDepthMaterial?!1:a&&void 0!==a.shading&&a.shading===
THREE.SmoothShading?THREE.SmoothShading:THREE.FlatShading}function g(a){return a.map||a.lightMap||a.bumpMap||a.normalMap||a.specularMap||a instanceof THREE.ShaderMaterial?!0:!1}function h(a){Ta[a]||(k.enableVertexAttribArray(a),Ta[a]=!0)}function i(){for(var a in Ta)Ta[a]&&(k.disableVertexAttribArray(a),Ta[a]=!1)}function j(a,b){return a.z!==b.z?b.z-a.z:a.id-b.id}function m(a,b){return b[0]-a[0]}function p(a,b,c){if(a.length)for(var d=0,e=a.length;d<e;d++)pa=ab=null,Ka=qa=da=W=oa=kb=la=-1,bb=!0,a[d].render(b,
c,Tb,Ub),pa=ab=null,Ka=qa=da=W=oa=kb=la=-1,bb=!0}function l(a,b,c,d,e,f,g,h){var i,k,j,p;b?(k=a.length-1,p=b=-1):(k=0,b=a.length,p=1);for(var m=k;m!==b;m+=p)if(i=a[m],i.render){k=i.object;j=i.buffer;if(h)i=h;else{i=i[c];if(!i)continue;g&&N.setBlending(i.blending,i.blendEquation,i.blendSrc,i.blendDst);N.setDepthTest(i.depthTest);N.setDepthWrite(i.depthWrite);K(i.polygonOffset,i.polygonOffsetFactor,i.polygonOffsetUnits)}N.setMaterialFaces(i);j instanceof THREE.BufferGeometry?N.renderBufferDirect(d,
e,f,i,j,k):N.renderBuffer(d,e,f,i,j,k)}}function r(a,b,c,d,e,f,g){for(var h,i,k=0,j=a.length;k<j;k++)if(h=a[k],i=h.object,i.visible){if(g)h=g;else{h=h[b];if(!h)continue;f&&N.setBlending(h.blending,h.blendEquation,h.blendSrc,h.blendDst);N.setDepthTest(h.depthTest);N.setDepthWrite(h.depthWrite);K(h.polygonOffset,h.polygonOffsetFactor,h.polygonOffsetUnits)}N.renderImmediateObject(c,d,e,h,i)}}function s(a,b){var e,f,g,h;if(void 0===a.__webglInit&&(a.__webglInit=!0,a._modelViewMatrix=new THREE.Matrix4,
a._normalMatrix=new THREE.Matrix3,void 0!==a.geometry&&void 0===a.geometry.__webglInit&&(a.geometry.__webglInit=!0,a.geometry.addEventListener("dispose",gc)),f=a.geometry,void 0!==f))if(f instanceof THREE.BufferGeometry){var i,j;for(i in f.attributes)j="index"===i?k.ELEMENT_ARRAY_BUFFER:k.ARRAY_BUFFER,h=f.attributes[i],h.buffer=k.createBuffer(),k.bindBuffer(j,h.buffer),k.bufferData(j,h.array,k.STATIC_DRAW)}else if(a instanceof THREE.Mesh){g=a.material;if(void 0===f.geometryGroups){i=f;var p,m,l,q,
r;j={};var s=i.morphTargets.length,t=i.morphNormals.length,u=g instanceof THREE.MeshFaceMaterial;i.geometryGroups={};g=0;for(p=i.faces.length;g<p;g++)m=i.faces[g],l=u?m.materialIndex:0,void 0===j[l]&&(j[l]={hash:l,counter:0}),r=j[l].hash+"_"+j[l].counter,void 0===i.geometryGroups[r]&&(i.geometryGroups[r]={faces3:[],faces4:[],materialIndex:l,vertices:0,numMorphTargets:s,numMorphNormals:t}),q=m instanceof THREE.Face3?3:4,65535<i.geometryGroups[r].vertices+q&&(j[l].counter+=1,r=j[l].hash+"_"+j[l].counter,
void 0===i.geometryGroups[r]&&(i.geometryGroups[r]={faces3:[],faces4:[],materialIndex:l,vertices:0,numMorphTargets:s,numMorphNormals:t})),m instanceof THREE.Face3?i.geometryGroups[r].faces3.push(g):i.geometryGroups[r].faces4.push(g),i.geometryGroups[r].vertices+=q;i.geometryGroupsList=[];for(h in i.geometryGroups)i.geometryGroups[h].id=Z++,i.geometryGroupsList.push(i.geometryGroups[h])}for(e in f.geometryGroups)if(h=f.geometryGroups[e],!h.__webglVertexBuffer){i=h;i.__webglVertexBuffer=k.createBuffer();
i.__webglNormalBuffer=k.createBuffer();i.__webglTangentBuffer=k.createBuffer();i.__webglColorBuffer=k.createBuffer();i.__webglUVBuffer=k.createBuffer();i.__webglUV2Buffer=k.createBuffer();i.__webglSkinIndicesBuffer=k.createBuffer();i.__webglSkinWeightsBuffer=k.createBuffer();i.__webglFaceBuffer=k.createBuffer();i.__webglLineBuffer=k.createBuffer();s=j=void 0;if(i.numMorphTargets){i.__webglMorphTargetsBuffers=[];j=0;for(s=i.numMorphTargets;j<s;j++)i.__webglMorphTargetsBuffers.push(k.createBuffer())}if(i.numMorphNormals){i.__webglMorphNormalsBuffers=
[];j=0;for(s=i.numMorphNormals;j<s;j++)i.__webglMorphNormalsBuffers.push(k.createBuffer())}N.info.memory.geometries++;d(h,a);f.verticesNeedUpdate=!0;f.morphTargetsNeedUpdate=!0;f.elementsNeedUpdate=!0;f.uvsNeedUpdate=!0;f.normalsNeedUpdate=!0;f.tangentsNeedUpdate=!0;f.colorsNeedUpdate=!0}}else a instanceof THREE.Ribbon?f.__webglVertexBuffer||(h=f,h.__webglVertexBuffer=k.createBuffer(),h.__webglColorBuffer=k.createBuffer(),h.__webglNormalBuffer=k.createBuffer(),N.info.memory.geometries++,h=f,i=h.vertices.length,
h.__vertexArray=new Float32Array(3*i),h.__colorArray=new Float32Array(3*i),h.__normalArray=new Float32Array(3*i),h.__webglVertexCount=i,c(h,a),f.verticesNeedUpdate=!0,f.colorsNeedUpdate=!0,f.normalsNeedUpdate=!0):a instanceof THREE.Line?f.__webglVertexBuffer||(h=f,h.__webglVertexBuffer=k.createBuffer(),h.__webglColorBuffer=k.createBuffer(),h.__webglLineDistanceBuffer=k.createBuffer(),N.info.memory.geometries++,h=f,i=h.vertices.length,h.__vertexArray=new Float32Array(3*i),h.__colorArray=new Float32Array(3*
i),h.__lineDistanceArray=new Float32Array(1*i),h.__webglLineCount=i,c(h,a),f.verticesNeedUpdate=!0,f.colorsNeedUpdate=!0,f.lineDistancesNeedUpdate=!0):a instanceof THREE.ParticleSystem&&!f.__webglVertexBuffer&&(h=f,h.__webglVertexBuffer=k.createBuffer(),h.__webglColorBuffer=k.createBuffer(),N.info.memory.geometries++,h=f,i=h.vertices.length,h.__vertexArray=new Float32Array(3*i),h.__colorArray=new Float32Array(3*i),h.__sortArray=[],h.__webglParticleCount=i,c(h,a),f.verticesNeedUpdate=!0,f.colorsNeedUpdate=
!0);if(void 0===a.__webglActive){if(a instanceof THREE.Mesh)if(f=a.geometry,f instanceof THREE.BufferGeometry)n(b.__webglObjects,f,a);else{if(f instanceof THREE.Geometry)for(e in f.geometryGroups)h=f.geometryGroups[e],n(b.__webglObjects,h,a)}else a instanceof THREE.Ribbon||a instanceof THREE.Line||a instanceof THREE.ParticleSystem?(f=a.geometry,n(b.__webglObjects,f,a)):a instanceof THREE.ImmediateRenderObject||a.immediateRenderCallback?b.__webglObjectsImmediate.push({object:a,opaque:null,transparent:null}):
a instanceof THREE.Sprite?b.__webglSprites.push(a):a instanceof THREE.LensFlare&&b.__webglFlares.push(a);a.__webglActive=!0}}function n(a,b,c){a.push({buffer:b,object:c,opaque:null,transparent:null})}function q(a){for(var b in a.attributes)if(a.attributes[b].needsUpdate)return!0;return!1}function y(a){for(var b in a.attributes)a.attributes[b].needsUpdate=!1}function u(a,b){a instanceof THREE.Mesh||a instanceof THREE.ParticleSystem||a instanceof THREE.Ribbon||a instanceof THREE.Line?x(b.__webglObjects,
a):a instanceof THREE.Sprite?t(b.__webglSprites,a):a instanceof THREE.LensFlare?t(b.__webglFlares,a):(a instanceof THREE.ImmediateRenderObject||a.immediateRenderCallback)&&x(b.__webglObjectsImmediate,a);delete a.__webglActive}function x(a,b){for(var c=a.length-1;0<=c;c--)a[c].object===b&&a.splice(c,1)}function t(a,b){for(var c=a.length-1;0<=c;c--)a[c]===b&&a.splice(c,1)}function E(a,b,c,d,e){ga=0;d.needsUpdate&&(d.program&&pc(d),N.initMaterial(d,b,c,e),d.needsUpdate=!1);d.morphTargets&&!e.__webglMorphTargetInfluences&&
(e.__webglMorphTargetInfluences=new Float32Array(N.maxMorphTargets));var f=!1,g=d.program,h=g.uniforms,i=d.uniforms;g!==ab&&(k.useProgram(g),ab=g,f=!0);d.id!==Ka&&(Ka=d.id,f=!0);if(f||a!==pa)k.uniformMatrix4fv(h.projectionMatrix,!1,a.projectionMatrix.elements),a!==pa&&(pa=a);if(d.skinning)if(Vb&&e.useVertexTexture){if(null!==h.boneTexture){var j=J();k.uniform1i(h.boneTexture,j);N.setTexture(e.boneTexture,j)}}else null!==h.boneGlobalMatrices&&k.uniformMatrix4fv(h.boneGlobalMatrices,!1,e.boneMatrices);
if(f){c&&d.fog&&(i.fogColor.value=c.color,c instanceof THREE.Fog?(i.fogNear.value=c.near,i.fogFar.value=c.far):c instanceof THREE.FogExp2&&(i.fogDensity.value=c.density));if(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d.lights){if(bb){for(var p,l=j=0,m=0,n,q,r,s=Ab,t=s.directional.colors,u=s.directional.positions,x=s.point.colors,y=s.point.positions,E=s.point.distances,C=s.spot.colors,G=s.spot.positions,H=s.spot.distances,D=s.spot.directions,L=s.spot.anglesCos,K=
s.spot.exponents,O=s.hemi.skyColors,A=s.hemi.groundColors,U=s.hemi.positions,R=0,V=0,fa=0,W=0,Z=0,S=0,T=0,Q=0,aa=p=0,c=r=aa=0,f=b.length;c<f;c++)p=b[c],p.onlyShadow||(n=p.color,q=p.intensity,r=p.distance,p instanceof THREE.AmbientLight?p.visible&&(N.gammaInput?(j+=n.r*n.r,l+=n.g*n.g,m+=n.b*n.b):(j+=n.r,l+=n.g,m+=n.b)):p instanceof THREE.DirectionalLight?(Z+=1,p.visible&&(ra.getPositionFromMatrix(p.matrixWorld),Na.getPositionFromMatrix(p.target.matrixWorld),ra.sub(Na),ra.normalize(),0===ra.x&&0===
ra.y&&0===ra.z||(p=3*R,u[p]=ra.x,u[p+1]=ra.y,u[p+2]=ra.z,N.gammaInput?F(t,p,n,q*q):z(t,p,n,q),R+=1))):p instanceof THREE.PointLight?(S+=1,p.visible&&(aa=3*V,N.gammaInput?F(x,aa,n,q*q):z(x,aa,n,q),Na.getPositionFromMatrix(p.matrixWorld),y[aa]=Na.x,y[aa+1]=Na.y,y[aa+2]=Na.z,E[V]=r,V+=1)):p instanceof THREE.SpotLight?(T+=1,p.visible&&(aa=3*fa,N.gammaInput?F(C,aa,n,q*q):z(C,aa,n,q),Na.getPositionFromMatrix(p.matrixWorld),G[aa]=Na.x,G[aa+1]=Na.y,G[aa+2]=Na.z,H[fa]=r,ra.copy(Na),Na.getPositionFromMatrix(p.target.matrixWorld),
ra.sub(Na),ra.normalize(),D[aa]=ra.x,D[aa+1]=ra.y,D[aa+2]=ra.z,L[fa]=Math.cos(p.angle),K[fa]=p.exponent,fa+=1)):p instanceof THREE.HemisphereLight&&(Q+=1,p.visible&&(ra.getPositionFromMatrix(p.matrixWorld),ra.normalize(),0===ra.x&&0===ra.y&&0===ra.z||(r=3*W,U[r]=ra.x,U[r+1]=ra.y,U[r+2]=ra.z,n=p.color,p=p.groundColor,N.gammaInput?(q*=q,F(O,r,n,q),F(A,r,p,q)):(z(O,r,n,q),z(A,r,p,q)),W+=1))));c=3*R;for(f=Math.max(t.length,3*Z);c<f;c++)t[c]=0;c=3*V;for(f=Math.max(x.length,3*S);c<f;c++)x[c]=0;c=3*fa;for(f=
Math.max(C.length,3*T);c<f;c++)C[c]=0;c=3*W;for(f=Math.max(O.length,3*Q);c<f;c++)O[c]=0;c=3*W;for(f=Math.max(A.length,3*Q);c<f;c++)A[c]=0;s.directional.length=R;s.point.length=V;s.spot.length=fa;s.hemi.length=W;s.ambient[0]=j;s.ambient[1]=l;s.ambient[2]=m;bb=!1}c=Ab;i.ambientLightColor.value=c.ambient;i.directionalLightColor.value=c.directional.colors;i.directionalLightDirection.value=c.directional.positions;i.pointLightColor.value=c.point.colors;i.pointLightPosition.value=c.point.positions;i.pointLightDistance.value=
c.point.distances;i.spotLightColor.value=c.spot.colors;i.spotLightPosition.value=c.spot.positions;i.spotLightDistance.value=c.spot.distances;i.spotLightDirection.value=c.spot.directions;i.spotLightAngleCos.value=c.spot.anglesCos;i.spotLightExponent.value=c.spot.exponents;i.hemisphereLightSkyColor.value=c.hemi.skyColors;i.hemisphereLightGroundColor.value=c.hemi.groundColors;i.hemisphereLightDirection.value=c.hemi.positions}if(d instanceof THREE.MeshBasicMaterial||d instanceof THREE.MeshLambertMaterial||
d instanceof THREE.MeshPhongMaterial){i.opacity.value=d.opacity;N.gammaInput?i.diffuse.value.copyGammaToLinear(d.color):i.diffuse.value=d.color;i.map.value=d.map;i.lightMap.value=d.lightMap;i.specularMap.value=d.specularMap;d.bumpMap&&(i.bumpMap.value=d.bumpMap,i.bumpScale.value=d.bumpScale);d.normalMap&&(i.normalMap.value=d.normalMap,i.normalScale.value.copy(d.normalScale));var P;d.map?P=d.map:d.specularMap?P=d.specularMap:d.normalMap?P=d.normalMap:d.bumpMap&&(P=d.bumpMap);void 0!==P&&(c=P.offset,
P=P.repeat,i.offsetRepeat.value.set(c.x,c.y,P.x,P.y));i.envMap.value=d.envMap;i.flipEnvMap.value=d.envMap instanceof THREE.WebGLRenderTargetCube?1:-1;i.reflectivity.value=d.reflectivity;i.refractionRatio.value=d.refractionRatio;i.combine.value=d.combine;i.useRefract.value=d.envMap&&d.envMap.mapping instanceof THREE.CubeRefractionMapping}d instanceof THREE.LineBasicMaterial?(i.diffuse.value=d.color,i.opacity.value=d.opacity):d instanceof THREE.LineDashedMaterial?(i.diffuse.value=d.color,i.opacity.value=
d.opacity,i.dashSize.value=d.dashSize,i.totalSize.value=d.dashSize+d.gapSize,i.scale.value=d.scale):d instanceof THREE.ParticleBasicMaterial?(i.psColor.value=d.color,i.opacity.value=d.opacity,i.size.value=d.size,i.scale.value=M.height/2,i.map.value=d.map):d instanceof THREE.MeshPhongMaterial?(i.shininess.value=d.shininess,N.gammaInput?(i.ambient.value.copyGammaToLinear(d.ambient),i.emissive.value.copyGammaToLinear(d.emissive),i.specular.value.copyGammaToLinear(d.specular)):(i.ambient.value=d.ambient,
i.emissive.value=d.emissive,i.specular.value=d.specular),d.wrapAround&&i.wrapRGB.value.copy(d.wrapRGB)):d instanceof THREE.MeshLambertMaterial?(N.gammaInput?(i.ambient.value.copyGammaToLinear(d.ambient),i.emissive.value.copyGammaToLinear(d.emissive)):(i.ambient.value=d.ambient,i.emissive.value=d.emissive),d.wrapAround&&i.wrapRGB.value.copy(d.wrapRGB)):d instanceof THREE.MeshDepthMaterial?(i.mNear.value=a.near,i.mFar.value=a.far,i.opacity.value=d.opacity):d instanceof THREE.MeshNormalMaterial&&(i.opacity.value=
d.opacity);if(e.receiveShadow&&!d._shadowPass&&i.shadowMatrix){c=P=0;for(f=b.length;c<f;c++)if(j=b[c],j.castShadow&&(j instanceof THREE.SpotLight||j instanceof THREE.DirectionalLight&&!j.shadowCascade))i.shadowMap.value[P]=j.shadowMap,i.shadowMapSize.value[P]=j.shadowMapSize,i.shadowMatrix.value[P]=j.shadowMatrix,i.shadowDarkness.value[P]=j.shadowDarkness,i.shadowBias.value[P]=j.shadowBias,P++}b=d.uniformsList;i=0;for(P=b.length;i<P;i++)if(f=g.uniforms[b[i][1]])if(c=b[i][0],l=c.type,j=c.value,"i"===
l)k.uniform1i(f,j);else if("f"===l)k.uniform1f(f,j);else if("v2"===l)k.uniform2f(f,j.x,j.y);else if("v3"===l)k.uniform3f(f,j.x,j.y,j.z);else if("v4"===l)k.uniform4f(f,j.x,j.y,j.z,j.w);else if("c"===l)k.uniform3f(f,j.r,j.g,j.b);else if("iv1"===l)k.uniform1iv(f,j);else if("iv"===l)k.uniform3iv(f,j);else if("fv1"===l)k.uniform1fv(f,j);else if("fv"===l)k.uniform3fv(f,j);else if("v2v"===l){void 0===c._array&&(c._array=new Float32Array(2*j.length));l=0;for(m=j.length;l<m;l++)s=2*l,c._array[s]=j[l].x,c._array[s+
1]=j[l].y;k.uniform2fv(f,c._array)}else if("v3v"===l){void 0===c._array&&(c._array=new Float32Array(3*j.length));l=0;for(m=j.length;l<m;l++)s=3*l,c._array[s]=j[l].x,c._array[s+1]=j[l].y,c._array[s+2]=j[l].z;k.uniform3fv(f,c._array)}else if("v4v"===l){void 0===c._array&&(c._array=new Float32Array(4*j.length));l=0;for(m=j.length;l<m;l++)s=4*l,c._array[s]=j[l].x,c._array[s+1]=j[l].y,c._array[s+2]=j[l].z,c._array[s+3]=j[l].w;k.uniform4fv(f,c._array)}else if("m4"===l)void 0===c._array&&(c._array=new Float32Array(16)),
j.flattenToArray(c._array),k.uniformMatrix4fv(f,!1,c._array);else if("m4v"===l){void 0===c._array&&(c._array=new Float32Array(16*j.length));l=0;for(m=j.length;l<m;l++)j[l].flattenToArrayOffset(c._array,16*l);k.uniformMatrix4fv(f,!1,c._array)}else if("t"===l){if(s=j,j=J(),k.uniform1i(f,j),s)if(s.image instanceof Array&&6===s.image.length){if(c=s,f=j,6===c.image.length)if(c.needsUpdate){c.image.__webglTextureCube||(c.image.__webglTextureCube=k.createTexture(),N.info.memory.textures++);k.activeTexture(k.TEXTURE0+
f);k.bindTexture(k.TEXTURE_CUBE_MAP,c.image.__webglTextureCube);k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,c.flipY);f=c instanceof THREE.CompressedTexture;j=[];for(l=0;6>l;l++)N.autoScaleCubemaps&&!f?(m=j,s=l,t=c.image[l],x=Ic,t.width<=x&&t.height<=x||(y=Math.max(t.width,t.height),u=Math.floor(t.width*x/y),x=Math.floor(t.height*x/y),y=document.createElement("canvas"),y.width=u,y.height=x,y.getContext("2d").drawImage(t,0,0,t.width,t.height,0,0,u,x),t=y),m[s]=t):j[l]=c.image[l];l=j[0];m=0===(l.width&l.width-
1)&&0===(l.height&l.height-1);s=I(c.format);t=I(c.type);B(k.TEXTURE_CUBE_MAP,c,m);for(l=0;6>l;l++)if(f){x=j[l].mipmaps;y=0;for(E=x.length;y<E;y++)u=x[y],k.compressedTexImage2D(k.TEXTURE_CUBE_MAP_POSITIVE_X+l,y,s,u.width,u.height,0,u.data)}else k.texImage2D(k.TEXTURE_CUBE_MAP_POSITIVE_X+l,0,s,s,t,j[l]);c.generateMipmaps&&m&&k.generateMipmap(k.TEXTURE_CUBE_MAP);c.needsUpdate=!1;if(c.onUpdate)c.onUpdate()}else k.activeTexture(k.TEXTURE0+f),k.bindTexture(k.TEXTURE_CUBE_MAP,c.image.__webglTextureCube)}else s instanceof
THREE.WebGLRenderTargetCube?(c=s,k.activeTexture(k.TEXTURE0+j),k.bindTexture(k.TEXTURE_CUBE_MAP,c.__webglTexture)):N.setTexture(s,j)}else if("tv"===l){void 0===c._array&&(c._array=[]);l=0;for(m=c.value.length;l<m;l++)c._array[l]=J();k.uniform1iv(f,c._array);l=0;for(m=c.value.length;l<m;l++)s=c.value[l],j=c._array[l],s&&N.setTexture(s,j)}if((d instanceof THREE.ShaderMaterial||d instanceof THREE.MeshPhongMaterial||d.envMap)&&null!==h.cameraPosition)Na.getPositionFromMatrix(a.matrixWorld),k.uniform3f(h.cameraPosition,
Na.x,Na.y,Na.z);(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.ShaderMaterial||d.skinning)&&null!==h.viewMatrix&&k.uniformMatrix4fv(h.viewMatrix,!1,a.matrixWorldInverse.elements)}k.uniformMatrix4fv(h.modelViewMatrix,!1,e._modelViewMatrix.elements);h.normalMatrix&&k.uniformMatrix3fv(h.normalMatrix,!1,e._normalMatrix.elements);null!==h.modelMatrix&&k.uniformMatrix4fv(h.modelMatrix,!1,e.matrixWorld.elements);return g}function J(){var a=ga;a>=cc&&console.warn("WebGLRenderer: trying to use "+
a+" texture units while this GPU supports only "+cc);ga+=1;return a}function F(a,b,c,d){a[b]=c.r*c.r*d;a[b+1]=c.g*c.g*d;a[b+2]=c.b*c.b*d}function z(a,b,c,d){a[b]=c.r*d;a[b+1]=c.g*d;a[b+2]=c.b*d}function H(a){a!==Sa&&(k.lineWidth(a),Sa=a)}function K(a,b,c){Xa!==a&&(a?k.enable(k.POLYGON_OFFSET_FILL):k.disable(k.POLYGON_OFFSET_FILL),Xa=a);if(a&&(Ra!==b||Aa!==c))k.polygonOffset(b,c),Ra=b,Aa=c}function G(a){for(var a=a.split("\n"),b=0,c=a.length;b<c;b++)a[b]=b+1+": "+a[b];return a.join("\n")}function L(a,
b){var c;"fragment"===a?c=k.createShader(k.FRAGMENT_SHADER):"vertex"===a&&(c=k.createShader(k.VERTEX_SHADER));k.shaderSource(c,b);k.compileShader(c);return!k.getShaderParameter(c,k.COMPILE_STATUS)?(console.error(k.getShaderInfoLog(c)),console.error(G(b)),null):c}function B(a,b,c){c?(k.texParameteri(a,k.TEXTURE_WRAP_S,I(b.wrapS)),k.texParameteri(a,k.TEXTURE_WRAP_T,I(b.wrapT)),k.texParameteri(a,k.TEXTURE_MAG_FILTER,I(b.magFilter)),k.texParameteri(a,k.TEXTURE_MIN_FILTER,I(b.minFilter))):(k.texParameteri(a,
k.TEXTURE_WRAP_S,k.CLAMP_TO_EDGE),k.texParameteri(a,k.TEXTURE_WRAP_T,k.CLAMP_TO_EDGE),k.texParameteri(a,k.TEXTURE_MAG_FILTER,C(b.magFilter)),k.texParameteri(a,k.TEXTURE_MIN_FILTER,C(b.minFilter)));if(lb&&b.type!==THREE.FloatType&&(1<b.anisotropy||b.__oldAnisotropy))k.texParameterf(a,lb.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,dc)),b.__oldAnisotropy=b.anisotropy}function V(a,b){k.bindRenderbuffer(k.RENDERBUFFER,a);b.depthBuffer&&!b.stencilBuffer?(k.renderbufferStorage(k.RENDERBUFFER,k.DEPTH_COMPONENT16,
b.width,b.height),k.framebufferRenderbuffer(k.FRAMEBUFFER,k.DEPTH_ATTACHMENT,k.RENDERBUFFER,a)):b.depthBuffer&&b.stencilBuffer?(k.renderbufferStorage(k.RENDERBUFFER,k.DEPTH_STENCIL,b.width,b.height),k.framebufferRenderbuffer(k.FRAMEBUFFER,k.DEPTH_STENCIL_ATTACHMENT,k.RENDERBUFFER,a)):k.renderbufferStorage(k.RENDERBUFFER,k.RGBA4,b.width,b.height)}function C(a){return a===THREE.NearestFilter||a===THREE.NearestMipMapNearestFilter||a===THREE.NearestMipMapLinearFilter?k.NEAREST:k.LINEAR}function I(a){if(a===
THREE.RepeatWrapping)return k.REPEAT;if(a===THREE.ClampToEdgeWrapping)return k.CLAMP_TO_EDGE;if(a===THREE.MirroredRepeatWrapping)return k.MIRRORED_REPEAT;if(a===THREE.NearestFilter)return k.NEAREST;if(a===THREE.NearestMipMapNearestFilter)return k.NEAREST_MIPMAP_NEAREST;if(a===THREE.NearestMipMapLinearFilter)return k.NEAREST_MIPMAP_LINEAR;if(a===THREE.LinearFilter)return k.LINEAR;if(a===THREE.LinearMipMapNearestFilter)return k.LINEAR_MIPMAP_NEAREST;if(a===THREE.LinearMipMapLinearFilter)return k.LINEAR_MIPMAP_LINEAR;
if(a===THREE.UnsignedByteType)return k.UNSIGNED_BYTE;if(a===THREE.UnsignedShort4444Type)return k.UNSIGNED_SHORT_4_4_4_4;if(a===THREE.UnsignedShort5551Type)return k.UNSIGNED_SHORT_5_5_5_1;if(a===THREE.UnsignedShort565Type)return k.UNSIGNED_SHORT_5_6_5;if(a===THREE.ByteType)return k.BYTE;if(a===THREE.ShortType)return k.SHORT;if(a===THREE.UnsignedShortType)return k.UNSIGNED_SHORT;if(a===THREE.IntType)return k.INT;if(a===THREE.UnsignedIntType)return k.UNSIGNED_INT;if(a===THREE.FloatType)return k.FLOAT;
if(a===THREE.AlphaFormat)return k.ALPHA;if(a===THREE.RGBFormat)return k.RGB;if(a===THREE.RGBAFormat)return k.RGBA;if(a===THREE.LuminanceFormat)return k.LUMINANCE;if(a===THREE.LuminanceAlphaFormat)return k.LUMINANCE_ALPHA;if(a===THREE.AddEquation)return k.FUNC_ADD;if(a===THREE.SubtractEquation)return k.FUNC_SUBTRACT;if(a===THREE.ReverseSubtractEquation)return k.FUNC_REVERSE_SUBTRACT;if(a===THREE.ZeroFactor)return k.ZERO;if(a===THREE.OneFactor)return k.ONE;if(a===THREE.SrcColorFactor)return k.SRC_COLOR;
if(a===THREE.OneMinusSrcColorFactor)return k.ONE_MINUS_SRC_COLOR;if(a===THREE.SrcAlphaFactor)return k.SRC_ALPHA;if(a===THREE.OneMinusSrcAlphaFactor)return k.ONE_MINUS_SRC_ALPHA;if(a===THREE.DstAlphaFactor)return k.DST_ALPHA;if(a===THREE.OneMinusDstAlphaFactor)return k.ONE_MINUS_DST_ALPHA;if(a===THREE.DstColorFactor)return k.DST_COLOR;if(a===THREE.OneMinusDstColorFactor)return k.ONE_MINUS_DST_COLOR;if(a===THREE.SrcAlphaSaturateFactor)return k.SRC_ALPHA_SATURATE;if(void 0!==Va){if(a===THREE.RGB_S3TC_DXT1_Format)return Va.COMPRESSED_RGB_S3TC_DXT1_EXT;
if(a===THREE.RGBA_S3TC_DXT1_Format)return Va.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(a===THREE.RGBA_S3TC_DXT3_Format)return Va.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(a===THREE.RGBA_S3TC_DXT5_Format)return Va.COMPRESSED_RGBA_S3TC_DXT5_EXT}return 0}console.log("THREE.WebGLRenderer",THREE.REVISION);var a=a||{},M=void 0!==a.canvas?a.canvas:document.createElement("canvas"),R=void 0!==a.precision?a.precision:"highp",ea=void 0!==a.alpha?a.alpha:!0,wa=void 0!==a.premultipliedAlpha?a.premultipliedAlpha:!0,Ma=void 0!==
a.antialias?a.antialias:!1,A=void 0!==a.stencil?a.stencil:!0,ca=void 0!==a.preserveDrawingBuffer?a.preserveDrawingBuffer:!1,ja=new THREE.Color(0),na=0;void 0!==a.clearColor&&(console.warn("DEPRECATED: clearColor in WebGLRenderer constructor parameters is being removed. Use .setClearColor() instead."),ja.setHex(a.clearColor));void 0!==a.clearAlpha&&(console.warn("DEPRECATED: clearAlpha in WebGLRenderer constructor parameters is being removed. Use .setClearColor() instead."),na=a.clearAlpha);this.domElement=
M;this.context=null;this.devicePixelRatio=void 0!==a.devicePixelRatio?a.devicePixelRatio:void 0!==window.devicePixelRatio?window.devicePixelRatio:1;this.autoUpdateObjects=this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=!0;this.shadowMapEnabled=this.physicallyBasedShading=this.gammaOutput=this.gammaInput=!1;this.shadowMapAutoUpdate=!0;this.shadowMapType=THREE.PCFShadowMap;this.shadowMapCullFace=THREE.CullFaceFront;this.shadowMapCascade=this.shadowMapDebug=
!1;this.maxMorphTargets=8;this.maxMorphNormals=4;this.autoScaleCubemaps=!0;this.renderPluginsPre=[];this.renderPluginsPost=[];this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0,points:0}};var N=this,fa=[],Wa=0,ab=null,fb=null,Ka=-1,qa=null,pa=null,Z=0,ga=0,W=-1,da=-1,la=-1,ha=-1,ia=-1,Qa=-1,kb=-1,oa=-1,Xa=null,Ra=null,Aa=null,Sa=null,sb=0,Nb=0,Kb=0,Ob=0,Tb=0,Ub=0,Ta={},ua=new THREE.Frustum,Ja=new THREE.Matrix4,tb=new THREE.Matrix4,Na=new THREE.Vector3,ra=new THREE.Vector3,
bb=!0,Ab={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[]},spot:{length:0,colors:[],positions:[],distances:[],directions:[],anglesCos:[],exponents:[]},hemi:{length:0,skyColors:[],groundColors:[],positions:[]}},k,Bb,Ua,lb,Va;try{if(!(k=M.getContext("experimental-webgl",{alpha:ea,premultipliedAlpha:wa,antialias:Ma,stencil:A,preserveDrawingBuffer:ca})))throw"Error creating WebGL context.";}catch(Cb){console.error(Cb)}Bb=k.getExtension("OES_texture_float");
Ua=k.getExtension("OES_standard_derivatives");lb=k.getExtension("EXT_texture_filter_anisotropic")||k.getExtension("MOZ_EXT_texture_filter_anisotropic")||k.getExtension("WEBKIT_EXT_texture_filter_anisotropic");Va=k.getExtension("WEBGL_compressed_texture_s3tc")||k.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||k.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");Bb||console.log("THREE.WebGLRenderer: Float textures not supported.");Ua||console.log("THREE.WebGLRenderer: Standard derivatives not supported.");
lb||console.log("THREE.WebGLRenderer: Anisotropic texture filtering not supported.");Va||console.log("THREE.WebGLRenderer: S3TC compressed textures not supported.");void 0===k.getShaderPrecisionFormat&&(k.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}});k.clearColor(0,0,0,1);k.clearDepth(1);k.clearStencil(0);k.enable(k.DEPTH_TEST);k.depthFunc(k.LEQUAL);k.frontFace(k.CCW);k.cullFace(k.BACK);k.enable(k.CULL_FACE);k.enable(k.BLEND);k.blendEquation(k.FUNC_ADD);k.blendFunc(k.SRC_ALPHA,
k.ONE_MINUS_SRC_ALPHA);k.clearColor(ja.r,ja.g,ja.b,na);this.context=k;var cc=k.getParameter(k.MAX_TEXTURE_IMAGE_UNITS),Hc=k.getParameter(k.MAX_VERTEX_TEXTURE_IMAGE_UNITS);k.getParameter(k.MAX_TEXTURE_SIZE);var Ic=k.getParameter(k.MAX_CUBE_MAP_TEXTURE_SIZE),dc=lb?k.getParameter(lb.MAX_TEXTURE_MAX_ANISOTROPY_EXT):0,ec=0<Hc,Vb=ec&&Bb;Va&&k.getParameter(k.COMPRESSED_TEXTURE_FORMATS);var Lc=k.getShaderPrecisionFormat(k.VERTEX_SHADER,k.HIGH_FLOAT),Mc=k.getShaderPrecisionFormat(k.VERTEX_SHADER,k.MEDIUM_FLOAT);
k.getShaderPrecisionFormat(k.VERTEX_SHADER,k.LOW_FLOAT);var Nc=k.getShaderPrecisionFormat(k.FRAGMENT_SHADER,k.HIGH_FLOAT),Kc=k.getShaderPrecisionFormat(k.FRAGMENT_SHADER,k.MEDIUM_FLOAT);k.getShaderPrecisionFormat(k.FRAGMENT_SHADER,k.LOW_FLOAT);k.getShaderPrecisionFormat(k.VERTEX_SHADER,k.HIGH_INT);k.getShaderPrecisionFormat(k.VERTEX_SHADER,k.MEDIUM_INT);k.getShaderPrecisionFormat(k.VERTEX_SHADER,k.LOW_INT);k.getShaderPrecisionFormat(k.FRAGMENT_SHADER,k.HIGH_INT);k.getShaderPrecisionFormat(k.FRAGMENT_SHADER,
k.MEDIUM_INT);k.getShaderPrecisionFormat(k.FRAGMENT_SHADER,k.LOW_INT);var Jc=0<Lc.precision&&0<Nc.precision,fc=0<Mc.precision&&0<Kc.precision;"highp"===R&&!Jc&&(fc?(R="mediump",console.warn("WebGLRenderer: highp not supported, using mediump")):(R="lowp",console.warn("WebGLRenderer: highp and mediump not supported, using lowp")));"mediump"===R&&!fc&&(R="lowp",console.warn("WebGLRenderer: mediump not supported, using lowp"));this.getContext=function(){return k};this.supportsVertexTextures=function(){return ec};
this.supportsFloatTextures=function(){return Bb};this.supportsStandardDerivatives=function(){return Ua};this.supportsCompressedTextureS3TC=function(){return Va};this.getMaxAnisotropy=function(){return dc};this.getPrecision=function(){return R};this.setSize=function(a,b,c){M.width=a*this.devicePixelRatio;M.height=b*this.devicePixelRatio;1!==this.devicePixelRatio&&!1!==c&&(M.style.width=a+"px",M.style.height=b+"px");this.setViewport(0,0,M.width,M.height)};this.setViewport=function(a,b,c,d){sb=void 0!==
a?a:0;Nb=void 0!==b?b:0;Kb=void 0!==c?c:M.width;Ob=void 0!==d?d:M.height;k.viewport(sb,Nb,Kb,Ob)};this.setScissor=function(a,b,c,d){k.scissor(a,b,c,d)};this.enableScissorTest=function(a){a?k.enable(k.SCISSOR_TEST):k.disable(k.SCISSOR_TEST)};this.setClearColor=function(a,b){ja.set(a);na=void 0!==b?b:1;k.clearColor(ja.r,ja.g,ja.b,na)};this.setClearColorHex=function(a,b){console.warn("DEPRECATED: .setClearColorHex() is being removed. Use .setClearColor() instead.");this.setClearColor(a,b)};this.getClearColor=
function(){return ja};this.getClearAlpha=function(){return na};this.clear=function(a,b,c){var d=0;if(void 0===a||a)d|=k.COLOR_BUFFER_BIT;if(void 0===b||b)d|=k.DEPTH_BUFFER_BIT;if(void 0===c||c)d|=k.STENCIL_BUFFER_BIT;k.clear(d)};this.clearTarget=function(a,b,c,d){this.setRenderTarget(a);this.clear(b,c,d)};this.addPostPlugin=function(a){a.init(this);this.renderPluginsPost.push(a)};this.addPrePlugin=function(a){a.init(this);this.renderPluginsPre.push(a)};this.updateShadowMap=function(a,b){ab=null;Ka=
qa=oa=kb=la=-1;bb=!0;da=W=-1;this.shadowMapPlugin.update(a,b)};var gc=function(a){a=a.target;a.removeEventListener("dispose",gc);a.__webglInit=void 0;void 0!==a.__webglVertexBuffer&&k.deleteBuffer(a.__webglVertexBuffer);void 0!==a.__webglNormalBuffer&&k.deleteBuffer(a.__webglNormalBuffer);void 0!==a.__webglTangentBuffer&&k.deleteBuffer(a.__webglTangentBuffer);void 0!==a.__webglColorBuffer&&k.deleteBuffer(a.__webglColorBuffer);void 0!==a.__webglUVBuffer&&k.deleteBuffer(a.__webglUVBuffer);void 0!==
a.__webglUV2Buffer&&k.deleteBuffer(a.__webglUV2Buffer);void 0!==a.__webglSkinIndicesBuffer&&k.deleteBuffer(a.__webglSkinIndicesBuffer);void 0!==a.__webglSkinWeightsBuffer&&k.deleteBuffer(a.__webglSkinWeightsBuffer);void 0!==a.__webglFaceBuffer&&k.deleteBuffer(a.__webglFaceBuffer);void 0!==a.__webglLineBuffer&&k.deleteBuffer(a.__webglLineBuffer);void 0!==a.__webglLineDistanceBuffer&&k.deleteBuffer(a.__webglLineDistanceBuffer);if(void 0!==a.geometryGroups)for(var c in a.geometryGroups){var d=a.geometryGroups[c];
if(void 0!==d.numMorphTargets)for(var e=0,f=d.numMorphTargets;e<f;e++)k.deleteBuffer(d.__webglMorphTargetsBuffers[e]);if(void 0!==d.numMorphNormals){e=0;for(f=d.numMorphNormals;e<f;e++)k.deleteBuffer(d.__webglMorphNormalsBuffers[e])}b(d)}b(a);N.info.memory.geometries--},oc=function(a){a=a.target;a.removeEventListener("dispose",oc);a.image&&a.image.__webglTextureCube?k.deleteTexture(a.image.__webglTextureCube):a.__webglInit&&(a.__webglInit=!1,k.deleteTexture(a.__webglTexture));N.info.memory.textures--},
U=function(a){a=a.target;a.removeEventListener("dispose",U);if(a&&a.__webglTexture)if(k.deleteTexture(a.__webglTexture),a instanceof THREE.WebGLRenderTargetCube)for(var b=0;6>b;b++)k.deleteFramebuffer(a.__webglFramebuffer[b]),k.deleteRenderbuffer(a.__webglRenderbuffer[b]);else k.deleteFramebuffer(a.__webglFramebuffer),k.deleteRenderbuffer(a.__webglRenderbuffer);N.info.memory.textures--},P=function(a){a=a.target;a.removeEventListener("dispose",P);pc(a)},pc=function(a){var b=a.program;if(void 0!==b){a.program=
void 0;var c,d,e=!1,a=0;for(c=fa.length;a<c;a++)if(d=fa[a],d.program===b){d.usedTimes--;0===d.usedTimes&&(e=!0);break}if(!0===e){e=[];a=0;for(c=fa.length;a<c;a++)d=fa[a],d.program!==b&&e.push(d);fa=e;k.deleteProgram(b);N.info.memory.programs--}}};this.renderBufferImmediate=function(a,b,c){a.hasPositions&&!a.__webglVertexBuffer&&(a.__webglVertexBuffer=k.createBuffer());a.hasNormals&&!a.__webglNormalBuffer&&(a.__webglNormalBuffer=k.createBuffer());a.hasUvs&&!a.__webglUvBuffer&&(a.__webglUvBuffer=k.createBuffer());
a.hasColors&&!a.__webglColorBuffer&&(a.__webglColorBuffer=k.createBuffer());a.hasPositions&&(k.bindBuffer(k.ARRAY_BUFFER,a.__webglVertexBuffer),k.bufferData(k.ARRAY_BUFFER,a.positionArray,k.DYNAMIC_DRAW),k.enableVertexAttribArray(b.attributes.position),k.vertexAttribPointer(b.attributes.position,3,k.FLOAT,!1,0,0));if(a.hasNormals){k.bindBuffer(k.ARRAY_BUFFER,a.__webglNormalBuffer);if(c.shading===THREE.FlatShading){var d,e,f,g,h,i,j,l,p,m,n,q=3*a.count;for(n=0;n<q;n+=9)m=a.normalArray,d=m[n],e=m[n+
1],f=m[n+2],g=m[n+3],i=m[n+4],l=m[n+5],h=m[n+6],j=m[n+7],p=m[n+8],d=(d+g+h)/3,e=(e+i+j)/3,f=(f+l+p)/3,m[n]=d,m[n+1]=e,m[n+2]=f,m[n+3]=d,m[n+4]=e,m[n+5]=f,m[n+6]=d,m[n+7]=e,m[n+8]=f}k.bufferData(k.ARRAY_BUFFER,a.normalArray,k.DYNAMIC_DRAW);k.enableVertexAttribArray(b.attributes.normal);k.vertexAttribPointer(b.attributes.normal,3,k.FLOAT,!1,0,0)}a.hasUvs&&c.map&&(k.bindBuffer(k.ARRAY_BUFFER,a.__webglUvBuffer),k.bufferData(k.ARRAY_BUFFER,a.uvArray,k.DYNAMIC_DRAW),k.enableVertexAttribArray(b.attributes.uv),
k.vertexAttribPointer(b.attributes.uv,2,k.FLOAT,!1,0,0));a.hasColors&&c.vertexColors!==THREE.NoColors&&(k.bindBuffer(k.ARRAY_BUFFER,a.__webglColorBuffer),k.bufferData(k.ARRAY_BUFFER,a.colorArray,k.DYNAMIC_DRAW),k.enableVertexAttribArray(b.attributes.color),k.vertexAttribPointer(b.attributes.color,3,k.FLOAT,!1,0,0));k.drawArrays(k.TRIANGLES,0,a.count);a.count=0};this.renderBufferDirect=function(a,b,c,d,e,f){if(!1!==d.visible){var g,j,l;g=E(a,b,c,d,f);a=g.attributes;b=e.attributes;c=!1;g=16777215*e.id+
2*g.id+(d.wireframe?1:0);g!==qa&&(qa=g,c=!0);c&&i();if(f instanceof THREE.Mesh)if(d=b.index){e=e.offsets;1<e.length&&(c=!0);for(var p=0,m=e.length;p<m;p++){var n=e[p].index;if(c){for(j in b)"index"!==j&&(g=a[j],f=b[j],l=f.itemSize,0<=g&&(k.bindBuffer(k.ARRAY_BUFFER,f.buffer),h(g),k.vertexAttribPointer(g,l,k.FLOAT,!1,0,4*n*l)));k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,d.buffer)}k.drawElements(k.TRIANGLES,e[p].count,k.UNSIGNED_SHORT,2*e[p].start);N.info.render.calls++;N.info.render.vertices+=e[p].count;
N.info.render.faces+=e[p].count/3}}else{if(c)for(j in b)"index"!==j&&(g=a[j],f=b[j],l=f.itemSize,0<=g&&(k.bindBuffer(k.ARRAY_BUFFER,f.buffer),h(g),k.vertexAttribPointer(g,l,k.FLOAT,!1,0,0)));j=e.attributes.position;k.drawArrays(k.TRIANGLES,0,j.numItems/3);N.info.render.calls++;N.info.render.vertices+=j.numItems/3;N.info.render.faces+=j.numItems/3/3}else if(f instanceof THREE.ParticleSystem){if(c){for(j in b)g=a[j],f=b[j],l=f.itemSize,0<=g&&(k.bindBuffer(k.ARRAY_BUFFER,f.buffer),h(g),k.vertexAttribPointer(g,
l,k.FLOAT,!1,0,0));j=b.position;k.drawArrays(k.POINTS,0,j.numItems/3);N.info.render.calls++;N.info.render.points+=j.numItems/3}}else if(f instanceof THREE.Line&&c){for(j in b)g=a[j],f=b[j],l=f.itemSize,0<=g&&(k.bindBuffer(k.ARRAY_BUFFER,f.buffer),h(g),k.vertexAttribPointer(g,l,k.FLOAT,!1,0,0));H(d.linewidth);j=b.position;k.drawArrays(k.LINE_STRIP,0,j.numItems/3);N.info.render.calls++;N.info.render.points+=j.numItems}}};this.renderBuffer=function(a,b,c,d,e,f){if(!1!==d.visible){var g,j,c=E(a,b,c,d,
f),a=c.attributes,b=!1,c=16777215*e.id+2*c.id+(d.wireframe?1:0);c!==qa&&(qa=c,b=!0);b&&i();if(!d.morphTargets&&0<=a.position)b&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglVertexBuffer),h(a.position),k.vertexAttribPointer(a.position,3,k.FLOAT,!1,0,0));else if(f.morphTargetBase){c=d.program.attributes;-1!==f.morphTargetBase&&0<=c.position?(k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[f.morphTargetBase]),h(c.position),k.vertexAttribPointer(c.position,3,k.FLOAT,!1,0,0)):0<=c.position&&(k.bindBuffer(k.ARRAY_BUFFER,
e.__webglVertexBuffer),h(c.position),k.vertexAttribPointer(c.position,3,k.FLOAT,!1,0,0));if(f.morphTargetForcedOrder.length){var l=0;j=f.morphTargetForcedOrder;for(g=f.morphTargetInfluences;l<d.numSupportedMorphTargets&&l<j.length;)0<=c["morphTarget"+l]&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[j[l]]),h(c["morphTarget"+l]),k.vertexAttribPointer(c["morphTarget"+l],3,k.FLOAT,!1,0,0)),0<=c["morphNormal"+l]&&d.morphNormals&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[j[l]]),
h(c["morphNormal"+l]),k.vertexAttribPointer(c["morphNormal"+l],3,k.FLOAT,!1,0,0)),f.__webglMorphTargetInfluences[l]=g[j[l]],l++}else{j=[];g=f.morphTargetInfluences;var p,n=g.length;for(p=0;p<n;p++)l=g[p],0<l&&j.push([l,p]);j.length>d.numSupportedMorphTargets?(j.sort(m),j.length=d.numSupportedMorphTargets):j.length>d.numSupportedMorphNormals?j.sort(m):0===j.length&&j.push([0,0]);for(l=0;l<d.numSupportedMorphTargets;)j[l]?(p=j[l][1],0<=c["morphTarget"+l]&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[p]),
h(c["morphTarget"+l]),k.vertexAttribPointer(c["morphTarget"+l],3,k.FLOAT,!1,0,0)),0<=c["morphNormal"+l]&&d.morphNormals&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[p]),h(c["morphNormal"+l]),k.vertexAttribPointer(c["morphNormal"+l],3,k.FLOAT,!1,0,0)),f.__webglMorphTargetInfluences[l]=g[p]):f.__webglMorphTargetInfluences[l]=0,l++}null!==d.program.uniforms.morphTargetInfluences&&k.uniform1fv(d.program.uniforms.morphTargetInfluences,f.__webglMorphTargetInfluences)}if(b){if(e.__webglCustomAttributesList){g=
0;for(j=e.__webglCustomAttributesList.length;g<j;g++)c=e.__webglCustomAttributesList[g],0<=a[c.buffer.belongsToAttribute]&&(k.bindBuffer(k.ARRAY_BUFFER,c.buffer),h(a[c.buffer.belongsToAttribute]),k.vertexAttribPointer(a[c.buffer.belongsToAttribute],c.size,k.FLOAT,!1,0,0))}0<=a.color&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglColorBuffer),h(a.color),k.vertexAttribPointer(a.color,3,k.FLOAT,!1,0,0));0<=a.normal&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglNormalBuffer),h(a.normal),k.vertexAttribPointer(a.normal,
3,k.FLOAT,!1,0,0));0<=a.tangent&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglTangentBuffer),h(a.tangent),k.vertexAttribPointer(a.tangent,4,k.FLOAT,!1,0,0));0<=a.uv&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglUVBuffer),h(a.uv),k.vertexAttribPointer(a.uv,2,k.FLOAT,!1,0,0));0<=a.uv2&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglUV2Buffer),h(a.uv2),k.vertexAttribPointer(a.uv2,2,k.FLOAT,!1,0,0));d.skinning&&(0<=a.skinIndex&&0<=a.skinWeight)&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglSkinIndicesBuffer),h(a.skinIndex),k.vertexAttribPointer(a.skinIndex,
4,k.FLOAT,!1,0,0),k.bindBuffer(k.ARRAY_BUFFER,e.__webglSkinWeightsBuffer),h(a.skinWeight),k.vertexAttribPointer(a.skinWeight,4,k.FLOAT,!1,0,0));0<=a.lineDistance&&(k.bindBuffer(k.ARRAY_BUFFER,e.__webglLineDistanceBuffer),h(a.lineDistance),k.vertexAttribPointer(a.lineDistance,1,k.FLOAT,!1,0,0))}f instanceof THREE.Mesh?(d.wireframe?(H(d.wireframeLinewidth),b&&k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,e.__webglLineBuffer),k.drawElements(k.LINES,e.__webglLineCount,k.UNSIGNED_SHORT,0)):(b&&k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,
e.__webglFaceBuffer),k.drawElements(k.TRIANGLES,e.__webglFaceCount,k.UNSIGNED_SHORT,0)),N.info.render.calls++,N.info.render.vertices+=e.__webglFaceCount,N.info.render.faces+=e.__webglFaceCount/3):f instanceof THREE.Line?(f=f.type===THREE.LineStrip?k.LINE_STRIP:k.LINES,H(d.linewidth),k.drawArrays(f,0,e.__webglLineCount),N.info.render.calls++):f instanceof THREE.ParticleSystem?(k.drawArrays(k.POINTS,0,e.__webglParticleCount),N.info.render.calls++,N.info.render.points+=e.__webglParticleCount):f instanceof
THREE.Ribbon&&(k.drawArrays(k.TRIANGLE_STRIP,0,e.__webglVertexCount),N.info.render.calls++)}};this.render=function(a,b,c,d){if(!1===b instanceof THREE.Camera)console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");else{var e,f,g,h,i=a.__lights,m=a.fog;Ka=-1;bb=!0;!0===a.autoUpdate&&a.updateMatrixWorld();void 0===b.parent&&b.updateMatrixWorld();b.matrixWorldInverse.getInverse(b.matrixWorld);Ja.multiplyMatrices(b.projectionMatrix,b.matrixWorldInverse);ua.setFromMatrix(Ja);
this.autoUpdateObjects&&this.initWebGLObjects(a);p(this.renderPluginsPre,a,b);N.info.render.calls=0;N.info.render.vertices=0;N.info.render.faces=0;N.info.render.points=0;this.setRenderTarget(c);(this.autoClear||d)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil);h=a.__webglObjects;d=0;for(e=h.length;d<e;d++)if(f=h[d],g=f.object,f.id=d,f.render=!1,g.visible&&(!(g instanceof THREE.Mesh||g instanceof THREE.ParticleSystem)||!g.frustumCulled||ua.intersectsObject(g))){var n=g;
n._modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,n.matrixWorld);n._normalMatrix.getNormalMatrix(n._modelViewMatrix);var n=f,q=n.buffer,s=void 0,t=s=void 0,t=n.object.material;if(t instanceof THREE.MeshFaceMaterial)s=q.materialIndex,s=t.materials[s],s.transparent?(n.transparent=s,n.opaque=null):(n.opaque=s,n.transparent=null);else if(s=t)s.transparent?(n.transparent=s,n.opaque=null):(n.opaque=s,n.transparent=null);f.render=!0;!0===this.sortObjects&&(null!==g.renderDepth?f.z=g.renderDepth:(Na.getPositionFromMatrix(g.matrixWorld),
Na.applyProjection(Ja),f.z=Na.z))}this.sortObjects&&h.sort(j);h=a.__webglObjectsImmediate;d=0;for(e=h.length;d<e;d++)f=h[d],g=f.object,g.visible&&(g._modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,g.matrixWorld),g._normalMatrix.getNormalMatrix(g._modelViewMatrix),g=f.object.material,g.transparent?(f.transparent=g,f.opaque=null):(f.opaque=g,f.transparent=null));a.overrideMaterial?(d=a.overrideMaterial,this.setBlending(d.blending,d.blendEquation,d.blendSrc,d.blendDst),this.setDepthTest(d.depthTest),
this.setDepthWrite(d.depthWrite),K(d.polygonOffset,d.polygonOffsetFactor,d.polygonOffsetUnits),l(a.__webglObjects,!1,"",b,i,m,!0,d),r(a.__webglObjectsImmediate,"",b,i,m,!1,d)):(d=null,this.setBlending(THREE.NoBlending),l(a.__webglObjects,!0,"opaque",b,i,m,!1,d),r(a.__webglObjectsImmediate,"opaque",b,i,m,!1,d),l(a.__webglObjects,!1,"transparent",b,i,m,!0,d),r(a.__webglObjectsImmediate,"transparent",b,i,m,!0,d));p(this.renderPluginsPost,a,b);c&&(c.generateMipmaps&&c.minFilter!==THREE.NearestFilter&&
c.minFilter!==THREE.LinearFilter)&&(c instanceof THREE.WebGLRenderTargetCube?(k.bindTexture(k.TEXTURE_CUBE_MAP,c.__webglTexture),k.generateMipmap(k.TEXTURE_CUBE_MAP),k.bindTexture(k.TEXTURE_CUBE_MAP,null)):(k.bindTexture(k.TEXTURE_2D,c.__webglTexture),k.generateMipmap(k.TEXTURE_2D),k.bindTexture(k.TEXTURE_2D,null)));this.setDepthTest(!0);this.setDepthWrite(!0)}};this.renderImmediateObject=function(a,b,c,d,e){var f=E(a,b,c,d,e);qa=-1;N.setMaterialFaces(d);e.immediateRenderCallback?e.immediateRenderCallback(f,
k,ua):e.render(function(a){N.renderBufferImmediate(a,f,d)})};this.initWebGLObjects=function(a){a.__webglObjects||(a.__webglObjects=[],a.__webglObjectsImmediate=[],a.__webglSprites=[],a.__webglFlares=[]);for(;a.__objectsAdded.length;)s(a.__objectsAdded[0],a),a.__objectsAdded.splice(0,1);for(;a.__objectsRemoved.length;)u(a.__objectsRemoved[0],a),a.__objectsRemoved.splice(0,1);for(var b=0,c=a.__webglObjects.length;b<c;b++){var h=a.__webglObjects[b].object;void 0===h.__webglInit&&(void 0!==h.__webglActive&&
u(h,a),s(h,a));var i=h,j=i.geometry,l=void 0,p=void 0,n=void 0;if(j instanceof THREE.BufferGeometry){var r=k.DYNAMIC_DRAW,t=!j.dynamic,x=j.attributes,z=void 0,B=void 0;for(z in x)B=x[z],B.needsUpdate&&("index"===z?(k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,B.buffer),k.bufferData(k.ELEMENT_ARRAY_BUFFER,B.array,r)):(k.bindBuffer(k.ARRAY_BUFFER,B.buffer),k.bufferData(k.ARRAY_BUFFER,B.array,r)),B.needsUpdate=!1),t&&!B.dynamic&&delete B.array}else if(i instanceof THREE.Mesh){for(var E=0,F=j.geometryGroupsList.length;E<
F;E++)if(l=j.geometryGroupsList[E],n=e(i,l),j.buffersNeedUpdate&&d(l,i),p=n.attributes&&q(n),j.verticesNeedUpdate||j.morphTargetsNeedUpdate||j.elementsNeedUpdate||j.uvsNeedUpdate||j.normalsNeedUpdate||j.colorsNeedUpdate||j.tangentsNeedUpdate||p){var C=l,J=i,G=k.DYNAMIC_DRAW,I=!j.dynamic,H=n;if(C.__inittedArrays){var L=f(H),K=H.vertexColors?H.vertexColors:!1,N=g(H),M=L===THREE.SmoothShading,D=void 0,A=void 0,fa=void 0,O=void 0,U=void 0,R=void 0,P=void 0,V=void 0,W=void 0,Z=void 0,da=void 0,S=void 0,
T=void 0,Q=void 0,aa=void 0,ga=void 0,pa=void 0,ca=void 0,ab=void 0,ea=void 0,ha=void 0,ia=void 0,la=void 0,Wa=void 0,ja=void 0,qa=void 0,na=void 0,oa=void 0,Ka=void 0,fb=void 0,wa=void 0,ra=void 0,ua=void 0,Aa=void 0,Qa=void 0,va=void 0,bb=void 0,Ma=void 0,Ua=void 0,Xa=void 0,cb=void 0,kb=void 0,Za=void 0,$a=void 0,Ra=void 0,Sa=void 0,La=0,Pa=0,Ta=0,Va=0,wb=0,ib=0,Ba=0,nb=0,Oa=0,Y=0,ka=0,w=0,ya=void 0,db=C.__vertexArray,lb=C.__uvArray,sb=C.__uv2Array,xb=C.__normalArray,Fa=C.__tangentArray,eb=C.__colorArray,
Ga=C.__skinIndexArray,Ha=C.__skinWeightArray,Ab=C.__morphTargetsArrays,Bb=C.__morphNormalsArrays,Cb=C.__webglCustomAttributesList,v=void 0,Fb=C.__faceArray,ub=C.__lineArray,ob=J.geometry,Nb=ob.elementsNeedUpdate,Kb=ob.uvsNeedUpdate,Ob=ob.normalsNeedUpdate,Tb=ob.tangentsNeedUpdate,Ub=ob.colorsNeedUpdate,ec=ob.morphTargetsNeedUpdate,Wb=ob.vertices,sa=C.faces3,ta=C.faces4,jb=ob.faces,Vb=ob.faceVertexUvs[0],Qc=ob.faceVertexUvs[1],Xb=ob.skinIndices,Qb=ob.skinWeights,Rb=ob.morphTargets,rc=ob.morphNormals;
if(ob.verticesNeedUpdate){D=0;for(A=sa.length;D<A;D++)O=jb[sa[D]],S=Wb[O.a],T=Wb[O.b],Q=Wb[O.c],db[Pa]=S.x,db[Pa+1]=S.y,db[Pa+2]=S.z,db[Pa+3]=T.x,db[Pa+4]=T.y,db[Pa+5]=T.z,db[Pa+6]=Q.x,db[Pa+7]=Q.y,db[Pa+8]=Q.z,Pa+=9;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],S=Wb[O.a],T=Wb[O.b],Q=Wb[O.c],aa=Wb[O.d],db[Pa]=S.x,db[Pa+1]=S.y,db[Pa+2]=S.z,db[Pa+3]=T.x,db[Pa+4]=T.y,db[Pa+5]=T.z,db[Pa+6]=Q.x,db[Pa+7]=Q.y,db[Pa+8]=Q.z,db[Pa+9]=aa.x,db[Pa+10]=aa.y,db[Pa+11]=aa.z,Pa+=12;k.bindBuffer(k.ARRAY_BUFFER,C.__webglVertexBuffer);
k.bufferData(k.ARRAY_BUFFER,db,G)}if(ec){cb=0;for(kb=Rb.length;cb<kb;cb++){D=ka=0;for(A=sa.length;D<A;D++)Ra=sa[D],O=jb[Ra],S=Rb[cb].vertices[O.a],T=Rb[cb].vertices[O.b],Q=Rb[cb].vertices[O.c],Za=Ab[cb],Za[ka]=S.x,Za[ka+1]=S.y,Za[ka+2]=S.z,Za[ka+3]=T.x,Za[ka+4]=T.y,Za[ka+5]=T.z,Za[ka+6]=Q.x,Za[ka+7]=Q.y,Za[ka+8]=Q.z,H.morphNormals&&(M?(Sa=rc[cb].vertexNormals[Ra],ea=Sa.a,ha=Sa.b,ia=Sa.c):ia=ha=ea=rc[cb].faceNormals[Ra],$a=Bb[cb],$a[ka]=ea.x,$a[ka+1]=ea.y,$a[ka+2]=ea.z,$a[ka+3]=ha.x,$a[ka+4]=ha.y,
$a[ka+5]=ha.z,$a[ka+6]=ia.x,$a[ka+7]=ia.y,$a[ka+8]=ia.z),ka+=9;D=0;for(A=ta.length;D<A;D++)Ra=ta[D],O=jb[Ra],S=Rb[cb].vertices[O.a],T=Rb[cb].vertices[O.b],Q=Rb[cb].vertices[O.c],aa=Rb[cb].vertices[O.d],Za=Ab[cb],Za[ka]=S.x,Za[ka+1]=S.y,Za[ka+2]=S.z,Za[ka+3]=T.x,Za[ka+4]=T.y,Za[ka+5]=T.z,Za[ka+6]=Q.x,Za[ka+7]=Q.y,Za[ka+8]=Q.z,Za[ka+9]=aa.x,Za[ka+10]=aa.y,Za[ka+11]=aa.z,H.morphNormals&&(M?(Sa=rc[cb].vertexNormals[Ra],ea=Sa.a,ha=Sa.b,ia=Sa.c,la=Sa.d):la=ia=ha=ea=rc[cb].faceNormals[Ra],$a=Bb[cb],$a[ka]=
ea.x,$a[ka+1]=ea.y,$a[ka+2]=ea.z,$a[ka+3]=ha.x,$a[ka+4]=ha.y,$a[ka+5]=ha.z,$a[ka+6]=ia.x,$a[ka+7]=ia.y,$a[ka+8]=ia.z,$a[ka+9]=la.x,$a[ka+10]=la.y,$a[ka+11]=la.z),ka+=12;k.bindBuffer(k.ARRAY_BUFFER,C.__webglMorphTargetsBuffers[cb]);k.bufferData(k.ARRAY_BUFFER,Ab[cb],G);H.morphNormals&&(k.bindBuffer(k.ARRAY_BUFFER,C.__webglMorphNormalsBuffers[cb]),k.bufferData(k.ARRAY_BUFFER,Bb[cb],G))}}if(Qb.length){D=0;for(A=sa.length;D<A;D++)O=jb[sa[D]],oa=Qb[O.a],Ka=Qb[O.b],fb=Qb[O.c],Ha[Y]=oa.x,Ha[Y+1]=oa.y,Ha[Y+
2]=oa.z,Ha[Y+3]=oa.w,Ha[Y+4]=Ka.x,Ha[Y+5]=Ka.y,Ha[Y+6]=Ka.z,Ha[Y+7]=Ka.w,Ha[Y+8]=fb.x,Ha[Y+9]=fb.y,Ha[Y+10]=fb.z,Ha[Y+11]=fb.w,ra=Xb[O.a],ua=Xb[O.b],Aa=Xb[O.c],Ga[Y]=ra.x,Ga[Y+1]=ra.y,Ga[Y+2]=ra.z,Ga[Y+3]=ra.w,Ga[Y+4]=ua.x,Ga[Y+5]=ua.y,Ga[Y+6]=ua.z,Ga[Y+7]=ua.w,Ga[Y+8]=Aa.x,Ga[Y+9]=Aa.y,Ga[Y+10]=Aa.z,Ga[Y+11]=Aa.w,Y+=12;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],oa=Qb[O.a],Ka=Qb[O.b],fb=Qb[O.c],wa=Qb[O.d],Ha[Y]=oa.x,Ha[Y+1]=oa.y,Ha[Y+2]=oa.z,Ha[Y+3]=oa.w,Ha[Y+4]=Ka.x,Ha[Y+5]=Ka.y,Ha[Y+6]=Ka.z,Ha[Y+7]=
Ka.w,Ha[Y+8]=fb.x,Ha[Y+9]=fb.y,Ha[Y+10]=fb.z,Ha[Y+11]=fb.w,Ha[Y+12]=wa.x,Ha[Y+13]=wa.y,Ha[Y+14]=wa.z,Ha[Y+15]=wa.w,ra=Xb[O.a],ua=Xb[O.b],Aa=Xb[O.c],Qa=Xb[O.d],Ga[Y]=ra.x,Ga[Y+1]=ra.y,Ga[Y+2]=ra.z,Ga[Y+3]=ra.w,Ga[Y+4]=ua.x,Ga[Y+5]=ua.y,Ga[Y+6]=ua.z,Ga[Y+7]=ua.w,Ga[Y+8]=Aa.x,Ga[Y+9]=Aa.y,Ga[Y+10]=Aa.z,Ga[Y+11]=Aa.w,Ga[Y+12]=Qa.x,Ga[Y+13]=Qa.y,Ga[Y+14]=Qa.z,Ga[Y+15]=Qa.w,Y+=16;0<Y&&(k.bindBuffer(k.ARRAY_BUFFER,C.__webglSkinIndicesBuffer),k.bufferData(k.ARRAY_BUFFER,Ga,G),k.bindBuffer(k.ARRAY_BUFFER,
C.__webglSkinWeightsBuffer),k.bufferData(k.ARRAY_BUFFER,Ha,G))}if(Ub&&K){D=0;for(A=sa.length;D<A;D++)O=jb[sa[D]],P=O.vertexColors,V=O.color,3===P.length&&K===THREE.VertexColors?(Wa=P[0],ja=P[1],qa=P[2]):qa=ja=Wa=V,eb[Oa]=Wa.r,eb[Oa+1]=Wa.g,eb[Oa+2]=Wa.b,eb[Oa+3]=ja.r,eb[Oa+4]=ja.g,eb[Oa+5]=ja.b,eb[Oa+6]=qa.r,eb[Oa+7]=qa.g,eb[Oa+8]=qa.b,Oa+=9;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],P=O.vertexColors,V=O.color,4===P.length&&K===THREE.VertexColors?(Wa=P[0],ja=P[1],qa=P[2],na=P[3]):na=qa=ja=Wa=V,eb[Oa]=
Wa.r,eb[Oa+1]=Wa.g,eb[Oa+2]=Wa.b,eb[Oa+3]=ja.r,eb[Oa+4]=ja.g,eb[Oa+5]=ja.b,eb[Oa+6]=qa.r,eb[Oa+7]=qa.g,eb[Oa+8]=qa.b,eb[Oa+9]=na.r,eb[Oa+10]=na.g,eb[Oa+11]=na.b,Oa+=12;0<Oa&&(k.bindBuffer(k.ARRAY_BUFFER,C.__webglColorBuffer),k.bufferData(k.ARRAY_BUFFER,eb,G))}if(Tb&&ob.hasTangents){D=0;for(A=sa.length;D<A;D++)O=jb[sa[D]],W=O.vertexTangents,ga=W[0],pa=W[1],ca=W[2],Fa[Ba]=ga.x,Fa[Ba+1]=ga.y,Fa[Ba+2]=ga.z,Fa[Ba+3]=ga.w,Fa[Ba+4]=pa.x,Fa[Ba+5]=pa.y,Fa[Ba+6]=pa.z,Fa[Ba+7]=pa.w,Fa[Ba+8]=ca.x,Fa[Ba+9]=ca.y,
Fa[Ba+10]=ca.z,Fa[Ba+11]=ca.w,Ba+=12;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],W=O.vertexTangents,ga=W[0],pa=W[1],ca=W[2],ab=W[3],Fa[Ba]=ga.x,Fa[Ba+1]=ga.y,Fa[Ba+2]=ga.z,Fa[Ba+3]=ga.w,Fa[Ba+4]=pa.x,Fa[Ba+5]=pa.y,Fa[Ba+6]=pa.z,Fa[Ba+7]=pa.w,Fa[Ba+8]=ca.x,Fa[Ba+9]=ca.y,Fa[Ba+10]=ca.z,Fa[Ba+11]=ca.w,Fa[Ba+12]=ab.x,Fa[Ba+13]=ab.y,Fa[Ba+14]=ab.z,Fa[Ba+15]=ab.w,Ba+=16;k.bindBuffer(k.ARRAY_BUFFER,C.__webglTangentBuffer);k.bufferData(k.ARRAY_BUFFER,Fa,G)}if(Ob&&L){D=0;for(A=sa.length;D<A;D++)if(O=jb[sa[D]],
U=O.vertexNormals,R=O.normal,3===U.length&&M)for(va=0;3>va;va++)Ma=U[va],xb[ib]=Ma.x,xb[ib+1]=Ma.y,xb[ib+2]=Ma.z,ib+=3;else for(va=0;3>va;va++)xb[ib]=R.x,xb[ib+1]=R.y,xb[ib+2]=R.z,ib+=3;D=0;for(A=ta.length;D<A;D++)if(O=jb[ta[D]],U=O.vertexNormals,R=O.normal,4===U.length&&M)for(va=0;4>va;va++)Ma=U[va],xb[ib]=Ma.x,xb[ib+1]=Ma.y,xb[ib+2]=Ma.z,ib+=3;else for(va=0;4>va;va++)xb[ib]=R.x,xb[ib+1]=R.y,xb[ib+2]=R.z,ib+=3;k.bindBuffer(k.ARRAY_BUFFER,C.__webglNormalBuffer);k.bufferData(k.ARRAY_BUFFER,xb,G)}if(Kb&&
Vb&&N){D=0;for(A=sa.length;D<A;D++)if(fa=sa[D],Z=Vb[fa],void 0!==Z)for(va=0;3>va;va++)Ua=Z[va],lb[Ta]=Ua.x,lb[Ta+1]=Ua.y,Ta+=2;D=0;for(A=ta.length;D<A;D++)if(fa=ta[D],Z=Vb[fa],void 0!==Z)for(va=0;4>va;va++)Ua=Z[va],lb[Ta]=Ua.x,lb[Ta+1]=Ua.y,Ta+=2;0<Ta&&(k.bindBuffer(k.ARRAY_BUFFER,C.__webglUVBuffer),k.bufferData(k.ARRAY_BUFFER,lb,G))}if(Kb&&Qc&&N){D=0;for(A=sa.length;D<A;D++)if(fa=sa[D],da=Qc[fa],void 0!==da)for(va=0;3>va;va++)Xa=da[va],sb[Va]=Xa.x,sb[Va+1]=Xa.y,Va+=2;D=0;for(A=ta.length;D<A;D++)if(fa=
ta[D],da=Qc[fa],void 0!==da)for(va=0;4>va;va++)Xa=da[va],sb[Va]=Xa.x,sb[Va+1]=Xa.y,Va+=2;0<Va&&(k.bindBuffer(k.ARRAY_BUFFER,C.__webglUV2Buffer),k.bufferData(k.ARRAY_BUFFER,sb,G))}if(Nb){D=0;for(A=sa.length;D<A;D++)Fb[wb]=La,Fb[wb+1]=La+1,Fb[wb+2]=La+2,wb+=3,ub[nb]=La,ub[nb+1]=La+1,ub[nb+2]=La,ub[nb+3]=La+2,ub[nb+4]=La+1,ub[nb+5]=La+2,nb+=6,La+=3;D=0;for(A=ta.length;D<A;D++)Fb[wb]=La,Fb[wb+1]=La+1,Fb[wb+2]=La+3,Fb[wb+3]=La+1,Fb[wb+4]=La+2,Fb[wb+5]=La+3,wb+=6,ub[nb]=La,ub[nb+1]=La+1,ub[nb+2]=La,ub[nb+
3]=La+3,ub[nb+4]=La+1,ub[nb+5]=La+2,ub[nb+6]=La+2,ub[nb+7]=La+3,nb+=8,La+=4;k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,C.__webglFaceBuffer);k.bufferData(k.ELEMENT_ARRAY_BUFFER,Fb,G);k.bindBuffer(k.ELEMENT_ARRAY_BUFFER,C.__webglLineBuffer);k.bufferData(k.ELEMENT_ARRAY_BUFFER,ub,G)}if(Cb){va=0;for(bb=Cb.length;va<bb;va++)if(v=Cb[va],v.__original.needsUpdate){w=0;if(1===v.size)if(void 0===v.boundTo||"vertices"===v.boundTo){D=0;for(A=sa.length;D<A;D++)O=jb[sa[D]],v.array[w]=v.value[O.a],v.array[w+1]=v.value[O.b],
v.array[w+2]=v.value[O.c],w+=3;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],v.array[w]=v.value[O.a],v.array[w+1]=v.value[O.b],v.array[w+2]=v.value[O.c],v.array[w+3]=v.value[O.d],w+=4}else{if("faces"===v.boundTo){D=0;for(A=sa.length;D<A;D++)ya=v.value[sa[D]],v.array[w]=ya,v.array[w+1]=ya,v.array[w+2]=ya,w+=3;D=0;for(A=ta.length;D<A;D++)ya=v.value[ta[D]],v.array[w]=ya,v.array[w+1]=ya,v.array[w+2]=ya,v.array[w+3]=ya,w+=4}}else if(2===v.size)if(void 0===v.boundTo||"vertices"===v.boundTo){D=0;for(A=sa.length;D<
A;D++)O=jb[sa[D]],S=v.value[O.a],T=v.value[O.b],Q=v.value[O.c],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=T.x,v.array[w+3]=T.y,v.array[w+4]=Q.x,v.array[w+5]=Q.y,w+=6;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],S=v.value[O.a],T=v.value[O.b],Q=v.value[O.c],aa=v.value[O.d],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=T.x,v.array[w+3]=T.y,v.array[w+4]=Q.x,v.array[w+5]=Q.y,v.array[w+6]=aa.x,v.array[w+7]=aa.y,w+=8}else{if("faces"===v.boundTo){D=0;for(A=sa.length;D<A;D++)Q=T=S=ya=v.value[sa[D]],v.array[w]=
S.x,v.array[w+1]=S.y,v.array[w+2]=T.x,v.array[w+3]=T.y,v.array[w+4]=Q.x,v.array[w+5]=Q.y,w+=6;D=0;for(A=ta.length;D<A;D++)aa=Q=T=S=ya=v.value[ta[D]],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=T.x,v.array[w+3]=T.y,v.array[w+4]=Q.x,v.array[w+5]=Q.y,v.array[w+6]=aa.x,v.array[w+7]=aa.y,w+=8}}else if(3===v.size){var X;X="c"===v.type?["r","g","b"]:["x","y","z"];if(void 0===v.boundTo||"vertices"===v.boundTo){D=0;for(A=sa.length;D<A;D++)O=jb[sa[D]],S=v.value[O.a],T=v.value[O.b],Q=v.value[O.c],v.array[w]=
S[X[0]],v.array[w+1]=S[X[1]],v.array[w+2]=S[X[2]],v.array[w+3]=T[X[0]],v.array[w+4]=T[X[1]],v.array[w+5]=T[X[2]],v.array[w+6]=Q[X[0]],v.array[w+7]=Q[X[1]],v.array[w+8]=Q[X[2]],w+=9;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],S=v.value[O.a],T=v.value[O.b],Q=v.value[O.c],aa=v.value[O.d],v.array[w]=S[X[0]],v.array[w+1]=S[X[1]],v.array[w+2]=S[X[2]],v.array[w+3]=T[X[0]],v.array[w+4]=T[X[1]],v.array[w+5]=T[X[2]],v.array[w+6]=Q[X[0]],v.array[w+7]=Q[X[1]],v.array[w+8]=Q[X[2]],v.array[w+9]=aa[X[0]],v.array[w+
10]=aa[X[1]],v.array[w+11]=aa[X[2]],w+=12}else if("faces"===v.boundTo){D=0;for(A=sa.length;D<A;D++)Q=T=S=ya=v.value[sa[D]],v.array[w]=S[X[0]],v.array[w+1]=S[X[1]],v.array[w+2]=S[X[2]],v.array[w+3]=T[X[0]],v.array[w+4]=T[X[1]],v.array[w+5]=T[X[2]],v.array[w+6]=Q[X[0]],v.array[w+7]=Q[X[1]],v.array[w+8]=Q[X[2]],w+=9;D=0;for(A=ta.length;D<A;D++)aa=Q=T=S=ya=v.value[ta[D]],v.array[w]=S[X[0]],v.array[w+1]=S[X[1]],v.array[w+2]=S[X[2]],v.array[w+3]=T[X[0]],v.array[w+4]=T[X[1]],v.array[w+5]=T[X[2]],v.array[w+
6]=Q[X[0]],v.array[w+7]=Q[X[1]],v.array[w+8]=Q[X[2]],v.array[w+9]=aa[X[0]],v.array[w+10]=aa[X[1]],v.array[w+11]=aa[X[2]],w+=12}else if("faceVertices"===v.boundTo){D=0;for(A=sa.length;D<A;D++)ya=v.value[sa[D]],S=ya[0],T=ya[1],Q=ya[2],v.array[w]=S[X[0]],v.array[w+1]=S[X[1]],v.array[w+2]=S[X[2]],v.array[w+3]=T[X[0]],v.array[w+4]=T[X[1]],v.array[w+5]=T[X[2]],v.array[w+6]=Q[X[0]],v.array[w+7]=Q[X[1]],v.array[w+8]=Q[X[2]],w+=9;D=0;for(A=ta.length;D<A;D++)ya=v.value[ta[D]],S=ya[0],T=ya[1],Q=ya[2],aa=ya[3],
v.array[w]=S[X[0]],v.array[w+1]=S[X[1]],v.array[w+2]=S[X[2]],v.array[w+3]=T[X[0]],v.array[w+4]=T[X[1]],v.array[w+5]=T[X[2]],v.array[w+6]=Q[X[0]],v.array[w+7]=Q[X[1]],v.array[w+8]=Q[X[2]],v.array[w+9]=aa[X[0]],v.array[w+10]=aa[X[1]],v.array[w+11]=aa[X[2]],w+=12}}else if(4===v.size)if(void 0===v.boundTo||"vertices"===v.boundTo){D=0;for(A=sa.length;D<A;D++)O=jb[sa[D]],S=v.value[O.a],T=v.value[O.b],Q=v.value[O.c],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=S.z,v.array[w+3]=S.w,v.array[w+4]=T.x,v.array[w+
5]=T.y,v.array[w+6]=T.z,v.array[w+7]=T.w,v.array[w+8]=Q.x,v.array[w+9]=Q.y,v.array[w+10]=Q.z,v.array[w+11]=Q.w,w+=12;D=0;for(A=ta.length;D<A;D++)O=jb[ta[D]],S=v.value[O.a],T=v.value[O.b],Q=v.value[O.c],aa=v.value[O.d],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=S.z,v.array[w+3]=S.w,v.array[w+4]=T.x,v.array[w+5]=T.y,v.array[w+6]=T.z,v.array[w+7]=T.w,v.array[w+8]=Q.x,v.array[w+9]=Q.y,v.array[w+10]=Q.z,v.array[w+11]=Q.w,v.array[w+12]=aa.x,v.array[w+13]=aa.y,v.array[w+14]=aa.z,v.array[w+15]=aa.w,w+=
16}else if("faces"===v.boundTo){D=0;for(A=sa.length;D<A;D++)Q=T=S=ya=v.value[sa[D]],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=S.z,v.array[w+3]=S.w,v.array[w+4]=T.x,v.array[w+5]=T.y,v.array[w+6]=T.z,v.array[w+7]=T.w,v.array[w+8]=Q.x,v.array[w+9]=Q.y,v.array[w+10]=Q.z,v.array[w+11]=Q.w,w+=12;D=0;for(A=ta.length;D<A;D++)aa=Q=T=S=ya=v.value[ta[D]],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=S.z,v.array[w+3]=S.w,v.array[w+4]=T.x,v.array[w+5]=T.y,v.array[w+6]=T.z,v.array[w+7]=T.w,v.array[w+8]=Q.x,v.array[w+
9]=Q.y,v.array[w+10]=Q.z,v.array[w+11]=Q.w,v.array[w+12]=aa.x,v.array[w+13]=aa.y,v.array[w+14]=aa.z,v.array[w+15]=aa.w,w+=16}else if("faceVertices"===v.boundTo){D=0;for(A=sa.length;D<A;D++)ya=v.value[sa[D]],S=ya[0],T=ya[1],Q=ya[2],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=S.z,v.array[w+3]=S.w,v.array[w+4]=T.x,v.array[w+5]=T.y,v.array[w+6]=T.z,v.array[w+7]=T.w,v.array[w+8]=Q.x,v.array[w+9]=Q.y,v.array[w+10]=Q.z,v.array[w+11]=Q.w,w+=12;D=0;for(A=ta.length;D<A;D++)ya=v.value[ta[D]],S=ya[0],T=ya[1],
Q=ya[2],aa=ya[3],v.array[w]=S.x,v.array[w+1]=S.y,v.array[w+2]=S.z,v.array[w+3]=S.w,v.array[w+4]=T.x,v.array[w+5]=T.y,v.array[w+6]=T.z,v.array[w+7]=T.w,v.array[w+8]=Q.x,v.array[w+9]=Q.y,v.array[w+10]=Q.z,v.array[w+11]=Q.w,v.array[w+12]=aa.x,v.array[w+13]=aa.y,v.array[w+14]=aa.z,v.array[w+15]=aa.w,w+=16}k.bindBuffer(k.ARRAY_BUFFER,v.buffer);k.bufferData(k.ARRAY_BUFFER,v.array,G)}}I&&(delete C.__inittedArrays,delete C.__colorArray,delete C.__normalArray,delete C.__tangentArray,delete C.__uvArray,delete C.__uv2Array,
delete C.__faceArray,delete C.__vertexArray,delete C.__lineArray,delete C.__skinIndexArray,delete C.__skinWeightArray)}}j.verticesNeedUpdate=!1;j.morphTargetsNeedUpdate=!1;j.elementsNeedUpdate=!1;j.uvsNeedUpdate=!1;j.normalsNeedUpdate=!1;j.colorsNeedUpdate=!1;j.tangentsNeedUpdate=!1;j.buffersNeedUpdate=!1;n.attributes&&y(n)}else if(i instanceof THREE.Ribbon){n=e(i,j);p=n.attributes&&q(n);if(j.verticesNeedUpdate||j.colorsNeedUpdate||j.normalsNeedUpdate||p){var yb=j,sc=k.DYNAMIC_DRAW,hc=void 0,ic=void 0,
jc=void 0,tc=void 0,za=void 0,uc=void 0,vc=void 0,wc=void 0,cc=void 0,gb=void 0,$b=void 0,Da=void 0,pb=void 0,dc=yb.vertices,fc=yb.colors,gc=yb.normals,oc=dc.length,pc=fc.length,Hc=gc.length,xc=yb.__vertexArray,yc=yb.__colorArray,zc=yb.__normalArray,Ic=yb.colorsNeedUpdate,Jc=yb.normalsNeedUpdate,Rc=yb.__webglCustomAttributesList;if(yb.verticesNeedUpdate){for(hc=0;hc<oc;hc++)tc=dc[hc],za=3*hc,xc[za]=tc.x,xc[za+1]=tc.y,xc[za+2]=tc.z;k.bindBuffer(k.ARRAY_BUFFER,yb.__webglVertexBuffer);k.bufferData(k.ARRAY_BUFFER,
xc,sc)}if(Ic){for(ic=0;ic<pc;ic++)uc=fc[ic],za=3*ic,yc[za]=uc.r,yc[za+1]=uc.g,yc[za+2]=uc.b;k.bindBuffer(k.ARRAY_BUFFER,yb.__webglColorBuffer);k.bufferData(k.ARRAY_BUFFER,yc,sc)}if(Jc){for(jc=0;jc<Hc;jc++)vc=gc[jc],za=3*jc,zc[za]=vc.x,zc[za+1]=vc.y,zc[za+2]=vc.z;k.bindBuffer(k.ARRAY_BUFFER,yb.__webglNormalBuffer);k.bufferData(k.ARRAY_BUFFER,zc,sc)}if(Rc){wc=0;for(cc=Rc.length;wc<cc;wc++)if(Da=Rc[wc],Da.needsUpdate&&(void 0===Da.boundTo||"vertices"===Da.boundTo)){za=0;$b=Da.value.length;if(1===Da.size)for(gb=
0;gb<$b;gb++)Da.array[gb]=Da.value[gb];else if(2===Da.size)for(gb=0;gb<$b;gb++)pb=Da.value[gb],Da.array[za]=pb.x,Da.array[za+1]=pb.y,za+=2;else if(3===Da.size)if("c"===Da.type)for(gb=0;gb<$b;gb++)pb=Da.value[gb],Da.array[za]=pb.r,Da.array[za+1]=pb.g,Da.array[za+2]=pb.b,za+=3;else for(gb=0;gb<$b;gb++)pb=Da.value[gb],Da.array[za]=pb.x,Da.array[za+1]=pb.y,Da.array[za+2]=pb.z,za+=3;else if(4===Da.size)for(gb=0;gb<$b;gb++)pb=Da.value[gb],Da.array[za]=pb.x,Da.array[za+1]=pb.y,Da.array[za+2]=pb.z,Da.array[za+
3]=pb.w,za+=4;k.bindBuffer(k.ARRAY_BUFFER,Da.buffer);k.bufferData(k.ARRAY_BUFFER,Da.array,sc)}}}j.verticesNeedUpdate=!1;j.colorsNeedUpdate=!1;j.normalsNeedUpdate=!1;n.attributes&&y(n)}else if(i instanceof THREE.Line){n=e(i,j);p=n.attributes&&q(n);if(j.verticesNeedUpdate||j.colorsNeedUpdate||j.lineDistancesNeedUpdate||p){var zb=j,Ac=k.DYNAMIC_DRAW,kc=void 0,lc=void 0,mc=void 0,Bc=void 0,Ia=void 0,Cc=void 0,Wc=zb.vertices,Xc=zb.colors,Yc=zb.lineDistances,Kc=Wc.length,Lc=Xc.length,Mc=Yc.length,Dc=zb.__vertexArray,
Ec=zb.__colorArray,Zc=zb.__lineDistanceArray,Nc=zb.colorsNeedUpdate,dd=zb.lineDistancesNeedUpdate,Sc=zb.__webglCustomAttributesList,Fc=void 0,$c=void 0,hb=void 0,ac=void 0,qb=void 0,Ea=void 0;if(zb.verticesNeedUpdate){for(kc=0;kc<Kc;kc++)Bc=Wc[kc],Ia=3*kc,Dc[Ia]=Bc.x,Dc[Ia+1]=Bc.y,Dc[Ia+2]=Bc.z;k.bindBuffer(k.ARRAY_BUFFER,zb.__webglVertexBuffer);k.bufferData(k.ARRAY_BUFFER,Dc,Ac)}if(Nc){for(lc=0;lc<Lc;lc++)Cc=Xc[lc],Ia=3*lc,Ec[Ia]=Cc.r,Ec[Ia+1]=Cc.g,Ec[Ia+2]=Cc.b;k.bindBuffer(k.ARRAY_BUFFER,zb.__webglColorBuffer);
k.bufferData(k.ARRAY_BUFFER,Ec,Ac)}if(dd){for(mc=0;mc<Mc;mc++)Zc[mc]=Yc[mc];k.bindBuffer(k.ARRAY_BUFFER,zb.__webglLineDistanceBuffer);k.bufferData(k.ARRAY_BUFFER,Zc,Ac)}if(Sc){Fc=0;for($c=Sc.length;Fc<$c;Fc++)if(Ea=Sc[Fc],Ea.needsUpdate&&(void 0===Ea.boundTo||"vertices"===Ea.boundTo)){Ia=0;ac=Ea.value.length;if(1===Ea.size)for(hb=0;hb<ac;hb++)Ea.array[hb]=Ea.value[hb];else if(2===Ea.size)for(hb=0;hb<ac;hb++)qb=Ea.value[hb],Ea.array[Ia]=qb.x,Ea.array[Ia+1]=qb.y,Ia+=2;else if(3===Ea.size)if("c"===Ea.type)for(hb=
0;hb<ac;hb++)qb=Ea.value[hb],Ea.array[Ia]=qb.r,Ea.array[Ia+1]=qb.g,Ea.array[Ia+2]=qb.b,Ia+=3;else for(hb=0;hb<ac;hb++)qb=Ea.value[hb],Ea.array[Ia]=qb.x,Ea.array[Ia+1]=qb.y,Ea.array[Ia+2]=qb.z,Ia+=3;else if(4===Ea.size)for(hb=0;hb<ac;hb++)qb=Ea.value[hb],Ea.array[Ia]=qb.x,Ea.array[Ia+1]=qb.y,Ea.array[Ia+2]=qb.z,Ea.array[Ia+3]=qb.w,Ia+=4;k.bindBuffer(k.ARRAY_BUFFER,Ea.buffer);k.bufferData(k.ARRAY_BUFFER,Ea.array,Ac)}}}j.verticesNeedUpdate=!1;j.colorsNeedUpdate=!1;j.lineDistancesNeedUpdate=!1;n.attributes&&
y(n)}else if(i instanceof THREE.ParticleSystem){n=e(i,j);p=n.attributes&&q(n);if(j.verticesNeedUpdate||j.colorsNeedUpdate||i.sortParticles||p){var Gb=j,Tc=k.DYNAMIC_DRAW,nc=i,rb=void 0,Hb=void 0,Ib=void 0,ba=void 0,Jb=void 0,Sb=void 0,Gc=Gb.vertices,Uc=Gc.length,Vc=Gb.colors,ad=Vc.length,Yb=Gb.__vertexArray,Zb=Gb.__colorArray,Lb=Gb.__sortArray,bd=Gb.verticesNeedUpdate,cd=Gb.colorsNeedUpdate,Mb=Gb.__webglCustomAttributesList,Db=void 0,bc=void 0,ma=void 0,Eb=void 0,Ca=void 0,$=void 0;if(nc.sortParticles){tb.copy(Ja);
tb.multiply(nc.matrixWorld);for(rb=0;rb<Uc;rb++)Ib=Gc[rb],Na.copy(Ib),Na.applyProjection(tb),Lb[rb]=[Na.z,rb];Lb.sort(m);for(rb=0;rb<Uc;rb++)Ib=Gc[Lb[rb][1]],ba=3*rb,Yb[ba]=Ib.x,Yb[ba+1]=Ib.y,Yb[ba+2]=Ib.z;for(Hb=0;Hb<ad;Hb++)ba=3*Hb,Sb=Vc[Lb[Hb][1]],Zb[ba]=Sb.r,Zb[ba+1]=Sb.g,Zb[ba+2]=Sb.b;if(Mb){Db=0;for(bc=Mb.length;Db<bc;Db++)if($=Mb[Db],void 0===$.boundTo||"vertices"===$.boundTo)if(ba=0,Eb=$.value.length,1===$.size)for(ma=0;ma<Eb;ma++)Jb=Lb[ma][1],$.array[ma]=$.value[Jb];else if(2===$.size)for(ma=
0;ma<Eb;ma++)Jb=Lb[ma][1],Ca=$.value[Jb],$.array[ba]=Ca.x,$.array[ba+1]=Ca.y,ba+=2;else if(3===$.size)if("c"===$.type)for(ma=0;ma<Eb;ma++)Jb=Lb[ma][1],Ca=$.value[Jb],$.array[ba]=Ca.r,$.array[ba+1]=Ca.g,$.array[ba+2]=Ca.b,ba+=3;else for(ma=0;ma<Eb;ma++)Jb=Lb[ma][1],Ca=$.value[Jb],$.array[ba]=Ca.x,$.array[ba+1]=Ca.y,$.array[ba+2]=Ca.z,ba+=3;else if(4===$.size)for(ma=0;ma<Eb;ma++)Jb=Lb[ma][1],Ca=$.value[Jb],$.array[ba]=Ca.x,$.array[ba+1]=Ca.y,$.array[ba+2]=Ca.z,$.array[ba+3]=Ca.w,ba+=4}}else{if(bd)for(rb=
0;rb<Uc;rb++)Ib=Gc[rb],ba=3*rb,Yb[ba]=Ib.x,Yb[ba+1]=Ib.y,Yb[ba+2]=Ib.z;if(cd)for(Hb=0;Hb<ad;Hb++)Sb=Vc[Hb],ba=3*Hb,Zb[ba]=Sb.r,Zb[ba+1]=Sb.g,Zb[ba+2]=Sb.b;if(Mb){Db=0;for(bc=Mb.length;Db<bc;Db++)if($=Mb[Db],$.needsUpdate&&(void 0===$.boundTo||"vertices"===$.boundTo))if(Eb=$.value.length,ba=0,1===$.size)for(ma=0;ma<Eb;ma++)$.array[ma]=$.value[ma];else if(2===$.size)for(ma=0;ma<Eb;ma++)Ca=$.value[ma],$.array[ba]=Ca.x,$.array[ba+1]=Ca.y,ba+=2;else if(3===$.size)if("c"===$.type)for(ma=0;ma<Eb;ma++)Ca=
$.value[ma],$.array[ba]=Ca.r,$.array[ba+1]=Ca.g,$.array[ba+2]=Ca.b,ba+=3;else for(ma=0;ma<Eb;ma++)Ca=$.value[ma],$.array[ba]=Ca.x,$.array[ba+1]=Ca.y,$.array[ba+2]=Ca.z,ba+=3;else if(4===$.size)for(ma=0;ma<Eb;ma++)Ca=$.value[ma],$.array[ba]=Ca.x,$.array[ba+1]=Ca.y,$.array[ba+2]=Ca.z,$.array[ba+3]=Ca.w,ba+=4}}if(bd||nc.sortParticles)k.bindBuffer(k.ARRAY_BUFFER,Gb.__webglVertexBuffer),k.bufferData(k.ARRAY_BUFFER,Yb,Tc);if(cd||nc.sortParticles)k.bindBuffer(k.ARRAY_BUFFER,Gb.__webglColorBuffer),k.bufferData(k.ARRAY_BUFFER,
Zb,Tc);if(Mb){Db=0;for(bc=Mb.length;Db<bc;Db++)if($=Mb[Db],$.needsUpdate||nc.sortParticles)k.bindBuffer(k.ARRAY_BUFFER,$.buffer),k.bufferData(k.ARRAY_BUFFER,$.array,Tc)}}j.verticesNeedUpdate=!1;j.colorsNeedUpdate=!1;n.attributes&&y(n)}}};this.initMaterial=function(a,b,c,d){var e,f,g,h;a.addEventListener("dispose",P);var i,j,l,p,m;a instanceof THREE.MeshDepthMaterial?m="depth":a instanceof THREE.MeshNormalMaterial?m="normal":a instanceof THREE.MeshBasicMaterial?m="basic":a instanceof THREE.MeshLambertMaterial?
m="lambert":a instanceof THREE.MeshPhongMaterial?m="phong":a instanceof THREE.LineBasicMaterial?m="basic":a instanceof THREE.LineDashedMaterial?m="dashed":a instanceof THREE.ParticleBasicMaterial&&(m="particle_basic");if(m){var n=THREE.ShaderLib[m];a.uniforms=THREE.UniformsUtils.clone(n.uniforms);a.vertexShader=n.vertexShader;a.fragmentShader=n.fragmentShader}var q,r,s;e=g=r=s=n=0;for(f=b.length;e<f;e++)q=b[e],q.onlyShadow||(q instanceof THREE.DirectionalLight&&g++,q instanceof THREE.PointLight&&
r++,q instanceof THREE.SpotLight&&s++,q instanceof THREE.HemisphereLight&&n++);e=g;f=r;g=s;h=n;n=q=0;for(s=b.length;n<s;n++)r=b[n],r.castShadow&&(r instanceof THREE.SpotLight&&q++,r instanceof THREE.DirectionalLight&&!r.shadowCascade&&q++);p=q;Vb&&d&&d.useVertexTexture?l=1024:(b=k.getParameter(k.MAX_VERTEX_UNIFORM_VECTORS),b=Math.floor((b-20)/4),void 0!==d&&d instanceof THREE.SkinnedMesh&&(b=Math.min(d.bones.length,b),b<d.bones.length&&console.warn("WebGLRenderer: too many bones - "+d.bones.length+
", this GPU supports just "+b+" (try OpenGL instead of ANGLE)")),l=b);a:{s=a.fragmentShader;r=a.vertexShader;n=a.uniforms;b=a.attributes;q=a.defines;var c={map:!!a.map,envMap:!!a.envMap,lightMap:!!a.lightMap,bumpMap:!!a.bumpMap,normalMap:!!a.normalMap,specularMap:!!a.specularMap,vertexColors:a.vertexColors,fog:c,useFog:a.fog,fogExp:c instanceof THREE.FogExp2,sizeAttenuation:a.sizeAttenuation,skinning:a.skinning,maxBones:l,useVertexTexture:Vb&&d&&d.useVertexTexture,boneTextureWidth:d&&d.boneTextureWidth,
boneTextureHeight:d&&d.boneTextureHeight,morphTargets:a.morphTargets,morphNormals:a.morphNormals,maxMorphTargets:this.maxMorphTargets,maxMorphNormals:this.maxMorphNormals,maxDirLights:e,maxPointLights:f,maxSpotLights:g,maxHemiLights:h,maxShadows:p,shadowMapEnabled:this.shadowMapEnabled&&d.receiveShadow,shadowMapType:this.shadowMapType,shadowMapDebug:this.shadowMapDebug,shadowMapCascade:this.shadowMapCascade,alphaTest:a.alphaTest,metal:a.metal,perPixel:a.perPixel,wrapAround:a.wrapAround,doubleSided:a.side===
THREE.DoubleSide,flipSided:a.side===THREE.BackSide},t,x,u,d=[];m?d.push(m):(d.push(s),d.push(r));for(x in q)d.push(x),d.push(q[x]);for(t in c)d.push(t),d.push(c[t]);m=d.join();t=0;for(x=fa.length;t<x;t++)if(d=fa[t],d.code===m){d.usedTimes++;j=d.program;break a}t="SHADOWMAP_TYPE_BASIC";c.shadowMapType===THREE.PCFShadowMap?t="SHADOWMAP_TYPE_PCF":c.shadowMapType===THREE.PCFSoftShadowMap&&(t="SHADOWMAP_TYPE_PCF_SOFT");x=[];for(u in q)d=q[u],!1!==d&&(d="#define "+u+" "+d,x.push(d));d=x.join("\n");u=k.createProgram();
x=["precision "+R+" float;",d,ec?"#define VERTEX_TEXTURES":"",N.gammaInput?"#define GAMMA_INPUT":"",N.gammaOutput?"#define GAMMA_OUTPUT":"",N.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"","#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_HEMI_LIGHTS "+c.maxHemiLights,"#define MAX_SHADOWS "+c.maxShadows,"#define MAX_BONES "+c.maxBones,c.map?"#define USE_MAP":"",c.envMap?"#define USE_ENVMAP":"",
c.lightMap?"#define USE_LIGHTMAP":"",c.bumpMap?"#define USE_BUMPMAP":"",c.normalMap?"#define USE_NORMALMAP":"",c.specularMap?"#define USE_SPECULARMAP":"",c.vertexColors?"#define USE_COLOR":"",c.skinning?"#define USE_SKINNING":"",c.useVertexTexture?"#define BONE_TEXTURE":"",c.boneTextureWidth?"#define N_BONE_PIXEL_X "+c.boneTextureWidth.toFixed(1):"",c.boneTextureHeight?"#define N_BONE_PIXEL_Y "+c.boneTextureHeight.toFixed(1):"",c.morphTargets?"#define USE_MORPHTARGETS":"",c.morphNormals?"#define USE_MORPHNORMALS":
"",c.perPixel?"#define PHONG_PER_PIXEL":"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.flipSided?"#define FLIP_SIDED":"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapEnabled?"#define "+t:"",c.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",c.sizeAttenuation?"#define USE_SIZEATTENUATION":"","uniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\n#ifdef USE_MORPHNORMALS\nattribute vec3 morphNormal0;\nattribute vec3 morphNormal1;\nattribute vec3 morphNormal2;\nattribute vec3 morphNormal3;\n#else\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
t=["precision "+R+" float;",c.bumpMap||c.normalMap?"#extension GL_OES_standard_derivatives : enable":"",d,"#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_HEMI_LIGHTS "+c.maxHemiLights,"#define MAX_SHADOWS "+c.maxShadows,c.alphaTest?"#define ALPHATEST "+c.alphaTest:"",N.gammaInput?"#define GAMMA_INPUT":"",N.gammaOutput?"#define GAMMA_OUTPUT":"",N.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"",
c.useFog&&c.fog?"#define USE_FOG":"",c.useFog&&c.fogExp?"#define FOG_EXP2":"",c.map?"#define USE_MAP":"",c.envMap?"#define USE_ENVMAP":"",c.lightMap?"#define USE_LIGHTMAP":"",c.bumpMap?"#define USE_BUMPMAP":"",c.normalMap?"#define USE_NORMALMAP":"",c.specularMap?"#define USE_SPECULARMAP":"",c.vertexColors?"#define USE_COLOR":"",c.metal?"#define METAL":"",c.perPixel?"#define PHONG_PER_PIXEL":"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.flipSided?"#define FLIP_SIDED":
"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapEnabled?"#define "+t:"",c.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");x=L("vertex",x+r);t=L("fragment",t+s);k.attachShader(u,x);k.attachShader(u,t);k.linkProgram(u);k.getProgramParameter(u,k.LINK_STATUS)||console.error("Could not initialise shader\nVALIDATE_STATUS: "+k.getProgramParameter(u,k.VALIDATE_STATUS)+", gl error ["+
k.getError()+"]");k.deleteShader(t);k.deleteShader(x);u.uniforms={};u.attributes={};var y;t="viewMatrix modelViewMatrix projectionMatrix normalMatrix modelMatrix cameraPosition morphTargetInfluences".split(" ");c.useVertexTexture?t.push("boneTexture"):t.push("boneGlobalMatrices");for(y in n)t.push(y);y=t;t=0;for(x=y.length;t<x;t++)n=y[t],u.uniforms[n]=k.getUniformLocation(u,n);t="position normal uv uv2 tangent color skinIndex skinWeight lineDistance".split(" ");for(y=0;y<c.maxMorphTargets;y++)t.push("morphTarget"+
y);for(y=0;y<c.maxMorphNormals;y++)t.push("morphNormal"+y);for(j in b)t.push(j);j=t;y=0;for(b=j.length;y<b;y++)t=j[y],u.attributes[t]=k.getAttribLocation(u,t);u.id=Wa++;fa.push({program:u,code:m,usedTimes:1});N.info.memory.programs=fa.length;j=u}a.program=j;y=a.program.attributes;if(a.morphTargets){a.numSupportedMorphTargets=0;b="morphTarget";for(j=0;j<this.maxMorphTargets;j++)u=b+j,0<=y[u]&&a.numSupportedMorphTargets++}if(a.morphNormals){a.numSupportedMorphNormals=0;b="morphNormal";for(j=0;j<this.maxMorphNormals;j++)u=
b+j,0<=y[u]&&a.numSupportedMorphNormals++}a.uniformsList=[];for(i in a.uniforms)a.uniformsList.push([a.uniforms[i],i])};this.setFaceCulling=function(a,b){a===THREE.CullFaceNone?k.disable(k.CULL_FACE):(b===THREE.FrontFaceDirectionCW?k.frontFace(k.CW):k.frontFace(k.CCW),a===THREE.CullFaceBack?k.cullFace(k.BACK):a===THREE.CullFaceFront?k.cullFace(k.FRONT):k.cullFace(k.FRONT_AND_BACK),k.enable(k.CULL_FACE))};this.setMaterialFaces=function(a){var b=a.side===THREE.DoubleSide,a=a.side===THREE.BackSide;W!==
b&&(b?k.disable(k.CULL_FACE):k.enable(k.CULL_FACE),W=b);da!==a&&(a?k.frontFace(k.CW):k.frontFace(k.CCW),da=a)};this.setDepthTest=function(a){kb!==a&&(a?k.enable(k.DEPTH_TEST):k.disable(k.DEPTH_TEST),kb=a)};this.setDepthWrite=function(a){oa!==a&&(k.depthMask(a),oa=a)};this.setBlending=function(a,b,c,d){a!==la&&(a===THREE.NoBlending?k.disable(k.BLEND):a===THREE.AdditiveBlending?(k.enable(k.BLEND),k.blendEquation(k.FUNC_ADD),k.blendFunc(k.SRC_ALPHA,k.ONE)):a===THREE.SubtractiveBlending?(k.enable(k.BLEND),
k.blendEquation(k.FUNC_ADD),k.blendFunc(k.ZERO,k.ONE_MINUS_SRC_COLOR)):a===THREE.MultiplyBlending?(k.enable(k.BLEND),k.blendEquation(k.FUNC_ADD),k.blendFunc(k.ZERO,k.SRC_COLOR)):a===THREE.CustomBlending?k.enable(k.BLEND):(k.enable(k.BLEND),k.blendEquationSeparate(k.FUNC_ADD,k.FUNC_ADD),k.blendFuncSeparate(k.SRC_ALPHA,k.ONE_MINUS_SRC_ALPHA,k.ONE,k.ONE_MINUS_SRC_ALPHA)),la=a);if(a===THREE.CustomBlending){if(b!==ha&&(k.blendEquation(I(b)),ha=b),c!==ia||d!==Qa)k.blendFunc(I(c),I(d)),ia=c,Qa=d}else Qa=
ia=ha=null};this.setTexture=function(a,b){if(a.needsUpdate){a.__webglInit||(a.__webglInit=!0,a.addEventListener("dispose",oc),a.__webglTexture=k.createTexture(),N.info.memory.textures++);k.activeTexture(k.TEXTURE0+b);k.bindTexture(k.TEXTURE_2D,a.__webglTexture);k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,a.flipY);k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha);k.pixelStorei(k.UNPACK_ALIGNMENT,a.unpackAlignment);var c=a.image,d=0===(c.width&c.width-1)&&0===(c.height&c.height-1),e=I(a.format),
f=I(a.type);B(k.TEXTURE_2D,a,d);var g=a.mipmaps;if(a instanceof THREE.DataTexture)if(0<g.length&&d){for(var h=0,i=g.length;h<i;h++)c=g[h],k.texImage2D(k.TEXTURE_2D,h,e,c.width,c.height,0,e,f,c.data);a.generateMipmaps=!1}else k.texImage2D(k.TEXTURE_2D,0,e,c.width,c.height,0,e,f,c.data);else if(a instanceof THREE.CompressedTexture){h=0;for(i=g.length;h<i;h++)c=g[h],k.compressedTexImage2D(k.TEXTURE_2D,h,e,c.width,c.height,0,c.data)}else if(0<g.length&&d){h=0;for(i=g.length;h<i;h++)c=g[h],k.texImage2D(k.TEXTURE_2D,
h,e,e,f,c);a.generateMipmaps=!1}else k.texImage2D(k.TEXTURE_2D,0,e,e,f,a.image);a.generateMipmaps&&d&&k.generateMipmap(k.TEXTURE_2D);a.needsUpdate=!1;if(a.onUpdate)a.onUpdate()}else k.activeTexture(k.TEXTURE0+b),k.bindTexture(k.TEXTURE_2D,a.__webglTexture)};this.setRenderTarget=function(a){var b=a instanceof THREE.WebGLRenderTargetCube;if(a&&!a.__webglFramebuffer){void 0===a.depthBuffer&&(a.depthBuffer=!0);void 0===a.stencilBuffer&&(a.stencilBuffer=!0);a.addEventListener("dispose",U);a.__webglTexture=
k.createTexture();N.info.memory.textures++;var c=0===(a.width&a.width-1)&&0===(a.height&a.height-1),d=I(a.format),e=I(a.type);if(b){a.__webglFramebuffer=[];a.__webglRenderbuffer=[];k.bindTexture(k.TEXTURE_CUBE_MAP,a.__webglTexture);B(k.TEXTURE_CUBE_MAP,a,c);for(var f=0;6>f;f++){a.__webglFramebuffer[f]=k.createFramebuffer();a.__webglRenderbuffer[f]=k.createRenderbuffer();k.texImage2D(k.TEXTURE_CUBE_MAP_POSITIVE_X+f,0,d,a.width,a.height,0,d,e,null);var g=a,h=k.TEXTURE_CUBE_MAP_POSITIVE_X+f;k.bindFramebuffer(k.FRAMEBUFFER,
a.__webglFramebuffer[f]);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,h,g.__webglTexture,0);V(a.__webglRenderbuffer[f],a)}c&&k.generateMipmap(k.TEXTURE_CUBE_MAP)}else a.__webglFramebuffer=k.createFramebuffer(),a.__webglRenderbuffer=a.shareDepthFrom?a.shareDepthFrom.__webglRenderbuffer:k.createRenderbuffer(),k.bindTexture(k.TEXTURE_2D,a.__webglTexture),B(k.TEXTURE_2D,a,c),k.texImage2D(k.TEXTURE_2D,0,d,a.width,a.height,0,d,e,null),d=k.TEXTURE_2D,k.bindFramebuffer(k.FRAMEBUFFER,a.__webglFramebuffer),
k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,d,a.__webglTexture,0),a.shareDepthFrom?a.depthBuffer&&!a.stencilBuffer?k.framebufferRenderbuffer(k.FRAMEBUFFER,k.DEPTH_ATTACHMENT,k.RENDERBUFFER,a.__webglRenderbuffer):a.depthBuffer&&a.stencilBuffer&&k.framebufferRenderbuffer(k.FRAMEBUFFER,k.DEPTH_STENCIL_ATTACHMENT,k.RENDERBUFFER,a.__webglRenderbuffer):V(a.__webglRenderbuffer,a),c&&k.generateMipmap(k.TEXTURE_2D);b?k.bindTexture(k.TEXTURE_CUBE_MAP,null):k.bindTexture(k.TEXTURE_2D,null);k.bindRenderbuffer(k.RENDERBUFFER,
null);k.bindFramebuffer(k.FRAMEBUFFER,null)}a?(b=b?a.__webglFramebuffer[a.activeCubeFace]:a.__webglFramebuffer,c=a.width,a=a.height,e=d=0):(b=null,c=Kb,a=Ob,d=sb,e=Nb);b!==fb&&(k.bindFramebuffer(k.FRAMEBUFFER,b),k.viewport(d,e,c,a),fb=b);Tb=c;Ub=a};this.shadowMapPlugin=new THREE.ShadowMapPlugin;this.addPrePlugin(this.shadowMapPlugin);this.addPostPlugin(new THREE.SpritePlugin);this.addPostPlugin(new THREE.LensFlarePlugin)};THREE.WebGLRenderTarget=function(a,b,c){this.width=a;this.height=b;c=c||{};this.wrapS=void 0!==c.wrapS?c.wrapS:THREE.ClampToEdgeWrapping;this.wrapT=void 0!==c.wrapT?c.wrapT:THREE.ClampToEdgeWrapping;this.magFilter=void 0!==c.magFilter?c.magFilter:THREE.LinearFilter;this.minFilter=void 0!==c.minFilter?c.minFilter:THREE.LinearMipMapLinearFilter;this.anisotropy=void 0!==c.anisotropy?c.anisotropy:1;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.format=void 0!==c.format?c.format:
THREE.RGBAFormat;this.type=void 0!==c.type?c.type:THREE.UnsignedByteType;this.depthBuffer=void 0!==c.depthBuffer?c.depthBuffer:!0;this.stencilBuffer=void 0!==c.stencilBuffer?c.stencilBuffer:!0;this.generateMipmaps=!0;this.shareDepthFrom=null};
THREE.WebGLRenderTarget.prototype={constructor:THREE.WebGLRenderTarget,addEventListener:THREE.EventDispatcher.prototype.addEventListener,hasEventListener:THREE.EventDispatcher.prototype.hasEventListener,removeEventListener:THREE.EventDispatcher.prototype.removeEventListener,dispatchEvent:THREE.EventDispatcher.prototype.dispatchEvent,clone:function(){var a=new THREE.WebGLRenderTarget(this.width,this.height);a.wrapS=this.wrapS;a.wrapT=this.wrapT;a.magFilter=this.magFilter;a.minFilter=this.minFilter;
a.anisotropy=this.anisotropy;a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.format=this.format;a.type=this.type;a.depthBuffer=this.depthBuffer;a.stencilBuffer=this.stencilBuffer;a.generateMipmaps=this.generateMipmaps;a.shareDepthFrom=this.shareDepthFrom;return a},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.WebGLRenderTargetCube=function(a,b,c){THREE.WebGLRenderTarget.call(this,a,b,c);this.activeCubeFace=0};THREE.WebGLRenderTargetCube.prototype=Object.create(THREE.WebGLRenderTarget.prototype);THREE.RenderableVertex=function(){this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.visible=!0};THREE.RenderableVertex.prototype.copy=function(a){this.positionWorld.copy(a.positionWorld);this.positionScreen.copy(a.positionScreen)};THREE.RenderableFace3=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.centroidModel=new THREE.Vector3;this.normalModel=new THREE.Vector3;this.normalModelView=new THREE.Vector3;this.vertexNormalsLength=0;this.vertexNormalsModel=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.vertexNormalsModelView=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.material=this.color=null;this.uvs=[[]];this.z=null};THREE.RenderableFace4=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.v4=new THREE.RenderableVertex;this.centroidModel=new THREE.Vector3;this.normalModel=new THREE.Vector3;this.normalModelView=new THREE.Vector3;this.vertexNormalsLength=0;this.vertexNormalsModel=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.vertexNormalsModelView=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];
this.material=this.color=null;this.uvs=[[]];this.z=null};THREE.RenderableObject=function(){this.z=this.object=null};THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=this.object=null;this.scale=new THREE.Vector2;this.material=null};THREE.RenderableLine=function(){this.z=null;this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.vertexColors=[new THREE.Color,new THREE.Color];this.material=null};THREE.GeometryUtils={merge:function(a,b,c){var d,e,f=a.vertices.length,g=b instanceof THREE.Mesh?b.geometry:b,h=a.vertices,i=g.vertices,j=a.faces,m=g.faces,a=a.faceVertexUvs[0],g=g.faceVertexUvs[0];void 0===c&&(c=0);b instanceof THREE.Mesh&&(b.matrixAutoUpdate&&b.updateMatrix(),d=b.matrix,e=(new THREE.Matrix3).getNormalMatrix(d));for(var b=0,p=i.length;b<p;b++){var l=i[b].clone();d&&l.applyMatrix4(d);h.push(l)}b=0;for(p=m.length;b<p;b++){var l=m[b],r,s,n=l.vertexNormals,q=l.vertexColors;l instanceof
THREE.Face3?r=new THREE.Face3(l.a+f,l.b+f,l.c+f):l instanceof THREE.Face4&&(r=new THREE.Face4(l.a+f,l.b+f,l.c+f,l.d+f));r.normal.copy(l.normal);e&&r.normal.applyMatrix3(e).normalize();h=0;for(i=n.length;h<i;h++)s=n[h].clone(),e&&s.applyMatrix3(e).normalize(),r.vertexNormals.push(s);r.color.copy(l.color);h=0;for(i=q.length;h<i;h++)s=q[h],r.vertexColors.push(s.clone());r.materialIndex=l.materialIndex+c;r.centroid.copy(l.centroid);d&&r.centroid.applyMatrix4(d);j.push(r)}b=0;for(p=g.length;b<p;b++){c=
g[b];d=[];h=0;for(i=c.length;h<i;h++)d.push(new THREE.Vector2(c[h].x,c[h].y));a.push(d)}},removeMaterials:function(a,b){for(var c={},d=0,e=b.length;d<e;d++)c[b[d]]=!0;for(var f,g=[],d=0,e=a.faces.length;d<e;d++)f=a.faces[d],f.materialIndex in c||g.push(f);a.faces=g},randomPointInTriangle:function(a,b,c){var d,e,f,g=new THREE.Vector3,h=THREE.GeometryUtils.__v1;d=THREE.GeometryUtils.random();e=THREE.GeometryUtils.random();1<d+e&&(d=1-d,e=1-e);f=1-d-e;g.copy(a);g.multiplyScalar(d);h.copy(b);h.multiplyScalar(e);
g.add(h);h.copy(c);h.multiplyScalar(f);g.add(h);return g},randomPointInFace:function(a,b,c){var d,e,f;if(a instanceof THREE.Face3)return d=b.vertices[a.a],e=b.vertices[a.b],f=b.vertices[a.c],THREE.GeometryUtils.randomPointInTriangle(d,e,f);if(a instanceof THREE.Face4){d=b.vertices[a.a];e=b.vertices[a.b];f=b.vertices[a.c];var b=b.vertices[a.d],g;c?a._area1&&a._area2?(c=a._area1,g=a._area2):(c=THREE.GeometryUtils.triangleArea(d,e,b),g=THREE.GeometryUtils.triangleArea(e,f,b),a._area1=c,a._area2=g):(c=
THREE.GeometryUtils.triangleArea(d,e,b),g=THREE.GeometryUtils.triangleArea(e,f,b));return THREE.GeometryUtils.random()*(c+g)<c?THREE.GeometryUtils.randomPointInTriangle(d,e,b):THREE.GeometryUtils.randomPointInTriangle(e,f,b)}},randomPointsInGeometry:function(a,b){function c(a){function b(c,d){if(d<c)return c;var e=c+Math.floor((d-c)/2);return j[e]>a?b(c,e-1):j[e]<a?b(e+1,d):e}return b(0,j.length-1)}var d,e,f=a.faces,g=a.vertices,h=f.length,i=0,j=[],m,p,l,r;for(e=0;e<h;e++)d=f[e],d instanceof THREE.Face3?
(m=g[d.a],p=g[d.b],l=g[d.c],d._area=THREE.GeometryUtils.triangleArea(m,p,l)):d instanceof THREE.Face4&&(m=g[d.a],p=g[d.b],l=g[d.c],r=g[d.d],d._area1=THREE.GeometryUtils.triangleArea(m,p,r),d._area2=THREE.GeometryUtils.triangleArea(p,l,r),d._area=d._area1+d._area2),i+=d._area,j[e]=i;d=[];for(e=0;e<b;e++)g=THREE.GeometryUtils.random()*i,g=c(g),d[e]=THREE.GeometryUtils.randomPointInFace(f[g],a,!0);return d},triangleArea:function(a,b,c){var d=THREE.GeometryUtils.__v1,e=THREE.GeometryUtils.__v2;d.subVectors(b,
a);e.subVectors(c,a);d.cross(e);return 0.5*d.length()},center:function(a){a.computeBoundingBox();var b=a.boundingBox,c=new THREE.Vector3;c.addVectors(b.min,b.max);c.multiplyScalar(-0.5);a.applyMatrix((new THREE.Matrix4).makeTranslation(c.x,c.y,c.z));a.computeBoundingBox();return c},normalizeUVs:function(a){for(var a=a.faceVertexUvs[0],b=0,c=a.length;b<c;b++)for(var d=a[b],e=0,f=d.length;e<f;e++)1!==d[e].x&&(d[e].x-=Math.floor(d[e].x)),1!==d[e].y&&(d[e].y-=Math.floor(d[e].y))},triangulateQuads:function(a){var b,
c,d,e,f=[],g=[],h=[];b=0;for(c=a.faceUvs.length;b<c;b++)g[b]=[];b=0;for(c=a.faceVertexUvs.length;b<c;b++)h[b]=[];b=0;for(c=a.faces.length;b<c;b++)if(d=a.faces[b],d instanceof THREE.Face4){e=d.a;var i=d.b,j=d.c,m=d.d,p=new THREE.Face3,l=new THREE.Face3;p.color.copy(d.color);l.color.copy(d.color);p.materialIndex=d.materialIndex;l.materialIndex=d.materialIndex;p.a=e;p.b=i;p.c=m;l.a=i;l.b=j;l.c=m;4===d.vertexColors.length&&(p.vertexColors[0]=d.vertexColors[0].clone(),p.vertexColors[1]=d.vertexColors[1].clone(),
p.vertexColors[2]=d.vertexColors[3].clone(),l.vertexColors[0]=d.vertexColors[1].clone(),l.vertexColors[1]=d.vertexColors[2].clone(),l.vertexColors[2]=d.vertexColors[3].clone());f.push(p,l);d=0;for(e=a.faceVertexUvs.length;d<e;d++)a.faceVertexUvs[d].length&&(p=a.faceVertexUvs[d][b],i=p[1],j=p[2],m=p[3],p=[p[0].clone(),i.clone(),m.clone()],i=[i.clone(),j.clone(),m.clone()],h[d].push(p,i));d=0;for(e=a.faceUvs.length;d<e;d++)a.faceUvs[d].length&&(i=a.faceUvs[d][b],g[d].push(i,i))}else{f.push(d);d=0;for(e=
a.faceUvs.length;d<e;d++)g[d].push(a.faceUvs[d][b]);d=0;for(e=a.faceVertexUvs.length;d<e;d++)h[d].push(a.faceVertexUvs[d][b])}a.faces=f;a.faceUvs=g;a.faceVertexUvs=h;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals();a.hasTangents&&a.computeTangents()},setMaterialIndex:function(a,b,c,d){a=a.faces;d=d||a.length-1;for(c=c||0;c<=d;c++)a[c].materialIndex=b}};THREE.GeometryUtils.random=THREE.Math.random16;THREE.GeometryUtils.__v1=new THREE.Vector3;THREE.GeometryUtils.__v2=new THREE.Vector3;THREE.ImageUtils={crossOrigin:"anonymous",loadTexture:function(a,b,c,d){var e=new Image,f=new THREE.Texture(e,b),b=new THREE.ImageLoader;b.addEventListener("load",function(a){f.image=a.content;f.needsUpdate=!0;c&&c(f)});b.addEventListener("error",function(a){d&&d(a.message)});b.crossOrigin=this.crossOrigin;b.load(a,e);f.sourceFile=a;return f},loadCompressedTexture:function(a,b,c,d){var e=new THREE.CompressedTexture;e.mapping=b;var f=new XMLHttpRequest;f.onload=function(){var a=THREE.ImageUtils.parseDDS(f.response,
!0);e.format=a.format;e.mipmaps=a.mipmaps;e.image.width=a.width;e.image.height=a.height;e.generateMipmaps=!1;e.needsUpdate=!0;c&&c(e)};f.onerror=d;f.open("GET",a,!0);f.responseType="arraybuffer";f.send(null);return e},loadTextureCube:function(a,b,c,d){var e=[];e.loadCount=0;var f=new THREE.Texture;f.image=e;void 0!==b&&(f.mapping=b);f.flipY=!1;for(var b=0,g=a.length;b<g;++b){var h=new Image;e[b]=h;h.onload=function(){e.loadCount+=1;6===e.loadCount&&(f.needsUpdate=!0,c&&c(f))};h.onerror=d;h.crossOrigin=
this.crossOrigin;h.src=a[b]}return f},loadCompressedTextureCube:function(a,b,c,d){var e=[];e.loadCount=0;var f=new THREE.CompressedTexture;f.image=e;void 0!==b&&(f.mapping=b);f.flipY=!1;f.generateMipmaps=!1;b=function(a,b){return function(){var d=THREE.ImageUtils.parseDDS(a.response,!0);b.format=d.format;b.mipmaps=d.mipmaps;b.width=d.width;b.height=d.height;e.loadCount+=1;6===e.loadCount&&(f.format=d.format,f.needsUpdate=!0,c&&c(f))}};if(a instanceof Array)for(var g=0,h=a.length;g<h;++g){var i={};
e[g]=i;var j=new XMLHttpRequest;j.onload=b(j,i);j.onerror=d;i=a[g];j.open("GET",i,!0);j.responseType="arraybuffer";j.send(null)}else j=new XMLHttpRequest,j.onload=function(){var a=THREE.ImageUtils.parseDDS(j.response,!0);if(a.isCubemap){for(var b=a.mipmaps.length/a.mipmapCount,d=0;d<b;d++){e[d]={mipmaps:[]};for(var g=0;g<a.mipmapCount;g++)e[d].mipmaps.push(a.mipmaps[d*a.mipmapCount+g]),e[d].format=a.format,e[d].width=a.width,e[d].height=a.height}f.format=a.format;f.needsUpdate=!0;c&&c(f)}},j.onerror=
d,j.open("GET",a,!0),j.responseType="arraybuffer",j.send(null);return f},parseDDS:function(a,b){function c(a){return a.charCodeAt(0)+(a.charCodeAt(1)<<8)+(a.charCodeAt(2)<<16)+(a.charCodeAt(3)<<24)}var d={mipmaps:[],width:0,height:0,format:null,mipmapCount:1},e=c("DXT1"),f=c("DXT3"),g=c("DXT5"),h=new Int32Array(a,0,31);if(542327876!==h[0])return console.error("ImageUtils.parseDDS(): Invalid magic number in DDS header"),d;if(!h[20]&4)return console.error("ImageUtils.parseDDS(): Unsupported format, must contain a FourCC code"),
d;var i=h[21];switch(i){case e:e=8;d.format=THREE.RGB_S3TC_DXT1_Format;break;case f:e=16;d.format=THREE.RGBA_S3TC_DXT3_Format;break;case g:e=16;d.format=THREE.RGBA_S3TC_DXT5_Format;break;default:return console.error("ImageUtils.parseDDS(): Unsupported FourCC code: ",String.fromCharCode(i&255,i>>8&255,i>>16&255,i>>24&255)),d}d.mipmapCount=1;h[2]&131072&&!1!==b&&(d.mipmapCount=Math.max(1,h[7]));d.isCubemap=h[28]&512?!0:!1;d.width=h[4];d.height=h[3];for(var h=h[1]+4,f=d.width,g=d.height,i=d.isCubemap?
6:1,j=0;j<i;j++){for(var m=0;m<d.mipmapCount;m++){var p=Math.max(4,f)/4*Math.max(4,g)/4*e,l={data:new Uint8Array(a,h,p),width:f,height:g};d.mipmaps.push(l);h+=p;f=Math.max(0.5*f,1);g=Math.max(0.5*g,1)}f=d.width;g=d.height}return d},getNormalMap:function(a,b){var c=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return[a[0]/b,a[1]/b,a[2]/b]},b=b|1,d=a.width,e=a.height,f=document.createElement("canvas");f.width=d;f.height=e;var g=f.getContext("2d");g.drawImage(a,0,0);for(var h=g.getImageData(0,
0,d,e).data,i=g.createImageData(d,e),j=i.data,m=0;m<d;m++)for(var p=0;p<e;p++){var l=0>p-1?0:p-1,r=p+1>e-1?e-1:p+1,s=0>m-1?0:m-1,n=m+1>d-1?d-1:m+1,q=[],y=[0,0,h[4*(p*d+m)]/255*b];q.push([-1,0,h[4*(p*d+s)]/255*b]);q.push([-1,-1,h[4*(l*d+s)]/255*b]);q.push([0,-1,h[4*(l*d+m)]/255*b]);q.push([1,-1,h[4*(l*d+n)]/255*b]);q.push([1,0,h[4*(p*d+n)]/255*b]);q.push([1,1,h[4*(r*d+n)]/255*b]);q.push([0,1,h[4*(r*d+m)]/255*b]);q.push([-1,1,h[4*(r*d+s)]/255*b]);l=[];s=q.length;for(r=0;r<s;r++){var n=q[r],u=q[(r+1)%
s],n=[n[0]-y[0],n[1]-y[1],n[2]-y[2]],u=[u[0]-y[0],u[1]-y[1],u[2]-y[2]];l.push(c([n[1]*u[2]-n[2]*u[1],n[2]*u[0]-n[0]*u[2],n[0]*u[1]-n[1]*u[0]]))}q=[0,0,0];for(r=0;r<l.length;r++)q[0]+=l[r][0],q[1]+=l[r][1],q[2]+=l[r][2];q[0]/=l.length;q[1]/=l.length;q[2]/=l.length;y=4*(p*d+m);j[y]=255*((q[0]+1)/2)|0;j[y+1]=255*((q[1]+1)/2)|0;j[y+2]=255*q[2]|0;j[y+3]=255}g.putImageData(i,0,0);return f},generateDataTexture:function(a,b,c){for(var d=a*b,e=new Uint8Array(3*d),f=Math.floor(255*c.r),g=Math.floor(255*c.g),
c=Math.floor(255*c.b),h=0;h<d;h++)e[3*h]=f,e[3*h+1]=g,e[3*h+2]=c;a=new THREE.DataTexture(e,a,b,THREE.RGBFormat);a.needsUpdate=!0;return a}};THREE.SceneUtils={createMultiMaterialObject:function(a,b){for(var c=new THREE.Object3D,d=0,e=b.length;d<e;d++)c.add(new THREE.Mesh(a,b[d]));return c},detach:function(a,b,c){a.applyMatrix(b.matrixWorld);b.remove(a);c.add(a)},attach:function(a,b,c){var d=new THREE.Matrix4;d.getInverse(c.matrixWorld);a.applyMatrix(d);b.remove(a);c.add(a)}};THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){return this.faces[this.face][this.weight][this.style]},loadFace:function(a){var b=a.familyName.toLowerCase();this.faces[b]=this.faces[b]||{};this.faces[b][a.cssFontWeight]=this.faces[b][a.cssFontWeight]||{};this.faces[b][a.cssFontWeight][a.cssFontStyle]=a;return this.faces[b][a.cssFontWeight][a.cssFontStyle]=a},drawText:function(a){for(var b=this.getFace(),c=this.size/b.resolution,d=
0,e=String(a).split(""),f=e.length,g=[],a=0;a<f;a++){var h=new THREE.Path,h=this.extractGlyphPoints(e[a],b,c,d,h),d=d+h.offset;g.push(h.path)}return{paths:g,offset:d/2}},extractGlyphPoints:function(a,b,c,d,e){var f=[],g,h,i,j,m,p,l,r,s,n,q,y=b.glyphs[a]||b.glyphs["?"];if(y){if(y.o){b=y._cachedOutline||(y._cachedOutline=y.o.split(" "));j=b.length;for(a=0;a<j;)switch(i=b[a++],i){case "m":i=b[a++]*c+d;m=b[a++]*c;e.moveTo(i,m);break;case "l":i=b[a++]*c+d;m=b[a++]*c;e.lineTo(i,m);break;case "q":i=b[a++]*
c+d;m=b[a++]*c;r=b[a++]*c+d;s=b[a++]*c;e.quadraticCurveTo(r,s,i,m);if(g=f[f.length-1]){p=g.x;l=g.y;g=1;for(h=this.divisions;g<=h;g++){var u=g/h;THREE.Shape.Utils.b2(u,p,r,i);THREE.Shape.Utils.b2(u,l,s,m)}}break;case "b":if(i=b[a++]*c+d,m=b[a++]*c,r=b[a++]*c+d,s=b[a++]*-c,n=b[a++]*c+d,q=b[a++]*-c,e.bezierCurveTo(i,m,r,s,n,q),g=f[f.length-1]){p=g.x;l=g.y;g=1;for(h=this.divisions;g<=h;g++)u=g/h,THREE.Shape.Utils.b3(u,p,r,n,i),THREE.Shape.Utils.b3(u,l,s,q,m)}}}return{offset:y.ha*c,path:e}}}};
THREE.FontUtils.generateShapes=function(a,b){var b=b||{},c=void 0!==b.curveSegments?b.curveSegments:4,d=void 0!==b.font?b.font:"helvetiker",e=void 0!==b.weight?b.weight:"normal",f=void 0!==b.style?b.style:"normal";THREE.FontUtils.size=void 0!==b.size?b.size:100;THREE.FontUtils.divisions=c;THREE.FontUtils.face=d;THREE.FontUtils.weight=e;THREE.FontUtils.style=f;c=THREE.FontUtils.drawText(a).paths;d=[];e=0;for(f=c.length;e<f;e++)Array.prototype.push.apply(d,c[e].toShapes());return d};
(function(a){var b=function(a){for(var b=a.length,e=0,f=b-1,g=0;g<b;f=g++)e+=a[f].x*a[g].y-a[g].x*a[f].y;return 0.5*e};a.Triangulate=function(a,d){var e=a.length;if(3>e)return null;var f=[],g=[],h=[],i,j,m;if(0<b(a))for(j=0;j<e;j++)g[j]=j;else for(j=0;j<e;j++)g[j]=e-1-j;var p=2*e;for(j=e-1;2<e;){if(0>=p--){console.log("Warning, unable to triangulate polygon!");break}i=j;e<=i&&(i=0);j=i+1;e<=j&&(j=0);m=j+1;e<=m&&(m=0);var l;a:{var r=l=void 0,s=void 0,n=void 0,q=void 0,y=void 0,u=void 0,x=void 0,t=
void 0,r=a[g[i]].x,s=a[g[i]].y,n=a[g[j]].x,q=a[g[j]].y,y=a[g[m]].x,u=a[g[m]].y;if(1E-10>(n-r)*(u-s)-(q-s)*(y-r))l=!1;else{var E=void 0,J=void 0,F=void 0,z=void 0,H=void 0,K=void 0,G=void 0,L=void 0,B=void 0,V=void 0,B=L=G=t=x=void 0,E=y-n,J=u-q,F=r-y,z=s-u,H=n-r,K=q-s;for(l=0;l<e;l++)if(!(l===i||l===j||l===m))if(x=a[g[l]].x,t=a[g[l]].y,G=x-r,L=t-s,B=x-n,V=t-q,x-=y,t-=u,B=E*V-J*B,G=H*L-K*G,L=F*t-z*x,0<=B&&0<=L&&0<=G){l=!1;break a}l=!0}}if(l){f.push([a[g[i]],a[g[j]],a[g[m]]]);h.push([g[i],g[j],g[m]]);
i=j;for(m=j+1;m<e;i++,m++)g[i]=g[m];e--;p=2*e}}return d?h:f};a.Triangulate.area=b;return a})(THREE.FontUtils);self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace};THREE.typeface_js=self._typeface_js;THREE.Curve=function(){};THREE.Curve.prototype.getPoint=function(){console.log("Warning, getPoint() not implemented!");return null};THREE.Curve.prototype.getPointAt=function(a){a=this.getUtoTmapping(a);return this.getPoint(a)};THREE.Curve.prototype.getPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPoint(b/a));return c};THREE.Curve.prototype.getSpacedPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPointAt(b/a));return c};
THREE.Curve.prototype.getLength=function(){var a=this.getLengths();return a[a.length-1]};THREE.Curve.prototype.getLengths=function(a){a||(a=this.__arcLengthDivisions?this.__arcLengthDivisions:200);if(this.cacheArcLengths&&this.cacheArcLengths.length==a+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;var b=[],c,d=this.getPoint(0),e,f=0;b.push(0);for(e=1;e<=a;e++)c=this.getPoint(e/a),f+=c.distanceTo(d),b.push(f),d=c;return this.cacheArcLengths=b};
THREE.Curve.prototype.updateArcLengths=function(){this.needsUpdate=!0;this.getLengths()};THREE.Curve.prototype.getUtoTmapping=function(a,b){var c=this.getLengths(),d=0,e=c.length,f;f=b?b:a*c[e-1];for(var g=0,h=e-1,i;g<=h;)if(d=Math.floor(g+(h-g)/2),i=c[d]-f,0>i)g=d+1;else if(0<i)h=d-1;else{h=d;break}d=h;if(c[d]==f)return d/(e-1);g=c[d];return c=(d+(f-g)/(c[d+1]-g))/(e-1)};THREE.Curve.prototype.getTangent=function(a){var b=a-1E-4,a=a+1E-4;0>b&&(b=0);1<a&&(a=1);b=this.getPoint(b);return this.getPoint(a).clone().sub(b).normalize()};
THREE.Curve.prototype.getTangentAt=function(a){a=this.getUtoTmapping(a);return this.getTangent(a)};THREE.LineCurve=function(a,b){this.v1=a;this.v2=b};THREE.LineCurve.prototype=Object.create(THREE.Curve.prototype);THREE.LineCurve.prototype.getPoint=function(a){var b=this.v2.clone().sub(this.v1);b.multiplyScalar(a).add(this.v1);return b};THREE.LineCurve.prototype.getPointAt=function(a){return this.getPoint(a)};THREE.LineCurve.prototype.getTangent=function(){return this.v2.clone().sub(this.v1).normalize()};
THREE.QuadraticBezierCurve=function(a,b,c){this.v0=a;this.v1=b;this.v2=c};THREE.QuadraticBezierCurve.prototype=Object.create(THREE.Curve.prototype);THREE.QuadraticBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);return new THREE.Vector2(b,a)};
THREE.QuadraticBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.y,this.v1.y,this.v2.y);b=new THREE.Vector2(b,a);b.normalize();return b};THREE.CubicBezierCurve=function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d};THREE.CubicBezierCurve.prototype=Object.create(THREE.Curve.prototype);
THREE.CubicBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);return new THREE.Vector2(b,a)};THREE.CubicBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);b=new THREE.Vector2(b,a);b.normalize();return b};
THREE.SplineCurve=function(a){this.points=void 0==a?[]:a};THREE.SplineCurve.prototype=Object.create(THREE.Curve.prototype);THREE.SplineCurve.prototype.getPoint=function(a){var b=new THREE.Vector2,c=[],d=this.points,e;e=(d.length-1)*a;a=Math.floor(e);e-=a;c[0]=0==a?a:a-1;c[1]=a;c[2]=a>d.length-2?d.length-1:a+1;c[3]=a>d.length-3?d.length-1:a+2;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);return b};
THREE.EllipseCurve=function(a,b,c,d,e,f,g){this.aX=a;this.aY=b;this.xRadius=c;this.yRadius=d;this.aStartAngle=e;this.aEndAngle=f;this.aClockwise=g};THREE.EllipseCurve.prototype=Object.create(THREE.Curve.prototype);THREE.EllipseCurve.prototype.getPoint=function(a){var b=this.aEndAngle-this.aStartAngle;this.aClockwise||(a=1-a);b=this.aStartAngle+a*b;a=this.aX+this.xRadius*Math.cos(b);b=this.aY+this.yRadius*Math.sin(b);return new THREE.Vector2(a,b)};
THREE.ArcCurve=function(a,b,c,d,e,f){THREE.EllipseCurve.call(this,a,b,c,c,d,e,f)};THREE.ArcCurve.prototype=Object.create(THREE.EllipseCurve.prototype);
THREE.Curve.Utils={tangentQuadraticBezier:function(a,b,c,d){return 2*(1-a)*(c-b)+2*a*(d-c)},tangentCubicBezier:function(a,b,c,d,e){return-3*b*(1-a)*(1-a)+3*c*(1-a)*(1-a)-6*a*c*(1-a)+6*a*d*(1-a)-3*a*a*d+3*a*a*e},tangentSpline:function(a){return 6*a*a-6*a+(3*a*a-4*a+1)+(-6*a*a+6*a)+(3*a*a-2*a)},interpolate:function(a,b,c,d,e){var a=0.5*(c-a),d=0.5*(d-b),f=e*e;return(2*b-2*c+a+d)*e*f+(-3*b+3*c-2*a-d)*f+a*e+b}};
THREE.Curve.create=function(a,b){a.prototype=Object.create(THREE.Curve.prototype);a.prototype.getPoint=b;return a};THREE.LineCurve3=THREE.Curve.create(function(a,b){this.v1=a;this.v2=b},function(a){var b=new THREE.Vector3;b.subVectors(this.v2,this.v1);b.multiplyScalar(a);b.add(this.v1);return b});
THREE.QuadraticBezierCurve3=THREE.Curve.create(function(a,b,c){this.v0=a;this.v1=b;this.v2=c},function(a){var b,c;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);c=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);a=THREE.Shape.Utils.b2(a,this.v0.z,this.v1.z,this.v2.z);return new THREE.Vector3(b,c,a)});
THREE.CubicBezierCurve3=THREE.Curve.create(function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d},function(a){var b,c;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);c=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);a=THREE.Shape.Utils.b3(a,this.v0.z,this.v1.z,this.v2.z,this.v3.z);return new THREE.Vector3(b,c,a)});
THREE.SplineCurve3=THREE.Curve.create(function(a){this.points=void 0==a?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e,a=(d.length-1)*a;e=Math.floor(a);a-=e;c[0]=0==e?e:e-1;c[1]=e;c[2]=e>d.length-2?d.length-1:e+1;c[3]=e>d.length-3?d.length-1:e+2;e=d[c[0]];var f=d[c[1]],g=d[c[2]],c=d[c[3]];b.x=THREE.Curve.Utils.interpolate(e.x,f.x,g.x,c.x,a);b.y=THREE.Curve.Utils.interpolate(e.y,f.y,g.y,c.y,a);b.z=THREE.Curve.Utils.interpolate(e.z,f.z,g.z,c.z,a);return b});
THREE.ClosedSplineCurve3=THREE.Curve.create(function(a){this.points=void 0==a?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e;e=(d.length-0)*a;a=Math.floor(e);e-=a;a+=0<a?0:(Math.floor(Math.abs(a)/d.length)+1)*d.length;c[0]=(a-1)%d.length;c[1]=a%d.length;c[2]=(a+1)%d.length;c[3]=(a+2)%d.length;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);b.z=THREE.Curve.Utils.interpolate(d[c[0]].z,
d[c[1]].z,d[c[2]].z,d[c[3]].z,e);return b});THREE.CurvePath=function(){this.curves=[];this.bends=[];this.autoClose=!1};THREE.CurvePath.prototype=Object.create(THREE.Curve.prototype);THREE.CurvePath.prototype.add=function(a){this.curves.push(a)};THREE.CurvePath.prototype.checkConnection=function(){};THREE.CurvePath.prototype.closePath=function(){var a=this.curves[0].getPoint(0),b=this.curves[this.curves.length-1].getPoint(1);a.equals(b)||this.curves.push(new THREE.LineCurve(b,a))};
THREE.CurvePath.prototype.getPoint=function(a){for(var b=a*this.getLength(),c=this.getCurveLengths(),a=0;a<c.length;){if(c[a]>=b)return b=c[a]-b,a=this.curves[a],b=1-b/a.getLength(),a.getPointAt(b);a++}return null};THREE.CurvePath.prototype.getLength=function(){var a=this.getCurveLengths();return a[a.length-1]};
THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length)return this.cacheLengths;var a=[],b=0,c,d=this.curves.length;for(c=0;c<d;c++)b+=this.curves[c].getLength(),a.push(b);return this.cacheLengths=a};
THREE.CurvePath.prototype.getBoundingBox=function(){var a=this.getPoints(),b,c,d,e,f,g;b=c=Number.NEGATIVE_INFINITY;e=f=Number.POSITIVE_INFINITY;var h,i,j,m,p=a[0]instanceof THREE.Vector3;m=p?new THREE.Vector3:new THREE.Vector2;i=0;for(j=a.length;i<j;i++)h=a[i],h.x>b?b=h.x:h.x<e&&(e=h.x),h.y>c?c=h.y:h.y<f&&(f=h.y),p&&(h.z>d?d=h.z:h.z<g&&(g=h.z)),m.add(h);a={minX:e,minY:f,maxX:b,maxY:c,centroid:m.divideScalar(j)};p&&(a.maxZ=d,a.minZ=g);return a};
THREE.CurvePath.prototype.createPointsGeometry=function(a){a=this.getPoints(a,!0);return this.createGeometry(a)};THREE.CurvePath.prototype.createSpacedPointsGeometry=function(a){a=this.getSpacedPoints(a,!0);return this.createGeometry(a)};THREE.CurvePath.prototype.createGeometry=function(a){for(var b=new THREE.Geometry,c=0;c<a.length;c++)b.vertices.push(new THREE.Vector3(a[c].x,a[c].y,a[c].z||0));return b};THREE.CurvePath.prototype.addWrapPath=function(a){this.bends.push(a)};
THREE.CurvePath.prototype.getTransformedPoints=function(a,b){var c=this.getPoints(a),d,e;b||(b=this.bends);d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};THREE.CurvePath.prototype.getTransformedSpacedPoints=function(a,b){var c=this.getSpacedPoints(a),d,e;b||(b=this.bends);d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};
THREE.CurvePath.prototype.getWrapPoints=function(a,b){var c=this.getBoundingBox(),d,e,f,g,h,i;d=0;for(e=a.length;d<e;d++)f=a[d],g=f.x,h=f.y,i=g/c.maxX,i=b.getUtoTmapping(i,g),g=b.getPoint(i),h=b.getNormalVector(i).multiplyScalar(h),f.x=g.x+h.x,f.y=g.y+h.y;return a};THREE.Gyroscope=function(){THREE.Object3D.call(this)};THREE.Gyroscope.prototype=Object.create(THREE.Object3D.prototype);
THREE.Gyroscope.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a)this.parent?(this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorld.decompose(this.translationWorld,this.rotationWorld,this.scaleWorld),this.matrix.decompose(this.translationObject,this.rotationObject,this.scaleObject),this.matrixWorld.makeFromPositionQuaternionScale(this.translationWorld,this.rotationObject,this.scaleWorld)):this.matrixWorld.copy(this.matrix),
this.matrixWorldNeedsUpdate=!1,a=!0;for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)};THREE.Gyroscope.prototype.translationWorld=new THREE.Vector3;THREE.Gyroscope.prototype.translationObject=new THREE.Vector3;THREE.Gyroscope.prototype.rotationWorld=new THREE.Quaternion;THREE.Gyroscope.prototype.rotationObject=new THREE.Quaternion;THREE.Gyroscope.prototype.scaleWorld=new THREE.Vector3;THREE.Gyroscope.prototype.scaleObject=new THREE.Vector3;THREE.Path=function(a){THREE.CurvePath.call(this);this.actions=[];a&&this.fromPoints(a)};THREE.Path.prototype=Object.create(THREE.CurvePath.prototype);THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc",ELLIPSE:"ellipse"};THREE.Path.prototype.fromPoints=function(a){this.moveTo(a[0].x,a[0].y);for(var b=1,c=a.length;b<c;b++)this.lineTo(a[b].x,a[b].y)};
THREE.Path.prototype.moveTo=function(a,b){var c=Array.prototype.slice.call(arguments);this.actions.push({action:THREE.PathActions.MOVE_TO,args:c})};THREE.Path.prototype.lineTo=function(a,b){var c=Array.prototype.slice.call(arguments),d=this.actions[this.actions.length-1].args,d=new THREE.LineCurve(new THREE.Vector2(d[d.length-2],d[d.length-1]),new THREE.Vector2(a,b));this.curves.push(d);this.actions.push({action:THREE.PathActions.LINE_TO,args:c})};
THREE.Path.prototype.quadraticCurveTo=function(a,b,c,d){var e=Array.prototype.slice.call(arguments),f=this.actions[this.actions.length-1].args,f=new THREE.QuadraticBezierCurve(new THREE.Vector2(f[f.length-2],f[f.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d));this.curves.push(f);this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:e})};
THREE.Path.prototype.bezierCurveTo=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1].args,h=new THREE.CubicBezierCurve(new THREE.Vector2(h[h.length-2],h[h.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d),new THREE.Vector2(e,f));this.curves.push(h);this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:g})};
THREE.Path.prototype.splineThru=function(a){var b=Array.prototype.slice.call(arguments),c=this.actions[this.actions.length-1].args,c=[new THREE.Vector2(c[c.length-2],c[c.length-1])];Array.prototype.push.apply(c,a);c=new THREE.SplineCurve(c);this.curves.push(c);this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:b})};THREE.Path.prototype.arc=function(a,b,c,d,e,f){var g=this.actions[this.actions.length-1].args;this.absarc(a+g[g.length-2],b+g[g.length-1],c,d,e,f)};
THREE.Path.prototype.absarc=function(a,b,c,d,e,f){this.absellipse(a,b,c,c,d,e,f)};THREE.Path.prototype.ellipse=function(a,b,c,d,e,f,g){var h=this.actions[this.actions.length-1].args;this.absellipse(a+h[h.length-2],b+h[h.length-1],c,d,e,f,g)};THREE.Path.prototype.absellipse=function(a,b,c,d,e,f,g){var h=Array.prototype.slice.call(arguments),i=new THREE.EllipseCurve(a,b,c,d,e,f,g);this.curves.push(i);i=i.getPoint(g?1:0);h.push(i.x);h.push(i.y);this.actions.push({action:THREE.PathActions.ELLIPSE,args:h})};
THREE.Path.prototype.getSpacedPoints=function(a){a||(a=40);for(var b=[],c=0;c<a;c++)b.push(this.getPoint(c/a));return b};
THREE.Path.prototype.getPoints=function(a,b){if(this.useSpacedPoints)return console.log("tata"),this.getSpacedPoints(a,b);var a=a||12,c=[],d,e,f,g,h,i,j,m,p,l,r,s,n;d=0;for(e=this.actions.length;d<e;d++)switch(f=this.actions[d],g=f.action,f=f.args,g){case THREE.PathActions.MOVE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.LINE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.QUADRATIC_CURVE_TO:h=f[2];i=f[3];p=f[0];l=f[1];0<c.length?(g=c[c.length-1],r=g.x,
s=g.y):(g=this.actions[d-1].args,r=g[g.length-2],s=g[g.length-1]);for(f=1;f<=a;f++)n=f/a,g=THREE.Shape.Utils.b2(n,r,p,h),n=THREE.Shape.Utils.b2(n,s,l,i),c.push(new THREE.Vector2(g,n));break;case THREE.PathActions.BEZIER_CURVE_TO:h=f[4];i=f[5];p=f[0];l=f[1];j=f[2];m=f[3];0<c.length?(g=c[c.length-1],r=g.x,s=g.y):(g=this.actions[d-1].args,r=g[g.length-2],s=g[g.length-1]);for(f=1;f<=a;f++)n=f/a,g=THREE.Shape.Utils.b3(n,r,p,j,h),n=THREE.Shape.Utils.b3(n,s,l,m,i),c.push(new THREE.Vector2(g,n));break;case THREE.PathActions.CSPLINE_THRU:g=
this.actions[d-1].args;n=[new THREE.Vector2(g[g.length-2],g[g.length-1])];g=a*f[0].length;n=n.concat(f[0]);n=new THREE.SplineCurve(n);for(f=1;f<=g;f++)c.push(n.getPointAt(f/g));break;case THREE.PathActions.ARC:h=f[0];i=f[1];l=f[2];j=f[3];g=f[4];p=!!f[5];r=g-j;s=2*a;for(f=1;f<=s;f++)n=f/s,p||(n=1-n),n=j+n*r,g=h+l*Math.cos(n),n=i+l*Math.sin(n),c.push(new THREE.Vector2(g,n));break;case THREE.PathActions.ELLIPSE:h=f[0];i=f[1];l=f[2];m=f[3];j=f[4];g=f[5];p=!!f[6];r=g-j;s=2*a;for(f=1;f<=s;f++)n=f/s,p||
(n=1-n),n=j+n*r,g=h+l*Math.cos(n),n=i+m*Math.sin(n),c.push(new THREE.Vector2(g,n))}d=c[c.length-1];1E-10>Math.abs(d.x-c[0].x)&&1E-10>Math.abs(d.y-c[0].y)&&c.splice(c.length-1,1);b&&c.push(c[0]);return c};
THREE.Path.prototype.toShapes=function(){var a,b,c,d,e=[],f=new THREE.Path;a=0;for(b=this.actions.length;a<b;a++)c=this.actions[a],d=c.args,c=c.action,c==THREE.PathActions.MOVE_TO&&0!=f.actions.length&&(e.push(f),f=new THREE.Path),f[c].apply(f,d);0!=f.actions.length&&e.push(f);if(0==e.length)return[];var g;d=[];a=!THREE.Shape.Utils.isClockWise(e[0].getPoints());if(1==e.length)return f=e[0],g=new THREE.Shape,g.actions=f.actions,g.curves=f.curves,d.push(g),d;if(a){g=new THREE.Shape;a=0;for(b=e.length;a<
b;a++)f=e[a],THREE.Shape.Utils.isClockWise(f.getPoints())?(g.actions=f.actions,g.curves=f.curves,d.push(g),g=new THREE.Shape):g.holes.push(f)}else{a=0;for(b=e.length;a<b;a++)f=e[a],THREE.Shape.Utils.isClockWise(f.getPoints())?(g&&d.push(g),g=new THREE.Shape,g.actions=f.actions,g.curves=f.curves):g.holes.push(f);d.push(g)}return d};THREE.Shape=function(){THREE.Path.apply(this,arguments);this.holes=[]};THREE.Shape.prototype=Object.create(THREE.Path.prototype);THREE.Shape.prototype.extrude=function(a){return new THREE.ExtrudeGeometry(this,a)};THREE.Shape.prototype.makeGeometry=function(a){return new THREE.ShapeGeometry(this,a)};THREE.Shape.prototype.getPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedPoints(a,this.bends);return d};
THREE.Shape.prototype.getSpacedPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedSpacedPoints(a,this.bends);return d};THREE.Shape.prototype.extractAllPoints=function(a){return{shape:this.getTransformedPoints(a),holes:this.getPointsHoles(a)}};THREE.Shape.prototype.extractPoints=function(a){return this.useSpacedPoints?this.extractAllSpacedPoints(a):this.extractAllPoints(a)};
THREE.Shape.prototype.extractAllSpacedPoints=function(a){return{shape:this.getTransformedSpacedPoints(a),holes:this.getSpacedPointsHoles(a)}};
THREE.Shape.Utils={removeHoles:function(a,b){var c=a.concat(),d=c.concat(),e,f,g,h,i,j,m,p,l,r,s=[];for(i=0;i<b.length;i++){j=b[i];Array.prototype.push.apply(d,j);f=Number.POSITIVE_INFINITY;for(e=0;e<j.length;e++){l=j[e];r=[];for(p=0;p<c.length;p++)m=c[p],m=l.distanceToSquared(m),r.push(m),m<f&&(f=m,g=e,h=p)}e=0<=h-1?h-1:c.length-1;f=0<=g-1?g-1:j.length-1;var n=[j[g],c[h],c[e]];p=THREE.FontUtils.Triangulate.area(n);var q=[j[g],j[f],c[h]];l=THREE.FontUtils.Triangulate.area(q);r=h;m=g;h+=1;g+=-1;0>
h&&(h+=c.length);h%=c.length;0>g&&(g+=j.length);g%=j.length;e=0<=h-1?h-1:c.length-1;f=0<=g-1?g-1:j.length-1;n=[j[g],c[h],c[e]];n=THREE.FontUtils.Triangulate.area(n);q=[j[g],j[f],c[h]];q=THREE.FontUtils.Triangulate.area(q);p+l>n+q&&(h=r,g=m,0>h&&(h+=c.length),h%=c.length,0>g&&(g+=j.length),g%=j.length,e=0<=h-1?h-1:c.length-1,f=0<=g-1?g-1:j.length-1);p=c.slice(0,h);l=c.slice(h);r=j.slice(g);m=j.slice(0,g);f=[j[g],j[f],c[h]];s.push([j[g],c[h],c[e]]);s.push(f);c=p.concat(r).concat(m).concat(l)}return{shape:c,
isolatedPts:s,allpoints:d}},triangulateShape:function(a,b){var c=THREE.Shape.Utils.removeHoles(a,b),d=c.allpoints,e=c.isolatedPts,c=THREE.FontUtils.Triangulate(c.shape,!1),f,g,h,i,j={};f=0;for(g=d.length;f<g;f++)i=d[f].x+":"+d[f].y,void 0!==j[i]&&console.log("Duplicate point",i),j[i]=f;f=0;for(g=c.length;f<g;f++){h=c[f];for(d=0;3>d;d++)i=h[d].x+":"+h[d].y,i=j[i],void 0!==i&&(h[d]=i)}f=0;for(g=e.length;f<g;f++){h=e[f];for(d=0;3>d;d++)i=h[d].x+":"+h[d].y,i=j[i],void 0!==i&&(h[d]=i)}return c.concat(e)},
isClockWise:function(a){return 0>THREE.FontUtils.Triangulate.area(a)},b2p0:function(a,b){var c=1-a;return c*c*b},b2p1:function(a,b){return 2*(1-a)*a*b},b2p2:function(a,b){return a*a*b},b2:function(a,b,c,d){return this.b2p0(a,b)+this.b2p1(a,c)+this.b2p2(a,d)},b3p0:function(a,b){var c=1-a;return c*c*c*b},b3p1:function(a,b){var c=1-a;return 3*c*c*a*b},b3p2:function(a,b){return 3*(1-a)*a*a*b},b3p3:function(a,b){return a*a*a*b},b3:function(a,b,c,d,e){return this.b3p0(a,b)+this.b3p1(a,c)+this.b3p2(a,d)+
this.b3p3(a,e)}};THREE.AnimationHandler=function(){var a=[],b={},c={update:function(b){for(var c=0;c<a.length;c++)a[c].update(b)},addToUpdate:function(b){-1===a.indexOf(b)&&a.push(b)},removeFromUpdate:function(b){b=a.indexOf(b);-1!==b&&a.splice(b,1)},add:function(a){void 0!==b[a.name]&&console.log("THREE.AnimationHandler.add: Warning! "+a.name+" already exists in library. Overwriting.");b[a.name]=a;if(!0!==a.initialized){for(var c=0;c<a.hierarchy.length;c++){for(var d=0;d<a.hierarchy[c].keys.length;d++)if(0>a.hierarchy[c].keys[d].time&&
(a.hierarchy[c].keys[d].time=0),void 0!==a.hierarchy[c].keys[d].rot&&!(a.hierarchy[c].keys[d].rot instanceof THREE.Quaternion)){var h=a.hierarchy[c].keys[d].rot;a.hierarchy[c].keys[d].rot=new THREE.Quaternion(h[0],h[1],h[2],h[3])}if(a.hierarchy[c].keys.length&&void 0!==a.hierarchy[c].keys[0].morphTargets){h={};for(d=0;d<a.hierarchy[c].keys.length;d++)for(var i=0;i<a.hierarchy[c].keys[d].morphTargets.length;i++){var j=a.hierarchy[c].keys[d].morphTargets[i];h[j]=-1}a.hierarchy[c].usedMorphTargets=h;
for(d=0;d<a.hierarchy[c].keys.length;d++){var m={};for(j in h){for(i=0;i<a.hierarchy[c].keys[d].morphTargets.length;i++)if(a.hierarchy[c].keys[d].morphTargets[i]===j){m[j]=a.hierarchy[c].keys[d].morphTargetsInfluences[i];break}i===a.hierarchy[c].keys[d].morphTargets.length&&(m[j]=0)}a.hierarchy[c].keys[d].morphTargetsInfluences=m}}for(d=1;d<a.hierarchy[c].keys.length;d++)a.hierarchy[c].keys[d].time===a.hierarchy[c].keys[d-1].time&&(a.hierarchy[c].keys.splice(d,1),d--);for(d=0;d<a.hierarchy[c].keys.length;d++)a.hierarchy[c].keys[d].index=
d}d=parseInt(a.length*a.fps,10);a.JIT={};a.JIT.hierarchy=[];for(c=0;c<a.hierarchy.length;c++)a.JIT.hierarchy.push(Array(d));a.initialized=!0}},get:function(a){if("string"===typeof a){if(b[a])return b[a];console.log("THREE.AnimationHandler.get: Couldn't find animation "+a);return null}},parse:function(a){var b=[];if(a instanceof THREE.SkinnedMesh)for(var c=0;c<a.bones.length;c++)b.push(a.bones[c]);else d(a,b);return b}},d=function(a,b){b.push(a);for(var c=0;c<a.children.length;c++)d(a.children[c],
b)};c.LINEAR=0;c.CATMULLROM=1;c.CATMULLROM_FORWARD=2;return c}();THREE.Animation=function(a,b,c){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=1;this.isPlaying=!1;this.loop=this.isPaused=!0;this.interpolationType=void 0!==c?c:THREE.AnimationHandler.LINEAR;this.points=[];this.target=new THREE.Vector3};
THREE.Animation.prototype.play=function(a,b){if(!1===this.isPlaying){this.isPlaying=!0;this.loop=void 0!==a?a:!0;this.currentTime=void 0!==b?b:0;var c,d=this.hierarchy.length,e;for(c=0;c<d;c++){e=this.hierarchy[c];this.interpolationType!==THREE.AnimationHandler.CATMULLROM_FORWARD&&(e.useQuaternion=!0);e.matrixAutoUpdate=!0;void 0===e.animationCache&&(e.animationCache={},e.animationCache.prevKey={pos:0,rot:0,scl:0},e.animationCache.nextKey={pos:0,rot:0,scl:0},e.animationCache.originalMatrix=e instanceof
THREE.Bone?e.skinMatrix:e.matrix);var f=e.animationCache.prevKey;e=e.animationCache.nextKey;f.pos=this.data.hierarchy[c].keys[0];f.rot=this.data.hierarchy[c].keys[0];f.scl=this.data.hierarchy[c].keys[0];e.pos=this.getNextKeyWith("pos",c,1);e.rot=this.getNextKeyWith("rot",c,1);e.scl=this.getNextKeyWith("scl",c,1)}this.update(0)}this.isPaused=!1;THREE.AnimationHandler.addToUpdate(this)};
THREE.Animation.prototype.pause=function(){!0===this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};THREE.Animation.prototype.stop=function(){this.isPaused=this.isPlaying=!1;THREE.AnimationHandler.removeFromUpdate(this)};
THREE.Animation.prototype.update=function(a){if(!1!==this.isPlaying){var b=["pos","rot","scl"],c,d,e,f,g,h,i,j,m;m=this.currentTime+=a*this.timeScale;j=this.currentTime%=this.data.length;parseInt(Math.min(j*this.data.fps,this.data.length*this.data.fps),10);for(var p=0,l=this.hierarchy.length;p<l;p++){a=this.hierarchy[p];i=a.animationCache;for(var r=0;3>r;r++){c=b[r];g=i.prevKey[c];h=i.nextKey[c];if(h.time<=m){if(j<m)if(this.loop){g=this.data.hierarchy[p].keys[0];for(h=this.getNextKeyWith(c,p,1);h.time<
j;)g=h,h=this.getNextKeyWith(c,p,h.index+1)}else{this.stop();return}else{do g=h,h=this.getNextKeyWith(c,p,h.index+1);while(h.time<j)}i.prevKey[c]=g;i.nextKey[c]=h}a.matrixAutoUpdate=!0;a.matrixWorldNeedsUpdate=!0;d=(j-g.time)/(h.time-g.time);e=g[c];f=h[c];if(0>d||1<d)console.log("THREE.Animation.update: Warning! Scale out of bounds:"+d+" on bone "+p),d=0>d?0:1;if("pos"===c)if(c=a.position,this.interpolationType===THREE.AnimationHandler.LINEAR)c.x=e[0]+(f[0]-e[0])*d,c.y=e[1]+(f[1]-e[1])*d,c.z=e[2]+
(f[2]-e[2])*d;else{if(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD)this.points[0]=this.getPrevKeyWith("pos",p,g.index-1).pos,this.points[1]=e,this.points[2]=f,this.points[3]=this.getNextKeyWith("pos",p,h.index+1).pos,d=0.33*d+0.33,e=this.interpolateCatmullRom(this.points,d),c.x=e[0],c.y=e[1],c.z=e[2],this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD&&(d=this.interpolateCatmullRom(this.points,1.01*d),
this.target.set(d[0],d[1],d[2]),this.target.sub(c),this.target.y=0,this.target.normalize(),d=Math.atan2(this.target.x,this.target.z),a.rotation.set(0,d,0))}else"rot"===c?THREE.Quaternion.slerp(e,f,a.quaternion,d):"scl"===c&&(c=a.scale,c.x=e[0]+(f[0]-e[0])*d,c.y=e[1]+(f[1]-e[1])*d,c.z=e[2]+(f[2]-e[2])*d)}}}};
THREE.Animation.prototype.interpolateCatmullRom=function(a,b){var c=[],d=[],e,f,g,h,i,j;e=(a.length-1)*b;f=Math.floor(e);e-=f;c[0]=0===f?f:f-1;c[1]=f;c[2]=f>a.length-2?f:f+1;c[3]=f>a.length-3?f:f+2;f=a[c[0]];h=a[c[1]];i=a[c[2]];j=a[c[3]];c=e*e;g=e*c;d[0]=this.interpolate(f[0],h[0],i[0],j[0],e,c,g);d[1]=this.interpolate(f[1],h[1],i[1],j[1],e,c,g);d[2]=this.interpolate(f[2],h[2],i[2],j[2],e,c,g);return d};
THREE.Animation.prototype.interpolate=function(a,b,c,d,e,f,g){a=0.5*(c-a);d=0.5*(d-b);return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b};THREE.Animation.prototype.getNextKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c<d.length-1?c:d.length-1:c%d.length;c<d.length;c++)if(void 0!==d[c][a])return d[c];return this.data.hierarchy[b].keys[0]};
THREE.Animation.prototype.getPrevKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?0<c?c:0:0<=c?c:c+d.length;0<=c;c--)if(void 0!==d[c][a])return d[c];return this.data.hierarchy[b].keys[d.length-1]};THREE.KeyFrameAnimation=function(a,b,c){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=0.001;this.isPlaying=!1;this.loop=this.isPaused=!0;this.JITCompile=void 0!==c?c:!0;a=0;for(b=this.hierarchy.length;a<b;a++){var c=this.data.hierarchy[a].sids,d=this.hierarchy[a];if(this.data.hierarchy[a].keys.length&&c){for(var e=0;e<c.length;e++){var f=c[e],g=this.getNextKeyWith(f,a,0);g&&g.apply(f)}d.matrixAutoUpdate=!1;this.data.hierarchy[a].node.updateMatrix();
d.matrixWorldNeedsUpdate=!0}}};
THREE.KeyFrameAnimation.prototype.play=function(a,b){if(!this.isPlaying){this.isPlaying=!0;this.loop=void 0!==a?a:!0;this.currentTime=void 0!==b?b:0;this.startTimeMs=b;this.startTime=1E7;this.endTime=-this.startTime;var c,d=this.hierarchy.length,e,f;for(c=0;c<d;c++)e=this.hierarchy[c],f=this.data.hierarchy[c],e.useQuaternion=!0,void 0===f.animationCache&&(f.animationCache={},f.animationCache.prevKey=null,f.animationCache.nextKey=null,f.animationCache.originalMatrix=e instanceof THREE.Bone?e.skinMatrix:
e.matrix),e=this.data.hierarchy[c].keys,e.length&&(f.animationCache.prevKey=e[0],f.animationCache.nextKey=e[1],this.startTime=Math.min(e[0].time,this.startTime),this.endTime=Math.max(e[e.length-1].time,this.endTime));this.update(0)}this.isPaused=!1;THREE.AnimationHandler.addToUpdate(this)};THREE.KeyFrameAnimation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.KeyFrameAnimation.prototype.stop=function(){this.isPaused=this.isPlaying=!1;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.data.hierarchy.length;a++){var b=this.hierarchy[a],c=this.data.hierarchy[a];if(void 0!==c.animationCache){var d=c.animationCache.originalMatrix;b instanceof THREE.Bone?(d.copy(b.skinMatrix),b.skinMatrix=d):(d.copy(b.matrix),b.matrix=d);delete c.animationCache}}};
THREE.KeyFrameAnimation.prototype.update=function(a){if(this.isPlaying){var b,c,d,e,f=this.data.JIT.hierarchy,g,h,i;h=this.currentTime+=a*this.timeScale;g=this.currentTime%=this.data.length;g<this.startTimeMs&&(g=this.currentTime=this.startTimeMs+g);e=parseInt(Math.min(g*this.data.fps,this.data.length*this.data.fps),10);if((i=g<h)&&!this.loop){for(var a=0,j=this.hierarchy.length;a<j;a++){var m=this.data.hierarchy[a].keys,f=this.data.hierarchy[a].sids;d=m.length-1;e=this.hierarchy[a];if(m.length){for(m=
0;m<f.length;m++)g=f[m],(h=this.getPrevKeyWith(g,a,d))&&h.apply(g);this.data.hierarchy[a].node.updateMatrix();e.matrixWorldNeedsUpdate=!0}}this.stop()}else if(!(g<this.startTime)){a=0;for(j=this.hierarchy.length;a<j;a++){d=this.hierarchy[a];b=this.data.hierarchy[a];var m=b.keys,p=b.animationCache;if(this.JITCompile&&void 0!==f[a][e])d instanceof THREE.Bone?(d.skinMatrix=f[a][e],d.matrixWorldNeedsUpdate=!1):(d.matrix=f[a][e],d.matrixWorldNeedsUpdate=!0);else if(m.length){this.JITCompile&&p&&(d instanceof
THREE.Bone?d.skinMatrix=p.originalMatrix:d.matrix=p.originalMatrix);b=p.prevKey;c=p.nextKey;if(b&&c){if(c.time<=h){if(i&&this.loop){b=m[0];for(c=m[1];c.time<g;)b=c,c=m[b.index+1]}else if(!i)for(var l=m.length-1;c.time<g&&c.index!==l;)b=c,c=m[b.index+1];p.prevKey=b;p.nextKey=c}c.time>=g?b.interpolate(c,g):b.interpolate(c,c.time)}this.data.hierarchy[a].node.updateMatrix();d.matrixWorldNeedsUpdate=!0}}if(this.JITCompile&&void 0===f[0][e]){this.hierarchy[0].updateMatrixWorld(!0);for(a=0;a<this.hierarchy.length;a++)f[a][e]=
this.hierarchy[a]instanceof THREE.Bone?this.hierarchy[a].skinMatrix.clone():this.hierarchy[a].matrix.clone()}}}};THREE.KeyFrameAnimation.prototype.getNextKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c%=b.length;c<b.length;c++)if(b[c].hasTarget(a))return b[c];return b[0]};THREE.KeyFrameAnimation.prototype.getPrevKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=0<=c?c:c+b.length;0<=c;c--)if(b[c].hasTarget(a))return b[c];return b[b.length-1]};THREE.CubeCamera=function(a,b,c){THREE.Object3D.call(this);var d=new THREE.PerspectiveCamera(90,1,a,b);d.up.set(0,-1,0);d.lookAt(new THREE.Vector3(1,0,0));this.add(d);var e=new THREE.PerspectiveCamera(90,1,a,b);e.up.set(0,-1,0);e.lookAt(new THREE.Vector3(-1,0,0));this.add(e);var f=new THREE.PerspectiveCamera(90,1,a,b);f.up.set(0,0,1);f.lookAt(new THREE.Vector3(0,1,0));this.add(f);var g=new THREE.PerspectiveCamera(90,1,a,b);g.up.set(0,0,-1);g.lookAt(new THREE.Vector3(0,-1,0));this.add(g);var h=new THREE.PerspectiveCamera(90,
1,a,b);h.up.set(0,-1,0);h.lookAt(new THREE.Vector3(0,0,1));this.add(h);var i=new THREE.PerspectiveCamera(90,1,a,b);i.up.set(0,-1,0);i.lookAt(new THREE.Vector3(0,0,-1));this.add(i);this.renderTarget=new THREE.WebGLRenderTargetCube(c,c,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter});this.updateCubeMap=function(a,b){var c=this.renderTarget,l=c.generateMipmaps;c.generateMipmaps=!1;c.activeCubeFace=0;a.render(b,d,c);c.activeCubeFace=1;a.render(b,e,c);c.activeCubeFace=
2;a.render(b,f,c);c.activeCubeFace=3;a.render(b,g,c);c.activeCubeFace=4;a.render(b,h,c);c.generateMipmaps=l;c.activeCubeFace=5;a.render(b,i,c)}};THREE.CubeCamera.prototype=Object.create(THREE.Object3D.prototype);THREE.CombinedCamera=function(a,b,c,d,e,f,g){THREE.Camera.call(this);this.fov=c;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2;this.cameraO=new THREE.OrthographicCamera(a/-2,a/2,b/2,b/-2,f,g);this.cameraP=new THREE.PerspectiveCamera(c,a/b,d,e);this.zoom=1;this.toPerspective()};THREE.CombinedCamera.prototype=Object.create(THREE.Camera.prototype);
THREE.CombinedCamera.prototype.toPerspective=function(){this.near=this.cameraP.near;this.far=this.cameraP.far;this.cameraP.fov=this.fov/this.zoom;this.cameraP.updateProjectionMatrix();this.projectionMatrix=this.cameraP.projectionMatrix;this.inPerspectiveMode=!0;this.inOrthographicMode=!1};
THREE.CombinedCamera.prototype.toOrthographic=function(){var a=this.cameraP.aspect,b=(this.cameraP.near+this.cameraP.far)/2,b=Math.tan(this.fov/2)*b,a=2*b*a/2,b=b/this.zoom,a=a/this.zoom;this.cameraO.left=-a;this.cameraO.right=a;this.cameraO.top=b;this.cameraO.bottom=-b;this.cameraO.updateProjectionMatrix();this.near=this.cameraO.near;this.far=this.cameraO.far;this.projectionMatrix=this.cameraO.projectionMatrix;this.inPerspectiveMode=!1;this.inOrthographicMode=!0};
THREE.CombinedCamera.prototype.setSize=function(a,b){this.cameraP.aspect=a/b;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2};THREE.CombinedCamera.prototype.setFov=function(a){this.fov=a;this.inPerspectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.updateProjectionMatrix=function(){this.inPerspectiveMode?this.toPerspective():(this.toPerspective(),this.toOrthographic())};
THREE.CombinedCamera.prototype.setLens=function(a,b){void 0===b&&(b=24);var c=2*THREE.Math.radToDeg(Math.atan(b/(2*a)));this.setFov(c);return c};THREE.CombinedCamera.prototype.setZoom=function(a){this.zoom=a;this.inPerspectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.toFrontView=function(){this.rotation.x=0;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=!1};
THREE.CombinedCamera.prototype.toBackView=function(){this.rotation.x=0;this.rotation.y=Math.PI;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.CombinedCamera.prototype.toLeftView=function(){this.rotation.x=0;this.rotation.y=-Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.CombinedCamera.prototype.toRightView=function(){this.rotation.x=0;this.rotation.y=Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=!1};
THREE.CombinedCamera.prototype.toTopView=function(){this.rotation.x=-Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.CombinedCamera.prototype.toBottomView=function(){this.rotation.x=Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.CircleGeometry=function(a,b,c,d){THREE.Geometry.call(this);var a=a||50,c=void 0!==c?c:0,d=void 0!==d?d:2*Math.PI,b=void 0!==b?Math.max(3,b):8,e,f=[];e=new THREE.Vector3;var g=new THREE.Vector2(0.5,0.5);this.vertices.push(e);f.push(g);for(e=0;e<=b;e++){var h=new THREE.Vector3,i=c+e/b*d;h.x=a*Math.cos(i);h.y=a*Math.sin(i);this.vertices.push(h);f.push(new THREE.Vector2((h.x/a+1)/2,(h.y/a+1)/2))}c=new THREE.Vector3(0,0,1);for(e=1;e<=b;e++)this.faces.push(new THREE.Face3(e,e+1,0,[c,c,c])),this.faceVertexUvs[0].push([f[e],
f[e+1],g]);this.computeCentroids();this.computeFaceNormals();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,a)};THREE.CircleGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.CubeGeometry=function(a,b,c,d,e,f){function g(a,b,c,d,e,f,g,n){var q,y=h.widthSegments,u=h.heightSegments,x=e/2,t=f/2,E=h.vertices.length;if("x"===a&&"y"===b||"y"===a&&"x"===b)q="z";else if("x"===a&&"z"===b||"z"===a&&"x"===b)q="y",u=h.depthSegments;else if("z"===a&&"y"===b||"y"===a&&"z"===b)q="x",y=h.depthSegments;var J=y+1,F=u+1,z=e/y,H=f/u,K=new THREE.Vector3;K[q]=0<g?1:-1;for(e=0;e<F;e++)for(f=0;f<J;f++){var G=new THREE.Vector3;G[a]=(f*z-x)*c;G[b]=(e*H-t)*d;G[q]=g;h.vertices.push(G)}for(e=
0;e<u;e++)for(f=0;f<y;f++)a=new THREE.Face4(f+J*e+E,f+J*(e+1)+E,f+1+J*(e+1)+E,f+1+J*e+E),a.normal.copy(K),a.vertexNormals.push(K.clone(),K.clone(),K.clone(),K.clone()),a.materialIndex=n,h.faces.push(a),h.faceVertexUvs[0].push([new THREE.Vector2(f/y,1-e/u),new THREE.Vector2(f/y,1-(e+1)/u),new THREE.Vector2((f+1)/y,1-(e+1)/u),new THREE.Vector2((f+1)/y,1-e/u)])}THREE.Geometry.call(this);var h=this;this.width=a;this.height=b;this.depth=c;this.widthSegments=d||1;this.heightSegments=e||1;this.depthSegments=
f||1;a=this.width/2;b=this.height/2;c=this.depth/2;g("z","y",-1,-1,this.depth,this.height,a,0);g("z","y",1,-1,this.depth,this.height,-a,1);g("x","z",1,1,this.width,this.depth,b,2);g("x","z",1,-1,this.width,this.depth,-b,3);g("x","y",1,-1,this.width,this.height,c,4);g("x","y",-1,-1,this.width,this.height,-c,5);this.computeCentroids();this.mergeVertices()};THREE.CubeGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.CylinderGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);this.radiusTop=a=void 0!==a?a:20;this.radiusBottom=b=void 0!==b?b:20;this.height=c=void 0!==c?c:100;this.radiusSegments=d=d||8;this.heightSegments=e=e||1;this.openEnded=f=void 0!==f?f:!1;var g=c/2,h,i,j=[],m=[];for(i=0;i<=e;i++){var p=[],l=[],r=i/e,s=r*(b-a)+a;for(h=0;h<=d;h++){var n=h/d,q=new THREE.Vector3;q.x=s*Math.sin(2*n*Math.PI);q.y=-r*c+g;q.z=s*Math.cos(2*n*Math.PI);this.vertices.push(q);p.push(this.vertices.length-1);l.push(new THREE.Vector2(n,
1-r))}j.push(p);m.push(l)}c=(b-a)/c;for(h=0;h<d;h++){0!==a?(p=this.vertices[j[0][h]].clone(),l=this.vertices[j[0][h+1]].clone()):(p=this.vertices[j[1][h]].clone(),l=this.vertices[j[1][h+1]].clone());p.setY(Math.sqrt(p.x*p.x+p.z*p.z)*c).normalize();l.setY(Math.sqrt(l.x*l.x+l.z*l.z)*c).normalize();for(i=0;i<e;i++){var r=j[i][h],s=j[i+1][h],n=j[i+1][h+1],q=j[i][h+1],y=p.clone(),u=p.clone(),x=l.clone(),t=l.clone(),E=m[i][h].clone(),J=m[i+1][h].clone(),F=m[i+1][h+1].clone(),z=m[i][h+1].clone();this.faces.push(new THREE.Face4(r,
s,n,q,[y,u,x,t]));this.faceVertexUvs[0].push([E,J,F,z])}}if(!1===f&&0<a){this.vertices.push(new THREE.Vector3(0,g,0));for(h=0;h<d;h++)r=j[0][h],s=j[0][h+1],n=this.vertices.length-1,y=new THREE.Vector3(0,1,0),u=new THREE.Vector3(0,1,0),x=new THREE.Vector3(0,1,0),E=m[0][h].clone(),J=m[0][h+1].clone(),F=new THREE.Vector2(J.u,0),this.faces.push(new THREE.Face3(r,s,n,[y,u,x])),this.faceVertexUvs[0].push([E,J,F])}if(!1===f&&0<b){this.vertices.push(new THREE.Vector3(0,-g,0));for(h=0;h<d;h++)r=j[i][h+1],
s=j[i][h],n=this.vertices.length-1,y=new THREE.Vector3(0,-1,0),u=new THREE.Vector3(0,-1,0),x=new THREE.Vector3(0,-1,0),E=m[i][h+1].clone(),J=m[i][h].clone(),F=new THREE.Vector2(J.u,1),this.faces.push(new THREE.Face3(r,s,n,[y,u,x])),this.faceVertexUvs[0].push([E,J,F])}this.computeCentroids();this.computeFaceNormals()};THREE.CylinderGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ExtrudeGeometry=function(a,b){"undefined"!==typeof a&&(THREE.Geometry.call(this),a=a instanceof Array?a:[a],this.shapebb=a[a.length-1].getBoundingBox(),this.addShapeList(a,b),this.computeCentroids(),this.computeFaceNormals())};THREE.ExtrudeGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ExtrudeGeometry.prototype.addShapeList=function(a,b){for(var c=a.length,d=0;d<c;d++)this.addShape(a[d],b)};
THREE.ExtrudeGeometry.prototype.addShape=function(a,b){function c(a,b,c){b||console.log("die");return b.clone().multiplyScalar(c).add(a)}function d(a,b,c){var d=THREE.ExtrudeGeometry.__v1,e=THREE.ExtrudeGeometry.__v2,f=THREE.ExtrudeGeometry.__v3,g=THREE.ExtrudeGeometry.__v4,h=THREE.ExtrudeGeometry.__v5,i=THREE.ExtrudeGeometry.__v6;d.set(a.x-b.x,a.y-b.y);e.set(a.x-c.x,a.y-c.y);d=d.normalize();e=e.normalize();f.set(-d.y,d.x);g.set(e.y,-e.x);h.copy(a).add(f);i.copy(a).add(g);if(h.equals(i))return g.clone();
h.copy(b).add(f);i.copy(c).add(g);f=d.dot(g);g=i.sub(h).dot(g);0===f&&(console.log("Either infinite or no solutions!"),0===g?console.log("Its finite solutions."):console.log("Too bad, no solutions."));g/=f;return 0>g?(b=Math.atan2(b.y-a.y,b.x-a.x),a=Math.atan2(c.y-a.y,c.x-a.x),b>a&&(a+=2*Math.PI),c=(b+a)/2,a=-Math.cos(c),c=-Math.sin(c),new THREE.Vector2(a,c)):d.multiplyScalar(g).add(h).sub(a).clone()}function e(c,d){var e,f;for(A=c.length;0<=--A;){e=A;f=A-1;0>f&&(f=c.length-1);for(var g=0,h=r+2*m,
g=0;g<h;g++){var i=ea*g,j=ea*(g+1),l=d+e+i,i=d+f+i,p=d+f+j,j=d+e+j,n=c,q=g,s=h,t=e,y=f,l=l+L,i=i+L,p=p+L,j=j+L;G.faces.push(new THREE.Face4(l,i,p,j,null,null,u));l=x.generateSideWallUV(G,a,n,b,l,i,p,j,q,s,t,y);G.faceVertexUvs[0].push(l)}}}function f(a,b,c){G.vertices.push(new THREE.Vector3(a,b,c))}function g(c,d,e,f){c+=L;d+=L;e+=L;G.faces.push(new THREE.Face3(c,d,e,null,null,y));c=f?x.generateBottomUV(G,a,b,c,d,e):x.generateTopUV(G,a,b,c,d,e);G.faceVertexUvs[0].push(c)}var h=void 0!==b.amount?b.amount:
100,i=void 0!==b.bevelThickness?b.bevelThickness:6,j=void 0!==b.bevelSize?b.bevelSize:i-2,m=void 0!==b.bevelSegments?b.bevelSegments:3,p=void 0!==b.bevelEnabled?b.bevelEnabled:!0,l=void 0!==b.curveSegments?b.curveSegments:12,r=void 0!==b.steps?b.steps:1,s=b.extrudePath,n,q=!1,y=b.material,u=b.extrudeMaterial,x=void 0!==b.UVGenerator?b.UVGenerator:THREE.ExtrudeGeometry.WorldUVGenerator,t,E,J,F;s&&(n=s.getSpacedPoints(r),q=!0,p=!1,t=void 0!==b.frames?b.frames:new THREE.TubeGeometry.FrenetFrames(s,r,
!1),E=new THREE.Vector3,J=new THREE.Vector3,F=new THREE.Vector3);p||(j=i=m=0);var z,H,K,G=this,L=this.vertices.length,l=a.extractPoints(l),B=l.shape,l=l.holes;if(s=!THREE.Shape.Utils.isClockWise(B)){B=B.reverse();H=0;for(K=l.length;H<K;H++)z=l[H],THREE.Shape.Utils.isClockWise(z)&&(l[H]=z.reverse());s=!1}var V=THREE.Shape.Utils.triangulateShape(B,l),s=B;H=0;for(K=l.length;H<K;H++)z=l[H],B=B.concat(z);var C,I,M,R,ea=B.length,wa=V.length,Ma=[],A=0,ca=s.length;C=ca-1;for(I=A+1;A<ca;A++,C++,I++)C===ca&&
(C=0),I===ca&&(I=0),Ma[A]=d(s[A],s[C],s[I]);var ja=[],na,N=Ma.concat();H=0;for(K=l.length;H<K;H++){z=l[H];na=[];A=0;ca=z.length;C=ca-1;for(I=A+1;A<ca;A++,C++,I++)C===ca&&(C=0),I===ca&&(I=0),na[A]=d(z[A],z[C],z[I]);ja.push(na);N=N.concat(na)}for(C=0;C<m;C++){z=C/m;M=i*(1-z);I=j*Math.sin(z*Math.PI/2);A=0;for(ca=s.length;A<ca;A++)R=c(s[A],Ma[A],I),f(R.x,R.y,-M);H=0;for(K=l.length;H<K;H++){z=l[H];na=ja[H];A=0;for(ca=z.length;A<ca;A++)R=c(z[A],na[A],I),f(R.x,R.y,-M)}}I=j;for(A=0;A<ea;A++)R=p?c(B[A],N[A],
I):B[A],q?(J.copy(t.normals[0]).multiplyScalar(R.x),E.copy(t.binormals[0]).multiplyScalar(R.y),F.copy(n[0]).add(J).add(E),f(F.x,F.y,F.z)):f(R.x,R.y,0);for(z=1;z<=r;z++)for(A=0;A<ea;A++)R=p?c(B[A],N[A],I):B[A],q?(J.copy(t.normals[z]).multiplyScalar(R.x),E.copy(t.binormals[z]).multiplyScalar(R.y),F.copy(n[z]).add(J).add(E),f(F.x,F.y,F.z)):f(R.x,R.y,h/r*z);for(C=m-1;0<=C;C--){z=C/m;M=i*(1-z);I=j*Math.sin(z*Math.PI/2);A=0;for(ca=s.length;A<ca;A++)R=c(s[A],Ma[A],I),f(R.x,R.y,h+M);H=0;for(K=l.length;H<
K;H++){z=l[H];na=ja[H];A=0;for(ca=z.length;A<ca;A++)R=c(z[A],na[A],I),q?f(R.x,R.y+n[r-1].y,n[r-1].x+M):f(R.x,R.y,h+M)}}if(p){i=0*ea;for(A=0;A<wa;A++)h=V[A],g(h[2]+i,h[1]+i,h[0]+i,!0);i=ea*(r+2*m);for(A=0;A<wa;A++)h=V[A],g(h[0]+i,h[1]+i,h[2]+i,!1)}else{for(A=0;A<wa;A++)h=V[A],g(h[2],h[1],h[0],!0);for(A=0;A<wa;A++)h=V[A],g(h[0]+ea*r,h[1]+ea*r,h[2]+ea*r,!1)}h=0;e(s,h);h+=s.length;H=0;for(K=l.length;H<K;H++)z=l[H],e(z,h),h+=z.length};
THREE.ExtrudeGeometry.WorldUVGenerator={generateTopUV:function(a,b,c,d,e,f){b=a.vertices[e].x;e=a.vertices[e].y;c=a.vertices[f].x;f=a.vertices[f].y;return[new THREE.Vector2(a.vertices[d].x,a.vertices[d].y),new THREE.Vector2(b,e),new THREE.Vector2(c,f)]},generateBottomUV:function(a,b,c,d,e,f){return this.generateTopUV(a,b,c,d,e,f)},generateSideWallUV:function(a,b,c,d,e,f,g,h){var b=a.vertices[e].x,c=a.vertices[e].y,e=a.vertices[e].z,d=a.vertices[f].x,i=a.vertices[f].y,f=a.vertices[f].z,j=a.vertices[g].x,
m=a.vertices[g].y,g=a.vertices[g].z,p=a.vertices[h].x,l=a.vertices[h].y,a=a.vertices[h].z;return 0.01>Math.abs(c-i)?[new THREE.Vector2(b,1-e),new THREE.Vector2(d,1-f),new THREE.Vector2(j,1-g),new THREE.Vector2(p,1-a)]:[new THREE.Vector2(c,1-e),new THREE.Vector2(i,1-f),new THREE.Vector2(m,1-g),new THREE.Vector2(l,1-a)]}};THREE.ExtrudeGeometry.__v1=new THREE.Vector2;THREE.ExtrudeGeometry.__v2=new THREE.Vector2;THREE.ExtrudeGeometry.__v3=new THREE.Vector2;THREE.ExtrudeGeometry.__v4=new THREE.Vector2;
THREE.ExtrudeGeometry.__v5=new THREE.Vector2;THREE.ExtrudeGeometry.__v6=new THREE.Vector2;THREE.ShapeGeometry=function(a,b){THREE.Geometry.call(this);!1===a instanceof Array&&(a=[a]);this.shapebb=a[a.length-1].getBoundingBox();this.addShapeList(a,b);this.computeCentroids();this.computeFaceNormals()};THREE.ShapeGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ShapeGeometry.prototype.addShapeList=function(a,b){for(var c=0,d=a.length;c<d;c++)this.addShape(a[c],b);return this};
THREE.ShapeGeometry.prototype.addShape=function(a,b){void 0===b&&(b={});var c=b.material,d=void 0===b.UVGenerator?THREE.ExtrudeGeometry.WorldUVGenerator:b.UVGenerator,e,f,g,h=this.vertices.length;e=a.extractPoints(void 0!==b.curveSegments?b.curveSegments:12);var i=e.shape,j=e.holes;if(!THREE.Shape.Utils.isClockWise(i)){i=i.reverse();e=0;for(f=j.length;e<f;e++)g=j[e],THREE.Shape.Utils.isClockWise(g)&&(j[e]=g.reverse())}var m=THREE.Shape.Utils.triangulateShape(i,j);e=0;for(f=j.length;e<f;e++)g=j[e],
i=i.concat(g);j=i.length;f=m.length;for(e=0;e<j;e++)g=i[e],this.vertices.push(new THREE.Vector3(g.x,g.y,0));for(e=0;e<f;e++)j=m[e],i=j[0]+h,g=j[1]+h,j=j[2]+h,this.faces.push(new THREE.Face3(i,g,j,null,null,c)),this.faceVertexUvs[0].push(d.generateBottomUV(this,a,b,i,g,j))};THREE.LatheGeometry=function(a,b,c,d){THREE.Geometry.call(this);for(var b=b||12,c=c||0,d=d||2*Math.PI,e=1/(a.length-1),f=1/b,g=0,h=b;g<=h;g++)for(var i=c+g*f*d,j=Math.cos(i),m=Math.sin(i),i=0,p=a.length;i<p;i++){var l=a[i],r=new THREE.Vector3;r.x=j*l.x-m*l.y;r.y=m*l.x+j*l.y;r.z=l.z;this.vertices.push(r)}c=a.length;g=0;for(h=b;g<h;g++){i=0;for(p=a.length-1;i<p;i++)d=b=i+c*g,m=b+c,j=b+1+c,this.faces.push(new THREE.Face4(d,m,j,b+1)),j=g*f,b=i*e,d=j+f,m=b+e,this.faceVertexUvs[0].push([new THREE.Vector2(j,
b),new THREE.Vector2(d,b),new THREE.Vector2(d,m),new THREE.Vector2(j,m)])}this.mergeVertices();this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.LatheGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.PlaneGeometry=function(a,b,c,d){THREE.Geometry.call(this);this.width=a;this.height=b;this.widthSegments=c||1;this.heightSegments=d||1;for(var c=a/2,e=b/2,d=this.widthSegments,f=this.heightSegments,g=d+1,h=f+1,i=this.width/d,j=this.height/f,m=new THREE.Vector3(0,0,1),a=0;a<h;a++)for(b=0;b<g;b++)this.vertices.push(new THREE.Vector3(b*i-c,-(a*j-e),0));for(a=0;a<f;a++)for(b=0;b<d;b++)c=new THREE.Face4(b+g*a,b+g*(a+1),b+1+g*(a+1),b+1+g*a),c.normal.copy(m),c.vertexNormals.push(m.clone(),m.clone(),
m.clone(),m.clone()),this.faces.push(c),this.faceVertexUvs[0].push([new THREE.Vector2(b/d,1-a/f),new THREE.Vector2(b/d,1-(a+1)/f),new THREE.Vector2((b+1)/d,1-(a+1)/f),new THREE.Vector2((b+1)/d,1-a/f)]);this.computeCentroids()};THREE.PlaneGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.RingGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);for(var a=a||0,b=b||50,e=void 0!==e?e:0,f=void 0!==f?f:2*Math.PI,c=void 0!==c?Math.max(3,c):8,d=void 0!==d?Math.max(3,d):8,g=[],h=a,i=(b-a)/d,a=0;a<=d;a++){for(b=0;b<=c;b++){var j=new THREE.Vector3,m=e+b/c*f;j.x=h*Math.cos(m);j.y=h*Math.sin(m);this.vertices.push(j);g.push(new THREE.Vector2((j.x/h+1)/2,-(j.y/h+1)/2+1))}h+=i}e=new THREE.Vector3(0,0,1);for(a=0;a<d;a++){f=a*c;for(b=0;b<=c;b++){var m=b+f,i=m+a,j=m+c+a,p=m+c+1+a;this.faces.push(new THREE.Face3(i,
j,p,[e,e,e]));this.faceVertexUvs[0].push([g[i],g[j],g[p]]);i=m+a;j=m+c+1+a;p=m+1+a;this.faces.push(new THREE.Face3(i,j,p,[e,e,e]));this.faceVertexUvs[0].push([g[i],g[j],g[p]])}}this.computeCentroids();this.computeFaceNormals();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,h)};THREE.RingGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.SphereGeometry=function(a,b,c,d,e,f,g){THREE.Geometry.call(this);this.radius=a=a||50;this.widthSegments=b=Math.max(3,Math.floor(b)||8);this.heightSegments=c=Math.max(2,Math.floor(c)||6);this.phiStart=d=void 0!==d?d:0;this.phiLength=e=void 0!==e?e:2*Math.PI;this.thetaStart=f=void 0!==f?f:0;this.thetaLength=g=void 0!==g?g:Math.PI;var h,i,j=[],m=[];for(i=0;i<=c;i++){var p=[],l=[];for(h=0;h<=b;h++){var r=h/b,s=i/c,n=new THREE.Vector3;n.x=-a*Math.cos(d+r*e)*Math.sin(f+s*g);n.y=a*Math.cos(f+s*g);
n.z=a*Math.sin(d+r*e)*Math.sin(f+s*g);this.vertices.push(n);p.push(this.vertices.length-1);l.push(new THREE.Vector2(r,1-s))}j.push(p);m.push(l)}for(i=0;i<this.heightSegments;i++)for(h=0;h<this.widthSegments;h++){var b=j[i][h+1],c=j[i][h],d=j[i+1][h],e=j[i+1][h+1],f=this.vertices[b].clone().normalize(),g=this.vertices[c].clone().normalize(),p=this.vertices[d].clone().normalize(),l=this.vertices[e].clone().normalize(),r=m[i][h+1].clone(),s=m[i][h].clone(),n=m[i+1][h].clone(),q=m[i+1][h+1].clone();Math.abs(this.vertices[b].y)===
this.radius?(this.faces.push(new THREE.Face3(b,d,e,[f,p,l])),this.faceVertexUvs[0].push([r,n,q])):Math.abs(this.vertices[d].y)===this.radius?(this.faces.push(new THREE.Face3(b,c,d,[f,g,p])),this.faceVertexUvs[0].push([r,s,n])):(this.faces.push(new THREE.Face4(b,c,d,e,[f,g,p,l])),this.faceVertexUvs[0].push([r,s,n,q]))}this.computeCentroids();this.computeFaceNormals();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,a)};THREE.SphereGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TextGeometry=function(a,b){var b=b||{},c=THREE.FontUtils.generateShapes(a,b);b.amount=void 0!==b.height?b.height:50;void 0===b.bevelThickness&&(b.bevelThickness=10);void 0===b.bevelSize&&(b.bevelSize=8);void 0===b.bevelEnabled&&(b.bevelEnabled=!1);THREE.ExtrudeGeometry.call(this,c,b)};THREE.TextGeometry.prototype=Object.create(THREE.ExtrudeGeometry.prototype);THREE.TorusGeometry=function(a,b,c,d,e){THREE.Geometry.call(this);this.radius=a||100;this.tube=b||40;this.radialSegments=c||8;this.tubularSegments=d||6;this.arc=e||2*Math.PI;e=new THREE.Vector3;a=[];b=[];for(c=0;c<=this.radialSegments;c++)for(d=0;d<=this.tubularSegments;d++){var f=d/this.tubularSegments*this.arc,g=2*c/this.radialSegments*Math.PI;e.x=this.radius*Math.cos(f);e.y=this.radius*Math.sin(f);var h=new THREE.Vector3;h.x=(this.radius+this.tube*Math.cos(g))*Math.cos(f);h.y=(this.radius+this.tube*
Math.cos(g))*Math.sin(f);h.z=this.tube*Math.sin(g);this.vertices.push(h);a.push(new THREE.Vector2(d/this.tubularSegments,c/this.radialSegments));b.push(h.clone().sub(e).normalize())}for(c=1;c<=this.radialSegments;c++)for(d=1;d<=this.tubularSegments;d++){var e=(this.tubularSegments+1)*c+d-1,f=(this.tubularSegments+1)*(c-1)+d-1,g=(this.tubularSegments+1)*(c-1)+d,h=(this.tubularSegments+1)*c+d,i=new THREE.Face4(e,f,g,h,[b[e],b[f],b[g],b[h]]);i.normal.add(b[e]);i.normal.add(b[f]);i.normal.add(b[g]);i.normal.add(b[h]);
i.normal.normalize();this.faces.push(i);this.faceVertexUvs[0].push([a[e].clone(),a[f].clone(),a[g].clone(),a[h].clone()])}this.computeCentroids()};THREE.TorusGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TorusKnotGeometry=function(a,b,c,d,e,f,g){function h(a,b,c,d,e,f){var g=Math.cos(a);Math.cos(b);b=Math.sin(a);a*=c/d;c=Math.cos(a);g*=0.5*e*(2+c);b=0.5*e*(2+c)*b;e=0.5*f*e*Math.sin(a);return new THREE.Vector3(g,b,e)}THREE.Geometry.call(this);this.radius=a||100;this.tube=b||40;this.radialSegments=c||64;this.tubularSegments=d||8;this.p=e||2;this.q=f||3;this.heightScale=g||1;this.grid=Array(this.radialSegments);c=new THREE.Vector3;d=new THREE.Vector3;e=new THREE.Vector3;for(a=0;a<this.radialSegments;++a){this.grid[a]=
Array(this.tubularSegments);for(b=0;b<this.tubularSegments;++b){var i=2*(a/this.radialSegments)*this.p*Math.PI,g=2*(b/this.tubularSegments)*Math.PI,f=h(i,g,this.q,this.p,this.radius,this.heightScale),i=h(i+0.01,g,this.q,this.p,this.radius,this.heightScale);c.subVectors(i,f);d.addVectors(i,f);e.crossVectors(c,d);d.crossVectors(e,c);e.normalize();d.normalize();i=-this.tube*Math.cos(g);g=this.tube*Math.sin(g);f.x+=i*d.x+g*e.x;f.y+=i*d.y+g*e.y;f.z+=i*d.z+g*e.z;this.grid[a][b]=this.vertices.push(new THREE.Vector3(f.x,
f.y,f.z))-1}}for(a=0;a<this.radialSegments;++a)for(b=0;b<this.tubularSegments;++b){var e=(a+1)%this.radialSegments,f=(b+1)%this.tubularSegments,c=this.grid[a][b],d=this.grid[e][b],e=this.grid[e][f],f=this.grid[a][f],g=new THREE.Vector2(a/this.radialSegments,b/this.tubularSegments),i=new THREE.Vector2((a+1)/this.radialSegments,b/this.tubularSegments),j=new THREE.Vector2((a+1)/this.radialSegments,(b+1)/this.tubularSegments),m=new THREE.Vector2(a/this.radialSegments,(b+1)/this.tubularSegments);this.faces.push(new THREE.Face4(c,
d,e,f));this.faceVertexUvs[0].push([g,i,j,m])}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.TorusKnotGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TubeGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);this.path=a;this.segments=b||64;this.radius=c||1;this.radiusSegments=d||8;this.closed=e||!1;f&&(this.debug=new THREE.Object3D);this.grid=[];var g,h,e=this.segments+1,i,j,m,f=new THREE.Vector3,p,l,r,b=new THREE.TubeGeometry.FrenetFrames(this.path,this.segments,this.closed);p=b.tangents;l=b.normals;r=b.binormals;this.tangents=p;this.normals=l;this.binormals=r;for(b=0;b<e;b++){this.grid[b]=[];d=b/(e-1);m=a.getPointAt(d);d=p[b];g=l[b];
h=r[b];this.debug&&(this.debug.add(new THREE.ArrowHelper(d,m,c,255)),this.debug.add(new THREE.ArrowHelper(g,m,c,16711680)),this.debug.add(new THREE.ArrowHelper(h,m,c,65280)));for(d=0;d<this.radiusSegments;d++)i=2*(d/this.radiusSegments)*Math.PI,j=-this.radius*Math.cos(i),i=this.radius*Math.sin(i),f.copy(m),f.x+=j*g.x+i*h.x,f.y+=j*g.y+i*h.y,f.z+=j*g.z+i*h.z,this.grid[b][d]=this.vertices.push(new THREE.Vector3(f.x,f.y,f.z))-1}for(b=0;b<this.segments;b++)for(d=0;d<this.radiusSegments;d++)e=this.closed?
(b+1)%this.segments:b+1,f=(d+1)%this.radiusSegments,a=this.grid[b][d],c=this.grid[e][d],e=this.grid[e][f],f=this.grid[b][f],p=new THREE.Vector2(b/this.segments,d/this.radiusSegments),l=new THREE.Vector2((b+1)/this.segments,d/this.radiusSegments),r=new THREE.Vector2((b+1)/this.segments,(d+1)/this.radiusSegments),g=new THREE.Vector2(b/this.segments,(d+1)/this.radiusSegments),this.faces.push(new THREE.Face4(a,c,e,f)),this.faceVertexUvs[0].push([p,l,r,g]);this.computeCentroids();this.computeFaceNormals();
this.computeVertexNormals()};THREE.TubeGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.TubeGeometry.FrenetFrames=function(a,b,c){new THREE.Vector3;var d=new THREE.Vector3;new THREE.Vector3;var e=[],f=[],g=[],h=new THREE.Vector3,i=new THREE.Matrix4,b=b+1,j,m,p;this.tangents=e;this.normals=f;this.binormals=g;for(j=0;j<b;j++)m=j/(b-1),e[j]=a.getTangentAt(m),e[j].normalize();f[0]=new THREE.Vector3;g[0]=new THREE.Vector3;a=Number.MAX_VALUE;j=Math.abs(e[0].x);m=Math.abs(e[0].y);p=Math.abs(e[0].z);j<=a&&(a=j,d.set(1,0,0));m<=a&&(a=m,d.set(0,1,0));p<=a&&d.set(0,0,1);h.crossVectors(e[0],
d).normalize();f[0].crossVectors(e[0],h);g[0].crossVectors(e[0],f[0]);for(j=1;j<b;j++)f[j]=f[j-1].clone(),g[j]=g[j-1].clone(),h.crossVectors(e[j-1],e[j]),1E-4<h.length()&&(h.normalize(),d=Math.acos(e[j-1].dot(e[j])),f[j].applyMatrix4(i.makeRotationAxis(h,d))),g[j].crossVectors(e[j],f[j]);if(c){d=Math.acos(f[0].dot(f[b-1]));d/=b-1;0<e[0].dot(h.crossVectors(f[0],f[b-1]))&&(d=-d);for(j=1;j<b;j++)f[j].applyMatrix4(i.makeRotationAxis(e[j],d*j)),g[j].crossVectors(e[j],f[j])}};THREE.PolyhedronGeometry=function(a,b,c,d){function e(a){var b=a.normalize().clone();b.index=h.vertices.push(b)-1;var c=Math.atan2(a.z,-a.x)/2/Math.PI+0.5,a=Math.atan2(-a.y,Math.sqrt(a.x*a.x+a.z*a.z))/Math.PI+0.5;b.uv=new THREE.Vector2(c,1-a);return b}function f(a,b,c){var d=new THREE.Face3(a.index,b.index,c.index,[a.clone(),b.clone(),c.clone()]);d.centroid.add(a).add(b).add(c).divideScalar(3);d.normal.copy(d.centroid).normalize();h.faces.push(d);d=Math.atan2(d.centroid.z,-d.centroid.x);h.faceVertexUvs[0].push([g(a.uv,
a,d),g(b.uv,b,d),g(c.uv,c,d)])}function g(a,b,c){0>c&&1===a.x&&(a=new THREE.Vector2(a.x-1,a.y));0===b.x&&0===b.z&&(a=new THREE.Vector2(c/2/Math.PI+0.5,a.y));return a.clone()}THREE.Geometry.call(this);for(var c=c||1,d=d||0,h=this,i=0,j=a.length;i<j;i++)e(new THREE.Vector3(a[i][0],a[i][1],a[i][2]));for(var m=this.vertices,a=[],i=0,j=b.length;i<j;i++){var p=m[b[i][0]],l=m[b[i][1]],r=m[b[i][2]];a[i]=new THREE.Face3(p.index,l.index,r.index,[p.clone(),l.clone(),r.clone()])}i=0;for(j=a.length;i<j;i++){l=
a[i];m=d;b=Math.pow(2,m);Math.pow(4,m);for(var m=e(h.vertices[l.a]),p=e(h.vertices[l.b]),s=e(h.vertices[l.c]),l=[],r=0;r<=b;r++){l[r]=[];for(var n=e(m.clone().lerp(s,r/b)),q=e(p.clone().lerp(s,r/b)),y=b-r,u=0;u<=y;u++)l[r][u]=0==u&&r==b?n:e(n.clone().lerp(q,u/y))}for(r=0;r<b;r++)for(u=0;u<2*(b-r)-1;u++)m=Math.floor(u/2),0==u%2?f(l[r][m+1],l[r+1][m],l[r][m]):f(l[r][m+1],l[r+1][m+1],l[r+1][m])}i=0;for(j=this.faceVertexUvs[0].length;i<j;i++)d=this.faceVertexUvs[0][i],a=d[0].x,b=d[1].x,m=d[2].x,p=Math.max(a,
Math.max(b,m)),l=Math.min(a,Math.min(b,m)),0.9<p&&0.1>l&&(0.2>a&&(d[0].x+=1),0.2>b&&(d[1].x+=1),0.2>m&&(d[2].x+=1));this.mergeVertices();i=0;for(j=this.vertices.length;i<j;i++)this.vertices[i].multiplyScalar(c);this.computeCentroids();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,c)};THREE.PolyhedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.IcosahedronGeometry=function(a,b){this.radius=a;this.detail=b;var c=(1+Math.sqrt(5))/2;THREE.PolyhedronGeometry.call(this,[[-1,c,0],[1,c,0],[-1,-c,0],[1,-c,0],[0,-1,c],[0,1,c],[0,-1,-c],[0,1,-c],[c,0,-1],[c,0,1],[-c,0,-1],[-c,0,1]],[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],a,b)};THREE.IcosahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.OctahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],[[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,5],[1,5,3],[1,3,4],[1,4,2]],a,b)};THREE.OctahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TetrahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],[[2,1,0],[0,3,2],[1,3,0],[2,3,1]],a,b)};THREE.TetrahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ParametricGeometry=function(a,b,c,d){THREE.Geometry.call(this);var e=this.vertices,f=this.faces,g=this.faceVertexUvs[0],d=void 0===d?!1:d,h,i,j,m,p=b+1;for(h=0;h<=c;h++){m=h/c;for(i=0;i<=b;i++)j=i/b,j=a(j,m),e.push(j)}var l,r,s,n;for(h=0;h<c;h++)for(i=0;i<b;i++)a=h*p+i,e=h*p+i+1,m=(h+1)*p+i,j=(h+1)*p+i+1,l=new THREE.Vector2(i/b,h/c),r=new THREE.Vector2((i+1)/b,h/c),s=new THREE.Vector2(i/b,(h+1)/c),n=new THREE.Vector2((i+1)/b,(h+1)/c),d?(f.push(new THREE.Face3(a,e,m)),f.push(new THREE.Face3(e,
j,m)),g.push([l,r,s]),g.push([r,n,s])):(f.push(new THREE.Face4(a,e,j,m)),g.push([l,r,n,s]));this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.ParametricGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ConvexGeometry=function(a){function b(a){var b=a.length();return new THREE.Vector2(a.x/b,a.y/b)}THREE.Geometry.call(this);for(var c=[[0,1,2],[0,2,1]],d=3;d<a.length;d++){var e=d,f=a[e].clone(),g=f.length();f.x+=g*2E-6*(Math.random()-0.5);f.y+=g*2E-6*(Math.random()-0.5);f.z+=g*2E-6*(Math.random()-0.5);for(var g=[],h=0;h<c.length;){var i=c[h],j=f,m=a[i[0]],p;p=m;var l=a[i[1]],r=a[i[2]],s=new THREE.Vector3,n=new THREE.Vector3;s.subVectors(r,l);n.subVectors(p,l);s.cross(n);s.normalize();p=s;m=p.dot(m);
if(p.dot(j)>=m){for(j=0;3>j;j++){m=[i[j],i[(j+1)%3]];p=!0;for(l=0;l<g.length;l++)if(g[l][0]===m[1]&&g[l][1]===m[0]){g[l]=g[g.length-1];g.pop();p=!1;break}p&&g.push(m)}c[h]=c[c.length-1];c.pop()}else h++}for(l=0;l<g.length;l++)c.push([g[l][0],g[l][1],e])}e=0;f=Array(a.length);for(d=0;d<c.length;d++){g=c[d];for(h=0;3>h;h++)void 0===f[g[h]]&&(f[g[h]]=e++,this.vertices.push(a[g[h]])),g[h]=f[g[h]]}for(d=0;d<c.length;d++)this.faces.push(new THREE.Face3(c[d][0],c[d][1],c[d][2]));for(d=0;d<this.faces.length;d++)g=
this.faces[d],this.faceVertexUvs[0].push([b(this.vertices[g.a]),b(this.vertices[g.b]),b(this.vertices[g.c])]);this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.ConvexGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.AxisHelper=function(a){var a=a||1,b=new THREE.Geometry;b.vertices.push(new THREE.Vector3,new THREE.Vector3(a,0,0),new THREE.Vector3,new THREE.Vector3(0,a,0),new THREE.Vector3,new THREE.Vector3(0,0,a));b.colors.push(new THREE.Color(16711680),new THREE.Color(16755200),new THREE.Color(65280),new THREE.Color(11206400),new THREE.Color(255),new THREE.Color(43775));a=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors});THREE.Line.call(this,b,a,THREE.LinePieces)};
THREE.AxisHelper.prototype=Object.create(THREE.Line.prototype);THREE.ArrowHelper=function(a,b,c,d){THREE.Object3D.call(this);void 0===d&&(d=16776960);void 0===c&&(c=1);this.position=b;this.useQuaternion=!0;b=new THREE.Geometry;b.vertices.push(new THREE.Vector3(0,0,0));b.vertices.push(new THREE.Vector3(0,1,0));this.line=new THREE.Line(b,new THREE.LineBasicMaterial({color:d}));this.line.matrixAutoUpdate=!1;this.add(this.line);b=new THREE.CylinderGeometry(0,0.05,0.25,5,1);b.applyMatrix((new THREE.Matrix4).makeTranslation(0,0.875,0));this.cone=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:d}));
this.cone.matrixAutoUpdate=!1;this.add(this.cone);this.setDirection(a);this.setLength(c)};THREE.ArrowHelper.prototype=Object.create(THREE.Object3D.prototype);THREE.ArrowHelper.prototype.setDirection=function(){var a=new THREE.Vector3,b;return function(c){0.999<c.y?this.quaternion.set(0,0,0,1):-0.999>c.y?this.quaternion.set(1,0,0,0):(a.set(c.z,0,-c.x).normalize(),b=Math.acos(c.y),this.quaternion.setFromAxisAngle(a,b))}}();THREE.ArrowHelper.prototype.setLength=function(a){this.scale.set(a,a,a)};
THREE.ArrowHelper.prototype.setColor=function(a){this.line.material.color.setHex(a);this.cone.material.color.setHex(a)};THREE.BoxHelper=function(a){var a=a||1,b=new THREE.Geometry,a=[new THREE.Vector3(a,a,a),new THREE.Vector3(-a,a,a),new THREE.Vector3(-a,-a,a),new THREE.Vector3(a,-a,a),new THREE.Vector3(a,a,-a),new THREE.Vector3(-a,a,-a),new THREE.Vector3(-a,-a,-a),new THREE.Vector3(a,-a,-a)];b.vertices.push(a[0],a[1],a[1],a[2],a[2],a[3],a[3],a[0],a[4],a[5],a[5],a[6],a[6],a[7],a[7],a[4],a[0],a[4],a[1],a[5],a[2],a[6],a[3],a[7]);this.vertices=a;THREE.Line.call(this,b,new THREE.LineBasicMaterial,THREE.LinePieces)};
THREE.BoxHelper.prototype=Object.create(THREE.Line.prototype);
THREE.BoxHelper.prototype.update=function(a){var b=a.geometry;null===b.boundingBox&&b.computeBoundingBox();var c=b.boundingBox.min,b=b.boundingBox.max,d=this.vertices;d[0].set(b.x,b.y,b.z);d[1].set(c.x,b.y,b.z);d[2].set(c.x,c.y,b.z);d[3].set(b.x,c.y,b.z);d[4].set(b.x,b.y,c.z);d[5].set(c.x,b.y,c.z);d[6].set(c.x,c.y,c.z);d[7].set(b.x,c.y,c.z);this.geometry.computeBoundingSphere();this.geometry.verticesNeedUpdate=!0;this.matrixAutoUpdate=!1;this.matrixWorld=a.matrixWorld};THREE.CameraHelper=function(a){function b(a,b,d){c(a,d);c(b,d)}function c(a,b){d.vertices.push(new THREE.Vector3);d.colors.push(new THREE.Color(b));void 0===f[a]&&(f[a]=[]);f[a].push(d.vertices.length-1)}THREE.Line.call(this);var d=new THREE.Geometry,e=new THREE.LineBasicMaterial({color:16777215,vertexColors:THREE.FaceColors}),f={};b("n1","n2",16755200);b("n2","n4",16755200);b("n4","n3",16755200);b("n3","n1",16755200);b("f1","f2",16755200);b("f2","f4",16755200);b("f4","f3",16755200);b("f3","f1",16755200);
b("n1","f1",16755200);b("n2","f2",16755200);b("n3","f3",16755200);b("n4","f4",16755200);b("p","n1",16711680);b("p","n2",16711680);b("p","n3",16711680);b("p","n4",16711680);b("u1","u2",43775);b("u2","u3",43775);b("u3","u1",43775);b("c","t",16777215);b("p","c",3355443);b("cn1","cn2",3355443);b("cn3","cn4",3355443);b("cf1","cf2",3355443);b("cf3","cf4",3355443);THREE.Line.call(this,d,e,THREE.LinePieces);this.camera=a;this.matrixWorld=a.matrixWorld;this.matrixAutoUpdate=!1;this.pointMap=f;this.update()};
THREE.CameraHelper.prototype=Object.create(THREE.Line.prototype);
THREE.CameraHelper.prototype.update=function(){var a=new THREE.Vector3,b=new THREE.Camera,c=new THREE.Projector;return function(){function d(d,g,h,i){a.set(g,h,i);c.unprojectVector(a,b);d=e.pointMap[d];if(void 0!==d){g=0;for(h=d.length;g<h;g++)e.geometry.vertices[d[g]].copy(a)}}var e=this;b.projectionMatrix.copy(this.camera.projectionMatrix);d("c",0,0,-1);d("t",0,0,1);d("n1",-1,-1,-1);d("n2",1,-1,-1);d("n3",-1,1,-1);d("n4",1,1,-1);d("f1",-1,-1,1);d("f2",1,-1,1);d("f3",-1,1,1);d("f4",1,1,1);d("u1",
0.7,1.1,-1);d("u2",-0.7,1.1,-1);d("u3",0,2,-1);d("cf1",-1,0,1);d("cf2",1,0,1);d("cf3",0,-1,1);d("cf4",0,1,1);d("cn1",-1,0,-1);d("cn2",1,0,-1);d("cn3",0,-1,-1);d("cn4",0,1,-1);this.geometry.verticesNeedUpdate=!0}}();THREE.DirectionalLightHelper=function(a,b){THREE.Object3D.call(this);this.matrixAutoUpdate=!1;this.light=a;var c=new THREE.SphereGeometry(b,4,2),d=new THREE.MeshBasicMaterial({fog:!1,wireframe:!0});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.lightSphere=new THREE.Mesh(c,d);this.lightSphere.matrixWorld=this.light.matrixWorld;this.lightSphere.matrixAutoUpdate=!1;this.add(this.lightSphere);c=new THREE.Geometry;c.vertices.push(this.light.position);c.vertices.push(this.light.target.position);
c.computeLineDistances();d=new THREE.LineDashedMaterial({dashSize:4,gapSize:4,opacity:0.75,transparent:!0,fog:!1});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.targetLine=new THREE.Line(c,d);this.add(this.targetLine)};THREE.DirectionalLightHelper.prototype=Object.create(THREE.Object3D.prototype);
THREE.DirectionalLightHelper.prototype.update=function(){this.lightSphere.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.targetLine.geometry.computeLineDistances();this.targetLine.geometry.verticesNeedUpdate=!0;this.targetLine.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)};THREE.GridHelper=function(a,b){for(var c=new THREE.Geometry,d=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors}),e=new THREE.Color(4473924),f=new THREE.Color(8947848),g=-a;g<=a;g+=b){c.vertices.push(new THREE.Vector3(-a,0,g));c.vertices.push(new THREE.Vector3(a,0,g));c.vertices.push(new THREE.Vector3(g,0,-a));c.vertices.push(new THREE.Vector3(g,0,a));var h=0===g?e:f;c.colors.push(h,h,h,h)}THREE.Line.call(this,c,d,THREE.LinePieces)};THREE.GridHelper.prototype=Object.create(THREE.Line.prototype);THREE.HemisphereLightHelper=function(a,b){THREE.Object3D.call(this);this.light=a;var c=new THREE.SphereGeometry(b,4,2);c.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2));for(var d=0;8>d;d++)c.faces[d].materialIndex=4>d?0:1;d=new THREE.MeshBasicMaterial({fog:!1,wireframe:!0});d.color.copy(a.color).multiplyScalar(a.intensity);var e=new THREE.MeshBasicMaterial({fog:!1,wireframe:!0});e.color.copy(a.groundColor).multiplyScalar(a.intensity);this.lightSphere=new THREE.Mesh(c,new THREE.MeshFaceMaterial([d,
e]));this.lightSphere.position=a.position;this.lightSphere.lookAt(new THREE.Vector3);this.add(this.lightSphere)};THREE.HemisphereLightHelper.prototype=Object.create(THREE.Object3D.prototype);THREE.HemisphereLightHelper.prototype.update=function(){this.lightSphere.lookAt(new THREE.Vector3);this.lightSphere.material.materials[0].color.copy(this.light.color).multiplyScalar(this.light.intensity);this.lightSphere.material.materials[1].color.copy(this.light.groundColor).multiplyScalar(this.light.intensity)};THREE.PointLightHelper=function(a,b){THREE.Object3D.call(this);this.matrixAutoUpdate=!1;this.light=a;var c=new THREE.SphereGeometry(b,4,2),d=new THREE.MeshBasicMaterial({fog:!1,wireframe:!0});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.lightSphere=new THREE.Mesh(c,d);this.lightSphere.matrixWorld=this.light.matrixWorld;this.lightSphere.matrixAutoUpdate=!1;this.add(this.lightSphere)};THREE.PointLightHelper.prototype=Object.create(THREE.Object3D.prototype);
THREE.PointLightHelper.prototype.update=function(){this.lightSphere.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)};THREE.SpotLightHelper=function(a,b){THREE.Object3D.call(this);this.matrixAutoUpdate=!1;this.light=a;var c=new THREE.SphereGeometry(b,4,2),d=new THREE.MeshBasicMaterial({fog:!1,wireframe:!0});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.lightSphere=new THREE.Mesh(c,d);this.lightSphere.matrixWorld=this.light.matrixWorld;this.lightSphere.matrixAutoUpdate=!1;this.add(this.lightSphere);c=new THREE.CylinderGeometry(1E-4,1,1,8,1,!0);c.applyMatrix((new THREE.Matrix4).makeTranslation(0,
-0.5,0));c.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2));d=new THREE.MeshBasicMaterial({fog:!1,wireframe:!0,opacity:0.3,transparent:!0});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.lightCone=new THREE.Mesh(c,d);this.lightCone.position=this.light.position;c=a.distance?a.distance:1E4;d=c*Math.tan(a.angle);this.lightCone.scale.set(d,d,c);this.lightCone.lookAt(this.light.target.position);this.add(this.lightCone)};THREE.SpotLightHelper.prototype=Object.create(THREE.Object3D.prototype);
THREE.SpotLightHelper.prototype.update=function(){var a=this.light.distance?this.light.distance:1E4,b=a*Math.tan(this.light.angle);this.lightCone.scale.set(b,b,a);this.lightCone.lookAt(this.light.target.position);this.lightSphere.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.lightCone.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)};THREE.ImmediateRenderObject=function(){THREE.Object3D.call(this);this.render=function(){}};THREE.ImmediateRenderObject.prototype=Object.create(THREE.Object3D.prototype);THREE.LensFlare=function(a,b,c,d,e){THREE.Object3D.call(this);this.lensFlares=[];this.positionScreen=new THREE.Vector3;this.customUpdateCallback=void 0;void 0!==a&&this.add(a,b,c,d,e)};THREE.LensFlare.prototype=Object.create(THREE.Object3D.prototype);
THREE.LensFlare.prototype.add=function(a,b,c,d,e,f){void 0===b&&(b=-1);void 0===c&&(c=0);void 0===f&&(f=1);void 0===e&&(e=new THREE.Color(16777215));void 0===d&&(d=THREE.NormalBlending);c=Math.min(c,Math.max(0,c));this.lensFlares.push({texture:a,size:b,distance:c,x:0,y:0,z:0,scale:1,rotation:1,opacity:f,color:e,blending:d})};
THREE.LensFlare.prototype.updateLensFlares=function(){var a,b=this.lensFlares.length,c,d=2*-this.positionScreen.x,e=2*-this.positionScreen.y;for(a=0;a<b;a++)c=this.lensFlares[a],c.x=this.positionScreen.x+d*c.distance,c.y=this.positionScreen.y+e*c.distance,c.wantedRotation=0.25*c.x*Math.PI,c.rotation+=0.25*(c.wantedRotation-c.rotation)};THREE.MorphBlendMesh=function(a,b){THREE.Mesh.call(this,a,b);this.animationsMap={};this.animationsList=[];var c=this.geometry.morphTargets.length;this.createAnimation("__default",0,c-1,c/1);this.setAnimationWeight("__default",1)};THREE.MorphBlendMesh.prototype=Object.create(THREE.Mesh.prototype);
THREE.MorphBlendMesh.prototype.createAnimation=function(a,b,c,d){b={startFrame:b,endFrame:c,length:c-b+1,fps:d,duration:(c-b)/d,lastFrame:0,currentFrame:0,active:!1,time:0,direction:1,weight:1,directionBackwards:!1,mirroredLoop:!1};this.animationsMap[a]=b;this.animationsList.push(b)};
THREE.MorphBlendMesh.prototype.autoCreateAnimations=function(a){for(var b=/([a-z]+)(\d+)/,c,d={},e=this.geometry,f=0,g=e.morphTargets.length;f<g;f++){var h=e.morphTargets[f].name.match(b);if(h&&1<h.length){var i=h[1];d[i]||(d[i]={start:Infinity,end:-Infinity});h=d[i];f<h.start&&(h.start=f);f>h.end&&(h.end=f);c||(c=i)}}for(i in d)h=d[i],this.createAnimation(i,h.start,h.end,a);this.firstAnimation=c};
THREE.MorphBlendMesh.prototype.setAnimationDirectionForward=function(a){if(a=this.animationsMap[a])a.direction=1,a.directionBackwards=!1};THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward=function(a){if(a=this.animationsMap[a])a.direction=-1,a.directionBackwards=!0};THREE.MorphBlendMesh.prototype.setAnimationFPS=function(a,b){var c=this.animationsMap[a];c&&(c.fps=b,c.duration=(c.end-c.start)/c.fps)};
THREE.MorphBlendMesh.prototype.setAnimationDuration=function(a,b){var c=this.animationsMap[a];c&&(c.duration=b,c.fps=(c.end-c.start)/c.duration)};THREE.MorphBlendMesh.prototype.setAnimationWeight=function(a,b){var c=this.animationsMap[a];c&&(c.weight=b)};THREE.MorphBlendMesh.prototype.setAnimationTime=function(a,b){var c=this.animationsMap[a];c&&(c.time=b)};THREE.MorphBlendMesh.prototype.getAnimationTime=function(a){var b=0;if(a=this.animationsMap[a])b=a.time;return b};
THREE.MorphBlendMesh.prototype.getAnimationDuration=function(a){var b=-1;if(a=this.animationsMap[a])b=a.duration;return b};THREE.MorphBlendMesh.prototype.playAnimation=function(a){var b=this.animationsMap[a];b?(b.time=0,b.active=!0):console.warn("animation["+a+"] undefined")};THREE.MorphBlendMesh.prototype.stopAnimation=function(a){if(a=this.animationsMap[a])a.active=!1};
THREE.MorphBlendMesh.prototype.update=function(a){for(var b=0,c=this.animationsList.length;b<c;b++){var d=this.animationsList[b];if(d.active){var e=d.duration/d.length;d.time+=d.direction*a;if(d.mirroredLoop){if(d.time>d.duration||0>d.time)d.direction*=-1,d.time>d.duration&&(d.time=d.duration,d.directionBackwards=!0),0>d.time&&(d.time=0,d.directionBackwards=!1)}else d.time%=d.duration,0>d.time&&(d.time+=d.duration);var f=d.startFrame+THREE.Math.clamp(Math.floor(d.time/e),0,d.length-1),g=d.weight;
f!==d.currentFrame&&(this.morphTargetInfluences[d.lastFrame]=0,this.morphTargetInfluences[d.currentFrame]=1*g,this.morphTargetInfluences[f]=0,d.lastFrame=d.currentFrame,d.currentFrame=f);e=d.time%e/e;d.directionBackwards&&(e=1-e);this.morphTargetInfluences[d.currentFrame]=e*g;this.morphTargetInfluences[d.lastFrame]=(1-e)*g}}};THREE.LensFlarePlugin=function(){function a(a,c){var d=b.createProgram(),e=b.createShader(b.FRAGMENT_SHADER),f=b.createShader(b.VERTEX_SHADER),g="precision "+c+" float;\n";b.shaderSource(e,g+a.fragmentShader);b.shaderSource(f,g+a.vertexShader);b.compileShader(e);b.compileShader(f);b.attachShader(d,e);b.attachShader(d,f);b.linkProgram(d);return d}var b,c,d,e,f,g,h,i,j,m,p,l,r;this.init=function(s){b=s.context;c=s;d=s.getPrecision();e=new Float32Array(16);f=new Uint16Array(6);s=0;e[s++]=-1;e[s++]=-1;
e[s++]=0;e[s++]=0;e[s++]=1;e[s++]=-1;e[s++]=1;e[s++]=0;e[s++]=1;e[s++]=1;e[s++]=1;e[s++]=1;e[s++]=-1;e[s++]=1;e[s++]=0;e[s++]=1;s=0;f[s++]=0;f[s++]=1;f[s++]=2;f[s++]=0;f[s++]=2;f[s++]=3;g=b.createBuffer();h=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,g);b.bufferData(b.ARRAY_BUFFER,e,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,h);b.bufferData(b.ELEMENT_ARRAY_BUFFER,f,b.STATIC_DRAW);i=b.createTexture();j=b.createTexture();b.bindTexture(b.TEXTURE_2D,i);b.texImage2D(b.TEXTURE_2D,0,b.RGB,16,16,
0,b.RGB,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);b.bindTexture(b.TEXTURE_2D,j);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,16,16,0,b.RGBA,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);
b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);0>=b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)?(m=!1,p=a(THREE.ShaderFlares.lensFlare,d)):(m=!0,p=a(THREE.ShaderFlares.lensFlareVertexTexture,d));l={};r={};l.vertex=b.getAttribLocation(p,"position");l.uv=b.getAttribLocation(p,"uv");r.renderType=b.getUniformLocation(p,"renderType");r.map=b.getUniformLocation(p,"map");r.occlusionMap=b.getUniformLocation(p,"occlusionMap");r.opacity=
b.getUniformLocation(p,"opacity");r.color=b.getUniformLocation(p,"color");r.scale=b.getUniformLocation(p,"scale");r.rotation=b.getUniformLocation(p,"rotation");r.screenPosition=b.getUniformLocation(p,"screenPosition")};this.render=function(a,d,e,f){var a=a.__webglFlares,u=a.length;if(u){var x=new THREE.Vector3,t=f/e,E=0.5*e,J=0.5*f,F=16/f,z=new THREE.Vector2(F*t,F),H=new THREE.Vector3(1,1,0),K=new THREE.Vector2(1,1),G=r,F=l;b.useProgram(p);b.enableVertexAttribArray(l.vertex);b.enableVertexAttribArray(l.uv);
b.uniform1i(G.occlusionMap,0);b.uniform1i(G.map,1);b.bindBuffer(b.ARRAY_BUFFER,g);b.vertexAttribPointer(F.vertex,2,b.FLOAT,!1,16,0);b.vertexAttribPointer(F.uv,2,b.FLOAT,!1,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,h);b.disable(b.CULL_FACE);b.depthMask(!1);var L,B,V,C,I;for(L=0;L<u;L++)if(F=16/f,z.set(F*t,F),C=a[L],x.set(C.matrixWorld.elements[12],C.matrixWorld.elements[13],C.matrixWorld.elements[14]),x.applyMatrix4(d.matrixWorldInverse),x.applyProjection(d.projectionMatrix),H.copy(x),K.x=H.x*E+E,
K.y=H.y*J+J,m||0<K.x&&K.x<e&&0<K.y&&K.y<f){b.activeTexture(b.TEXTURE1);b.bindTexture(b.TEXTURE_2D,i);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGB,K.x-8,K.y-8,16,16,0);b.uniform1i(G.renderType,0);b.uniform2f(G.scale,z.x,z.y);b.uniform3f(G.screenPosition,H.x,H.y,H.z);b.disable(b.BLEND);b.enable(b.DEPTH_TEST);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);b.activeTexture(b.TEXTURE0);b.bindTexture(b.TEXTURE_2D,j);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGBA,K.x-8,K.y-8,16,16,0);b.uniform1i(G.renderType,1);b.disable(b.DEPTH_TEST);
b.activeTexture(b.TEXTURE1);b.bindTexture(b.TEXTURE_2D,i);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);C.positionScreen.copy(H);C.customUpdateCallback?C.customUpdateCallback(C):C.updateLensFlares();b.uniform1i(G.renderType,2);b.enable(b.BLEND);B=0;for(V=C.lensFlares.length;B<V;B++)I=C.lensFlares[B],0.001<I.opacity&&0.001<I.scale&&(H.x=I.x,H.y=I.y,H.z=I.z,F=I.size*I.scale/f,z.x=F*t,z.y=F,b.uniform3f(G.screenPosition,H.x,H.y,H.z),b.uniform2f(G.scale,z.x,z.y),b.uniform1f(G.rotation,I.rotation),b.uniform1f(G.opacity,
I.opacity),b.uniform3f(G.color,I.color.r,I.color.g,I.color.b),c.setBlending(I.blending,I.blendEquation,I.blendSrc,I.blendDst),c.setTexture(I.texture,1),b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0))}b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(!0)}}};THREE.ShadowMapPlugin=function(){var a,b,c,d,e,f,g=new THREE.Frustum,h=new THREE.Matrix4,i=new THREE.Vector3,j=new THREE.Vector3,m=new THREE.Vector3;this.init=function(g){a=g.context;b=g;var g=THREE.ShaderLib.depthRGBA,h=THREE.UniformsUtils.clone(g.uniforms);c=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h});d=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0});e=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,
vertexShader:g.vertexShader,uniforms:h,skinning:!0});f=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0,skinning:!0});c._shadowPass=!0;d._shadowPass=!0;e._shadowPass=!0;f._shadowPass=!0};this.render=function(a,c){b.shadowMapEnabled&&b.shadowMapAutoUpdate&&this.update(a,c)};this.update=function(p,l){var r,s,n,q,y,u,x,t,E,J=[];q=0;a.clearColor(1,1,1,1);a.disable(a.BLEND);a.enable(a.CULL_FACE);a.frontFace(a.CCW);b.shadowMapCullFace===THREE.CullFaceFront?
a.cullFace(a.FRONT):a.cullFace(a.BACK);b.setDepthTest(!0);r=0;for(s=p.__lights.length;r<s;r++)if(n=p.__lights[r],n.castShadow)if(n instanceof THREE.DirectionalLight&&n.shadowCascade)for(y=0;y<n.shadowCascadeCount;y++){var F;if(n.shadowCascadeArray[y])F=n.shadowCascadeArray[y];else{E=n;x=y;F=new THREE.DirectionalLight;F.isVirtual=!0;F.onlyShadow=!0;F.castShadow=!0;F.shadowCameraNear=E.shadowCameraNear;F.shadowCameraFar=E.shadowCameraFar;F.shadowCameraLeft=E.shadowCameraLeft;F.shadowCameraRight=E.shadowCameraRight;
F.shadowCameraBottom=E.shadowCameraBottom;F.shadowCameraTop=E.shadowCameraTop;F.shadowCameraVisible=E.shadowCameraVisible;F.shadowDarkness=E.shadowDarkness;F.shadowBias=E.shadowCascadeBias[x];F.shadowMapWidth=E.shadowCascadeWidth[x];F.shadowMapHeight=E.shadowCascadeHeight[x];F.pointsWorld=[];F.pointsFrustum=[];t=F.pointsWorld;u=F.pointsFrustum;for(var z=0;8>z;z++)t[z]=new THREE.Vector3,u[z]=new THREE.Vector3;t=E.shadowCascadeNearZ[x];E=E.shadowCascadeFarZ[x];u[0].set(-1,-1,t);u[1].set(1,-1,t);u[2].set(-1,
1,t);u[3].set(1,1,t);u[4].set(-1,-1,E);u[5].set(1,-1,E);u[6].set(-1,1,E);u[7].set(1,1,E);F.originalCamera=l;u=new THREE.Gyroscope;u.position=n.shadowCascadeOffset;u.add(F);u.add(F.target);l.add(u);n.shadowCascadeArray[y]=F;console.log("Created virtualLight",F)}x=n;t=y;E=x.shadowCascadeArray[t];E.position.copy(x.position);E.target.position.copy(x.target.position);E.lookAt(E.target);E.shadowCameraVisible=x.shadowCameraVisible;E.shadowDarkness=x.shadowDarkness;E.shadowBias=x.shadowCascadeBias[t];u=x.shadowCascadeNearZ[t];
x=x.shadowCascadeFarZ[t];E=E.pointsFrustum;E[0].z=u;E[1].z=u;E[2].z=u;E[3].z=u;E[4].z=x;E[5].z=x;E[6].z=x;E[7].z=x;J[q]=F;q++}else J[q]=n,q++;r=0;for(s=J.length;r<s;r++){n=J[r];n.shadowMap||(y=THREE.LinearFilter,b.shadowMapType===THREE.PCFSoftShadowMap&&(y=THREE.NearestFilter),n.shadowMap=new THREE.WebGLRenderTarget(n.shadowMapWidth,n.shadowMapHeight,{minFilter:y,magFilter:y,format:THREE.RGBAFormat}),n.shadowMapSize=new THREE.Vector2(n.shadowMapWidth,n.shadowMapHeight),n.shadowMatrix=new THREE.Matrix4);
if(!n.shadowCamera){if(n instanceof THREE.SpotLight)n.shadowCamera=new THREE.PerspectiveCamera(n.shadowCameraFov,n.shadowMapWidth/n.shadowMapHeight,n.shadowCameraNear,n.shadowCameraFar);else if(n instanceof THREE.DirectionalLight)n.shadowCamera=new THREE.OrthographicCamera(n.shadowCameraLeft,n.shadowCameraRight,n.shadowCameraTop,n.shadowCameraBottom,n.shadowCameraNear,n.shadowCameraFar);else{console.error("Unsupported light type for shadow");continue}p.add(n.shadowCamera);!0===p.autoUpdate&&p.updateMatrixWorld()}n.shadowCameraVisible&&
!n.cameraHelper&&(n.cameraHelper=new THREE.CameraHelper(n.shadowCamera),n.shadowCamera.add(n.cameraHelper));if(n.isVirtual&&F.originalCamera==l){y=l;q=n.shadowCamera;u=n.pointsFrustum;E=n.pointsWorld;i.set(Infinity,Infinity,Infinity);j.set(-Infinity,-Infinity,-Infinity);for(x=0;8>x;x++)t=E[x],t.copy(u[x]),THREE.ShadowMapPlugin.__projector.unprojectVector(t,y),t.applyMatrix4(q.matrixWorldInverse),t.x<i.x&&(i.x=t.x),t.x>j.x&&(j.x=t.x),t.y<i.y&&(i.y=t.y),t.y>j.y&&(j.y=t.y),t.z<i.z&&(i.z=t.z),t.z>j.z&&
(j.z=t.z);q.left=i.x;q.right=j.x;q.top=j.y;q.bottom=i.y;q.updateProjectionMatrix()}q=n.shadowMap;u=n.shadowMatrix;y=n.shadowCamera;y.position.getPositionFromMatrix(n.matrixWorld);m.getPositionFromMatrix(n.target.matrixWorld);y.lookAt(m);y.updateMatrixWorld();y.matrixWorldInverse.getInverse(y.matrixWorld);n.cameraHelper&&(n.cameraHelper.visible=n.shadowCameraVisible);n.shadowCameraVisible&&n.cameraHelper.update();u.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1);u.multiply(y.projectionMatrix);u.multiply(y.matrixWorldInverse);
h.multiplyMatrices(y.projectionMatrix,y.matrixWorldInverse);g.setFromMatrix(h);b.setRenderTarget(q);b.clear();E=p.__webglObjects;n=0;for(q=E.length;n<q;n++)if(x=E[n],u=x.object,x.render=!1,u.visible&&u.castShadow&&(!(u instanceof THREE.Mesh||u instanceof THREE.ParticleSystem)||!u.frustumCulled||g.intersectsObject(u)))u._modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,u.matrixWorld),x.render=!0;n=0;for(q=E.length;n<q;n++)x=E[n],x.render&&(u=x.object,x=x.buffer,z=u.material instanceof THREE.MeshFaceMaterial?
u.material.materials[0]:u.material,t=0<u.geometry.morphTargets.length&&z.morphTargets,z=u instanceof THREE.SkinnedMesh&&z.skinning,t=u.customDepthMaterial?u.customDepthMaterial:z?t?f:e:t?d:c,x instanceof THREE.BufferGeometry?b.renderBufferDirect(y,p.__lights,null,t,x,u):b.renderBuffer(y,p.__lights,null,t,x,u));E=p.__webglObjectsImmediate;n=0;for(q=E.length;n<q;n++)x=E[n],u=x.object,u.visible&&u.castShadow&&(u._modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,u.matrixWorld),b.renderImmediateObject(y,
p.__lights,null,c,u))}r=b.getClearColor();s=b.getClearAlpha();a.clearColor(r.r,r.g,r.b,s);a.enable(a.BLEND);b.shadowMapCullFace===THREE.CullFaceFront&&a.cullFace(a.BACK)}};THREE.ShadowMapPlugin.__projector=new THREE.Projector;THREE.SpritePlugin=function(){function a(a,b){return a.z!==b.z?b.z-a.z:b.id-a.id}var b,c,d,e,f,g,h,i,j,m;this.init=function(a){b=a.context;c=a;d=a.getPrecision();e=new Float32Array(16);f=new Uint16Array(6);a=0;e[a++]=-1;e[a++]=-1;e[a++]=0;e[a++]=0;e[a++]=1;e[a++]=-1;e[a++]=1;e[a++]=0;e[a++]=1;e[a++]=1;e[a++]=1;e[a++]=1;e[a++]=-1;e[a++]=1;e[a++]=0;e[a++]=1;a=0;f[a++]=0;f[a++]=1;f[a++]=2;f[a++]=0;f[a++]=2;f[a++]=3;g=b.createBuffer();h=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,g);b.bufferData(b.ARRAY_BUFFER,
e,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,h);b.bufferData(b.ELEMENT_ARRAY_BUFFER,f,b.STATIC_DRAW);var a=THREE.ShaderSprite.sprite,l=b.createProgram(),r=b.createShader(b.FRAGMENT_SHADER),s=b.createShader(b.VERTEX_SHADER),n="precision "+d+" float;\n";b.shaderSource(r,n+a.fragmentShader);b.shaderSource(s,n+a.vertexShader);b.compileShader(r);b.compileShader(s);b.attachShader(l,r);b.attachShader(l,s);b.linkProgram(l);i=l;j={};m={};j.position=b.getAttribLocation(i,"position");j.uv=b.getAttribLocation(i,
"uv");m.uvOffset=b.getUniformLocation(i,"uvOffset");m.uvScale=b.getUniformLocation(i,"uvScale");m.rotation=b.getUniformLocation(i,"rotation");m.scale=b.getUniformLocation(i,"scale");m.alignment=b.getUniformLocation(i,"alignment");m.color=b.getUniformLocation(i,"color");m.map=b.getUniformLocation(i,"map");m.opacity=b.getUniformLocation(i,"opacity");m.useScreenCoordinates=b.getUniformLocation(i,"useScreenCoordinates");m.sizeAttenuation=b.getUniformLocation(i,"sizeAttenuation");m.screenPosition=b.getUniformLocation(i,
"screenPosition");m.modelViewMatrix=b.getUniformLocation(i,"modelViewMatrix");m.projectionMatrix=b.getUniformLocation(i,"projectionMatrix");m.fogType=b.getUniformLocation(i,"fogType");m.fogDensity=b.getUniformLocation(i,"fogDensity");m.fogNear=b.getUniformLocation(i,"fogNear");m.fogFar=b.getUniformLocation(i,"fogFar");m.fogColor=b.getUniformLocation(i,"fogColor");m.alphaTest=b.getUniformLocation(i,"alphaTest")};this.render=function(d,e,f,s){var n=d.__webglSprites,q=n.length;if(q){var y=j,u=m,x=s/
f,f=0.5*f,t=0.5*s;b.useProgram(i);b.enableVertexAttribArray(y.position);b.enableVertexAttribArray(y.uv);b.disable(b.CULL_FACE);b.enable(b.BLEND);b.bindBuffer(b.ARRAY_BUFFER,g);b.vertexAttribPointer(y.position,2,b.FLOAT,!1,16,0);b.vertexAttribPointer(y.uv,2,b.FLOAT,!1,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,h);b.uniformMatrix4fv(u.projectionMatrix,!1,e.projectionMatrix.elements);b.activeTexture(b.TEXTURE0);b.uniform1i(u.map,0);var E=y=0,J=d.fog;J?(b.uniform3f(u.fogColor,J.color.r,J.color.g,J.color.b),
J instanceof THREE.Fog?(b.uniform1f(u.fogNear,J.near),b.uniform1f(u.fogFar,J.far),b.uniform1i(u.fogType,1),E=y=1):J instanceof THREE.FogExp2&&(b.uniform1f(u.fogDensity,J.density),b.uniform1i(u.fogType,2),E=y=2)):(b.uniform1i(u.fogType,0),E=y=0);for(var F,z,H=[],J=0;J<q;J++)F=n[J],z=F.material,F.visible&&0!==z.opacity&&(z.useScreenCoordinates?F.z=-F.position.z:(F._modelViewMatrix.multiplyMatrices(e.matrixWorldInverse,F.matrixWorld),F.z=-F._modelViewMatrix.elements[14]));n.sort(a);for(J=0;J<q;J++)F=
n[J],z=F.material,F.visible&&0!==z.opacity&&(z.map&&z.map.image&&z.map.image.width)&&(b.uniform1f(u.alphaTest,z.alphaTest),!0===z.useScreenCoordinates?(b.uniform1i(u.useScreenCoordinates,1),b.uniform3f(u.screenPosition,(F.position.x*c.devicePixelRatio-f)/f,(t-F.position.y*c.devicePixelRatio)/t,Math.max(0,Math.min(1,F.position.z))),H[0]=c.devicePixelRatio,H[1]=c.devicePixelRatio):(b.uniform1i(u.useScreenCoordinates,0),b.uniform1i(u.sizeAttenuation,z.sizeAttenuation?1:0),b.uniformMatrix4fv(u.modelViewMatrix,
!1,F._modelViewMatrix.elements),H[0]=1,H[1]=1),e=d.fog&&z.fog?E:0,y!==e&&(b.uniform1i(u.fogType,e),y=e),e=1/(z.scaleByViewport?s:1),H[0]*=e*x*F.scale.x,H[1]*=e*F.scale.y,b.uniform2f(u.uvScale,z.uvScale.x,z.uvScale.y),b.uniform2f(u.uvOffset,z.uvOffset.x,z.uvOffset.y),b.uniform2f(u.alignment,z.alignment.x,z.alignment.y),b.uniform1f(u.opacity,z.opacity),b.uniform3f(u.color,z.color.r,z.color.g,z.color.b),b.uniform1f(u.rotation,F.rotation),b.uniform2fv(u.scale,H),c.setBlending(z.blending,z.blendEquation,
z.blendSrc,z.blendDst),c.setDepthTest(z.depthTest),c.setDepthWrite(z.depthWrite),c.setTexture(z.map,0),b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0));b.enable(b.CULL_FACE)}}};THREE.DepthPassPlugin=function(){this.enabled=!1;this.renderTarget=null;var a,b,c,d,e,f,g=new THREE.Frustum,h=new THREE.Matrix4;this.init=function(g){a=g.context;b=g;var g=THREE.ShaderLib.depthRGBA,h=THREE.UniformsUtils.clone(g.uniforms);c=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h});d=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0});e=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,
vertexShader:g.vertexShader,uniforms:h,skinning:!0});f=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0,skinning:!0});c._shadowPass=!0;d._shadowPass=!0;e._shadowPass=!0;f._shadowPass=!0};this.render=function(a,b){this.enabled&&this.update(a,b)};this.update=function(i,j){var m,p,l,r,s,n;a.clearColor(1,1,1,1);a.disable(a.BLEND);b.setDepthTest(!0);!0===i.autoUpdate&&i.updateMatrixWorld();j.matrixWorldInverse.getInverse(j.matrixWorld);h.multiplyMatrices(j.projectionMatrix,
j.matrixWorldInverse);g.setFromMatrix(h);b.setRenderTarget(this.renderTarget);b.clear();n=i.__webglObjects;m=0;for(p=n.length;m<p;m++)if(l=n[m],s=l.object,l.render=!1,s.visible&&(!(s instanceof THREE.Mesh||s instanceof THREE.ParticleSystem)||!s.frustumCulled||g.intersectsObject(s)))s._modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,s.matrixWorld),l.render=!0;var q;m=0;for(p=n.length;m<p;m++)if(l=n[m],l.render&&(s=l.object,l=l.buffer,!(s instanceof THREE.ParticleSystem)||s.customDepthMaterial))(q=
s.material instanceof THREE.MeshFaceMaterial?s.material.materials[0]:s.material)&&b.setMaterialFaces(s.material),r=0<s.geometry.morphTargets.length&&q.morphTargets,q=s instanceof THREE.SkinnedMesh&&q.skinning,r=s.customDepthMaterial?s.customDepthMaterial:q?r?f:e:r?d:c,l instanceof THREE.BufferGeometry?b.renderBufferDirect(j,i.__lights,null,r,l,s):b.renderBuffer(j,i.__lights,null,r,l,s);n=i.__webglObjectsImmediate;m=0;for(p=n.length;m<p;m++)l=n[m],s=l.object,s.visible&&(s._modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,
s.matrixWorld),b.renderImmediateObject(j,i.__lights,null,c,s));m=b.getClearColor();p=b.getClearAlpha();a.clearColor(m.r,m.g,m.b,p);a.enable(a.BLEND)}};THREE.ShaderFlares={lensFlareVertexTexture:{vertexShader:"uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
fragmentShader:"uniform lowp int renderType;\nuniform sampler2D map;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},lensFlare:{vertexShader:"uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
fragmentShader:"precision mediump float;\nuniform lowp int renderType;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"}};THREE.ShaderSprite={sprite:{vertexShader:"uniform int useScreenCoordinates;\nuniform int sizeAttenuation;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( sizeAttenuation == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",
fragmentShader:"uniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nuniform int fogType;\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\nuniform float alphaTest;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\nif ( texture.a < alphaTest ) discard;\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\nif ( fogType > 0 ) {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat fogFactor = 0.0;\nif ( fogType == 1 ) {\nfogFactor = smoothstep( fogNear, fogFar, depth );\n} else {\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n}\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n}\n}"}};

module.exports = THREE
}()
},{}],21:[function(_dereq_,module,exports){
(function (global){
!function() {

"use strict"

var hasZepto = typeof Zepto === 'function',
    hasJQuery = typeof jQuery === 'function',
    has$ = typeof global.$ === 'object' || typeof global.$ === 'function',
    $ = null,
    hasConflict = hasZepto || hasJQuery || has$,
    isArray = Array.isArray,
    isObject = function( obj ) { return typeof obj === 'object' },
    isPlainObject = function( obj ) {
      return isObject(obj) && Object.getPrototypeOf( obj ) == Object.prototype
    }

if( !hasConflict ) {
  $ = document.querySelector.bind( document )
}else if( hasJQuery ) {
  $ = jQuery 
}else if( hasZepto ) {
  $ = Zepto
}else if( has$ ){
  $ = global.$
}else{
  $ = document.querySelector.bind( document )
}

// taken from Zepto: zeptojs.com
function extend(target, source, deep) {
  for (var key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {}
      if (isArray(source[key]) && !isArray(target[key]))
        target[key] = []
      extend(target[key], source[key], deep)
    }
    else if (source[key] !== undefined) target[key] = source[key]
}

if( !hasConflict ) {
  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function( target ){
    var deep, args = Array.prototype.slice.call(arguments, 1)

    if (typeof target === 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }
  
  $.isArray = Array.isArray 
  $.isPlainObject = isPlainObject

  $.type = function( val ) {
    return typeof val
  }
}

var events = {}
$.subscribe   = function( key, fcn ) { 
  if( typeof events[ key ] === 'undefined' ) {
    events[ key ] = []
  }
  events[ key ].push( fcn )
}

$.unsubscribe = function( key, fcn ) {
  if( typeof events[ key ] !== 'undefined' ) {
    var arr = events[ key ]
    
    arr.splice( arr.indexOf( fcn ), 1 )
  }
}

$.publish = function( key, data ) {
  if( typeof events[ key ] !== 'undefined' ) {
    var arr = events[ key ]
    for( var i = 0; i < arr.length; i++ ) {
      arr[ i ]( data )
    }
  }
}

module.exports = $

}()
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(_dereq_,module,exports){
(function() {
//"use strict" 
// can't use strict because eval is used to evaluate user code in the run method
// I should wrap this in a Function call instead...
var $ = _dereq_( './dollar' )

var Gibber = {
  Presets: {},
  GraphicsLib: {},
  Binops: {},
  scale : null,
  minNoteFrequency:50,
  started:false,
  
  export: function( target ) {
    Gibber.Utilities.export( target )
    
    if( Gibber.Audio ) {
      Gibber.Audio.export( target )
    }
    
    if( Gibber.Graphics ) {
      Gibber.Graphics.export( target )
    }
  },
  
  init: function( _options ) {                        
      if( typeof window === 'undefined' ) { // check for node.js
        window = GLOBAL // is this a good idea? makes a global window available in all files required in node
        document = GLOBAL.document = false
      }else if( typeof GLOBAL !== 'undefined' ) { // I can't remember why I put this in there...
        if( !GLOBAL.document ) document = GLOBAL.document = false
      }
      
      var options = {
        globalize: true,
        canvas: null,
        target: window,
        graphicsMode:'3d'
      }
      
      if( typeof _options === 'object' ) $.extend( options, _options )
      
      if( Gibber.Audio ) {
        Gibber.Audio.init() 
      
        if( options.globalize ) {
          options.target.Master = Gibber.Audio.Master    
        }else{
          $.extend( Gibber, Gibber.Audio )
        }
      }
      
      if( Gibber.Graphics ) {
        Gibber.Graphics.init( options.graphicsMode )
      }
      
      if( options.globalize ) {
        Gibber.export( options.target )
      }
      
      options.target.$ = $ // TODO: geez louise
            
      Gibber.Utilities.init()
      
      // Gibber.isInstrument = true
  },
  // interfaceIsReady : function() {
  //   if( !Gibber.started ) {
  //     if( typeof Gibber.Audio.context.currentTime !== 'undefined' ) {
  //       Gibber.started = true
  //       if( Gibber.isInstrument ) eval( loadFile.text )
  //     }
  //   }
  // },
  Modules : {},
 	import : function( path, exportTo ) {
    var _done = null;
    console.log( 'Loading module ' + path + '...' )

    if( path.indexOf( 'http:' ) === -1 ) { 
      console.log( 'loading via post', path )
      $.post(
        Gibber.Environment.SERVER_URL + '/gibber/'+path, {},
        function( d ) {
          d = JSON.parse( d )
          eval( d.text )
          
          if( exportTo && Gibber.Modules[ path ] ) {
            $.extend( exportTo, Gibber.Modules[ path ] )
            Gibber.Modules[ path ] = exportTo
          }  
          if( Gibber.Modules[ path ] ) {
            if( Gibber.Modules[ path ].init ) {
              Gibber.Modules[ path ].init()
            }
            console.log( 'Module ' + path + ' is now loaded.' )
          }else{
            console.log( 'Publication ' + path + ' is loaded. It may not be a valid module.')
          }
          
          if( _done !== null ) { _done( Gibber.Modules[ path ] ) }

          return false;
        }
      )
    }else{
      var script = document.createElement( 'script' )
      script.src = path
      
      script.onload = function () {
        console.log( 'Module ' + path + ' is now loaded.' )
        if( _done !== null ) { _done() }
      };

      document.head.appendChild( script )
    }
    return { done: function( fcn ) { _done =  fcn } }
 	},  
  
  // log: function( msg ) { 
  //   //console.log( "LOG", typeof msg )
  //   if( typeof msg !== 'undefined' ) {
  //     if( typeof msg !== 'function') {
  //       console.log( msg )
  //     }else{
  //       console.log( 'Function' )
  //     }
  //   }
  // },
  
  scriptCallbacks: [],
  
  run: function( script, pos, cm ) { // called by Gibber.Environment.Keymap.modes.javascript
		var _start = pos.start ? pos.start.line : pos.line,
				tree
    
	  try{
			tree = Gibber.Esprima.parse(script, { loc:true, range:true} )
		}catch(e) {
			console.error( "Parse error on line " + ( _start + e.lineNumber ) + " : " + e.message.split(':')[1] )
			return
		}
    
    // must wrap i with underscores to avoid confusion in the eval statement with commands that use proxy i
    for( var __i__ = 0; __i__ < tree.body.length; __i__++ ) {
      var obj = tree.body[ __i__ ],
					start = { line:_start + obj.loc.start.line - 1, ch: obj.loc.start.column },
					end   = { line:_start + obj.loc.end.line - 1, ch: obj.loc.end.column },
				  src   = cm.getRange( start, end ),
          result = null
			
			//console.log( start, end, src )
			try{
				result = eval( src )
        if( typeof result !== 'function' ) {
          log( result )
        }else{
          log( 'Function' )
        }
			}catch( e ) {
				console.error( "Error evaluating expression beginning on line " + (start.line + 1) + '\n' + e.message )
			}
      
      if( this.scriptCallbacks.length > 0 ) {
        for( var ___i___ = 0; ___i___ < this.scriptCallbacks.length; ___i___++ ) {
          this.scriptCallbacks[ ___i___ ]( obj, cm, pos, start, end, src, _start )
        }
      }
    }
  },
  
  processArguments: function(args, type) {    
    var obj
    
    if( args.length ) {
      if( typeof args[0] === 'string' && type !== 'Drums' && type !== 'XOX' ) {
        obj = Gibber.getPreset( args[0], type )
        
        if( typeof args[1] == 'object' ) {
          $.extend( obj, args[ 1 ] )
        }
        return obj
      }
      return Array.prototype.slice.call(args, 0)
    }
    
    return obj
  },
  
  processArguments2 : function(obj, args, type) {
    if( args.length ) {
      var firstArg = args[ 0 ]
    
      if( typeof firstArg === 'string' && type !== 'Drums' && type !== 'XOX' && type !== 'Shader' ) {
        preset = Gibber.getPreset( args[0], type )
      
        if( typeof args[1] === 'object' ) {
          $.extend( preset, args[ 1 ] )
        }
      
        $.extend( obj, preset )
        
        if( obj.presetInit ) obj.presetInit() 
      }else if( $.isPlainObject( firstArg ) && typeof firstArg.type === 'undefined' ) {
        $.extend( obj, firstArg )
      }else{
        var keys = Object.keys( obj.properties )
                
        if( obj.type === 'FX' ) {
          for( var i = 0; i < args.length; i++ ) { obj[ keys[ i + 1 ] ] = args[ i ] }
        }else{
          for( var i = 0; i < args.length; i++ ) { obj[ keys[ i ] ] = args[ i ] }
        }
        
      }
    }      
  },
    
  getPreset: function( presetName, ugenType ) {
    var obj = {}
    
    if( Gibber.Presets[ ugenType ] ) {
      if( Gibber.Presets[ ugenType ][ presetName ] ) {
        obj = Gibber.Presets[ ugenType ][ presetName ]
      }else{
        Gibber.log( ugenType + ' does not have a preset named ' + presetName + '.' )
      }
    }else{
      Gibber.log( ugenType + ' does not have a preset named ' + presetName + '.' )
    }
    
    return obj
  },
  
  clear : function() {
    if( Gibber.Audio ) Gibber.Audio.clear();
    
    if( Gibber.Graphics ) Gibber.Graphics.clear()

    Gibber.proxy( window )
		
    $.publish( '/gibber/clear', {} )
        
    console.log( 'Gibber has been cleared.' )
  },
  
  proxy: function( target ) {
		var letters = "abcdefghijklmnopqrstuvwxyz"
    
		for(var l = 0; l < letters.length; l++) {
			var lt = letters.charAt(l);
      if( typeof window[ lt ] !== 'undefined' ) { 
        delete window[ lt ] 
        delete window[ '___' + lt ]
      }

      (function() {
				var ltr = lt;
      
				Object.defineProperty( target, ltr, {
          configurable: true,
					get:function() { return target[ '___'+ltr] },
					set:function( newObj ) {
            if( newObj ) {
              if( target[ '___'+ltr ] ) { 
                if( typeof target[ '___'+ltr ].replaceWith === 'function' ) {
                  target[ '___'+ltr ].replaceWith( newObj )
                  console.log( target[ '___'+ltr ].name + ' was replaced with ' + newObj.name )
                }
              }
              target[ '___'+ltr ] = newObj
            }else{
						  if( target[ '___'+ltr ] ) {
						  	 var variable = target[ '___'+ltr ]
						  	 if( variable ) {
						  		 if( typeof variable.kill === 'function' /*&& target[ '___'+ltr ].destinations.length > 0 */) {
						  			 variable.kill();
						  		 }
						  	 }
						  }
            }
          }
        });
      })();     
    }
  },

  construct: function( constructor, args ) {
    function F() {
      return constructor.apply( this, args );
    }
    F.prototype = constructor.prototype;
    return new F();
  },
  
  createMappingObject : function(target, from) {
    var min = typeof target.min === 'function' ? target.min() : target.min,
        max = typeof target.max === 'function' ? target.max() : target.max,
        _min = typeof from.min === 'function' ? from.min() : from.min,
        _max = typeof from.max === 'function' ? from.max() : from.max
        
    if( typeof from.object === 'undefined' && from.Value) { // if using an interface object directly to map
      from = from.Value
    }
    
    if( typeof target.object[ target.Name ].mapping !== 'undefined') {
      target.object[ target.Name ].mapping.replace( from.object, from.name, from.Name )
      return
    }
    
    if( typeof from.targets !== 'undefined' ) {
      if( from.targets.indexOf( target ) === -1 ) from.targets.push( [target, target.Name] )
    }
    
    var fromTimescale = from.Name !== 'Out' ? from.timescale : 'audioOut' // check for audio Out, which is a faux property
    
    //console.log( target.timescale, fromTimescale )
    
    mapping = Gibber.mappings[ target.timescale ][ fromTimescale ]( target, from )
    
    target.object[ target.name ].toString = function() { return '> continuous mapping: ' + from.name + ' -> ' + target.name }
    
    Object.defineProperties( target.object[ target.Name ], {
      'min' : {
        configurable:true,
        get : function() { return min },
        set : function(v) { min = v;  target.object[ target.Name ].mapping.outputMin = min }
      },
      'max' : {
        configurable:true,
        get : function() { return max },
        set : function(v) { max = v; target.object[ target.Name ].mapping.outputMax = max }
      },
    })
    
    target.object[ target.Name ].mappingObjects = []
    
    Gibber.createProxyProperty( target.object[ target.Name ], 'min', 1, 0, {
      'min':min, 'max':max, output: target.output,
      timescale: target.timescale,
      dimensions:1
    })
    
    Gibber.createProxyProperty( target.object[ target.Name ], 'max', 1, 0, {
      'min':min, 'max':max, output: target.output,
      timescale: target.timescale,
      dimensions:1
    })
    
    Object.defineProperties( from.object[ from.Name ], {
      'min' : {
        configurable:true,
        get : function() { return _min },
        set : function(v) { _min = v; target.object[ target.Name ].mapping.inputMin = _min }
      },
      'max' : {
        configurable:true,
        get : function() { return _max },
        set : function(v) { _max = v; target.object[ target.Name ].mapping.inputMax = _max }
      },
    })
    
    target.object[ target.Name ].invert = function() {
      target.object[ target.Name ].mapping.invert()
    }
    
    if( typeof target.object.mappings === 'undefined' ) target.object.mappings = []
    
    target.object.mappings.push( mapping )
    
    Gibber.defineSequencedProperty( target.object[ target.Name ], 'invert' )
  },
  
  defineSequencedProperty : function( obj, key, priority ) {
    var fnc = obj[ key ], seq, seqNumber
    
    // for( var i = obj.seq.seqs.length - 1; i >= 0; i-- ) {
    //   var s = obj.seq.seqs[ i ]
    //   if( s.key === key ) {
    //     seq = s,
    //     seqNumber = i
    //     break;
    //   }
    // }
    
    if( !obj.seq ) {
      obj.seq = Gibber.Audio.Seqs.Seq({ doNotStart:true, scale:obj.scale, priority:priority })
    }
    
    fnc.seq = function( v,d ) {  

      var args = {
            key: key,
            values: $.isArray(v) || v !== null && typeof v !== 'function' && typeof v.length === 'number' ? v : [v],
            durations: $.isArray(d) ? d : typeof d !== 'undefined' ? [d] : null,
            target: obj,
            'priority': priority
          }
            
      if( typeof seq !== 'undefined' ) {
        seq.shouldStop = true
        obj.seq.seqs.splice( seqNumber, 1 )
      }
      
      obj.seq.add( args )
      
      seqNumber = obj.seq.seqs.length - 1
      seq = obj.seq.seqs[ seqNumber ]
      
      if( args.durations === null ) { obj.seq.autofire.push( seq ) }
      
      Object.defineProperties( fnc.seq, {
        values: {
          configurable:true,
          get: function() { return obj.seq.seqs[ seqNumber ].values },
          set: function(v) {
            if( !Array.isArray(v) ) {
              v = [ v ]
            }
            if( key === 'note' && obj.seq.scale ) {  
              v = makeNoteFunction( v, obj.seq )
            }
            obj.seq.seqs[ seqNumber ].values = v //.splice( 0, 10000, v )
            //Gibber.defineSequencedProperty( obj.seq.seqs[ seqNumber ].values, 'reverse' )
          }
        },
        durations: {
          configurable:true,
          get: function() { return obj.seq.seqs[ seqNumber ].durations },
          set: function(v) {
            if( !Array.isArray(v) ) {
              v = [ v ]
            }
            obj.seq.seqs[ seqNumber ].durations = v   //.splice( 0, 10000, v )
            //Gibber.defineSequencedProperty( obj.seq.seqs[ seqNumber ].durations, 'reverse' )  
          }
        },
      })
      
      //Gibber.defineSequencedProperty( obj.seq.seqs[ seqNumber ].values, 'reverse' )
      //Gibber.defineSequencedProperty( obj.seq.seqs[ seqNumber ].durations, 'reverse' )      
      
      if( !obj.seq.isRunning ) {
        obj.seq.offset = Gibber.Clock.time( obj.offset )
        obj.seq.start( true, priority )
      }
      return obj
    }
    
    fnc.seq.stop = function() { seq.shouldStop = true } 
    
    // TODO: property specific stop/start/shuffle etc. for polyseq
    fnc.seq.start = function() {
      seq.shouldStop = false
      obj.seq.timeline[0] = [ seq ]                
      obj.seq.nextTime = 0
      
      if( !obj.seq.isRunning ) { 
        obj.seq.start( false, priority )
      }
    }
  },
  
  defineRampedProperty : function( obj, _key ) {
    var fnc = obj[ _key ], key = _key.slice(1), cancel
    
    fnc.ramp = function( from, to, length ) {
      if( arguments.length < 2 ) {
        console.err( 'ramp requires at least two arguments: target and time.' )
        return
      }
      
      if( typeof length === 'undefined' ) { // if only to and length arguments
        length = to
        to = from
        from = obj[ key ]()
      }
      
      if( cancel ) cancel()
      
      if( typeof from !== 'object' ) {
        obj[ key ] = Line( from, to, length )
      }else{
        from.retrigger( to, Gibber.Clock.time( length ) )
      }
      
      cancel = future( function() {
        obj[ key ] = to
      }, length )
      
      return obj
    }
  },
  
  createProxyMethods : function( obj, methods ) {
    for( var i = 0; i < methods.length; i++ ) Gibber.defineSequencedProperty( obj, methods[ i ] ) 
  },
  
  createProxyProperty: function( obj, _key, shouldSeq, shouldRamp, dict, _useMappings, priority ) {
    var propertyName = _key,
        useMappings = _useMappings === false ? false : true,
        propertyDict = useMappings ? dict || obj.mappingProperties[ propertyName ] : null,
        __n = propertyName.charAt(0).toUpperCase() + propertyName.slice(1),
        mapping, fnc
            
    mapping = $.extend( {}, propertyDict, {
      Name  : __n,
      name  : propertyName,
      type  : 'mapping',
      value : obj[ propertyName ],
      object: obj,
      targets: [],
			oldSetter: obj.__lookupSetter__( propertyName ),
			oldGetter: obj.__lookupGetter__( propertyName ),
      oldMappingGetter: obj.__lookupGetter__( __n ),
      oldMappingSetter: obj.__lookupSetter__( __n ),          
    })
    
    if( ! obj.mappingObjects ) obj.mappingObjects = []
    // voodoo to make method act like property
    obj.mappingObjects.push( mapping )
    
    var __propertyName = useMappings ? '_' + propertyName : propertyName
    
    fnc = obj[ '_' + propertyName ] = ( function() {
      var _fnc = function(v) {
        if( typeof v !== 'undefined' ) {
          mapping.value = v
          
          if( mapping.oldSetter ) { mapping.oldSetter( mapping.value ) }
          return obj
        }
        return mapping.value
      }
      return _fnc
    })()    

    fnc.valueOf = function() { return mapping.value }
    mapping.toString = function() { return '> continuous mapping: ' + mapping.name  }
    
    if( useMappings ) {
      Object.defineProperty( obj, propertyName, {
        configurable: true,
        get: function() { return obj[ '_' + propertyName ] },
        set: function(v) { 
          if( typeof v === 'object' && v.type === 'mapping' ) {
            Gibber.createMappingObject( mapping, v )
          }else{
            if( typeof obj[ mapping.Name ].mapping !== 'undefined' ) { 
              //if( obj[ mapping.Name ].mapping.op ) obj[ mapping.Name ].mapping.op.remove()
              if( obj[ mapping.Name ].mapping.remove )
                obj[ mapping.Name ].mapping.remove( true )
            }

            obj[ '_' + propertyName ]( v ) 
          }
          return obj
        }
      })
    }else{
      ( function() { 
        var __fnc = fnc
        Object.defineProperty( obj, propertyName, {
          configurable: true,
          get: function() { return obj['_'+propertyName] },
          set: function(v) { 
            obj['_'+propertyName]( v )
            return obj
          }
        })
      })()
    }
    
    if( shouldSeq )
      Gibber.defineSequencedProperty( obj, __propertyName, priority )
    
    if( shouldRamp )
      Gibber.defineRampedProperty( obj, __propertyName )
    
    // capital letter mapping sugar
    if( useMappings ) {
      Object.defineProperty( obj, mapping.Name, {
        configurable: true,
        get : function()  {
          if( typeof mapping.oldMappingGetter === 'function' ) mapping.oldMappingGetter()
          return mapping 
        },
        set : function( v ) {
          obj[ mapping.Name ] = v
          if( typeof mapping.oldMappingSetter === 'function' ) mapping.oldMappingSetter( v )
        }
      })
    }
  },
  
  // obj, _key, shouldSeq, shouldRamp, dict, _useMappings, priority
  createProxyProperties : function( obj, mappingProperties, noSeq, noRamp ) {
    var shouldSeq = typeof noSeq === 'undefined' ? true : noSeq,
        shouldRamp = typeof noRamp === 'undefined' ? true : noRamp
    
    obj.gibber = true // keyword identifying gibber object, needed for notation parser
    
    if( !obj.seq && shouldSeq ) {
      obj.seq = Gibber.Audio.Seqs.Seq({ doNotStart:true, scale:obj.scale })      
    }
    
    obj.mappingProperties = mappingProperties
    obj.mappingObjects = []
    
    for( var key in mappingProperties ) {
      if( ! mappingProperties[ key ].doNotProxy ) {
        Gibber.createProxyProperty( obj, key, shouldSeq, shouldRamp )
      }
    }
  },  
}

Gibber.Utilities = _dereq_( './utilities' )( Gibber )
//Gibber.Audio = require( './audio' )( Gibber )
Gibber.Graphics = _dereq_( './graphics/graphics' )( Gibber )
Gibber.mappings = _dereq_( './mappings' )( Gibber, null )

module.exports = Gibber

})()
},{"./dollar":21,"./graphics/graphics":27,"./mappings":31,"./utilities":32}],23:[function(_dereq_,module,exports){
module.exports = function( Gibber, Graphics ) {
  "use strict"
  var $ = _dereq_('../dollar')
  
  var _that, cnvs
  
  var TwoD = function( container ) { 
    return _that 
  }
  TwoD.export = function( target ) {
    target.Canvas = _that.Canvas
  }
  
  _that = {
    initialized: false,
    canvasObject:null,
    canvas:null,
    container:null,
    _update : function() {
      if( this.initialized ) {
        if( this.canvasObject ) {
          this.canvasObject._update()
        }
      }
    },
    remove: function() {
      if( this.canvasObject ) {
        this.canvasObject.remove()
      }
    },
    init: function( container ) {
      this.container = Graphics.getContainer( container )
      this.initialized = true
      
      if( this.canvasObject === null ) {
        this.canvasObject = _that._Canvas( container )
        this.canvas = this.canvasObject.canvas
        
        if( this.container.append ) {
          this.container.append( this.canvas )
        }else{
          this.container.appendChild( this.canvas )
        }
      }

      if( !Graphics.running ) {
        Graphics.start()
      }
    },
    setSize: function( w, h ) {
      this.canvasObject.setSize( w,h )
    },
    Canvas : function( container ) {
      //if( !this.initialized ) this.init( container )
      if( Graphics.mode === '3d' ) {
        Graphics.modes['3d'].obj.remove()
      }
      
      if( !_that.intialized ) Graphics.init( '2d', container )
      
      _that.canvasObject.show()
      
      return _that.canvasObject
    }.bind( _that ),
    _Canvas : function( container ) { 
      var canvas = document.createElement( 'canvas' ),//$( 'canvas' ),
         ctx = canvas.getContext( '2d' ),
         that = ctx,
         three = null;
      
      $.extend( that, {
        top: 0,
        bottom: canvas.height,
        left:0,
        right:canvas.width,
        center: { x: canvas.width / 2, y : canvas.height / 2 },
        init: function() {
          //Graphics.graph.push( this )
    
          if( !Graphics.running ) Graphics.start()
        },
        setSize: function( w, h ) {
          this.width = this.right = w
          this.height = this.bottom = h
          
          this.center.x = this.width / 2
          this.center.y = this.height / 2          

          this.canvas.style.width = w + 'px'
          this.canvas.style.height = h + 'px'
    
          this.canvas.width  = this.width  * Graphics.resolution
          this.canvas.height = this.height * Graphics.resolution
          
          //Graphics.sizeCanvas( this.canvas )
                    
        },
        canvas: canvas,
        is3D: Graphics.mode === '3d',
        texture:  { needsUpdate: function() {} },//tex || { needsUpdate: function() {} }, 
        remove : function() {
          that.hide()
          
          that.draw = function() {}
          Graphics.modes['2d'].canvas = null
        },
        show: function() {
          canvas.style.display = 'block'
        },
        hide: function() {
          canvas.style.display = 'none'
        },
        shouldClear: false,
        _fill : that.fill,
        _stroke : that.stroke,
        _rotate : that.rotate,
        rotate : function( amt ) {
          this.translate( this.center.x, this.center.y )
          this._rotate( amt )
          this.translate( -this.center.x, -this.center.y )  
        },
        fill : function( color ) {
          if( typeof color !== 'undefined' ) {
            if( ! isNaN( color ) ) {
              color = 'rgb(' + color + ',' + color + ',' + color + ')'
            }
            this.fillStyle = color
          }
          this._fill() 
          this.texture.needsUpdate = true
          return this
        },
        fade: function( amt, color ) {
          var store = this.alpha
  
          this.fillStyle = typeof color === 'undefined' ? 'black' : color
          this.alpha = amt
          this.fillRect( 0,0,this.width,this.height )
          this.alpha = store
        },
        stroke: function( color, lineWidth ) {
          if( typeof color !== 'undefined' ) {
            if( ! isNaN( color ) ) {
              color = 'rgb(' + color + ',' + color + ',' + color + ')'
            }
            this.strokeStyle = color
          }
          if( typeof lineWidth !== 'undefined' ) {
            this.lineWidth = lineWidth
          }
          this._stroke()
          this.texture.needsUpdate = true
          return this
        },
        _update: function() {
          if( this.shouldClear ) this.clear()
          this.save()
          for( var i = 0; i < this.graph.length; i++ ) {
            var shape = this.graph[ i ]
            shape._update()
            if( shape.update ) shape.update()
            shape.draw()
          }
          this.draw()
          this.restore()
        },
        draw : function() {},
        clear: function() {
          this.clearRect( 0,0,this.right,this.bottom )
    
          this.texture.needsUpdate = true
          return this
        },
        line : function( x1,y1, x2,y2 ) {
          this.beginPath()
            this.moveTo( x1, y1 )
            this.lineTo( x2, y2 )
          this.closePath()
          return this
        },
        circle : function( x,y,radius ) {
          if( radius > 0 ) {
            this.save()
    
            this.translate(x,y)
            this.beginPath()
              this.arc( 0,0, radius, 0, Math.PI * 2)
            this.closePath()
    
            this.restore()
          }
          return this
        },
        square : function( x,y,size ) {
          this.beginPath()
            this.moveTo( x,y )
            this.lineTo( x + size, y )
            this.lineTo( x + size, y + size )
            this.lineTo( x, y + size )
            this.lineTo( x,y )
          this.closePath()
          return this
        },
        rectangle : function( x,y,width,height ) {
          this.beginPath()
            this.moveTo( x,y )
            this.lineTo( x + width, y )
            this.lineTo( x + width, y + height )
            this.lineTo( x, y + height )
            this.lineTo( x,y )
          this.closePath()
          return this
        },
        shapes: {
          Shape : function() {
            var sqr = {
              ctx: that,
              stroke: null,
              fill: 'gray',
              mods:[],
              _update: function() {
        				for( var i = 0; i < this.mods.length; i++ ) {
        					var mod = this.mods[ i ],
                      val,
                      prop,
                      upper,
                      newVal

                  val  = this[ mod.name ]()
                  upper = mod.name.toUpperCase()
  
        					switch( mod.type ) {
        						case "+":
        							newVal = typeof mod.modulator === "number" ?  val + mod.modulator * mod.mult : val + mod.modulator.getValue() * mod.mult
        							break
        						case "++":
        							newVal += typeof mod.modulator === "number" ? val + Math.abs( mod.modulator * mod.mult) : val + Math.abs( mod.modulator.getValue() * mod.mult )
        							break							
        						case "-" :
        							newVal = typeof mod.modulator === "number" ? val - mod.modulator * mod.mult : val - mod.modulator.getValue() * mod.mult
        							break
        						case "=":
        							newVal = typeof mod.modulator === "number" ? mod.modulator : mod.modulator.getValue() * mod.mult
        							break
        						default:
        						break;	
        					}
                  this[ mod.name ]( newVal )
                }
              },
              remove: function() {
                that.graph.splice( that.graph.indexOf( this ), 1 )
              },
              changeZ : function( v ) {
                z  = v
              },
        			mod : function( _name, _modulator, _type, _mult ) {
        				this.mods.push({ name:_name, modulator:_modulator, type:_type || "+", mult: _mult || 1 })

                return this
        			},

              removeMod : function( name ) {
                if( name ) {
                  for( var i = this.mods.length - 1; i >= 0; i-- ) {
                    var m = this.mods[ i ]
                    if( m.name === name ) {
                      this.mods.splice( i, 1 )
                      //break
                    }
                  }
                }else{
                  this.mods = []
                }
              }
            }
  
            that.shouldClear = true
  
            var x = 0,
                y = 0,
                width = height = .2,
                z = that.graph.length;

            Object.defineProperties( sqr, {
              'x': { 
                configurable: true,
                get: function() { return x },
                set: function(v) { x = v; }
              },
              'y': {
                configurable: true, 
                get: function() { return y },
                set: function(v) { y = v; }
              },
              'z': { 
                get: function() { return z },
                set: function(v) { 
                  that.reorderGraph() 
                  that.graph.splice( that.graph.indexOf( this ),1 )
                  that.graph.splice( v, 0, this )
                  z = v
                }
              },
            })
            
            var zeroToOne = { min:0, max:1, timescale:'graphics', output:Gibber.LINEAR },
                mappings = {
                  x: that.zeroToOne,
                  y: that.zeroToOne,
                }

            Gibber.createProxyProperties( sqr, mappings )
  
            that.graph.push( sqr )
  
            return sqr
          },
          Rectangle : function() {
            var rect = that.shapes.Shape(),
                mappings = {
                  width: that.zeroToOne,
                  height: that.zeroToOne
                }
    
            rect.draw = function() {
              that.rectangle( Math.floor(this.x() * that.width), Math.floor(this.y() * that.height), Math.floor(this.width() * that.width), Math.floor(this.height() * that.height) )
              if( this.stroke ) that.stroke( this.stroke )
              if( this.fill   ) that.fill( this.fill )
            }
    
            var width = height = .2
            Object.defineProperties( rect, {
              'width': {
                configurable: true,
                get: function() { return width },
                set: function(v) { width = v; }
              },
              'height': {
                configurable: true,
                get: function() { return height },
                set: function(v) { height = v; }
              },
            })

            Gibber.createProxyProperties( rect, mappings )
    
            if( typeof arguments[0] === 'object' ) $.extend( rect, arguments[0] )
    
            return rect
          },
  
          Polygon: function() {
            var shape = that.shapes.Shape(),
                mappings = {
                  radius: that.zeroToOne,
                  sides: { min:3, max:20, output:Gibber.LINEAR, timescale:'graphics' }
                }
    
            shape.draw = function() {
              that.polygon( Math.floor(this.x() * that.width), Math.floor(this.y() * that.height), Math.floor(this.radius() * that.width), this.sides() )
              if( this.stroke ) that.stroke( this.stroke )
              if( this.fill   ) that.fill( this.fill )
            }
    
            var radius = .2, sides = 5
            Object.defineProperties( shape, {
              'radius': {
                configurable: true,
                get: function() { return radius },
                set: function(v) { radius = v; }
              },
              'sides': {
                configurable: true,
                get: function() { return sides },
                set: function(v) { sides = v; }
              },
            })

            Gibber.createProxyProperties( shape, mappings )
    
            if( typeof arguments[0] === 'object' ) $.extend( shape, arguments[0] )
    
            // console.log( 'SHAPE', shape, shape.draw )
            return shape
          }
        },
        zeroToOne: { min:0, max:1, timescale:'graphics', output:Gibber.LINEAR },
        reorderGraph : function() {
          if( z > v ) {
             for( var i = v; i < that.graph.length; i++ ){ 
               that.graph[i].changeZ( that.graph[i].z + 1 )
             }
          }
        },
        graph : [],
        update: function() { this.texture.needsUpdate = true; return this },
        polygon: function( x,y,radius,sides ) {
          var ca  = 360 / sides
  
          for( var i = 1; i <= sides; i++ ) {
            var angle = ca * i,
                radians = Math.PI * 2 * ( angle / 360 ),
                _x = Math.round( Math.sin( radians ) * radius ) + x,
                _y = Math.round( Math.cos( radians ) * radius ) + y
    
            if( i === 1 ) {
              this.beginPath()
              this.moveTo( _x, _y )
            }else{
              this.lineTo( _x, _y )
            }
          }
          var angle = ca,
              radians = Math.PI * 2 * ( angle / 360 ),
              _x = Math.round( Math.sin( radians ) * radius ) + x,
              _y = Math.round( Math.cos( radians ) * radius ) + y   
  
          this.lineTo( _x, _y )
          this.closePath()
          return this
        },
        randomColor : function() {
          return "#" + Math.random().toString(16).slice(2, 8)
        },
        width:canvas.width,
        height:canvas.height,
        sprite : null,
        createSprite: function() {
          that.texture = new Graphics.THREE.Texture( canvas ),
            
          that.sprite = new Graphics.THREE.Mesh(
            new Graphics.THREE.PlaneGeometry( canvas.width, canvas.height, 1, 1),
            new Graphics.THREE.MeshBasicMaterial({
              map:that.texture,
              affectedByDistance:false,
              useScreenCoordinates:true
            })
          )

          that.sprite.position.x = that.sprite.position.y = that.sprite.position.z = 0
          that.texture.needsUpdate = true 
  
          return that.sprite
        }
        // hide: function() {
        //   if( Graphics.scene ) Graphics.scene.remove( that.sprite )
        //   Graphics.graph.splice( that, 1 )
        // },
        // show : function() {
        //   Graphics.scene.add( that.sprite )
        //   Graphics.graph.push( that )
        // }
      })

      cnvs = that

      Object.defineProperties( that, {
        fps: {
          get: function() { return Graphics.fps !== null ? Graphics.fps : 60 },
          set: function(v) { Graphics.fps = v },
        },
        alpha: {
          get : function() { return this.globalAlpha },
          set : function(v) { this.globalAlpha = v }
        }
      })

      return that
    }
  }

  // window.Canvas = TwoD.Canvas
  // window.Rectangle = function() {
  //   var args = Array.prototype.slice.call( arguments, 0 )
  //   
  //   if( !Graphics.canvas2d ) TwoD.Canvas()
  //   
  //   return Graphics.canvas2d.shapes[ 'Rectangle' ].apply( null, args )
  // }
  // 
  // window.Polygon = function() {
  //   var args = Array.prototype.slice.call( arguments, 0 )
  //   
  //   if( !Graphics.canvas2d ) TwoD.Canvas()
  //   
  //   return Graphics.canvas2d.shapes[ 'Polygon' ].apply( null, args )
  // }
  
  return TwoD
}
},{"../dollar":21}],24:[function(_dereq_,module,exports){
module.exports = function( Gibber, Graphics ) {
  "use strict"
  
  var $ = _dereq_('../dollar')
  
  var ThreeD = function( container ) {    
    var that = $.extend( {}, {
      canvas : null,
      ctx : null,
      initialized :false,
      renderer: null,
      scene: null,
      camera: null,
      lights: [],
      running: false,
      init : function() {
        this.container = Graphics.getContainer( container )
        
        this.createRenderer()
        this.createScene()
        this.createLights()        
        
        if( !Graphics.running ) {
          Graphics.start()
        }
        
        this.show()
        this.initialized = true
        this.running = true
        
        Graphics.mode = '3d'
      },
      
      setSize: function( w, h ) {
        this.renderer.setSize( w, h );
        this.renderer.domElement.style.width = w + 'px'
        this.renderer.domElement.style.height = h + 'px'        
        
        this.createCameras()
      },
      
      _update : function() {        
        if( this.initialized ) {
          this.renderer.clear()

          if( Graphics.PostProcessing && Graphics.PostProcessing.fx.length ) {
            Graphics.PostProcessing.composer.render()
          }else{
            this.renderer.render( this.scene, this.camera )
          }
        }
      },
      
      createRenderer: function() {
        if( this.renderer !== null ) return
        
        this.renderer = new Graphics.THREE.WebGLRenderer();
    
        if( this.container.append ) {
          this.container.append( this.renderer.domElement )
        }else{
          this.container.appendChild( this.renderer.domElement )
        }
        
        this.canvas = this.renderer.domElement
        
        //Graphics.sizeCanvas( this.canvas )
      },
      
      createScene : function() {
        if( this.scene !== null ) return
    		this.scene = new Graphics.THREE.Scene();
      },
      
      createCameras: function() {
        if( this.camera === null ) {
    		  var VIEW_ANGLE = 45,
    		  	  ASPECT = Graphics.width / Graphics.height,
    		  	  NEAR = 0.1,
    		  	  FAR = 10000;
            
         	this.camera = new Graphics.THREE.PerspectiveCamera(
    		    VIEW_ANGLE,
    		    ASPECT,
    		    NEAR,
    		    FAR
    		  )
        
          this.scene.add( this.camera );
        }
        
        this.camera.updateProjectionMatrix();
        this.camera.position.z = 250;
        this.camera.lookAt( this.scene.position )
      },
      
      createLights: function() {
        if( this.lights.length > 0 ) return 
        
        this.ambientLight = new Graphics.THREE.AmbientLight(0xFFFFFF);

    		this.pointLight = new Graphics.THREE.PointLight( 0xFFFFFF )
    		this.pointLight.position.x = 100
    		this.pointLight.position.y = 100
    		this.pointLight.position.z = -130

    		this.pointLight2 = new Graphics.THREE.PointLight( 0x666666 )
    		this.pointLight2.position.x = 0
    		this.pointLight2.position.y = 0
    		this.pointLight2.position.z = 260

    		this.lights = [ this.pointLight, this.pointLight2 ]
        this.scene.add( this.pointLight );
        this.scene.add( this.pointLight2 );
        // this.scene.remove( this.ambientLight );
      },
      
      remove : function() {
        that.hide()
        that.running = false
      },
      show: function() { that.canvas.style.display = 'block' },
      hide: function() { that.canvas.style.display = 'none'  },
    })      
        
    return that
  }
  
  return ThreeD
}
},{"../dollar":21}],25:[function(_dereq_,module,exports){
var $ = _dereq_('../dollar' )

module.exports = function( Gibber, Graphics, THREE ){ 

"use strict"

var parametricFunc = function() {
  var points = rndf(-50,50,3)
  
  return { x:points[0], y:points[1], z:points[2] }
}

var types = [
  [ 'Vec2', 'Vector2', 'vec2' ],
  [ 'Vec3', 'Vector3', 'vec3' ],
  [ 'Vec4', 'Vector4', 'vec4' ],    
]
.forEach( function( element, index, array ) {
  var type = element[ 0 ],
    threeType = element[ 1 ] || element[ 0 ],
    shaderType = element[ 2 ] || 'f'
  
  // TODO: de-globalize this
  window[ type ] = function() {
    var args = Array.prototype.slice.call( arguments, 0 ),
        obj
    
    if( Array.isArray( args[0] ) ) {
      var _args = []
      for( var i = 0; i < args[0].length; i++ ) {
        _args[ i ] = args[0][ i ]
      }
      args = _args
    }    
        
    obj = Gibber.construct( THREE[ threeType ], args )
    
    obj.name = type
    obj.shaderType = shaderType
    
    return obj
  }
})

var types = {
      Cube:  { width:50, height:50, depth:50 },
      Sphere: { radius:50, segments:16, rings: 16 },
      Tetrahedron: { radius:50, detail: 0 },
      Octahedron: { radius:50, detail: 0 },
      Icosahedron: { radius:50, detail: 0 },
      Cylinder: { radiusTop:20, radiusBottom:20, height:100, radiusSegments:8, heightSegments:1, openEnded:false},
      Parametric: { func: parametricFunc, slices:8, stacks:8 },
      
      Torus:  { radius:50, tube:10, radialSegments:8, tubularSegments:8, arc:Math.PI * 2 },
      TorusKnot: { radius: 50, tube:5, radialSegments:64, tubularSegments: 8, p:5, q:3, heightScale:1 },
      Plane: { width:1, height:1, segmentsWidth:1, segmentsHeight:1 },
    },
    vectors = [ 'rotation', 'scale', 'position' ],
    processArgs = function( args, type, shape ) {
     var _args = Gibber.processArguments( args, type ),
         out
  
     if( typeof args[0] === 'object' ) {
       out = []
       for( var argsKey in shape ) {
         var pushValue = typeof args[0][ argsKey ] !== 'undefined' ? args[0][ argsKey ] : shape[ argsKey ]
         out.push( pushValue )
       }
       for( var arg in args[ 0 ] ) {
         if( ! shape[arg] ) {
           out[ arg ] = args[ 0 ][ arg ]
         }
       }
     }else if( Array.isArray( args )){
       out = args
     }else{
       out = []
       for( var argsKey in shape ) {
         out.push( shape[ argsKey ] )
       }
     }
  
     return out
   },
   mappingProperties = {
     rotation: {
       min: 0, max: Math.PI * 2,
       output: Gibber.LINEAR,
       wrap: true,       
       timescale: 'graphics',
     },
     scale: {
       min: 0, max: 2,
       output: Gibber.LINEAR,
       wrap: false,
       timescale: 'graphics',
     },
     position: {
       min: -100, max: 100,
       output: Gibber.LINEAR,
       wrap: false,
       timescale: 'graphics',
     }
   }

var Geometry = {
  export: function( target ) {
    $.extend( target, Geometry )
  }
}

for( var key in types) {

  (function() {
    var type = key,
        shape = types[ key ]
    var constructor = function() {
      if( Graphics.modes['3d'].obj === null ) { //|| Graphics.canvas !== Graphics.canvas3D ){
        Graphics.init( '3d', null )
      }else{
        Graphics.modes['3d'].obj.show()
        Graphics.mode = '3d'
      }/*else if( Graphics.mode === '2d' ) {
        Graphics.init('3d', null, false)
        //Graphics.use( '3d' )
      }else{
        //Graphics.canvas3D.style.display = 'block'
      }*/
      
      Graphics.running = true 

      var args = processArgs( arguments, type, shape )

      this.name = type
      
      if( args.color && $.isArray( args.color) ) { 
        var v = args.color
        args.color = Color().rgb( v[0] * 255, v[1] * 255, v[2] * 255 ).hexString()
      }
      this.color =    new THREE.Color( args.color ) || new THREE.Color(0xffffff)
      
      var hasShader = typeof arguments[0] !== 'undefined' && arguments[0].shader
      
      if( !hasShader) {
        if( !args.texture ) {
          this.material = new THREE.MeshPhongMaterial( { color: this.color, shading: THREE.FlatShading, shininess: 50 } )
        }else{
          this.material = new THREE.MeshBasicMaterial({ map: args.texture, affectedByDistance:false, useScreenCoordinates:true })
        }
      }else{
        this.material = new THREE.ShaderMaterial( arguments[0].shader.material || arguments[0].shader );
        if( arguments[0].shader.material ) arguments[0].shader.target = this
      }
      this.geometry = Gibber.construct( THREE[ type + "Geometry" ], args )
      
      this.mesh = new THREE.Mesh( this.geometry, this.material )

      this.spinX = this.spinY = this.spinZ = 0
      
      this.seq = {}//Gibber.Seq()
    
      this.mappingProperties = mappingProperties
      this.mappingObjects = []
      
      var ltrs = { x:'X', y:'Y', z:'Z' }
      for( var i = 0; i < vectors.length; i++ ) {
        
        (function( obj ) { // for each vector rotation, scale, position
          var prop = vectors[ i ],
              property = prop === 'scale' ? Vec3(1, 1, 1) : Vec3(),
              update = function() { 
                //console.log( property.toArray() )
                obj.mesh[ prop ].set( property.x(), property.y(), property.z() )
                //obj.mesh[ prop ].set.apply( obj.mesh[ prop ], property.toArray() ) 
              },
              x = property.x, y = property.y, z = property.z
          
          Object.defineProperties( property, {
            x: { get: function() { return x }, set: function(v) { x = v; update() }, configurable:true },
            y: { get: function() { return y }, set: function(v) { y = v; update() }, configurable:true },
            z: { get: function() { return z }, set: function(v) { z = v; update() }, configurable:true },
          })
          
          property.name = type + '.' + prop
          
          for(var _ltr in ltrs) {
            (function() {
              var ltr = _ltr,
                  Ltr = ltrs[ ltr ],
                  propertyDict = mappingProperties[ prop ],
                  propertyName = prop + ltr,
                  mapping = $.extend( {}, propertyDict, {
                    Name  : Ltr,
                    name  : ltr,
                    modName : prop + '.' + ltr,
                    type  : 'mapping',
                    value : property[ ltr ],
                    object: property,
                    modObject: obj,
                    targets:[],
                    oldSetter: property.__lookupSetter__( ltr ),
                    oldGetter: property.__lookupGetter__( ltr ),            
                    set : function( val )  { property[ ltr ] = val },
                  }),
                  fnc
              
              mapping.object = property
              
              fnc = obj[ '_' + propertyName ] = function(v) {
                if( typeof v !== 'undefined' ) {
                  mapping.value = v
                  mapping.oldSetter( mapping.value ) 
                }
                  
                return mapping.value
              }
    
              fnc.set = function(v) { 
                mapping.value = v; 
                mapping.oldSetter( mapping.value ) 
              }
    
              fnc.valueOf = function() { return mapping.value }
              
              Object.defineProperty( property, Ltr, {
                get: function()  { return mapping },
                set: function(v) { 
                  property[ Ltr ] = v 
                }
              })
              
              Object.defineProperty( property, ltr, {
                get: function() { return obj[ '_' + propertyName ] },
                set: function(v) {
                  if( typeof v === 'object' && v.type === 'mapping' ) {
                    Gibber.createMappingObject( mapping, v )
                  }else{
                    if( mapping.mapping ) mapping.mapping.remove()
                    obj[ '_' + propertyName ]( v )
                  }
                }
              })
              
              Gibber.defineSequencedProperty( obj, '_' + propertyName )
              Gibber.defineRampedProperty( obj, '_' + propertyName )
            })()
          }
                    
          var propertyDict = mappingProperties[ prop ], 
              mapping
              
          mapping = $.extend( {}, propertyDict, {
            Name  : prop.charAt(0).toUpperCase() + prop.slice(1),
            name  : prop,
            type  : 'mapping',
            value : property,
            object: obj,
            targets:[],
            oldSetter : function(v) {
              switch( $.type( v ) ) {
                case 'object' :
                  if(typeof v.x === 'number') property.x = v.x
                  if(typeof v.y === 'number') property.y = v.y
                  if(typeof v.z === 'number') property.z = v.z
                break;
                case 'array' :
                  if(typeof v[0] === 'number') property.x = v[ 0 ]
                  if(typeof v[1] === 'number') property.y = v[ 1 ]
                  if(typeof v[2] === 'number') property.z = v[ 2 ]
                  break;
                case 'number' :
                  x = y = z = v
                  break;
              }
              update()
            }
          })

          Object.defineProperty( obj, prop, {
            get: function() { return property },
            set: function(v) {
              if( mapping.mapping ) mapping.mapping.remove()
              switch( $.type( v ) ) {
                case 'object' :
                  if( v.type === 'mapping' ) {
                    Gibber.createMappingObject( mapping, v )
                  }else{
                    if(typeof v.x === 'number') property.x = v.x
                    if(typeof v.y === 'number') property.y = v.y
                    if(typeof v.z === 'number') property.z = v.z
                  }
                  break;
                case 'array' :
                  if(typeof v[0] === 'number') property.x = v[ 0 ]
                  if(typeof v[1] === 'number') property.y = v[ 1 ]
                  if(typeof v[2] === 'number') property.z = v[ 2 ]
                  break;
                case 'number' :                  
                  property.x = property.y = property.z = v
                  break;
              }
              update()
            },            
          })
                    
          Object.defineProperty( obj, mapping.Name, {
            get: function() { return mapping },
            set: function(v) {
              if( typeof v === 'object' && v.type === 'mapping' ) {
                Gibber.createMappingObject( mapping, v )
              }
            }
          })
          
          property.mappings = []
          Gibber.defineSequencedProperty( obj, prop )
          Gibber.defineRampedProperty( obj, prop )
          
        })( this )
        
      }
      
      this.update = function() {}
          
			this._update = function() {
				for( var i = 0; i < this.mods.length; i++ ) {
					var mod = this.mods[ i ],
              val,
              prop,
              upper,
              newVal
          
          if( mod.name.indexOf( '.' ) > -1 ) {
            var parts = mod.name.split( '.' )
            val  = this[ parts[ 0 ] ][ parts[ 1 ] ]()
            upper = parts[ 1 ].toUpperCase()
            
  					switch( mod.type ) {
  						case "+":
  							newVal = typeof mod.modulator === "number" ?  val + mod.modulator * mod.mult : val + mod.modulator.getValue() * mod.mult
  							break
  						case "++":
  							newVal += typeof mod.modulator === "number" ? val + Math.abs( mod.modulator * mod.mult) : val + Math.abs( mod.modulator.getValue() * mod.mult )
  							break							
  						case "-" :
  							newVal = typeof mod.modulator === "number" ? val - mod.modulator * mod.mult : val - mod.modulator.getValue() * mod.mult
  							break
  						case "=":
  							newVal = typeof mod.modulator === "number" ? mod.modulator : mod.modulator.getValue() * mod.mult
  							break
  						default:
  						break;	
  					}
            
            this[ parts[ 0 ] ][ parts[1] ].set( newVal )
            
          }else{
            var modValue = typeof mod.modulator === "number" ? mod.modulator : mod.modulator.getValue()
            
  					switch(mod.type) {
  						case "+":
                this[ mod.name ].x += modValue * mod.mult
                this[ mod.name ].y += modValue * mod.mult
                this[ mod.name ].z += modValue * mod.mult

  							break
  						case "++":
                this[ mod.name ].x += Math.abs( modValue * mod.mult )
                this[ mod.name ].y += Math.abs( modValue * mod.mult )
                this[ mod.name ].z += Math.abs( modValue * mod.mult )

  							break							
  						case "-" :
                this[ mod.name ].x -= modValue * mod.mult 
                this[ mod.name ].y -= modValue * mod.mult 
                this[ mod.name ].z -= modValue * mod.mult

  							break
  						case "=":
                this[ mod.name ].x = modValue * mod.mult 
                this[ mod.name ].y = modValue * mod.mult 
                this[ mod.name ].z = modValue * mod.mult                

  							break
  						default:
  						break;	
  					}
          }
				}
			}
      
			this.mods = []
      
      this.remove = this.kill = function(shouldNotRemove) {
        Graphics.modes['3d'].obj.scene.remove( this.mesh )
        if( !shouldNotRemove )
          Graphics.graph.splice( Graphics.graph.indexOf( this ), 1 )
          
        return this
      }
      
      this.replaceWith = function( newObj ) { this._ }
      
			this.mod = function( _name, _modulator, _type, _mult ) {
				this.mods.push({ name:_name, modulator:_modulator, type:_type || "+", mult: _mult || 1 })
        
        return this
			}
      
      this.removeMod = function( name ) {
        if( name ) {
          for( var i = this.mods.length - 1; i >= 0; i-- ) {
            var m = this.mods[ i ]
            if( m.name === name ) {
              this.mods.splice( i, 1 )
              //break
            }
          }
        }else{
          this.mods = []
        }
      }
      
      this.ramp = function( prop, from, to, time ) {
        if( arguments.length === 3 ) {
          time = to
          to = from
          from = this[ prop ]
        }        
      }
      
      this.spin = function( x,y,z ) {
        if( arguments.length === 1 ) {
          if( x !== 0 ) {
            this.mod('rotation', x )
          }else{
            this.removeMod('rotation', 0 )
            this.removeMod('rotation.x', 0 )
            this.removeMod('rotation.y', 0 )
            this.removeMod('rotation.z', 0 )
          }
        }else if( arguments.length === 0){
          this.removeMod( 'rotation' )
        }else{
          if( x !== 0 ) {
            this.mod( 'rotation.x', x )
          }else{
            this.removeMod( 'rotation.x' )
          }
          if( y !== 0 ) {
            this.mod( 'rotation.y', y )
          }else{
            this.removeMod( 'rotation.y' )
          }
          if( z !== 0 ) {
            this.mod( 'rotation.z', z )
          }else{
            this.removeMod( 'rotation.z' )
          }
        }
        return this
      }
      
      if( arguments[0] ) {
        if( arguments[0].scale ) this.scale = arguments[0].scale
        if( arguments[0].rotation ) this.scale = arguments[0].rotation
        if( arguments[0].position ) this.scale = arguments[0].position
      }
                
      Graphics.modes[ '3d' ].obj.scene.add( this.mesh )
      Graphics.graph.push( this )
      
      this.mappings = []
      
      Object.defineProperty( this, '_', {
        get: function() { 
          if( this.seq.isRunning ) this.seq.disconnect()  
      
          for( var i = 0; i < this.mappings.length; i++ ) {
            this.mappings[ i ].remove() 
          }
      
          if( this.clearMarks ) // check required for modulators
            this.clearMarks()
            
          this.remove(); 
          console.log( type + ' is removed.' ) 
        },
        set: function() {}
      })
      
      Object.defineProperty( this, 'color', {
        get: function() { return this.material.color },
        set: function(v) {
          if( $.isArray( v ) ) {
            v = Color().rgb( v[0] * 255, v[1] * 255, v[2] * 255 ).hexString()
          }
          console.log( "COLOR", v )
          this.material.color.set( v )
          
        }
      })
      
      this.toString = function() { return this.name }
      
      console.log( type + ' is created.' )
    } 

    Geometry[ type ] = function() { // wrap so no new keyword is required
      return Gibber.construct( constructor, arguments )
    }

  })()
}

//$.extend( window, Gibber.Graphics.Geometry )

//window.Knot = window.TorusKnot
//delete window.TorusKnot 

Geometry.Knot = Geometry.TorusKnot

return Geometry; 

}

},{"../dollar":21}],26:[function(_dereq_,module,exports){
module.exports = function( Gibber, Graphics ) {

"use strict"
    
var processArgs = function( args, type, shape ) {
   var _args = Gibber.processArguments( args, type ),
       out

   if( typeof args[0] === 'object' ) {
     out = []
     for( var argsKey in shape ) {
       var pushValue = typeof args[0][ argsKey ] !== 'undefined' ? args[0][ argsKey ] : shape[ argsKey ]
       out.push( pushValue )
     }
   }else if( Array.isArray( args )){
     out = args
   }else{
     out = []
     for( var argsKey in shape ) {
       out.push( shape[ argsKey ] )
     }
   }

   return out
}
// _mappingProperties = {
//   Bleach : {
//     opacity: {
//       min: 0, max: 1,
//       output: Gibber.LINEAR,
//       timescale: 'graphics',
//     }
//   },
//   Shader : {
//     amp:{
//       min:0, max:1,
//       output: Gibber.LINEAR,
//       timescale: 'graphics',
//     },
//     time:{
//       min:0, max:1,
//       output: Gibber.LINEAR,
//       timescale: 'graphics',
//     },
//   }
// }
// defaultFragment = [
//   "uniform lowp float amp;",
//   "uniform sampler2D tDiffuse;",
//   "uniform lowp float time;",
//   "varying lowp vec2 p;",
//   "",
//   "void main() {",
//   "  gl_FragColor = texture2D( tDiffuse, p ).rgba;",
//   "}"
// ].join('\n'),
// defaultVertex = [
//   "varying vec2 p;",
//   "void main() {",
//     "p = uv;",
//     "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
//   "}"
// ].join("\n")
  
var Shaders = {
  Stripes : function() {
    var frag = [
    "varying vec2 p;",
    "uniform float xCount;",
    "uniform float yCount;",
    "uniform float blend;",    
    "uniform sampler2D tDiffuse;",
    "uniform vec3 colorX;",
    "uniform vec3 colorY;", 
    "",
    "void main() {",
    "  vec3 color;",     
    "  float x = p.x * xCount;",
    "  float y = p.y * yCount;",
    "	 int stripeX = int(mod( x, 2.));",
    "	 int stripeY = int(mod( y, 2.));",
    "",    
    "  if( stripeX == 1 || stripeY == 1) {",
    "    color = colorX;",
    "  }else{",
    "    color = vec3(0., 0., 0.);",
    "  }",
    "",
    "  vec3 prev = texture2D( tDiffuse, p ).rgb;",
    "  gl_FragColor = vec4( mix(color, prev, blend), 1. );",
    "}",
    ].join('\n')
    
    var shader = Shader( frag )
    shader.uniform( 'xCount', 4, 1, 100, 'float' )
    shader.uniform( 'yCount', 4, 1, 100, 'float' )
    shader.uniform( 'blend', 0, 1, 0, 'float' )
    
    shader.uniforms.colorX = { type:'c', value:{ r:1, g:1, b:1 } }
    shader.uniforms.colorY = { type:'c', value:{ r:1, g:1, b:1 } }
    
    Object.defineProperties( shader, {
      colorX: {
        get: function()  { return shader.uniforms.colorX.value },
        set: function(v) { shader.uniforms.colorX.value = Color(v) }        
      },
      colorY: {
        get: function()  { return shader.uniforms.colorY.value },
        set: function(v) { shader.uniforms.colorY.value = Color(v) }
      }
    })
    
    return shader
  },
  
  Circles : function() {
    var frag = [
    "uniform float time;",
    "uniform float thickness;",
    "uniform float speed;",
    "uniform float radius;",
    "uniform float x;",
    "uniform float y;",
    "uniform sampler2D tDiffuse;",
    "uniform vec3 color;",
    "varying vec2 p;",
    "",
    "void main() {",
    "  vec2 uv = 2. * p - 1.;",
    "  float _speed = 20. * speed;",
    "  float edgeDistance = radius * thickness;",
    "  float dist = distance( p, vec2(x,y) );",
    "  float growth = mod(time, 1.) / -_speed;",
    "",
    "  float moddist = mod( dist + growth, radius );",
    "  float _out = smoothstep( moddist, moddist+edgeDistance, radius / 2. );",
    "  _out += smoothstep( moddist, moddist-edgeDistance, radius / 2.);",
    "",
    "  gl_FragColor = vec4( vec3(1.- _out), 1. );",
    "}",
    ].join('\n')
    
    var shader = Shader( frag )
    shader.uniform( 'blend', 1, 0, 1, 'float' )
    shader.uniform( 'thickness', .1, 0, 1, 'float' )
    shader.uniform( 'x', .5, 0, 1, 'float' )
    shader.uniform( 'y', .5, 0, 1, 'float' )
    shader.uniform( 'speed', 1, -1, 1, 'float' )               
    shader.uniform( 'radius', .05, 0, 1, 'float' )
    
    shader.uniforms.color = { type:'c', value:{ r:1, g:0, b:0 } }
    // shader.uniforms.colorY = { type:'c', value:{ r:1, g:1, b:1 } }
    // 
    
    var oldSpeedSet = shader.__lookupSetter__('speed'), oldSpeedGet = shader.__lookupGetter__('speed')
    Object.defineProperties( shader, {
      speed: {
        get: function() { return oldSpeedGet() },
        set: function(v) {
          v = v > 0 ? 1 - v : -1 - v
          oldSpeedSet( v )
        }
      }
    })
    //   colorX: {
    //     get: function()  { return shader.uniforms.colorX.value },
    //     set: function(v) { shader.uniforms.colorX.value = v }        
    //   },
    //   colorY: {
    //     get: function()  { return shader.uniforms.colorY.value },
    //     set: function(v) { shader.uniforms.colorY.value = v }        
    //   }
    // })
    return shader
  },
  Pixellate : function() {
    var frag = [
  		"uniform sampler2D tDiffuse;",
  		"uniform float amount;",
  		"uniform float blend;",
  		"varying vec2 vUv;",
  		"void main() {",
  		"	vec2 sd = vec2( amount );",
  		"	vec2 samplePos = vUv - mod( vUv, sd );",
  		"	vec4 p = texture2D( tDiffuse, samplePos );",
  		"	vec4 pp = texture2D( tDiffuse, vUv );",
  		"	vec3 _blend = (p.rgb * vec3( blend ) ) + ( pp.rgb * vec3(1.0 - blend ) );",
  		"	gl_FragColor = vec4( _blend, 1. );",
  		"}"
    ].join('\n')
    
    var vert = [
			"varying vec2 vUv;",
			"void main() {",
			"	vUv = uv;",
			"	gl_Position = vec4( position[0],position[1],position[2], 1.0 );",
			"}"
		].join("\n")
    
    var shader = Shader( frag, vert )
    shader.uniform( 'amount', .01, 0, 1, 'float' )
    shader.uniform( 'blend', 1, 0, 1, 'float' )
  
    return shader
  },
  export: function( target ) {
    target.Pixellate = Shaders.Pixellate
    target.Stripes = Shaders.Stripes
    target.Circles = Shaders.Circles
  },
}


return Shaders

// for( var key in Shaders ) {
//   window[ key ] = Shaders[ key ]
// }

//$.extend( window, Gibber.Graphics.Geometry )

}
},{}],27:[function(_dereq_,module,exports){
!function() {

"use strict"

var $ = _dereq_('../dollar'),

Graphics = {
  Color: _dereq_( 'color' ),
  canvas :  null,
  canvas2D: null,
  canvas3D: null,
  ctx:      null,
  width:    0,
  height:   0,
  running:  false,
  resolution: 1,
  fps: null,
  graph: [],
  initialized: false,
  defaultContainer: 'body',
  THREE: _dereq_('../../external/three/three.min'),
  
  export: function( target ) {
    Graphics.Geometry.export( target )
    Graphics.modes['2d'].constructor.export( target )
    //target.Canvas = Graphics.modes['2d'].constructor
    Graphics.PostProcessing.export( target )
    Graphics.GibberShaders.export( target )
    target.Video = Graphics.Video
  },
  
  getContainer: function( _container ) {
    var container
    if( typeof _container === 'undefined' || _container === null ) {
      container = document.querySelector( Graphics.defaultContainer )
    }else{
      container = _container.element
    }
    
    return container
  },
  
  init : function( mode, container ) { 
    if( mode === '3d' && !window.WebGLRenderingContext ) {
      var msg = 'Your browser does not support WebGL.' + 
                '2D drawing will work, but 3D geometries and shaders are not supported.'
        
      Gibber.Environment.Message.post( msg )
    }
    
    this.mode = mode || '3d'

    if( this.modes[ this.mode ].canvas === null ) {
                                    //Graphics.modes['2d'].constructor()
      this.modes[ this.mode ].obj = this.modes[ this.mode ].constructor( container )
      // if( this.mode === '2d' ) {
      //   this.modes[ '2d' ].canvas = this.modes[ this.mode ].obj
      // }
    }
    
    if( this.modes[ this.mode ].obj.init ) { this.modes[ this.mode ].obj.init() }
    
    if( this.modes[ this.mode ].canvas !== null ) {
      this.canvas = this.modes[ this.mode ].canvas
    }else{
      this.canvas = this.modes[ this.mode ].canvas = this.modes[ this.mode ].obj.canvas
    }
    
    if( typeof container === 'undefined' || container === null ) {
      this.canvas.parent = document.querySelector( Graphics.defaultContainer )
    }else{
      this.canvas.parent = container.element
      //container.element.find( '.editor' ).remove()
    }
    
    this.sizeCanvas( this.canvas )
    this.assignWidthAndHeight( true )
    
    this.modes[ this.mode ].obj.setSize( this.width * this.resolution, this.height * this.resolution )
    
    //Graphics.sizeCanvas( this.canvas )
    
    //console.log( this.mode )
    
    // if( !this.noThree ) {
    //   try{
    //     console.log( 'creating scene....')
    //     this.createScene( this.mode )
    //   }catch(e) {
    //     console.log(e)
    //     this.noThree = true
    //     console.log( 'Your browser supports WebGL but does not have it enabled. 2D drawing will work, but 3D geometries and shaders will not function until you turn it on.' )
    //     //Gibber.Environment.Message.post( 'Your browser supports WebGL but does not have it enabled. 2D drawing will work, but 3D geometries and shaders will not function until you turn it on.' )
    //   }finally{
    //     if( this.noThree ) {
    //       this.canvas2D = this.canvas
    //     }else{
    //       this.canvas3D = this.canvas
    //     }
    //   }
    // }else{
    //   this.canvas2D = this.canvas
    // }
    
    var res = this.resolution, self = this
    Object.defineProperty(this, 'resolution', {
      get: function() { return res; },
      set: function(v) { res = v; self.assignWidthAndHeight() }
    });

    var running = false
    Object.defineProperty(this, 'running', {
      get: function() { return running },
      set: function(v) {
        if( v !== running ) {
          if( running === true ) { // switching to false, clear screen
            self.render()
            running = v
          }else{ // switching to true, restart animation timer
            running = v
            self.render()
          }
        }
      }
    });
    
    this.start()

    // var resize = function( e, props ) { // I hate Safari on 10.6 for not having bind...
    //   Graphics.width = props.w
    //   Graphics.height = props.h
    //   
    //   Graphics.canvas.css({
    //     top: props.offset,
    //     width: Graphics.width,
    //     height: Graphics.height,
    //     zIndex: -1
    //   })
    // 
    //   Graphics.renderer.setSize( Graphics.width * Graphics.resolution, Graphics.height * Graphics.resolution );
    //   $( Graphics.renderer.domElement ).css({ width: Graphics.width, height: Graphics.height })
    // }
    // 
    // $.subscribe( '/layout/contentResize', resize ) // toggle fullscreen, or toggling console bar etc.
    // 
    // $.subscribe( '/layout/resizeWindow', function( e, props) {
    //   props.h -= $( 'thead' ).height() 
    //   props.h -= $( 'tfoot' ).height()
    //   
    //   resize( null, props )  
    // })
    
    this.initialized = true   
  },
  
  sizeCanvas: function( canvas ) {
    console.log( "SIZING CANVAS", canvas, canvas.parent )
    var body = document.querySelector( 'body' ),
        appendedToBody = canvas.parent === body
        
    canvas.style.left = 0
    canvas.style.top = appendedToBody ? 0 : 32
    canvas.style.position = 'fixed'
    //canvas.style.position = canvas.parent === document ? 'fixed' : 'relative'
    canvas.style.float    = canvas.parent === document ? 'none' : 'left'
    canvas.style.overflow = 'hidden'
    canvas.style.display  = 'block'
    
    if( appendedToBody ) {
      body.style.margin = 0
    }
  },
    
  start : function() {
    this.running = true
		window.requestAnimationFrame( this.render );
  },
  
  useCanvasAsTexture: function( _canvas ) {
    var sprite = _canvas.createSprite()
    //_canvas.hide()
    
    if( !Graphics.initialized ) {
      Graphics.init( '3d' )
    }
    Graphics.use( '2d' )
    Graphics.scene.add( sprite )
  },
  
  clear : function() {
    if( this.running ) {
      for( var i = 0; i < this.graph.length; i++ ) {
        this.graph[ i ].remove( true )
      }

      this.graph.length = 0
      
      console.log("GRAPHICS CLEAR", this.modes )
      
      for( var modeName in this.modes ) {
        var mode = this.modes[ modeName ]
        if( mode.obj ) mode.obj.remove()
      }
      
      if( this.PostProcessing ) { 
        for( var j = this.PostProcessing.fx - 1; j >= 0; j-- ) {
          this.PostProcessing.fx[ j ].remove()
        }
        this.PostProcessing.fx.length = 0
        this.PostProcessing.isRunning = false
      }

      // something in hear messes thigns up...
      //this.canvas.style.display = 'none'
      //this.canvas = null
      //this.ctx = null
      this.running = false
      //this.initialized = false
    }
  },
  render : function() {
    if( this.running ) {
  		for( var i = 0; i < this.graph.length; i++ ) {
  			this.graph[ i ]._update()
  			this.graph[ i ].update()
  		}
      
      this.modes[ this.mode ].obj._update()
      
      if( this.fps === null || this.fps >= 55 ) {
        window.requestAnimationFrame( this.render )
      }else{
        setTimeout( function() { Graphics.render() }, 1000 / this.fps )
      }
    }
  },
  
  test : function() {
    var cube = new Graphics.THREE.CubeGeometry( 50, 50, 50 ),
        fill = new Graphics.THREE.Color( 0x000000 ).setRGB( .5, 0, 0 ),
        mat  = new Graphics.THREE.MeshPhongMaterial( { color: fill, shading: Graphics.THREE.FlatShading, shininess: 50 } ),
        geo  = new Graphics.THREE.Mesh( cube, mat );
				
    this.scene.add( geo )
    this.graph.push( geo )
    
    return geo
  },
  
	showStats : function() {
		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		this.stats.domElement.style.right = '0px';			
		$( 'body' ).append( this.stats.domElement );	
	},
  
  assignWidthAndHeight : function( isInitialSetting ) { // don't run final lines before renderer is setup...
    Graphics.width  = Graphics.canvas.parent === window ? window.innerWidth  : (Graphics.canvas.parent.offsetWidth || Graphics.canvas.parent.width() ) //$( this.canvas.parent ).width() // either column or window... 
    Graphics.height = Graphics.canvas.parent === window ? window.innerHeight : (Graphics.canvas.parent.offsetHeight || document.querySelector('.column').offsetHeight )//$( window ).height()
    
    console.log("GRAPHICS HEIGHT", Graphics.height)
    if( document.querySelector( '#header' ) !== null && Graphics.canvas.parent === window ) {
      if( Gibber.Environment.Layout.fullScreenColumn === null) { 
        //Graphics.height -= $( "#header" ).height() + $( "tfoot" ).height()
      }
    }
    
    if( Graphics.canvas.parent === window ) {
      Graphics.canvas.style.top = document.querySelector( '#header' ) !== null ? document.querySelector( '#header' ).offsetHeight : 0
    }else{
      // var ch = document.querySelector( '.columnHeader' ).offsetHeight
      // Graphics.canvas.style.top = ch
      // Graphics.height -= ch
      // 
      // Graphics.width -= document.querySelector( '.resizeHandle' ).offsetWidth
    }
    
    // console.log( Graphics.width, Graphics.height, Graphics.canvas.style.width, Graphics.canvas.style.height )
    Graphics.canvas.style.zIndex = - 1
    
    // this.canvas.css({
//       top: $( '#header' ).height(),
//       width: this.width,
//       height: this.height,
//       zIndex: -1
//     })
    
    if( !isInitialSetting && Graphics.mode !== '2d' ) {
  		Graphics.renderer.setSize( Graphics.width * Graphics.resolution, Graphics.height * Graphics.resolution );
      Graphics.renderer.domElement.style.width = Graphics.width + 'px'
      Graphics.renderer.domElement.style.height = Graphics.height + 'px'      
      
      //$( this.renderer.domElement ).css({ width: this.width, height: this.height })
    }
  },
  
}

Graphics.render = Graphics.render.bind( Graphics )

module.exports = function( Gibber ) { 
  Graphics.modes = {
    '2d':{
      constructor: _dereq_( './2d' )( Gibber, Graphics ),
      canvas: null,
      obj: null,
    },
    '3d':{
      constructor: _dereq_( './3d' )( Gibber, Graphics ),
      canvas: null,
      obj: null
    }
  }
    
  Graphics.Geometry = _dereq_( './geometry' )( Gibber, Graphics, Graphics.THREE )
  
  _dereq_( '../../external/three/postprocessing/EffectComposer' )
  _dereq_( '../../external/three/postprocessing/RenderPass' )
  _dereq_( '../../external/three/postprocessing/MaskPass' )
  _dereq_( '../../external/three/postprocessing/ShaderPass' )
  _dereq_( '../../external/three/postprocessing/CopyShader' )
  _dereq_( '../../external/three/postprocessing/shaders/DotScreenShader' )
  _dereq_( '../../external/three/postprocessing/DotScreenPass' )
  _dereq_( '../../external/three/postprocessing/FilmPass' )
  _dereq_( '../../external/three/postprocessing/shaders/FilmShader' )
  _dereq_( '../../external/three/postprocessing/shaders/KaleidoShader' )
  _dereq_( '../../external/three/postprocessing/shaders/EdgeShader' )
  _dereq_( '../../external/three/postprocessing/shaders/FocusShader' )
  _dereq_( '../../external/three/postprocessing/shaders/ShaderGodRays' )
  _dereq_( '../../external/three/postprocessing/shaders/BleachBypassShader' )
  _dereq_( '../../external/three/postprocessing/shaders/ColorifyShader' )
  
  Graphics.PostProcessing = _dereq_( './postprocessing' )( Gibber, Graphics )
  Graphics.PostProcessing.init()
  Graphics.Shaders = _dereq_( './shader' )( Gibber, Graphics )
  Graphics.GibberShaders = _dereq_( './gibber_shaders' )( Gibber, Graphics )
  Graphics.Video = _dereq_( './video' )( Gibber, Graphics )
    
  return Graphics; 
}

}()

},{"../../external/three/postprocessing/CopyShader":5,"../../external/three/postprocessing/DotScreenPass":6,"../../external/three/postprocessing/EffectComposer":7,"../../external/three/postprocessing/FilmPass":8,"../../external/three/postprocessing/MaskPass":9,"../../external/three/postprocessing/RenderPass":10,"../../external/three/postprocessing/ShaderPass":11,"../../external/three/postprocessing/shaders/BleachBypassShader":12,"../../external/three/postprocessing/shaders/ColorifyShader":13,"../../external/three/postprocessing/shaders/DotScreenShader":14,"../../external/three/postprocessing/shaders/EdgeShader":15,"../../external/three/postprocessing/shaders/FilmShader":16,"../../external/three/postprocessing/shaders/FocusShader":17,"../../external/three/postprocessing/shaders/KaleidoShader":18,"../../external/three/postprocessing/shaders/ShaderGodRays":19,"../../external/three/three.min":20,"../dollar":21,"./2d":23,"./3d":24,"./geometry":25,"./gibber_shaders":26,"./postprocessing":28,"./shader":29,"./video":30,"color":1}],28:[function(_dereq_,module,exports){
module.exports = function( Gibber, Graphics ) {

"use strict"
    
var processArgs = function( args, type, shape ) {
   var _args = Gibber.processArguments( args, type ),
       out

   if( typeof args[0] === 'object' ) {
     out = []
     for( var argsKey in shape ) {
       var pushValue = typeof args[0][ argsKey ] !== 'undefined' ? args[0][ argsKey ] : shape[ argsKey ]
       out.push( pushValue )
     }
   }else if( Array.isArray( args )){
     out = args
   }else{
     out = []
     for( var argsKey in shape ) {
       out.push( shape[ argsKey ] )
     }
   }

   return out
  },
  _mappingProperties = {
    Dots: {
      angle: {
        min: 0, max: Math.PI * 2,
        output: Gibber.LINEAR,
        wrap: true,       
        timescale: 'graphics',
      },
      scale: {
        min: 0, max: 1,
        output: Gibber.LINEAR,       
        timescale: 'graphics',
      },  
    },
    Film: {
      nIntensity: {
        min: 0, max: 1,
        output: Gibber.LINEAR,      
        timescale: 'graphics',
      },
      sIntensity: {
        min: 0, max: 1,
        output: Gibber.LINEAR,      
        timescale: 'graphics',
      },
      sCount: {
        min: 0, max: 2048,
        output: Gibber.LINEAR,      
        timescale: 'graphics',
      },
    },
    Kaleidoscope: {
      angle: {
        min: 0, max: Math.PI * 2,
        output: Gibber.LINEAR,
        wrap: true,       
        timescale: 'graphics',
      },
      sides: {
        min: 2, max: 36,
        output: Gibber.LINEAR,       
        timescale: 'graphics',
      },
    },
    Focus: {
      screenWidth: {
        min: 0, max: 1024,
        output: Gibber.LINEAR, 
        timescale: 'graphics',
      },
      screenHeight: {
        min: 0, max: 1024,
        output: Gibber.LINEAR, 
        timescale: 'graphics',
      },
      sampleDistance: {
        min: 0, max: 2,
        output: Gibber.LINEAR, 
        timescale: 'graphics',
      },
      waveFactor: {
        min: 0, max: .05,
        output: Gibber.LINEAR, 
        timescale: 'graphics',
      },
    },
    Bleach : {
      opacity: {
        min: 0, max: 1,
        output: Gibber.LINEAR,
        timescale: 'graphics',
      }
    },
    Shader : {
      amp:{
        min:0, max:1,
        output: Gibber.LINEAR,
        timescale: 'graphics',
      },
      time:{
        min:0, max:1,
        output: Gibber.LINEAR,
        timescale: 'graphics',
      },
    }
  },
  shaders = {
     Dots: {
  		properties: {
    		angle:  .5,
    		scale:  .035,
        center: new THREE.Vector2( .5, .5 ),
  		},
  		type:'uniforms',
  		init : function(obj) {
  			var _center = obj.center ? new THREE.Vector2( obj.center[0], obj.center[1] ) : new THREE.Vector2( .5, .5 );
  			return new THREE.DotScreenPass( _center, obj.angle, obj.scale, obj.mix );
  		},
    },
    Film: {
			properties:{
				nIntensity: 1,
				sIntensity: .5,
				sCount: 1024,
				grayscale: false,
				mix: 1,
			},
			type:'uniforms',
			init: function(obj) {
        obj = obj || {}
				obj.nIntensity = obj.nIntensity || 1
				obj.sIntensity = obj.sIntensity || .5
				obj.sCount = obj.sCount || 1024
				obj.grayscale = obj.grayscale || false
				obj.mix = obj.mix || 1
				return new THREE.FilmPass( obj.nIntensity, obj.sIntensity, obj.sCount, obj.grayscale, obj.mix )
			}
		},
    Kaleidoscope: {
      properties: {
    		sides: 6.0,
    		angle: 0.0,
      },
      
      init: function( obj ) {
        obj = obj || {}
        obj.sides = obj.sides || 6
        obj.angle = obj.angle || 0
        
        return new THREE.ShaderPass( THREE.KaleidoShader )
      }
    },
    Edge: {
      properties: {
    		aspect: new THREE.Vector2( 512, 512 ) ,
      },
      
      init: function(obj) {
        obj = obj || {}
        obj.aspect = obj.aspect || shaders.Edge.properties.aspect
        
        return new THREE.ShaderPass( THREE.EdgeShader )
      }
    },
    Focus : {
      properties : {
  		  screenWidth:    1024,
  		  screenHeight:   1024,
  		  sampleDistance: 2,
  		  waveFactor:     0.1
      },
      init: function(obj) {
        return new THREE.ShaderPass( THREE.FocusShader )
      }
    },
    Godrays : {
      properties: {},
      init: function() {
        return new THREE.ShaderPass( THREE.ShaderGodRays )
      }
    },
    Bleach :{ 
      properties: { opacity: 1 },
      init : function() {
        return new THREE.ShaderPass( THREE.BleachBypassShader )
      }
    },
    Colorify : {
      properties: { color: new THREE.Color( 0xff0000 ) },
      init: function( obj ) {
        obj = obj || {}
        console.log( obj.color )
        obj.color = typeof obj.color === 'string' ? new THREE.Color( Color(obj.color).hexString() ) : shaders.Colorify.properties.color
        
        var shader = new THREE.ShaderPass( THREE.ColorifyShader )
        shader.uniforms[ 'color' ].value = obj.color
        return shader
      }
    },
    Shader : {
      properties : {
        amp:.1,
        time:0,
      },
			fragment : null,
			vertex : null,
      init : function( fragment, vertex ) {
        var columnV = null, columnF = null, out = null, shader = null
        if( fragment && typeof fragment === 'object' ) {
          columnF  = fragment
          fragment = Gibber.Graphics.PostProcessing.defs + columnF.value
        }
				
        if( vertex && typeof vertex === 'object' ) {
          columnV = vertex
          vertex = columnV.value
        }
        
        shader = Gibber.Graphics.Shaders.make( fragment, vertex )
				
        if( shader !== null) {
          out = new THREE.ShaderPass( shader )
        }
        
        if( out !== null ) {
					out.fragmentText = shader.fragmentText
					out.vertexText = shader.vertexText
          if( columnV ) { out.columnV = columnV; columnV.shader = out }
					if( columnF ) { out.columnF = columnF; columnF.shader = out }
        }
        	
        return out
      },
    },
  }

var PP = {
  export: function( target ) {
    for( var key in shaders ) {
      target[ key ] = PP[ key ]
    }
  },
  composer : null,
  fx: [],
  isRunning : false,
  defs: [
    "#define PI 3.14159265358979323846264",
    "float rand(vec2 co){",
    "  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
    "}\n",
  ].join('\n'),
  
  start: function() {
    this.composer = new THREE.EffectComposer( Gibber.Graphics.modes['3d'].obj.renderer );

    this.renderScene = new THREE.RenderPass( Gibber.Graphics.modes['3d'].obj.scene, Gibber.Graphics.modes['3d'].obj.camera );
    
    this.renderScene.clear = true;
    this.renderScene.renderToScreen = true;
    
    this.composer.addPass( this.renderScene )
    this.isRunning = true
  },
  init : function() {
    // Gibber.Graphics.running = true
    for( var key in shaders ) {
      (function() {
        var name = key,
            shaderProps = shaders[ key ],
            mappingProperties = _mappingProperties[ key ]
        
        var constructor = function() {
          // if( 'shaders' in shaders[ key ] ) {
          //console.log( shaderProps, shaderProps.shaders, shaderProps.shaders[0] )
          //var shader = shaderProps.shaders[0].init({ center:undefined, angle:.5, scale:.035, mix:.1 })
          if( Gibber.Graphics.canvas === null){
            Gibber.Graphics.init( '3d' )
          }
          
          Gibber.Graphics.running = true 
          
					if( name !== 'Shader' ) {
	          var args = Array.prototype.slice.call( arguments,0 ),
	              shader = shaderProps.init.call( shaderProps, args )
					}else{
					  shader = shaderProps.init( arguments[0], arguments[1] )
          }
          
          // TODO: replace with Graphics.seq or Audio.seq
          shader.seq = {}
          
          Gibber.createProxyProperties( shader, {  } ) // call with empty object to initialize
          
					shader.uniform = function(_name, _value, _min, _max, type ) {
						_min = isNaN( _min ) ? 0 : _min
						_max = isNaN( _max ) ? 1 : _max				
						_value = isNaN( _value ) && typeof _value !== 'object' ? _min + (_max - _min) / 2 : _value
		        
						if( typeof shader.mappingProperties[ _name ] === 'undefined' ) {
							_mappingProperties[ _name ] = shader.mappingProperties[ _name ] = {
				        min:_min, max:_max,
				        output: Gibber.LINEAR,
				        timescale: 'graphics',
				      }
						}
            
            var info = getShaderInfo( _value, type, _name ),
                shaderType = info[0],
                threeType  = info[1],
                shaderString = info[2]
            
            //console.log( "TYPE = ", shaderType, threeType )
            
						if( typeof shader.uniforms[ _name ] === 'undefined' && ( shader.columnF ) ) {
              var text = shaderString
              text += shader.columnF.editor.getValue()
              shader.columnF.editor.setValue( text )
            }
            
            shader.uniforms[ _name ] = { 'type': threeType, value:_value }
            
            Object.defineProperty( shader, _name, {
              configurable: true,
              get : function() { return shader.uniforms[_name].value },
              set : function(v){ return shader.uniforms[_name].value = v }
            })
            Gibber.createProxyProperty( shader, _name, true )
            
            shader[ _name ] = _value
            
            return shader
          }
					
          
          if( shader === null) {
            console.log( "SHADER ERROR... aborting" )
            return
          }
          
          if( !PP.isRunning ) { PP.start() }

          shader.renderToScreen = true
          
          shader.name = name
          shader.sequencers = []
          
          if( PP.fx.length > 0 ) {
            PP.fx[ PP.fx.length - 1 ].renderToScreen = false;
          }
        

          //console.log( shader )
          PP.composer.addPass( shader )
          //return shader;
          PP.fx.push( shader )
          // console.log(shader.material.program)
          // console.log( gl );
          // 
          // Gibber.Utilities.future( function() {
          //   var status = gl.getProgramParameter( shader.material.program, gl.LINK_STATUS )
          //   if( !status ) { 
          //     console.log(" REMOVING BUGGY SHADER ", status)
          //     shader.remove() 
          //   }
          // }, 44 * 15)
          
          PP.defineProperties( shader )
          
          console.log( shader, mappingProperties )
          
          for( var key in mappingProperties ) {
    				var prop = mappingProperties [ key ]
    				shader.uniform( key, shader[ key ], prop.min, prop.max, shader.uniforms[ key ].type )
          }
          
          $.extend( shader, PP.shader )
          
          Gibber.Graphics.graph.push( shader )
          
          shader.update = function() {}
          
    			shader._update = function() {
    				for(var i = 0; i < shader.mods.length; i++) {
    					var mod = shader.mods[i],
                  val = shader[ mod.name ],
                  upper = mod.name
              
              upper = upper.charAt(0).toUpperCase() + upper.substr(1)
              
              if( Array.isArray( val ) ) val = val[0]
              
    					switch(mod.type) {
    						case "+":
    							shader[ upper ].value = typeof mod.modulator === "number" ? val + mod.modulator : val + mod.modulator.getValue() * mod.mult
    							break
    						case "++":
    							shader[ upper ].value = typeof mod.modulator === "number" ? val + mod.modulator : val + Math.abs( mod.modulator.getValue() * mod.mult )
    							break							
    						case "-" :
    							shader[ upper ].value = typeof mod.modulator === "number" ? val - mod.modulator : val - mod.modulator.getValue() * mod.mult
    							break
    						case "=":
    							shader[ upper ].value = typeof mod.modulator === "number" ? mod.modulator : mod.modulator.getValue() * mod.mult
    							break
    						default:
    						break;	
    					}
              
              shader[ upper ].oldSetter.call( this, shader[ upper ].value ) 
    				}
            
            if( typeof shader.time !== 'undefined' ) shader.time += 1/60;
						
						shader.update()
    			}
      
    			shader.mods = []
    			shader.mod = function( _name, _modulator, _type, _mult ) {
    				this.mods.push({ name:_name, modulator:_modulator, type:_type || "+", mult: _mult || 1 })
    			}
          
          shader.removeMod = function( name ) {
            if( name ) {
              for( var i = 0; i < this.mods.length; i++ ) {
                var m = this.mods[ i ]
                if( m.name === name ) {
                  this.mods.splice( i, 1 )
                  break
                }
              }
            }
          }
          
          shader.replaceWith = function( replacement ) {
      
            for( var i = 0; i < this.sequencers.length; i++ ) {
              this.sequencers[ i ].target = replacement
              replacement.sequencers.push( this.sequencers[i] )
            }
      
            for( var i = 0; i < this.mappingObjects.length; i++ ) {
              var mapping = this.mappingObjects[ i ]

              if( mapping.targets.length > 0 ) {
                for( var j = 0; j < mapping.targets.length; j++ ) {
                  var _mapping = mapping.targets[ j ]
            
                  if( replacement.mappingProperties[ mapping.name ] ) {
                    _mapping[ 0 ].mapping.replace( replacement, mapping.name, mapping.Name )
                  }else{ // replacement object does not have property that was assigned to mapping
                    _mapping[ 0 ].mapping.remove()
                  }
                }
              }
            }
      
            this.remove()
          }

          shader.properties = shaderProps.properties
          
          Gibber.processArguments2( shader, Array.prototype.slice.call( arguments,0 ), shader.name )
          
          shader.mappings = []
          
          Object.defineProperty( shader, '_', {
            get: function() { 
              if( shader.seq.isRunning ) shader.seq.disconnect()  
      
              for( var i = 0; i < shader.mappings.length; i++ ) {
                shader.mappings[ i ].remove() 
              }
      
              if( shader.clearMarks ) // check required for modulators
                shader.clearMarks()
            
              shader.remove(); 
              //console.log( type + ' is removed.' ) 
            },
            set: function() {}
          })
          
          return shader;
        }
        PP[ name ] = constructor;
      })()
    }
  },
  
  defineProperties: function( shader ) {
    for( var key in shaders[ shader.name ].properties ) {
      ( function( _shader ) {
        var propName = key,
            value = shaders[ shader.name ].properties[ propName ]
        
        Object.defineProperty( shader, propName, {
          configurable: true,
          get: function() { return value; },
          set: function(v) {
            value = v
            shader.uniforms[ propName ].value = value
          },
        })
                
      })( shader )
    }
  },
  
  shader: {
    remove : function() {
      PP.composer.passes.splice( PP.composer.passes.indexOf( this ), 1 )
      PP.fx.splice( PP.fx.indexOf( this ), 1 )
      if( PP.fx.length > 0 ) {
        PP.fx[ PP.fx.length - 1 ].renderToScreen = true;
      }
      for( var key in this.mappingProperties) {
        var Key = key.charAt(0).toUpperCase() + key.slice(1)
        
        if( typeof this[ Key ].mapping === 'object' ) {
          this[ Key ].mapping.remove()
        }
      }
    }
  },
}

var types = [
  [ 'Vec2', 'Vector2', 'vec2' ],
  [ 'Vec3', 'Vector3', 'vec3' ],
  [ 'Vec4', 'Vector4', 'vec4' ],    
]
.forEach( function( element, index, array ) {
  var type = element[ 0 ],
    threeType = element[ 1 ] || element[ 0 ],
    shaderType = element[ 2 ] || 'f'
    
  window[ type ] = function() {
    var args = Array.prototype.slice.call( arguments, 0 ),
        obj
    
    if( Array.isArray( args[0] ) ) {
      var _args = []
      for( var i = 0; i < args[0].length; i++ ) {
        _args[ i ] = args[0][ i ]
      }
      args = _args
    }    
        
    obj = Gibber.construct( THREE[ threeType ], args )
    
    obj.name = type
    obj.shaderType = shaderType
    
    return obj
  }
})

var threeTypes = {
  'vec2' : 'v2',
  'vec3' : 'v3',
  'vec4' : 'v4',
  'int'  : 'i',
  'float'  : 'f'
}

var getShaderInfo = function( value, type, _name ) {
  var shaderType = null, threeType = null, shaderString = '', isArray = false
  
  if( type ) {
    if( type in threeTypes ) {
      shaderType = type
    }else{
      for( var key in threeTypes ) {
        if( threeTypes[ key ] === type ) {
          shaderType = key
          break;
        }
      }
    }
  }else{
    if( Array.isArray( value ) ) {
      var arrayMember = value[ 0 ],
          arrayMemberType = arrayMember.shaderType || typeof arrayMember
          
      if( arrayMemberType === 'number' ) {
        var isInt = arrayMember % 1 === 0
        
        // check to make sure all elements are ints, otherwise use float
        if( isInt ) { isInt = value.every( function( element ) { return element % 1 === 0 } ) }
        
        shaderType = isInt ? 'int' : 'float'
      }else{
        shaderType = arrayMemberType
      }
      isArray = true
    }else if( typeof value === 'object' ){
      shaderType = value.shaderType || 'float'
    }else{
      shaderType = typeof value
      if( shaderType === 'number' ) {
        console.log("CHECKING FLOAT VS INT")
        shaderType = value % 1 === 0 ? 'int' : 'float'
      } 
    }
  }
  
  shaderString = "uniform " + shaderType + " " + _name
  
  shaderString += isArray ? '[' + value.length + '];\n' : ';\n'
  
  threeType = threeTypes[ shaderType ]
  if( isArray ) {
    threeType += shaderType.indexOf( 'vec' ) > - 1 ? 'v' : 'v1'
  }
  
  return [ shaderType, threeType, shaderString ]
}

return PP

}

},{}],29:[function(_dereq_,module,exports){
module.exports = function( Gibber, Graphics ) {
  var GG = Gibber.Graphics
	
	var Shaders = {
		make : function( frag, vert ) {
			//console.log( ' MAKE SHADER ', frag, vert )
	    var shader = {
	    	uniforms: {
	    		"tDiffuse": { type: "t", value: null },
	        "amp": { type:"f", value:0 },
	        "time": { type:"f", value:0 },
	    	},
			
				fragmentShader :  frag || Shaders.defaultFragment,
				vertexShader   :  vert || Shaders.defaultVertex,
			}
		
			return shader
		},
		defaultFragment : [
			"uniform float amp;",
			"uniform sampler2D tDiffuse;",
			"uniform float time;",
			"varying vec2 p;",
      "",
			"void main() {",
			"  gl_FragColor = texture2D( tDiffuse, p ).rgba;",
			"}"
		].join('\n'),
		defaultVertex : [
  		"varying vec2 p;",
  		"void main() {",
  			"p = uv;",
  			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
  		"}"
  	].join("\n"),
		
		Material : function( frag, vert ) {
	    var shader = {},
					fragText = typeof frag === 'object' ? frag.value : frag, 
					vertText = typeof vert === 'object' ? vert.value : vert,
					_shader = {
			    	uniforms: {
			    		"tDiffuse": { type: "t", value: null },
			        "amp": { type:"f", value:0 },
			        "time": { type:"f", value:0 },
			    	},
	
						fragmentShader :  fragText || Shaders.defaultFragment,
						vertexShader   :  vertText || Shaders.defaultVertex,
					}
      
      _shader.fragmentShader = Graphics.PostProcessing.defs + _shader.fragmentShader
	    
      if( !Gibber.Graphics.running ) {
        console.log( "GRAPHICS INIT")
        Gibber.Graphics.init( '3d' )
        console.log( "MODE", Gibber.Graphics.mode )
      }else{
        if( Gibber.Graphics.mode === '2d' ) {
          Gibber.Graphics.use( '3d' )
        }
      }
      
			var _material = new THREE.ShaderMaterial( _shader )
	
			// if columns are passed as arguments set them up for livecoding
			if( typeof frag === 'object' ) { frag.shader = shader }
			if( typeof vert === 'object' ) { vert.shader = shader }			
			
      
			shader.fragmentText = _material.fragmentShader
			shader.vertexText =   _material.vertexShader
      
			Object.defineProperty( shader, 'material', {
				get: function() { return _material; },
				set: function(v) { _material = v; if( this.target) this.target.mesh.material = _material; }
			})
			
			var _target = null
			Object.defineProperty( shader, 'target', {
				get:function() { return _target },
				set:function(v) { 
					_target = v
					if( _target.mesh ) {
						_target.mesh.material = this.material;
						_target.mesh.material.needsUpdate = true;
					}
				}
			})
			
      Graphics.graph.push( shader )
      
      shader.update = function() {}
      
			var phase = 0
			shader._update = function() {
				for(var i = 0; i < shader.mods.length; i++) {
					var mod = shader.mods[i],
              val = shader[ mod.name ],
              upper = mod.name
          
          upper = upper.charAt(0).toUpperCase() + upper.substr(1)
					//if( phase % 60 === 0 ) { console.log( mod,val, upper ) }
          
          if( Array.isArray( val ) ) val = val[0]
          
					switch(mod.type) {
						case "+":
							shader[ upper ].value = typeof mod.modulator === "number" ? val + mod.modulator : val + mod.modulator.getValue() * mod.mult
							break
						case "++":
							shader[ upper ].value = typeof mod.modulator === "number" ? val + mod.modulator : val + Math.abs( mod.modulator.getValue() * mod.mult )
							break							
						case "-" :
							shader[ upper ].value = typeof mod.modulator === "number" ? val - mod.modulator : val - mod.modulator.getValue() * mod.mult
							break
						case "=":
							shader[ upper ].value = typeof mod.modulator === "number" ? mod.modulator : mod.modulator.getValue() * mod.mult
							break
						default:
						break;	
					}
          
          shader[ upper ].oldSetter.call( this, shader[ upper ].value ) 
				}
				
				shader.update()
			}
  
			shader.mods = []
			shader.mod = function( _name, _modulator, _type, _mult ) {
				this.mods.push({ name:_name, modulator:_modulator, type:_type || "+", mult: _mult || 1 })
			}
      
      shader.removeMod = function( name ) {
        if( name ) {
          for( var i = 0; i < this.mods.length; i++ ) {
            var m = this.mods[ i ]
            if( m.name === name ) {
              this.mods.splice( i, 1 )
              break
            }
          }
        }
      }
			shader.remove = function() {}
			
			shader.uniforms = _shader.uniforms
			
      var mappingProperties = shader.mappingProperties = {
				amp:{
	        min:0, max:1,
	        output: Gibber.LINEAR,
	        timescale: 'graphics',
	      },
	      time:{
	        min:0, max:1,
	        output: Gibber.LINEAR,
	        timescale: 'graphics',
	      },
			}
			
      shader.mappingObjects = []
        
      shader.uniform = function(_name, _value, _min, _max ) {
        _min = isNaN( _min ) ? 0 : _min
        _max = isNaN( _max ) ? 1 : _max        
        _value = isNaN( _value ) ? _min + (_max - _min) / 2 : _value
        
        if( typeof shader.mappingProperties[ _name ] === 'undefined' ) {
          mappingProperties[ _name ] = shader.mappingProperties[ _name ] = {
            min:_min, max:_max,
            output: Gibber.LINEAR,
            timescale: 'graphics',
          }
        }
        
        if( typeof shader.uniforms[ _name ] === 'undefined' ) shader.uniforms[ _name ] = { type:'f', value:_value }
              
        Object.defineProperty( shader, _name, {
          configurable: true,
          get: function() { return _value; },
          set: function(v) {
            _value = v
            shader.material.uniforms[ _name ].value = v
          },
        })
        
        Gibber.createProxyProperty( shader, _name )
        shader[  _name.charAt(0).toUpperCase() + _name.slice(1) ].timescale = 'graphics' // TODO: why is this necessary?
        
        return shader
      }
            
      for( var key in mappingProperties ) {
        var prop = mappingProperties [ key ]
        shader.uniform( key, prop.min, prop.max, shader[ key ] )
      }
			
			return shader
		}
	}
  
  return Shaders
	
	//window.ShaderMaterial = GG.Shaders.Material
  //Gibber.Graphics.makeFragmentShader = function( fragment ) {
    // var gl = Gibber.Graphics.renderer.getContext()
    // 
    // var shader = gl.createShader( gl.FRAGMENT_SHADER )
    //   // Set the shader source code.
    // 
    // gl.shaderSource( shader, fragment )
    // 
    // // Compile the shader
    // gl.compileShader( shader )
    // 
    //   // Check if it compiled
    // var success = gl.getShaderParameter( shader, gl.COMPILE_STATUS )
    // if (!success) {
    //   // Something went wrong during compilation; get the error
    //   throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    //   return null
    // } 
}
},{}],30:[function(_dereq_,module,exports){
/*
a = Video()

b = Cube({ texture: a, scale:3 }).spin(.001)

c = Dots({ scale:.25 })

c.update = function() {
  this.angle += .0005
}

c.scale.seq( Rndf(0,.35), 1/8 )

f = Film()
f.sCount = 8

Graphics.resolution = 1

a.stop()
*/

module.exports = function( Gibber, Graphics ) {
  'use strict';
  
  var _videoElement, 
      _videoTexture = null, 
      video, 
      
  Video = function() {
    if( _videoTexture !== null ) { return _videoTexture }
    
    if( typeof _videoElement === 'undefined' ) {
      video = document.createElement('video');
      video.width    = 320;
      video.height   = 240;
      video.autoplay = true;
    }
    
    if( _videoTexture === null ) {
      navigator.webkitGetUserMedia(
        { video:true, audio:false }, 
        function(stream){ 
          video.stream = stream;
          video.src = webkitURL.createObjectURL( stream ); 
        }, 
        function( error ){ console.log( 'Failed to get a stream due to', error ); }
      ); 
      
      _videoTexture = new Graphics.THREE.Texture( video )
      _videoTexture.video = video
      
      _videoTexture.remove = function() {
        Graphics.graph.splice( Graphics.graph.indexOf( _videoTexture ), 1 )
        _videoTexture = null
        video.stream.stop()
      }
      
      _videoTexture.stop = function() {
        Graphics.graph.splice( Graphics.graph.indexOf( _videoTexture ), 1 ) 
        _videoTexture = null
        video.stream.stop()
      }
      
      _videoTexture.update = function() {}
      _videoTexture._update = function() {
        if( video.readyState === video.HAVE_ENOUGH_DATA ){
          _videoTexture.needsUpdate = true;
      	}
      }
      
      Graphics.graph.push( _videoTexture )
    }
    
    return _videoTexture
  }
  
  return Video 
}
},{}],31:[function(_dereq_,module,exports){
// TODO: add Map to utilities? breaks graphics currently...

module.exports = function( Gibber, Gibberish ) {  
  var mappings = {
    audio : {
      graphics: function( target, from ) {
				if( typeof from.object.track === 'undefined' ) from.object.track = {}
				
        var proxy = typeof from.object.track[ from.name ] !== 'undefined' ? from.object.track[ from.name ] : new Gibberish.Proxy2( from.object, from.name ),
            op    = new Gibberish.OnePole({ a0:.005, b1:.995 }),
            mapping
        
        from.object.track = proxy;

        mapping = target.object[ target.Name ].mapping = Gibber.Audio.Core.Binops.Map( proxy, target.min, target.max, from.min, from.max, target.output, from.wrap ) 
        
        op.input = mapping
        
        target.object[ target.name ] = op
        
        mapping.proxy = proxy
        mapping.op = op
        
        mapping.remove = function( doNotSet ) {
          if( !doNotSet ) {
            target.object[ target.name ] = target.object[ target.Name ].mapping.getValue()
          }
          
          delete target.object[ target.Name ].mapping
        }
        
        return mapping
      },
      interface: function( target, from ) {
        var proxy = typeof from.track !== 'undefined' ? from.track : new Gibberish.Proxy2( from.object, from.name ),
            op    = new Gibberish.OnePole({ a0:.005, b1:.995 }),
            range = target.max - target.min,
            percent = ( target.object[ target.name ] - target.min ) / range,
            widgetValue = from.min + ( ( from.max - from.min ) * percent ),
            mapping
                
        if( from.object.setValue ) from.object.setValue( widgetValue )
        
        from.track = proxy
        
        mapping = target.object[ target.Name ].mapping = Gibber.Audio.Core.Binops.Map( proxy, target.min, target.max, from.min, from.max, target.output, from.wrap ) 
        
        op.input = mapping
        target.object[ target.name ] = op
        
        mapping.proxy = proxy
        mapping.op = op

        mapping.remove = function( doNotSet ) {
          if( !doNotSet ) target.object[ target.name ] = mapping.getValue()
          
          //if( mapping.op ) mapping.op.remove()
          
          delete mapping
        }
        
        if( typeof from.object.label !== 'undefined' ) { 
          var labelString = ''
          for( var i = 0; i < from.targets.length; i++ ) {
            var __target = from.targets[ i ]
            labelString += __target[0].object.name + '.' + __target[1]
            if( i !== from.targets.length - 1 ) labelString += ' & '
          }
          from.object.label = labelString
        }
                
        mapping.replace = function( replacementObject, key, Key  ) {
          proxy.setInput( replacementObject )
          if( replacementObject[ Key ].targets.indexOf( target ) === -1 ) replacementObject[ Key ].targets.push( [target, target.Name] )
        }
        
        return mapping
      },
      audio: function( target, from ) {
        var proxy, mapping
        
        if( typeof from.object.track !== 'undefined' ) {
          proxy = from.object.track
          proxy.count++
        } else {
          proxy = new Gibberish.Proxy2( from.object, from.name )
          proxy.count = 1
        }
        from.object.track = proxy
        
        target.object[ target.name ] = Gibber.Audio.Core.Binops.Map( proxy, target.min, target.max, from.min, from.max )
        
        mapping = target.object[ target.Name ].mapping = target.object[ target.name ]() // must call getter function explicitly
        
        mapping.remove = function( doNotSet ) {
          if( !doNotSet ) {
            target.object[ target.name ] = mapping.getValue()
          }
          
          if( mapping.op ) mapping.op.remove()
          
          delete target.object[ target.Name ].mapping
        }
        
        mapping.replace = function( replacementObject, key, Key ) {
          var proxy = new Gibberish.Proxy2( replacementObject, key )
          mapping.input = proxy
          if( replacementObject[ Key ].targets && replacementObject[ Key ].targets.indexOf( target ) === -1 ) {
            replacementObject[ Key ].targets.push( [target, target.Name] )
          }
        }
        
        return mapping
      },
      audioOut : function( target, from ) {
        var mapping
        
        target.object[ target.name ] = Gibber.Audio.Core.Binops.Map( null, target.min, target.max, 0, 1, 0 )   
        mapping = target.object[ target.Name ].mapping = target.object[ target.name ]() // must call getter function explicitly
        
        if( typeof from.object.track !== 'undefined' ) {
          mapping.follow = from.object.track
          mapping.follow.count++
        } else {
          mapping.follow = new Gibberish.Follow({ input:from.object, useAbsoluteValue: true })
          mapping.follow.count = 1
        }
        from.object.track = mapping.follow
        
        mapping.input = target.object[ target.Name ].mapping.follow
        
        mapping.remove = function( doNotSet ) {
          if( !doNotSet ) {
            target.object[ target.name ] = target.object[ target.Name ].mapping.getValue()
          }
          
          if( mapping.bus )
            mapping.bus.disconnect()
          
          if( mapping.follow ) {
            mapping.follow.count--
            if( mapping.follow.count === 0) {
              delete from.object.track
              mapping.follow.remove()
            }
          }
          
          delete target.object[ target.Name ].mapping
        }
        
        mapping.replace = function( replacementObject, key, Key  ) {
          mapping.follow.input = replacementObject   
          if( replacementObject[ Key ].targets.indexOf( target ) === -1 ) replacementObject[ Key ].targets.push( [target, target.Name] )            
        }
      
        var env = mapping.follow.bufferSize
        Object.defineProperty( target.object[ target.Name ], 'env', {
          configurable:true,
          get: function() { return env },
          set: function(v) { env = Gibber.Clock.time( v ); mapping.follow.bufferSize = env; }
        })
                
        return mapping
      }
    },
    graphics: {
      graphics: function( target, from ) {
        // rewrite getValue function of Map object to call Map callback and then return appropriate value
        var map = Gibber.Audio.Core.Binops.Map( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap ),
            old = map.getValue.bind( map ),
            mapping
        
        map.getValue = function() {
          //console.log( from.name, from, target.min, target.max, from.min, from.max )
          map.callback( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap )
          return old()
        }
        
        mapping = target.object[ target.Name ].mapping = map
        
        if( target.object.mod ) { // second case accomodates modding individual [0][1][2] properties fo vectors
          target.object.mod( target.name, mapping, '=' )
        }else{
          target.modObject.mod( target.modName, mapping, '=' )
        }
        
        mapping.remove = function() {
          if( target.object.mod ) {
            target.object.removeMod( target.name )
          }else{
            target.modObject.removeMod( target.modName )
          }
          target.object[ target.name ] = target.object[ target.Name ].mapping.getValue()
          
          delete target.object[ target.Name ].mapping
        }
        
        mapping.replace = function( replacementObject, key, Key  ) { mapping.input = replacementObject }
        
        return mapping
      },
      interface: function( target, from ) {
        // console.log( "FROM", from.name, target.min, target.max, from.min, from.max )
        var _map = Gibber.Audio.Core.Binops.Map( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap ),
            mapping
            
        if( typeof from.object.functions === 'undefined' ) {
          from.object.functions = {}
          from.object.onvaluechange = function() {
            for( var key in from.object.functions ) {
              from.object.functions[ key ]()
            }
          }
        }

        mapping = target.object[ target.Name ].mapping = _map

        target.mapping.from = from
        
        var fcn_name = target.name + ' <- ' + from.object.name + '.' + from.Name

        from.object.functions[ fcn_name ] = function() {
          var val = mapping.callback( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap )
          // target.object[ target.Name ].value = val
          // console.log( target.Name )
          target.object[ target.Name ].oldSetter.call( target.object[ target.Name ], val )
        }
        // from.object.onvaluechange = function() {          
        //   var val = map.callback( this[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap )
        //   target.object[ target.name ] = val
        // }
        mapping.replace = function() {
          // var old = from.functions[ target.Name ]
        } 
        
        mapping.remove  = function() {
          console.log( "mapping removed" )
          delete from.object.functions[ fcn_name ]
        } 
        
        if( from.object.setValue ) 
          from.object.setValue( target.object[ target.name ] )
        
        // if( typeof from.object.label !== 'undefined' ) {
        //   from.object.label = target.object.name + '.' + target.Name
        // }
        if( typeof from.object.label !== 'undefined' ) { 
          var labelString = ''
          for( var i = 0; i < from.targets.length; i++ ) {
            var __target = from.targets[ i ]
            labelString += __target[0].object.name + '.' + __target[1]
            if( i !== from.targets.length - 1 ) labelString += ' & '
          }
          from.object.label = labelString
        }
        
        return mapping
      },
      audio: function( target, from ) {
        var mapping
        
        mapping = target.object[ target.Name ].mapping = Gibber.Audio.Core.Binops.Map( null, target.min, target.max, from.min, from.max, target.output, from.wrap )
      
        mapping.follow = typeof from.object.track !== 'undefined' ? from.object.track : new Gibberish.Follow({ input:from.object.properties[ from.name ], useAbsoluteValue: false })
        from.object.track = target.object[ target.Name ].mapping.follow
        // assign input after Map ugen is created so that follow can be assigned to the mapping object
        mapping.input = mapping.follow
      
        mapping.bus = new Gibberish.Bus2({ amp:0 }).connect()

        mapping.connect( mapping.bus )
        
        mapping.replace = function( replacementObject, key, Key ) {
          mapping.follow.input = replacementObject            
          if( replacementObject[ Key ].targets.indexOf( target ) === -1 ) replacementObject[ Key ].targets.push( [target, target.Name] )
        }
        
        var env = mapping.follow.bufferSize
        Object.defineProperty( target.object[ target.Name ], 'env', {
          get: function() { return env },
          set: function(v) { env = Gibber.Clock.time( v ); mapping.follow.bufferSize = env; }
        })
        
        if( target.object.mod ) { // second case accomodates modding individual [0][1][2] properties fo vectors
          //console.log( target.object, target.object.mod )
          target.object.mod( target.name, mapping, '=' )
        }else{
          target.modObject.mod( target.modName, mapping, '=' )
        }
        
        mapping.remove = function() {
          this.bus.disconnect()
          
          if( this.follow ) {
            this.follow.count--
            if( this.follow.count === 0) {
              delete from.object.track
              this.follow.remove()
            }
          }

          if( target.object.mod ) {
            target.object.removeMod( target.name )
          }else{
            target.modObject.removeMod( target.modName )
          }
          
          delete target.object[ target.Name ].mapping
        }
        
        return mapping
      },
      audioOut : function( target, from ) {
        console.log( target.Name, target.object )
        if( typeof target.object[ target.Name ].mapping === 'undefined') {
          console.log("MAKING A MAPPING")
          var mapping = target.object[ target.Name ].mapping = Gibber.Audio.Core.Binops.Map( null, target.min, target.max, 0, 1, 0 )   
          if( typeof from.object.track !== 'undefined' ) {
            mapping.follow = from.object.track
            mapping.follow.count++
          } else {
            mapping.follow = new Gibberish.Follow({ input:from.object })
            mapping.follow.count = 1
          }
          from.object.track = mapping.follow
          
          var env = mapping.follow.bufferSize
          Object.defineProperty( target.object[ target.Name ], 'env', {
            configurable: true,
            get: function() { return env },
            set: function(v) { env = Gibber.Clock.time( v ); mapping.follow.bufferSize = env; }
          })
          
          mapping.input = mapping.follow
          mapping.bus = new Gibberish.Bus2({ amp:0 }).connect()
          mapping.connect( mapping.bus )
        
          mapping.replace = function( replacementObject, key, Key  ) {
            // _console.log( key, replacementObject )
            
            // what if new mapping isn't audio type?
            if ( replacementObject[ Key ].timescale === from.timescale ) {
              var idx = mapping.follow.input[ from.Name ].targets.indexOf( target )
              if( idx >= -1 ) {
                mapping.follow.input[ from.Name ].targets.splice( idx, 1 )
              }
            
              mapping.follow.input = replacementObject   
              if( replacementObject[ Key ].targets.indexOf( target ) === -1 ) replacementObject[ Key ].targets.push( [target, target.Name] )            
            }else{
              mapping.bus.disconnect()
              mapping.follow.remove()
              Gibber.createMappingObject( target, replacementObject )
            }
            
          }
        }else{
          console.log("REPLACING MAPPING")
          mapping.replace( from.object, from.name, from.Name )
          return mapping
        }
        
        if( target.object.mod ) { // second case accomodates modding individual [0][1][2] properties fo vectors
          //console.log( target.object, target.object.mod )
          target.object.mod( target.name, mapping, '=' )
        }else if (target.modObject) {
          target.modObject.mod( target.modName, mapping, '=' )
        }else{
          !function() {
            var _mapping = mapping
            target.object.update = function() { 
              target.object[ target.name ]( _mapping.getValue() )
            }
          }()
          //target.object.mod( target.name, mapping, '=' ) 
        }
        
        //target.object[ target.Name ].mapping = mapping
        
        mapping.remove = function() {
          this.bus.disconnect()
          
          if( this.follow ) {
            this.follow.count--
            if( this.follow.count === 0) {
              delete from.object.track
              this.follow.remove()
            }
          }

          if( target.object.mod ) {
            target.object.removeMod( target.name )
          }else if( target.modObject ) {
            target.modObject.removeMod( target.modName )
          }else{
            console.log( 'removing update ')
            //target.object.update = function() {}
          }
          
          delete target.object[ target.Name ].mapping
        }
        return mapping
      }
    },
    notation: {
      graphics: function( target, from ) {
        // rewrite getValue function of Map object to call Map callback and then return appropriate value

        var map = Gibber.Audio.Core.Binops.Map( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap ),
            old = map.getValue.bind( map ),
            mapping
        
        map.getValue = function() {
          map.callback( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap )
          return old()
        }
        
        mapping = target.object[ target.Name ].mapping = map
        
        if( target.object.mod ) { // second case accomodates modding individual [0][1][2] properties fo vectors
          target.object.mod( target.name, mapping, '=' )
        }else{
          target.modObject.mod( target.modName, mapping, '=' )
        }
        
        mapping.remove = function() {
          if( target.object.mod ) {
            target.object.removeMod( target.name )
          }else{
            target.modObject.removeMod( target.modName )
          }
          target.object[ target.name ] = target.object[ target.Name ].mapping.getValue()
          
          delete target.object[ target.Name ].mapping
        }
        
        mapping.replace = function( replacementObject, key, Key  ) { mapping.input = replacementObject }
        
        return mapping
      },
      interface: function( target, from ) {
        // console.log( "FROM", from.name, target.min, target.max, from.min, from.max )
        var _map = Gibber.Audio.Core.Binops.Map( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap ),
            mapping
            
        if( typeof from.object.functions === 'undefined' ) {
          from.object.functions = {}
          from.object.onvaluechange = function() {
            for( var key in from.object.functions ) {
              from.object.functions[ key ]()
            }
          }
        }

        mapping = target.object[ target.Name ].mapping = _map

        target.mapping.from = from
        
        var fcn_name = target.name + ' <- ' + from.object.name + '.' + from.Name

        from.object.functions[ fcn_name ] = function() {
          var val = mapping.callback( from.object[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap )
          // target.object[ target.Name ].value = val
          // console.log( target.Name )
          target.object[ target.Name ].oldSetter.call( target.object[ target.Name ], val )
        }
        // from.object.onvaluechange = function() {          
        //   var val = map.callback( this[ from.name ], target.min, target.max, from.min, from.max, target.output, from.wrap )
        //   target.object[ target.name ] = val
        // }
        mapping.replace = function() {
          // var old = from.functions[ target.Name ]
        } 
        
        mapping.remove  = function() {
          console.log( "mapping removed" )
          delete from.object.functions[ fcn_name ]
        } 
        
        if( from.object.setValue ) 
          from.object.setValue( target.object[ target.name ] )
        
        // if( typeof from.object.label !== 'undefined' ) {
        //   from.object.label = target.object.name + '.' + target.Name
        // }
        if( typeof from.object.label !== 'undefined' ) { 
          var labelString = ''
          for( var i = 0; i < from.targets.length; i++ ) {
            var __target = from.targets[ i ]
            labelString += __target[0].object.name + '.' + __target[1]
            if( i !== from.targets.length - 1 ) labelString += ' & '
          }
          from.object.label = labelString
        }
        
        return mapping
      },
      audio: function( target, from ) {
        var mapping
        
        mapping = target.object[ target.Name ].mapping = Gibber.Audio.Core.Binops.Map( null, target.min, target.max, from.min, from.max, target.output, from.wrap )
  
        if( typeof from.object.track !== 'undefined' && from.object.track.input === from.object.properties[ from.name ] ) {
          mapping.follow = from.object.track
          mapping.follow.count++
        }else{
          mapping.follow = new Gibberish.Follow({ input:from.object.properties[ from.name ], useAbsoluteValue: false })
          mapping.follow.count = 1
        }
        
        from.object.track = target.object[ target.Name ].mapping.follow
        
        // assign input after Map ugen is created so that follow can be assigned to the mapping object
        mapping.input = mapping.follow
      
        mapping.bus = new Gibberish.Bus2({ amp:0 }).connect()

        mapping.connect( mapping.bus )
        
        mapping.replace = function( replacementObject, key, Key ) {
          mapping.follow.input = replacementObject            
          if( replacementObject[ Key ].targets.indexOf( target ) === -1 ) replacementObject[ Key ].targets.push( [target, target.Name] )
        }
        
        var env = mapping.follow.bufferSize
        Object.defineProperty( target.object[ target.Name ], 'env', {
          get: function() { return env },
          set: function(v) { env = Gibber.Clock.time( v ); mapping.follow.bufferSize = env; }
        })
        
        mapping.update = function() {   
          target.object[ target.name ]( mapping.getValue() )
        }
        mapping.text = target.object

        // let Notation object handle scheduling updates
        Gibber.Environment.Notation.add( mapping )
        
        mapping.remove = function() {
          this.bus.disconnect()
          
          if( this.follow ) {
            this.follow.count--
            if( this.follow.count === 0) {
              delete from.object.track
              this.follow.remove()
            }
          }
          
          Gibber.Environment.Notation.remove( mapping )
          
          delete target.object[ target.Name ].mapping
        }
        
        return mapping
      },
      audioOut : function( target, from ) {
        if( typeof target.object[ target.Name ].mapping === 'undefined') {
          var mapping = target.object[ target.Name ].mapping = Gibber.Audio.Core.Binops.Map( null, target.min, target.max, 0, 1, 0 )
          
          console.log( "MAPPING", from )
          
          if( typeof from.object.track !== 'undefined' && from.object.track.input === from.object.properties[ from.name ] ) {
            mapping.follow = from.object.track
            mapping.follow.count++
          }else{
            mapping.follow = new Gibberish.Follow({ input:from.object, useAbsoluteValue: true })
            mapping.follow.count = 1
          }
          
          from.object.track = mapping.follow
          
          var env = mapping.follow.bufferSize
          Object.defineProperty( target.object[ target.Name ], 'env', {
            configurable:true,
            get: function() { return env },
            set: function(v) { env = Gibber.Clock.time( v ); mapping.follow.bufferSize = env; }
          })
          
          mapping.input = mapping.follow
          mapping.bus = new Gibberish.Bus2({ amp:0 }).connect()
          mapping.connect( mapping.bus )
        
          mapping.replace = function( replacementObject, key, Key  ) {
            // _console.log( key, replacementObject )
            
            // what if new mapping isn't audio type?
            if ( replacementObject[ Key ].timescale === from.timescale ) {
              var idx = mapping.follow.input[ from.Name ].targets.indexOf( target )
              if( idx >= -1 ) {
                mapping.follow.input[ from.Name ].targets.splice( idx, 1 )
              }
            
              mapping.follow.input = replacementObject   
              if( replacementObject[ Key ].targets.indexOf( target ) === -1 ) replacementObject[ Key ].targets.push( [target, target.Name] )            
            }else{
              mapping.bus.disconnect()
              mapping.follow.remove()
              Gibber.createMappingObject( target, replacementObject )
            }
            
          }
        }else{
          mapping.replace( from.object, from.name, from.Name )
          return mapping
        }
        
        mapping.update = function() {   
          target.object[ target.name ]( mapping.getValue() )
        }
        mapping.text = target.object

        // let Notation object handle scheduling updates
        Gibber.Environment.Notation.add( mapping )
        
        mapping.remove = function() {
          this.bus.disconnect()
          
          if( this.follow ) {
            this.follow.count--
            if( this.follow.count === 0) {
              delete from.object.track
              this.follow.remove()
            }
          }
          
          Gibber.Environment.Notation.remove( mapping )
          
          delete target.object[ target.Name ].mapping
        }
        return mapping
      }
    },
  } 
  
  return mappings
}

module.exports.outputCurves = {
  LINEAR:0,
  LOGARITHMIC:1
}
},{}],32:[function(_dereq_,module,exports){
!function() {
"use strict"

var soloGroup = [],
    isSoloing = false,
    Gibber,
    $ = _dereq_( './dollar' ),
    Synths = { Presets: {} },
    //Gibberish = require( 'gibberish-dsp' ), TODO: remove future call
    //Clock = require('./clock')( Gibber ),
    rnd = Math.random,

    Utilities = {
      seq : function() {
        var arg = arguments[0],
            type = typeof arg,
            list = [],
            output = null
    
        if( type === 'object' ) {
          if( Array.isArray( arg ) ) type = 'array'
        }
    
        // switch( type ) {
        //   case 'function':
        //     output = arg
        //     break;
        //   case 'array':
        //     for( var i = 0; i < arg.length; i++ ) {
        //       var elem = arg[ i ]
        //       if( typeof )
        //     }
        //     break;
        //   default: 
        //     output = function() { return arg }
        //     break;
        // }
    
        return output
      },
      random :  function() {
        var dict = {},
            lastChosen = null;
    
        for(var i = 0; i < arguments.length; i+=2) {
          dict[ "" + arguments[i] ] = { repeat: arguments[i+1], count: 0 };
        }

        this.pick = function() {
          var value = 0, index, lastValue;
          if(this[lastChosen]) lastValue = this[lastChosen]

          if(lastChosen !== null && dict[ lastValue ].count++ <= dict[ lastValue ].repeat) {
            index = lastChosen;
            if( dict[ lastValue ].count >= dict[ lastValue ].repeat) {
              dict[ lastValue ].count = 0;
              lastChosen = null;
            };
          }else{
            index = Utilities.rndi(0, this.length - 1);
            value = this[index];
            if( typeof dict[ ""+value ] !== 'undefined' ) {
              dict[ ""+value ].count = 1;
              lastChosen = index;
            }else{
              lastChosen = null;
            }
          }
      
        	return index; // return index, not value as required by secondary notation stuff
        };
    
        return this;
      },
  
      random2 : function() {
        var dict = {},
            lastChosen = null,
            that = this;
    
        for(var i = 0; i < arguments.length; i+=2) {
          dict[ "" + arguments[i] ] = { repeat: arguments[i+1], count: 0 };
        }

        this.pick = function() {
          var value = 0, index, lastValue;
          if(that[lastChosen]) lastValue = that[lastChosen]

          if(lastChosen !== null && dict[ lastValue ].count++ <= dict[ lastValue ].repeat) {
            index = lastChosen;
            if( dict[ lastValue ].count >= dict[ lastValue ].repeat) {
              dict[ lastValue ].count = 0;
              lastChosen = null;
            };
          }else{
            index = Utilities.rndi(0, that.length - 1);
            value = that[index];
            if( typeof dict[ ""+value ] !== 'undefined' ) {
              dict[ ""+value ].count = 1;
              lastChosen = index;
            }else{
              lastChosen = null;
            }
          }
      
        	return that[ index ]; // return index, not value as required by secondary notation stuff
        }
    
        return this.pick
      },
  
      choose: function( length ) {
        var output = null
    
        if( isNaN( length ) ) length = 1
    
        if( length !== 1 ) {
          var arr = []
    
          for( var i = 0; i < length; i++ ) {
            arr[ i ] = this[ Utilities.rndi( 0, this.length - 1 ) ]
          }
      
          output = arr
        }else{
          output = this[ Utilities.rndi( 0, this.length - 1 ) ]
        }
    
      	return output;
      },

      future : function(func, time) { 
        var __seq = new Gibberish.Sequencer({
          values:[
            function(){},
            function() {
              func();
              __seq.stop();
              __seq.disconnect();
            }
          ],
          durations:[ Gibber.Clock.time( time ) ]
        }).start()
    
        return function(){ __seq.stop(); __seq.disconnect(); }
      },
  
      shuffle : function( arr ) {
      	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
      },
  
      solo : function( ugen ) {
        var args = Array.prototype.slice.call( arguments, 0 );
        if( ugen ) {
          if( isSoloing ) { Utilities.solo(); } // quick toggle on / off
      
          for( var j = 0; j < args.length; j++ ) { // check if user soloed ugen, but fx is actually feeding Master bus
            var arg = args[ j ]
            if( arg.fx.length > 0 ) { 
              args[j] = arg.fx[ arg.fx.length - 1 ] // get last fx in chain
            }
          }
      
          for(var i = 0; i < Master.inputs.length; i++) {
            //console.log( i, Master.inputs[i] )
            var idx = args.indexOf( Master.inputs[i].value ),
                _ugen = Master.inputs[i].value,
                name = _ugen.name
            
            if( idx === -1 ) {
              if( name !== 'polyseq' &&  name !== 'Seq' ) { // TODO: please, please, don't route seqs into master bus...
                Master.inputs[i].value = Mul( Master.inputs[i].value, 0 )
                soloGroup.push( Master.inputs[i] );
              }
            }
          }
          isSoloing = true;
        }else{
          for( var i = 0; i < soloGroup.length; i++ ) {
            soloGroup[i].value = soloGroup[i].value[0]
          }
          soloGroup.length = 0
          isSoloing = false;
        } 
      },
      fill : function( length, fnc ) {
        if( isNaN( length ) ) length = 16
        if( typeof fnc !== 'function' ) { fnc = Rndf() }
    
        fnc = fnc.bind( this )
    
        for( var i = 0; i < length; i++ ) {
          this[ i ] = fnc()
        }
    
        return this
      },
      merge : function() {
        var output = []
      	for( var i = 0; i < this.length; i++ ) {
          var arg = this[ i ]
          if( Array.isArray( arg ) ) {
            for( var j = 0; j < arg.length; j++ ) {
      				output.push( arg[ j ] )
            }
          }else{
            output.push( arg )
          }
        }
  
        return output
      },
      weight : function() {
        var weights = Array.prototype.slice.call( arguments, 0 )
        this.pick = function() {
          var returnValue = this[0],
              total = 0,
              _rnd = Utilities.rndf();
  
          for(var i = 0; i < weights.length; i++) {
            total += weights[i];
            if( _rnd < total ) { 
              returnValue = i;
              break;
            }
          }
          return returnValue;
        }
    
      	return this
      },
      gibberArray: function( arr ) {
        
      },
      rndf : function(min, max, number, canRepeat) {
        canRepeat = typeof canRepeat === "undefined" ? true : canRepeat;
      	if(typeof number === "undefined" && typeof min != "object") {
      		if(arguments.length == 1) {
      			max = arguments[0]; min = 0;
      		}else if(arguments.length == 2) {
      			min = arguments[0];
      			max = arguments[1];
      		}else{
      			min = 0;
      			max = 1;
      		}

      		var diff = max - min,
      		    r = Math.random(),
      		    rr = diff * r
	
      		return min + rr;
      	}else{
      		var output = [];
      		var tmp = [];
      		if(typeof number === "undefined") {
      			number = max || min.length;
      		}
		
      		for(var i = 0; i < number; i++) {
      			var num;
      			if(typeof arguments[0] === "object") {
      				num = arguments[0][rndi(0, arguments[0].length - 1)];
      			}else{
      				if(canRepeat) {
      					num = Utilities.rndf(min, max);
      				}else{
                num = Utilities.rndf(min, max);
                while(tmp.indexOf(num) > -1) {
                  num = Utilities.rndf(min, max);
                }
      					tmp.push(num);
      				}
      			}
      			output.push(num);
      		}
      		return output;
      	}
      },
  
      Rndf : function() {
        var _min, _max, quantity, random = Math.random, canRepeat;
    
        if(arguments.length === 0) {
          _min = 0; _max = 1;
        }else if(arguments.length === 1) {
          _max = arguments[0]; _min = 0;
        }else if(arguments.length === 2) {
          _min = arguments[0]; _max = arguments[1];
        }else if(arguments.length === 3) {
          _min = arguments[0]; _max = arguments[1]; quantity = arguments[2];
        }else{
          _min = arguments[0]; _max = arguments[1]; quantity = arguments[2]; canRepeat = arguments[3];
        }    
  
        return function() {
          var value, min, max, range;
    
          min = typeof _min === 'function' ? _min() : _min
          max = typeof _max === 'function' ? _max() : _max
      
          if( typeof quantity === 'undefined') {
            value = Utilities.rndf( min, max )
          }else{
            value = Utilities.rndf( min, max, quantity, canRepeat )
          }
    
          return value;
        }
      },

      rndi : function( min, max, number, canRepeat ) {
        var range;
    
        if(arguments.length === 0) {
          min = 0; max = 1;
        }else if(arguments.length === 1) {
          max = arguments[0]; min = 0;
        }else if( arguments.length === 2 ){
          min = arguments[0]; max = arguments[1];
        }else{
          min = arguments[0]; max = arguments[1]; number = arguments[2]; canRepeat = arguments[3];
        }    
  
        range = max - min
        if( range < number ) canRepeat = true
  
        if( typeof number === 'undefined' ) {
          range = max - min
          return Math.round( min + Math.random() * range );
        }else{
      		var output = [];
      		var tmp = [];
		
      		for(var i = 0; i < number; i++) {
      			var num;
      			if(canRepeat) {
      				num = Utilities.rndi(min, max);
      			}else{
      				num = Utilities.rndi(min, max);
      				while(tmp.indexOf(num) > -1) {
      					num = Utilities.rndi(min, max);
      				}
      				tmp.push(num);
      			}
      			output.push(num);
      		}
      		return output;
        }
      },

      Rndi : function() {
        var _min, _max, quantity, random = Math.random, round = Math.round, canRepeat, range;
    
        if(arguments.length === 0) {
          _min = 0; _max = 1;
        }else if(arguments.length === 1) {
          _max = arguments[0]; _min = 0;
        }else if(arguments.length === 2) {
          _min = arguments[0]; _max = arguments[1];
        }else if(arguments.length === 3) {
          _min = arguments[0]; _max = arguments[1]; quantity = arguments[2];
        }else{
          _min = arguments[0]; _max = arguments[1]; quantity = arguments[2]; canRepeat = arguments[3];
        }  
  
        range = _max - _min
        if( typeof quantity === 'number' && range < quantity ) canRepeat = true
  
        return function() {
          var value, min, max, range;
    
          min = typeof _min === 'function' ? _min() : _min
          max = typeof _max === 'function' ? _max() : _max
    
          if( typeof quantity === 'undefined') {
            value = Utilities.rndi( min, max )
          }else{
            value = Utilities.rndi( min, max, quantity, canRepeat )
          }
    
          return value;
        }
      },
      export : function( target ) {
        target.rndi = Utilities.rndi
        target.rndf = Utilities.rndf
        target.Rndi = Utilities.Rndi
        target.Rndf = Utilities.Rndf
        
        target.future = Utilities.future
        target.solo = Utilities.solo
      },
      init: function() {
        // window.solo = Utilities.solo
        // window.future = Utilities.future // TODO: fix global reference
        Array.prototype.random = Array.prototype.rnd = Utilities.random
        Array.prototype.weight = Utilities.weight
        Array.prototype.fill = Utilities.fill
        Array.prototype.choose = Utilities.choose
        // Array.prototype.Rnd = Utilities.random2
        Array.prototype.merge = Utilities.merge
      }  
    }

  module.exports = function( __Gibber ) { if( typeof Gibber === 'undefined' ) { Gibber = __Gibber; } return Utilities }

}()

},{"./dollar":21}]},{},[22])
(22)
});