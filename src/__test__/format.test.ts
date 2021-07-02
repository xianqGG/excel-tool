import { format, numToChinese, formatWithPostHandle } from "../format";

describe("format", () => {
  it("特殊的单个", () => {
    expect(format("老几：1组3-1号、1组2-1号")).toEqual([
      ["老几", "1组3-1号"],
      ["老几", "1组2-1号"],
    ]);
  });

  it("count", () => {
    expect(format("太平社区：1（2个）")).toEqual([
      ["太平社区", "1"],
      ["太平社区", "1"],
    ]);

    expect(format("太平社区：1-1（2个）、1-2（2个）")).toEqual([
      ["太平社区", "1-1"],
      ["太平社区", "1-1"],
      ["太平社区", "1-2"],
      ["太平社区", "1-2"],
    ]);
  });

  it("递增 & 单双数", () => {
    expect(format("永丰村：1组1号至2号，2组1号-2号")).toEqual([
      ["永丰村", "1组1号"],
      ["永丰村", "1组2号"],
      ["永丰村", "2组1号"],
      ["永丰村", "2组2号"],
    ]);

    expect(
      format("沫江社区：33幢1号-2号、34幢1号-7号（单号）、35幢2号-8号（双号）")
    ).toEqual([
      ["沫江社区", "33幢1号"],
      ["沫江社区", "33幢2号"],

      ["沫江社区", "34幢1号"],
      ["沫江社区", "34幢3号"],
      ["沫江社区", "34幢5号"],
      ["沫江社区", "34幢7号"],

      ["沫江社区", "35幢2号"],
      ["沫江社区", "35幢4号"],
      ["沫江社区", "35幢6号"],
      ["沫江社区", "35幢8号"],
    ]);

    expect(format("永丰村：1组1号、2组69号、3组1号-3号")).toEqual([
      ["永丰村", "1组1号"],
      ["永丰村", "2组69号"],
      ["永丰村", "3组1号"],
      ["永丰村", "3组2号"],
      ["永丰村", "3组3号"],
    ]);
  });

  it("normal", () => {
    expect(format("复兴路：2-1、5")).toEqual([
      ["复兴路", "2-1"],
      ["复兴路", "5"],
    ]);

    expect(format("复兴村：19号、25号")).toEqual([
      ["复兴村", "19号"],
      ["复兴村", "25号"],
    ]);
  });
});

describe("numToChinese", () => {
  it("numToChinese", () => {
    expect(numToChinese(0)).toBe("零");
    expect(numToChinese(1)).toBe("一");

    expect(numToChinese(10)).toBe("十");
    expect(numToChinese(11)).toBe("十一");

    expect(numToChinese(20)).toBe("二十");
    expect(numToChinese(21)).toBe("二十一");

    expect(numToChinese(99)).toBe("九十九");
    expect(numToChinese(100)).toBe("一百");
    expect(numToChinese(101)).toBe("一百零一");
  });
});

describe("formatWithPostHandle", () => {
  it("特殊的单个", () => {
    expect(formatWithPostHandle("老几：1组3-1号、1组2-1号")).toEqual([
      ["老几一组", "3-1"],
      ["老几一组", "2-1"],
    ]);
  });

  it("递增 & 单双数", () => {
    expect(formatWithPostHandle("永丰村：1组1号至2号，2组1号-2号")).toEqual([
      ["永丰村一组", "1"],
      ["永丰村一组", "2"],
      ["永丰村二组", "1"],
      ["永丰村二组", "2"],
    ]);
  });

  it("normal", () => {
    expect(formatWithPostHandle("复兴路：2-1、5")).toEqual([
      ["复兴路", "2-1"],
      ["复兴路", "5"],
    ]);

    expect(formatWithPostHandle("复兴村：19号、25号")).toEqual([
      ["复兴村", "19"],
      ["复兴村", "25"],
    ]);
  });

  it("count", () => {
    expect(formatWithPostHandle("太平社区：1-1（4个）、1-2（3个）")).toEqual([
      ["太平社区", "1-1"],
      ["太平社区", "1-1"],
      ["太平社区", "1-1"],
      ["太平社区", "1-1"],
      ["太平社区", "1-2"],
      ["太平社区", "1-2"],
      ["太平社区", "1-2"],
    ]);
  });
});
