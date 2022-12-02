import { UAParser } from 'ua-parser-js';

export const getInfoDevice = (userAgent: string) => {
  const parser = new UAParser();
  parser.setUA(userAgent);
  const result = parser.getResult();
  const { browser, os, device } = result;
  return {
    browser: browser.name,
    os: os.name,
    device: device.vendor,
  };
};
