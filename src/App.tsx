import React, { useState } from "react";
import { Button, Input, Upload } from "@muya-ui/core";
import { AddIcon } from "@muya-ui/theme-up";
// https://www.npmjs.com/package/xlsx
import xlsx from "xlsx";
import { formatWithPostHandle } from "./format";
import { wait } from "@muya-ui/utils";

const DV = `复兴路：2-1、5；复兴村：19号、25号；新乐街：1号-165号（单号）；新乐街：2号-230号（双号）；沫江社区：33幢1号-16号、34幢1号-13号（单号）、35幢2号-8号（双号）；永丰村：1组1号、2组69号、3组1号-19号；太平社区：1-1（44个）、1-2（30个）；永丰村1组1号-41号，2组1号-69号，3组1号-42号，4组1号-38号，5组1号-53号，6组1号-70号；喻坝村1组1号至7号，2组1号至47号，3组1号至81号，4组1号至53号，5组1号至94号，6组1号至111号；临江路南段2号、4号、42号、福禄大街北段28号、30号、向阳路南段1号-65号、福兴街34号附1号-附130号、福禄大街南段27号附1号-附100号、新政街25号附1号-附100号、福兴街33号附1号-附40号；幸福路7号、幸福路62号、幸福路72号、兴贸街56号、明珠街1号、明珠街3号、明珠街34号、明珠街36号；龙泉街：1号、3号、4号、6号、7号、8号、10号、12号、14号-45号、47号、49号-87号（单号）；`;

function App() {
  const [val, setVal] = useState(DV);
  return (
    <div className="App">
      <Input
        multiline
        minRows={5}
        value={val}
        width="100%"
        onChange={(e) => setVal(e.target.value)}
      />
      <div>
        <Button
          autoLoading
          onClick={async () => {
            await wait.time(100);
            const data = val
              .trim()
              .split("；")
              .reduce(
                (res, curr) => {
                  res.push(...formatWithPostHandle(curr).map((it) => [...it]));
                  return res;
                },
                [["名称", "号码"]]
              );

            const fi = xlsx.utils.json_to_sheet(data);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, fi);
            xlsx.writeFile(wb, "out.xlsb");
            console.log(data);
          }}
        >
          生成 excel
        </Button>
      </div>
    </div>
  );
}

export default App;
