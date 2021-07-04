import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Typography,
  Space,
  Row,
  Col,
  toast,
  Img,
  Link,
  Spin,
} from "@muya-ui/core";
// https://www.npmjs.com/package/xlsx
import xlsx from "xlsx";
import { formatWithPostHandle } from "./format";
import { useEventCallback, wait } from "@muya-ui/utils";
import { logger } from "./logger";
import { clearUID, getUID, saveUID } from "./configFile";
import styled from "styled-components";
import { IItem } from "./types";
import qrcode from "./assets/qrcode.png";
import { getUidInfo } from "./services";
import { useAsyncRetry, useAsync } from "react-use";

const Tool: React.FC = () => {
  const [val, setVal] = useState("");
  return (
    <Space block direction="vertical" spacing="s5">
      <Input
        multiline
        minRows={5}
        value={val}
        width="100%"
        onChange={(e) => setVal(e.target.value)}
        placeholder="请输入需要被解析的内容"
      />
      <Typography.Paragraph fontSize="s1" color="assistant">
        解析样例：复兴路：2-1、5；复兴村：19号、25号；新乐街：1号-165号（单号）；新乐街：2号-230号（双号）；沫江社区：33幢1号-16号、34幢1号-13号（单号）、35幢2号-8号（双号）；永丰村：1组1号、2组69号、3组1号-19号；太平社区：1-1（44个）、1-2（30个）；永丰村1组1号-41号，2组1号-69号，3组1号-42号，4组1号-38号，5组1号-53号，6组1号-70号；喻坝村1组1号至7号，2组1号至47号，3组1号至81号，4组1号至53号，5组1号至94号，6组1号至111号；临江路南段2号、4号、42号、福禄大街北段28号、30号、向阳路南段1号-65号、福兴街34号附1号-附130号、福禄大街南段27号附1号-附100号、新政街25号附1号-附100号、福兴街33号附1号-附40号；幸福路7号、幸福路62号、幸福路72号、兴贸街56号、明珠街1号、明珠街3号、明珠街34号、明珠街36号；龙泉街：1号、3号、4号、6号、7号、8号、10号、12号、14号-45号、47号、49号-87号（单号）；
      </Typography.Paragraph>
      <div>
        <Button
          type="primary"
          autoLoading
          onClick={async () => {
            await wait.time(100);
            const data = val
              .trim()
              .split("；")
              .reduce<
                Array<{
                  名称: string;
                  号码: string;
                  错误信息?: string;
                }>
              >((res, curr) => {
                res.push(
                  ...formatWithPostHandle(curr).map((it) => ({
                    名称: it[0],
                    号码: it[1],
                  }))
                );
                return res;
              }, []);

            const errorStr = logger.cache.error
              .map((it) => JSON.stringify(it))
              .join("\n");
            logger.cache.error.length = 0;

            if (data[0]) {
              data[0].错误信息 = errorStr;
            }

            const fi = xlsx.utils.json_to_sheet(data, {
              header: ["名称", "号码", "错误信息"],
            });
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, fi);
            xlsx.writeFile(wb, "out.xlsx");
          }}
        >
          生成 Excel
        </Button>
      </div>
    </Space>
  );
};

const isChromium = (() => {
  try {
    for (let brand_version_pair of (navigator as any).userAgentData.brands) {
      if (brand_version_pair.brand == "Chromium") {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
})();

function App() {
  const [item, setItem] = useState<IItem>(null);
  const inputRef = useRef<any>();

  const { loading: initialing } = useAsync(() =>
    getUidInfo(getUID())
      .catch(() => null)
      .then((target) => {
        if (target) {
          setItem(target);
        } else {
          clearUID();
        }
      })
  );

  const { retry: handleValidate, loading } = useAsyncRetry(async () => {
    const v: string = inputRef.current.value.trim();
    if (!v) return;
    try {
      const target = await getUidInfo(v);
      if (!target) {
        return toast.error("无效的序列码");
      }
      setItem(target);
      saveUID(v);
    } catch (error) {
      toast.error("查询失败请重试");
    }
  });

  const loop = useEventCallback(() => {
    if (item && item.expire && item.expire < Date.now()) {
      toast.warning("已截止有效期");
      setItem(null);
      clearUID();
      return;
    }
    return setTimeout(loop, 1000);
  });

  useEffect(() => {
    const id = loop();
    return () => {
      clearTimeout(id);
    };
  }, [item]);

  return (
    <Spin spinning={initialing || loading}>
      <Container>
        <Space direction="vertical" spacing="s8" block>
          <Typography.Title>
            门楼牌清单数据自动分解&nbsp;
            <Typography.Text color="text" fontSize="s3">
              有偿代做：Excel数据处理（代码定制），PS修图，CDR排版;
            </Typography.Text>
          </Typography.Title>
          {!isChromium && (
            <Typography.Paragraph color="assistant" fontSize="s2">
              推荐使用 Chromium 内核的浏览器来打开本站点，推荐新版的
              <Link
                href="https://www.microsoft.com/en-us/edge"
                target="_blank"
                style={{ verticalAlign: "baseline" }}
              >
                Edge 浏览器
              </Link>
              或
              <Link
                href="https://www.google.cn/intl/zh-CN/chrome"
                target="_blank"
                style={{ verticalAlign: "baseline" }}
              >
                Chrome 浏览器
              </Link>
              。
            </Typography.Paragraph>
          )}
          {!!item ? (
            <>
              <Space block direction="vertical" spacing="s8">
                <Space spacing="s6">
                  <Typography.Paragraph fontSize="s2">
                    有效期至：
                    {item.expire
                      ? new Date(item.expire).toLocaleString()
                      : "永久有效"}
                  </Typography.Paragraph>

                  <Button
                    size="s"
                    onClick={() => {
                      clearUID();
                      setItem(null);
                    }}
                  >
                    重置序列码
                  </Button>
                </Space>
                <Tool />
              </Space>
            </>
          ) : (
            <Row align="middle" gutter={10}>
              <Col span={10} sm={12} xs={18}>
                <Input
                  width="100%"
                  placeholder="请输入序列码"
                  inputRef={inputRef}
                  maxLength={32}
                  limit={32}
                  onPressEnter={handleValidate}
                />
              </Col>
              <Col span={4} sm={4} xs={6}>
                <Button type="primary" onClick={handleValidate}>
                  验证
                </Button>
              </Col>
            </Row>
          )}
          <Row justify="center">
            <div>
              <Img
                component="img"
                src={qrcode}
                suffix="off"
                style={{ marginTop: 100, borderRadius: 4 }}
                width={240}
                height={240}
              />
              <Typography.Paragraph
                style={{ textAlign: "center" }}
                marginTop={12}
                fontSize="s3"
              >
                扫一扫，加微信
              </Typography.Paragraph>
            </div>
          </Row>
        </Space>
      </Container>
    </Spin>
  );
}

const Container = styled.div`
  width: 1080px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 30px;
`;

export default App;
