export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** Korean is the source of truth; `en` must provide every key (type-checked). */
const ko = {
  'lang.aria': '언어 선택',
  'install.button': '앱 설치',

  'nav.about': '소개',
  'nav.privacy': '개인정보',
  'nav.terms': '이용안내',
  'nav.licenses': '라이선스',
  'nav.github': 'GitHub',
  'nav.home': 'Building QR 홈',

  'footer.local': '계정·서버 없이 기기에서 로컬 생성',

  'home.title': '링크를 빌딩숲으로',
  'home.sub': 'URL이나 짧은 텍스트를 넣으면 스캔 가능한 도시 스카이라인 QR이 됩니다.',
  'home.inputLabel': '링크 또는 텍스트',
  'home.sampleBtn': '샘플 링크',
  'home.clearBtn': '지우기',
  'home.emptyHint': '권장 {max}자 이하 · 짧은 URL일수록 스캔이 안정적입니다.',
  'home.hint': '{count}자 · {reason}',
  'home.placeholderPreview': '링크를 입력하면 빌딩숲 QR이 여기에 세워집니다.',
  'home.previewBadge': '미리보기',
  'home.captionArt': '3D 빌딩숲 — 천천히 회전합니다',
  'home.captionScan': '2D 평면 — 위에서 본 도시. 공유는 “PNG 저장 / 공유”',

  'validation.ok': '적절한 길이입니다.',
  'validation.overRecommended': '권장 길이({max}자)를 넘었습니다. 짧은 URL일수록 스캔이 안정적입니다.',
  'validation.longWarn': '입력이 길어 일부 카메라에서 인식이 느릴 수 있습니다. 짧은 링크를 권장합니다.',
  'validation.tooLong': '입력이 너무 깁니다({count}자). 짧은 URL을 사용해 주세요.',
  'validation.empty': '링크 또는 텍스트를 입력해 주세요.',

  'reliability.good': '스캔용 보기에서 안정적으로 인식될 가능성이 높습니다.',
  'reliability.somewhatLongWarn': '입력이 다소 깁니다. 짧은 URL일수록 스캔이 안정적입니다.',
  'reliability.longWarn': '입력이 길어 일부 카메라에서 인식이 느릴 수 있습니다. 스캔용 보기나 짧은 링크를 권장합니다.',
  'reliability.complexBad': 'QR 구조가 너무 복잡합니다. 짧은 URL로 바꾸면 안정적으로 스캔됩니다.',
  'reliability.levelGood': '스캔 양호',
  'reliability.levelWarning': '주의',
  'reliability.levelBad': '스캔 어려움',
  'reliability.meta': '{size}×{size} 모듈 · v{version} · 빌딩 {buildings}채',

  'view.art': '3D 빌딩숲',
  'view.scan': '2D 평면',
  'view.aria': '3D 빌딩숲과 2D 평면 보기 전환',

  'preset.label': '스타일',
  'preset.aria': '아트 스타일 선택',
  'preset.dusk-city': '황혼 도시',
  'preset.mono-noir': '느와르 야경',
  'preset.sunrise': '노을 도시',
  'preset.dusk-city.desc': '보랏빛 황혼의 빌딩숲',
  'preset.mono-noir.desc': '푸른 밤의 단색 도시',
  'preset.sunrise.desc': '따뜻한 노을빛 스카이라인',

  'export.design': '디자인',
  'export.designAria': '디자인 선택',
  'export.card': '공유 카드',
  'export.plain': '심플',
  'export.target': '내보내기',
  'export.targetAria': '대상 선택',
  'export.qr': '스캔용 QR',
  'export.art': '3D 아트',
  'export.color': '색상',
  'export.colorAria': 'QR 색상',
  'export.bw': '흑백',
  'export.colorOn': '컬러',
  'export.resolution': '해상도',
  'export.transparent': '투명 배경',
  'export.save': 'PNG 저장',
  'export.share': '공유',
  'export.processing': '처리 중…',
  'export.colorNote': '컬러 QR은 감성적이지만 일부 스캐너에서 약할 수 있어요. 스캔이 중요하면 흑백을 권장합니다.',
  'export.saved': '문서함에 저장했습니다.',
  'export.downloaded': '기기에 저장했습니다.',
  'export.shared': '공유했습니다.',
  'export.failed': '저장에 실패했습니다. 다시 시도해 주세요.',

  'share.scanToOpen': '스캔해서 열어보세요',
  'share.myCity': '내가 만든 빌딩숲',
  'share.text': '내 빌딩숲 QR',

  'error.qrFailed': 'QR 코드를 만들 수 없습니다. 입력을 줄이거나 다른 링크를 사용해 주세요.',
  'error.generic': 'QR 생성 중 오류가 발생했습니다.',

  'render.loading': '3D 준비 중…',
  'render.fallback': 'WebGL을 사용할 수 없어 스캔용 2D 보기로 표시합니다.',
  'render.aria': '빌딩숲 미리보기',
} as const;

