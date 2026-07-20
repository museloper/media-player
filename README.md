# Media Player

음원/영상 재생목록 플레이어 (Electron)

## 다운로드

최신 설치 파일: https://github.com/museloper/media-player/releases/tag/latest

## 설치

### macOS

1. `.dmg` 파일을 열고 `Media Player.app`을 `Applications` 폴더로 드래그
2. 서명되지 않은 앱이라 처음 열 때 "손상되었기 때문에 열 수 없습니다" 오류가 뜰 수 있음. 터미널에서 아래 명령어 실행 후 다시 열기:

   ```bash
   xattr -cr "/Applications/Media Player.app"
   ```

### Windows

1. `MediaPlayerSetup.exe` 실행
2. SmartScreen 경고가 뜨면 "추가 정보" → "실행" 클릭
3. 이후로는 앱 실행 시 자동으로 새 버전을 확인·설치함 (재실행 시 반영)

## 개발

```bash
npm install
npm start        # 앱 실행
npm run dist:mac # macOS 설치 파일 빌드
npm run dist:win # Windows 설치 파일 빌드
```

`main` 브랜치에 푸시하면 GitHub Actions가 자동으로 두 플랫폼 설치 파일을 빌드해 위 릴리즈 링크에 업로드합니다. Windows는 빌드마다 버전을 자동으로 올려서 앱 내 자동 업데이트가 새 빌드를 감지할 수 있게 합니다. macOS는 서명/공증이 없어 자동 업데이트를 지원하지 않고, 위 다운로드 링크에서 수동으로 다시 받아야 합니다.
