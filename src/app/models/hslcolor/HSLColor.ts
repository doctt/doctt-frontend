class HSLColor {
  public h: number;
  public s: number;
  public l: number;

  constructor (h: number, s: number, l: number){
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toCSS() : string {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }

  static toHSL(hex: string): HSLColor {
    hex = hex.toUpperCase();
    if (!hex.match(/^#[A-F0-9]{6}$/)) {
      return null;
    }
    let v = hex.match(/[A-F0-9]{2}/g);
    let r = parseInt(v[0], 16) / 255;
    let g = parseInt(v[1], 16) / 255;
    let b = parseInt(v[2], 16) / 255;

    let min = Math.min(r, g, b);
    let max = Math.max(r, g, b);

    let l = (max + min) / 2;
    let s = (l < 0.5 ? (max - min) / (max + min) : (max - min) / (2.0 - max - min));
    let h = (max == r ? (g - b) / (max - min) : (
      max == g ? 2.0 + (b - r) / (max - min) :
        4.0 + (r - g) / (max - min)
    ));

    h *= 60;
    if (h < 0) {
      h += 360;
    }

    let hslColor = new HSLColor(Math.round(h), Math.round(s * 100), Math.round(l * 100));

    return hslColor;
  }
  
}

export {HSLColor};