export type MessageKey = keyof typeof ko;

const en: Record<MessageKey, string> = {
  'lang.aria': 'Select language',
  'install.button': 'Install',

  'nav.about': 'About',
  'nav.privacy': 'Privacy',
  'nav.terms': 'Guide',
  'nav.licenses': 'Licenses',
  'nav.github': 'GitHub',
  'nav.home': 'Building QR home',

  'footer.local': 'No account or server — generated on your device',

  'home.title': 'Turn your link into a city',
  'home.sub': 'Enter a URL or short text to get a scannable city-skyline QR.',
  'home.inputLabel': 'Link or text',
  'home.sampleBtn': 'Sample link',
  'home.clearBtn': 'Clear',
  'home.emptyHint': 'Recommended ≤ {max} chars · shorter URLs scan more reliably.',
  'home.hint': '{count} chars · {reason}',
  'home.placeholderPreview': 'Enter a link and your building-skyline QR rises here.',
  'home.previewBadge': 'Preview',
  'home.captionArt': '3D city — slowly rotating',
  'home.captionScan': '2D flat — top-down city. Share via “Save / Share”.',

  'validation.ok': 'Good length.',
  'validation.overRecommended':
    'Over the recommended {max} chars. Shorter URLs scan more reliably.',
  'validation.longWarn':
    'Long input may scan slowly on some cameras. A shorter link is recommended.',
  'validation.tooLong': 'Input is too long ({count} chars). Please use a shorter URL.',
  'validation.empty': 'Please enter a link or text.',

  'reliability.good': 'Likely to scan reliably in scan view.',
  'reliability.somewhatLongWarn': 'Input is a bit long. Shorter URLs scan more reliably.',
  'reliability.longWarn':
    'Long input may scan slowly on some cameras. Use scan view or a shorter link.',
  'reliability.complexBad': 'The QR is too complex. Switch to a shorter URL to scan reliably.',
  'reliability.levelGood': 'Good to scan',
  'reliability.levelWarning': 'Caution',
  'reliability.levelBad': 'Hard to scan',
  'reliability.meta': '{size}×{size} modules · v{version} · {buildings} buildings',

  'view.art': '3D city',
  'view.scan': '2D flat',
  'view.aria': 'Toggle 3D city / 2D flat',

  'preset.label': 'Style',
  'preset.aria': 'Select art style',
  'preset.dusk-city': 'Dusk City',
  'preset.mono-noir': 'Noir Night',
  'preset.sunrise': 'Sunrise City',
  'preset.dusk-city.desc': 'Purple-dusk skyline',
  'preset.mono-noir.desc': 'Monochrome blue night',
  'preset.sunrise.desc': 'Warm sunset skyline',

  'export.design': 'Design',
  'export.designAria': 'Choose design',
  'export.card': 'Share card',
  'export.plain': 'Plain',
  'export.target': 'Export',
  'export.targetAria': 'Choose target',
  'export.qr': 'Scan QR',
  'export.art': '3D art',
  'export.color': 'Color',
  'export.colorAria': 'QR color',
  'export.bw': 'B/W',
  'export.colorOn': 'Color',
  'export.resolution': 'Resolution',
  'export.transparent': 'Transparent',
  'export.save': 'Save PNG',
  'export.share': 'Share',
  'export.processing': 'Working…',
  'export.colorNote':
    'Colored QR looks nice but may be weaker on some scanners. Use B/W if scanning matters.',
  'export.saved': 'Saved to your files.',
  'export.downloaded': 'Saved to your device.',
  'export.shared': 'Shared.',
  'export.failed': 'Save failed. Please try again.',

  'share.scanToOpen': 'Scan to open',
  'share.myCity': 'My building skyline',
  'share.text': 'My Building QR',

  'error.qrFailed': 'Could not create the QR. Try shortening the input or a different link.',
  'error.generic': 'Something went wrong creating the QR.',

  'render.loading': 'Preparing 3D…',
  'render.fallback': 'WebGL is unavailable — showing the 2D scan view.',
  'render.aria': 'Building skyline preview',
};

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = { ko, en };
