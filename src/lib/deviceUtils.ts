import { DeviceInfo } from "@/types/session";

export function getClientDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      ip: "—",
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

  // A browser cannot see its own public IP; only a server could record it. Report it as
  // unknown rather than inventing an address that then appears in reports as fact.
  return {
    ip: "—",
    device,
    browser,
    os,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    userAgent: ua,
  };
}
