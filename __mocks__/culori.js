module.exports = {
  converter: (format) => {
    return (color) => {
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        } : { r: 0, g: 0, b: 0 };
      };

      const rgbToHsl = (r, g, b) => {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }

        return { h: h * 360, s, l };
      };

      const rgbToOklch = (r, g, b) => {
        const L = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
        const M = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
        const S = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

        const L_ = Math.cbrt(L);
        const M_ = Math.cbrt(M);
        const S_ = Math.cbrt(S);

        const l = 0.2104542553 * L_ + 0.7936177850 * M_ - 0.0040720468 * S_;
        const a = 1.9779984951 * L_ - 2.4285922050 * M_ + 0.4505937099 * S_;
        const b_ = 0.0259040371 * L_ + 0.7827717662 * M_ - 0.8086757660 * S_;

        const c = Math.sqrt(a * a + b_ * b_);
        const h = c === 0 ? 0 : Math.atan2(b_, a) * (180 / Math.PI);

        return { l, c, h };
      };

      const hslToRgb = (h, s, l) => {
        let r, g, b;

        if (s === 0) {
          r = g = b = l;
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          const h_ = h / 360;

          r = hue2rgb(p, q, h_ + 1/3);
          g = hue2rgb(p, q, h_);
          b = hue2rgb(p, q, h_ - 1/3);
        }

        return { r, g, b };
      };

      const rgbToHex = (r, g, b) => {
        const r_ = Math.round(r * 255);
        const g_ = Math.round(g * 255);
        const b_ = Math.round(b * 255);
        return `#${[r_, g_, b_].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      };

      const hslToHex = (h, s, l) => {
        const rgb = hslToRgb(h, s, l);
        return rgbToHex(rgb.r, rgb.g, rgb.b);
      };

      if (format === 'hsl') {
        return rgbToHsl(hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b);
      }

      if (format === 'rgb') {
        return hexToRgb(color);
      }

      if (format === 'oklch') {
        const rgb = hexToRgb(color);
        return rgbToOklch(rgb.r, rgb.g, rgb.b);
      }

      if (typeof color === 'object' && color.h !== undefined) {
        return hslToRgb(color.h, color.s || 0, color.l || 0.5);
      }

      return color;
    };
  },
  formatter: {
    hex: (color) => {
      if (typeof color === 'string') {
        return color.startsWith('#') ? color : `#${color}`;
      }

      if (color.h !== undefined) {
        const hslToRgb = (h, s, l) => {
          let r, g, b;

          if (s === 0) {
            r = g = b = l;
          } else {
            const hue2rgb = (p, q, t) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1/6) return p + (q - p) * 6 * t;
              if (t < 1/2) return q;
              if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            const h_ = h / 360;

            r = hue2rgb(p, q, h_ + 1/3);
            g = hue2rgb(p, q, h_);
            b = hue2rgb(p, q, h_ - 1/3);
          }

          return { r, g, b };
        };

        const rgb = hslToRgb(color.h, color.s || 0, color.l || 0.5);
        const r_ = Math.round(rgb.r * 255);
        const g_ = Math.round(rgb.g * 255);
        const b_ = Math.round(rgb.b * 255);
        return `#${[r_, g_, b_].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      }

      if (color.r !== undefined) {
        const r_ = Math.round((color.r || 0) * 255);
        const g_ = Math.round((color.g || 0) * 255);
        const b_ = Math.round((color.b || 0) * 255);
        return `#${[r_, g_, b_].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      }
      return color;
    }
  },
};
