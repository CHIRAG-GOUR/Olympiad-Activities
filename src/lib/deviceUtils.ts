import { DeviceInfo } from "@/types/session";

export function getClientDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      ip: "127.0.0.1",
      device: "Desktop",
      browser: "Server / Headless",
      os: "Unknown",
    };
  }

  const ua = navigator.userAgent;
  let browser = "Chrome";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

  let os = "Windows 11";
  if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  let device = "Desktop";
  if (/Mobi|Android/i.test(ua)) device = "Mobile";
  if (/iPad|Tablet/i.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/i.test(ua))) device = "Tablet";

  // Simulated local subnet IP for exam monitoring visibility
  const mockSubnet = Math.floor(Math.random() * 200) + 10;
  const ip = `192.168.1.${mockSubnet}`;

  return {
    ip,
    device,
    browser,
    os,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    userAgent: ua,
  };
}
