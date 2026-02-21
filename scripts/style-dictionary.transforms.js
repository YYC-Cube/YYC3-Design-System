// scripts/style-dictionary.transforms.js
import StyleDictionary from 'style-dictionary';
import * as culori from 'culori';

// Helper: try to parse an OKLCH string and return hex (lowercase, 7-char #rrggbb)
function oklchStringToHex(oklchString) {
  try {
    // culori.parse accepts CSS color functions like "oklch(0.62 0.18 348.14)"
    const parsed = culori.parse(oklchString);
    if (!parsed) return null;
    // convert to sRGB and clamp then format as hex
    const srgb = culori.converter('srgb')(parsed);
    // culori.formatHex will produce #rrggbb (no alpha)
    const hex = culori.formatHex(srgb);
    return hex;
  } catch (e) {
    // parsing/conversion failed
    return null;
  }
}

// Transform: name kebab-case (ensure consistent variable names)
StyleDictionary.registerTransform({
  name: 'name/cti/kebab',
  type: 'name',
  transformer: function(prop) {
    return prop.path.join('-').toLowerCase();
  }
});

// Transform: name camelCase for JS output
StyleDictionary.registerTransform({
  name: 'name/cti/camel',
  type: 'name',
  transformer: function(prop) {
    const parts = prop.path;
    return parts
      .map((p, i) => i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
  }
});

// Transform: keep rem values as-is (placeholder, can extend to produce px fallback)
StyleDictionary.registerTransform({
  name: 'size/remToRem',
  type: 'value',
  matcher: function(prop) {
    return typeof prop.value === 'string' && prop.value.endsWith('rem');
  },
  transformer: function(prop) {
    return prop.value;
  }
});

// NEW Transform: color/oklch-to-hex
// - If token value is an object with `hex` field, prefer that.
// - If token value is an object with `oklch` or `okLch` string, try to convert to hex via culori.
// - If token value is a string starting with "oklch(", try to convert.
// - Fallback: return original value.
StyleDictionary.registerTransform({
  name: 'color/oklch-to-hex',
  type: 'value',
  matcher: function(prop) {
    // apply to tokens that are color-related by path or by value pattern
    const pathStr = prop.path.join('.').toLowerCase();
    if (pathStr.includes('color') || pathStr.includes('colour') || pathStr.includes('chart') || pathStr.includes('ring')) {
      return true;
    }
    // also match if value looks like an oklch string
    if (typeof prop.value === 'string' && prop.value.trim().toLowerCase().startsWith('oklch(')) return true;
    if (typeof prop.value === 'object' && (prop.value.oklch || prop.value.okLch || prop.value.hex)) return true;
    return false;
  },
  transformer: function(prop) {
    const v = prop.value;

    // Case A: value is object with explicit hex -> use it
    if (v && typeof v === 'object') {
      if (v.hex) return v.hex;
      // try okLch or oklch field
      const okField = v.oklch || v.okLch || v.okLCH || v.okLCHString;
      if (okField && typeof okField === 'string') {
        const hex = oklchStringToHex(okField);
        if (hex) return hex;
      }
      // sometimes tokens store the oklch string directly under a nested key
      // fallback: if object has a string value that looks like oklch, try that
      for (const key of Object.keys(v)) {
        const val = v[key];
        if (typeof val === 'string' && val.trim().toLowerCase().startsWith('oklch(')) {
          const hex = oklchStringToHex(val);
          if (hex) return hex;
        }
      }
      // final fallback: JSON stringify (not ideal for CSS)
      return JSON.stringify(v);
    }

    // Case B: value is a string like "oklch(0.62 0.18 348.14)"
    if (typeof v === 'string') {
      const s = v.trim();
      if (s.toLowerCase().startsWith('oklch(')) {
        const hex = oklchStringToHex(s);
        if (hex) return hex;
        // if conversion fails, return original string so modern browsers can use it
        return s;
      }
      // if already hex or other color string, return as-is
      return v;
    }

    // Other types: return as-is
    return v;
  }
});

// Transform: compose shadow string from shadow token parts
StyleDictionary.registerTransform({
  name: 'shadow/compose',
  type: 'value',
  matcher: function(prop) {
    return prop.path.includes('shadow') && typeof prop.value === 'object';
  },
  transformer: function(prop) {
    const s = prop.value;
    const color = s.color_hex || s.color || 'rgba(0,0,0,0.12)';
    return `${s.x} ${s.y} ${s.blur} ${s.spread} ${color}`;
  }
});

// Optional: register a JS theme format if you want a flattened theme export
StyleDictionary.registerFormat({
  name: 'javascript/theme',
  formatter: function({ dictionary }) {
    const obj = {};
    dictionary.allProperties.forEach(prop => {
      const path = prop.path.join('.');
      obj[path] = prop.value;
    });
    return `export default ${JSON.stringify(obj, null, 2)};`;
  }
});

export default StyleDictionary;
