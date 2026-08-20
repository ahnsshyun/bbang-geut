# 나란히 (Naranhi)

> 회복의 모든 날을 나란히 · 回復のすべての日をともに

한국에서 수술(주로 성형외과, 코성형/융비술 등)을 받은 **외국인 환자**를 위한 애프터케어 동반 앱입니다.
수술 다음 날(D+0)부터 완전 회복 시점(D+120)까지, 병원의 회복 프로토콜을 매일 환자 곁에 두는 것을 목표로 합니다.

- **주 이용자**: 한국 병원에서 시술받은 외국인 환자 (현재 테스트 시나리오는 일본인 환자 기준)
- **핵심 가치**: "혼자 판단하지 않아도 되도록" — 오늘 뭘 해야 하는지, 뭘 해도 되고 안 되는지를 매일 안내

---

## 1. 전체 사용자 흐름

```
Splash (언어 선택)
  → Login (환자 ID + 생년월일)
    → Onboarding
        1) Intake       — 병원에서 받은 자료 확인 + 처방전 촬영/등록
        2) Check         — 시술 정보 확인
        3) Personal      — 개인 변수 질문 + 귀국 예정일 입력
        4) Complete      — 120일 케어 루틴 생성 완료
      → Home (하단 탭바 진입)
```

로그인 이후는 하단 탭바 4개 영역으로 구성됩니다.

| 탭 | 화면 | 역할 |
|---|---|---|
| 홈 | Home | 오늘(D+N) 기준 진행 상황, 오늘 할 일, 오늘 해도 될까 |
| 체크인 | CheckinPhoto → CheckinStatus → CheckinComplete | 매일 사진 3컷 + 증상 기록 |
| 기록 | History / HistorySubmission | 캘린더, 사진·증상 타임라인, 병원 제출용 리포트 |
| 병원 연결 | Hospital | 예약 목록, 원격 상담 채팅 |

부가 화면: Schedule(전체 일정 캘린더), HomeCountry(귀국용 요약), Notification(알림)

---

## 2. 화면별 상세

### 온보딩

- **OnboardingIntake**: 병원이 등록한 자료(수술기록 PDF, 주의사항 안내문, 예약 일정) 수신 여부와, 환자가 직접 등록해야 하는 처방전 상태를 보여줌
- **PrescriptionCapture / PrescriptionResult**: 처방전을 "촬영"하는 UX를 거치되, 실제로는 서버(관리자가 사전 등록한 데이터)에서 OCR 결과를 조회하는 구조. 정기 복용약/필요시 약을 구분해서 보여주고 확정(confirm)
- **OnboardingCheck**: 시술명/상세/수술일/시술기관/환자 정보를 확인만 하는 화면
- **OnboardingPersonal**: 예/아니오 질문(개인 변수) + 귀국 예정일 캘린더 입력 → 귀국일에 따라 비행 가능/주의/금지 구간 안내
- **OnboardingComplete**: 생성된 120일 루틴 요약(루틴 수, 가능/주의/금지 항목 수, 금기 해제 건수, 내원 예약 수, 복약 기간, 귀국일)

### 홈 (Home)

- D+N 진행 카드: 수술일 기준 경과일, 단계(stage), 전체 진행률 바
- 통계: 다시 할 수 있게 된 것 / 케어 루틴 완주율 / 다음 해금 / 귀국까지 D-n
- 오늘 체크인 여부 배너
- **오늘 해야할 케어 루틴**: 태스크별 반복 체크(회차별 원형 버튼), 클릭 시 "왜 해야 하는지 + 어떻게 하는지 + 병원 안내문 원문"을 담은 바텀시트 모달
- **오늘 해도 될까?**: 가능(ok) / 주의(caution) / 금지(danger) 3그룹, 주의·금지 항목은 클릭 시 상세 모달

### 체크인 (Checkin)

3단계 플로우, 상단에 진행률 바(3칸):
1. **CheckinPhoto**: 정면 → 좌측 → 우측 순서로 사진 촬영(파일 선택 UI, 실제 업로드 API 연동)
2. **CheckinStatus**: 부기/통증/멍 등 증상을 1~5단계로 선택
3. **CheckinComplete**: 그날 기록 완료 + 전체 루틴 완주율 표시

이미 오늘 체크인을 완료한 경우, 체크인 탭 진입 시 자동으로 Complete 화면으로 리다이렉트됩니다.

### 기록 (History)

