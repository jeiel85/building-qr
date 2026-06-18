# Manual scan QA checklist

The product principle: **pretty but unscannable = failure.** Run this before any release.
The 2D **black/white** export is the canonical scannable artifact.

## Scanners to test

- [ ] iPhone basic Camera
- [ ] Android basic Camera
- [ ] Samsung Camera
- [ ] Google Lens
- [ ] KakaoTalk QR scanner (가능 시)

## Conditions

- [ ] On-screen 2D view scans
- [ ] Exported PNG (B/W) scans from another device
- [ ] Screen brightness 50% still scans
- [ ] Low-light capture scans
- [ ] Printed export scans
- [ ] Long URL → `warning`/`bad` reliability shown, short URL recommended
- [ ] Quiet zone present in export
- [ ] Finder patterns undistorted in 2D / export

## Colored export

- [ ] Colored export is clearly labelled as lower-contrast
- [ ] B/W is the default and scans reliably

## Performance / rendering

- [ ] 3D renders on a mid-range Android (≥ 30fps)
- [ ] WebGL-disabled device falls back to 2D
- [ ] Mode transition is smooth on mobile
- [ ] No memory leak after repeated input changes (renderer disposes)

## Automated decode (regression)

A rendered/exported QR must decode back to the exact input. (Verified in development with
jsQR against the canvas output — wire into Playwright/CI before submission.)
