class Jeport {
  constructor(paperSize = EnumPaperSize.A4) {
    this.paperSize = paperSize;
  }

  static getPaperSize() {
    return this.paperSize;
  }

  static drowReport() {}
}

const EnumPaperSize = {
  A0: {
    width: 2384,
    height: 3370,
  },
  A1: {
    width: 1684,
    height: 2384,
  },
  A2: {
    width: 1191,
    height: 1684,
  },
  A3: {
    width: 841,
    height: 1191,
  },
  A4: {
    width: 595,
    height: 841,
  },
  A5: {
    width: 420,
    height: 595,
  },
};