- **History**: 캘린더(수술일/내원일/귀국일/완주일 마커, 체크인 있는 날 표시) + 날짜 클릭 시 그날의 사진 3장·증상·자가케어 기록 모달, 페이지 하단엔 최근 사진 타임라인과 증상 흐름 그래프 고정 표시
- **HistorySubmission**: 의료기관 제출용 "위클리 리포트" — 체크인/사진/루틴 이행률 통계, 증상 변화(↑↓—), 셀프케어 루틴별 도넛 차트, AI 자동 요약, 의료기관 확인 이력, PDF 저장 및 "병원에 전달하기"(상담 채팅에 리포트 첨부)
- **HomeCountry**: 귀국 후 현지 병원 제출용 요약(시술/상세/시술일/기관/담당의/경과/주의/차기진료 등을 문장으로 정리), PDF 저장

### 전체 일정 (Schedule)

- 캘린더 + 앞으로의 변화(타임라인 리스트, 내원/귀국/해금 등 배지)
- 날짜 클릭 시 그 날의 루틴 목록과 가능/주의/금지 항목을 바텀시트로 표시

### 병원 연결 (Hospital)

- 병원 정보 배너(병원명, 담당의, 연락처)
- 예약 목록(예정/완료/미방문 배지)
- 원격 상담 채팅: 실시간 번역(번역문/원문 토글), 메시지 자동 한국어 번역 전송, 날짜 구분선, 리포트 첨부 전송

### 기타

- **Notification**: 병원 답변 / 오늘 루틴 알림 두 섹션
- **Modal 시스템**: 바텀시트형 `Modal` 컴포넌트를 공용 뼈대로 두고, 케어루틴/처방약/히스토리/일정별 상세 모달을 그 위에 조립

---

## 3. 다국어(i18n) 구조

- 자체 제작한 경량 i18n 시스템 (외부 라이브러리 미사용)
- `src/i18n/*.i18n.js` — 도메인별 파일 분리(theme, home, checkin, onboarding, schedule, login, history, hospital, notification, splash), `index.js`에서 병합해 `dict` export
- `src/hooks/useLang.js` — 현재 언어(`ko`/`ja`)를 판별하고 `t(key)` 번역 함수 제공
- 언어 결정 방식은 백엔드 정책 변경에 따라 진화 중:
  - (구) 로그인 시 서버가 `patient.lang`을 `lang_locked`로 고정 → 이후 화면은 이 값을 최우선 사용
  - (신) 서버가 `lang_locked` 제거, UI 언어는 **매 요청마다 프론트가 보내는 값**이 최우선. `patient.lang`은 이제 리포트/문맥 전용
  - 이에 따라 프론트는 `axios` 인터셉터에서 모든 요청에 현재 선택 언어를 쿼리 파라미터로 자동 첨부하는 방식으로 전환
- Splash 화면에서 언어 버튼을 누르면 페이지 이동 없이 즉시 화면 텍스트가 바뀌도록 구현(로컬 state + `localStorage` 저장 분리)
- 서버가 주는 일부 텍스트 필드(예: 캘린더 배지, 온보딩 notice 문구)가 `lang` 파라미터와 무관하게 한국어로 고정되어 오는 경우가 반복적으로 발견되어, 해당 필드는 프론트에서 `key` 기반으로 직접 번역 매핑하는 방식으로 우회 처리

---

## 4. 프론트엔드 구조

```
src/
  api/           # 도메인별 axios 호출 함수 (auth, home, onboarding, prescription,
                  #   records, schedule, checkins, clinic, consult, notifications, client)
  components/
    Box/          # 재사용 카드/정보박스 컴포넌트 (Box, HomeBox, HistoryBox, HospitalBox)
    Modal/        # 바텀시트 모달 (Modal, HistoryModal, ScheduleModal)
    Theme/        # 페이지 상단 공용 레이아웃 (LoginTheme, HomeTheme, CheckinTheme, HistoryTheme)
    Calendar.jsx, Layout.jsx, Button.jsx, Icons.jsx 등
  hooks/          # useHome, useMe, useCheckin, useOnboardingStatus, useLang
  i18n/           # 다국어 딕셔너리
  login-pages/    # Splash, Login, Onboarding*, Prescription*
  home-pages/     # Home, History, HistorySubmission, HomeCountry, Schedule, Hospital, Notification
  checkin-pages/  # CheckinPhoto, CheckinStatus, CheckinComplete
  styles/         # colors.js, fonts.js
```

- **React + Vite**, **styled-components**로 스타일링
- **react-router-dom**으로 라우팅, 페이지 진입 시 API 데이터를 불러와 로딩/에러/정상 3단계로 분기하는 패턴을 전 화면에서 일관되게 사용
- **axios 인스턴스(`api/client.js`)**가 JWT access/refresh 토큰 자동 첨부 및 401 시 자동 재발급을 처리
- 모든 상세 정보(왜 해야 하는지, 병원 안내문 원문, 면책 문구)는 공용 `Modal` 뼈대 위에서 도메인별 콘텐츠만 갈아끼우는 구조로 설계

---

