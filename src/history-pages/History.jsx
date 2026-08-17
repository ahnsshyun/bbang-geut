import React, { useEffect, useState } from "react";
import HomeTheme from "../components/HomeTheme";
import HistoryTheme from "../components/HistoryTheme";
import Calendar from "../components/Calendar";
import { PhotoTimelineBox, SymptomFlowBox } from "../components/HistoryBox";
import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { ShadowBox } from "../components/Box";
import { HistoryDayModal } from "../components/HistoryModal";

import { getCalendar, getPhotoTimeline, getSymptomFlow, getDayDetail } from "../api/records";
import { getHome } from "../api/home";

// records/day의 photos는 { front: url, left: url, right: url } 형태.
// 각도 키 → 모달에 보여줄 한글 라벨
const ANGLE_LABELS = { front: "정면", left: "좌", right: "우" };

function formatKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDot(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function parseISODate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const History = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalDate, setModalDate] = useState(null);
  const [modalDetail, setModalDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [calendarData, setCalendarData] = useState(null);
  const [photoTimeline, setPhotoTimeline] = useState(null);
  const [symptomFlow, setSymptomFlow] = useState(null);
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCalendar(), getPhotoTimeline(), getSymptomFlow({ days: 14 }), getHome()])
      .then(([cal, photos, symptoms, home]) => {
        if (cancelled) return;
        setCalendarData(cal);
        setPhotoTimeline(photos);
        setSymptomFlow(symptoms);
        // TODO: /records/calendar 응답엔 수술일이 직접 없어서 /home의 date - day로 역산.
        const d = new Date(home.date);
        d.setDate(d.getDate() - home.day);
        setSurgeryDate(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setModalDate(date);
    setModalDetail(null);
    setModalLoading(true);

    getDayDetail({ date: formatKey(date) })
      .then((data) => setModalDetail(data))
      .catch(() => setModalDetail(null))
      .finally(() => setModalLoading(false));
  };

  if (loading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>불러오는 중이에요...</p>
      </HomeTheme>
    );
  }

  if (error || !calendarData || !surgeryDate) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>기록을 불러오지 못했어요. 네트워크 상태를 확인해 주세요.</p>
      </HomeTheme>
    );
  }

  const checkinDates = calendarData.days.filter((d) => d.has_checkin).map((d) => parseISODate(d.date));

  // return_box가 없을 수도 있어(귀국 전/후 무관하게 표시는 하되) 안전하게 기본값 처리
  const returnDDay = calendarData.return_box?.dn ?? 0;
  const returnDateLabel = calendarData.return_box?.date ? formatDot(parseISODate(calendarData.return_box.date)) : "";

  // TODO: photos 섹션의 progressPercent는 별도 API 값이 없어서
  // "지금까지 사진 있는 날 수 / 지금까지 지난 날 수"로 임시 계산했습니다. 정확한 정의가 있으면 교체 필요.
  const photoItems = photoTimeline?.items ?? [];
  const maxDay = photoItems.length ? Math.max(...photoItems.map((i) => i.day)) : 0;
  const photoProgressPercent = maxDay > 0 ? Math.round((photoItems.length / (maxDay + 1)) * 100) : 0;

  const timelinePhotos = photoItems.map((item) => ({ label: `D+${item.day}` }));

  const timelineSymptoms = (symptomFlow?.terms ?? []).map((term) => ({
    key: term.key,
    label: term.name,
    days: term.points.map((p) => ({ label: `D+${p.day}`, level: p.level })),
  }));

  // 사진도 없고 증상도 없으면 "그날 체크인 없음"으로 간주
  const hasModalDetail =
    modalDetail && (Object.keys(modalDetail.photos ?? {}).length > 0 || (modalDetail.symptoms ?? []).length > 0);

  const modalDetailForModal = hasModalDetail
    ? {
        photos: Object.entries(modalDetail.photos).map(([angle, url]) => ({
          label: ANGLE_LABELS[angle] ?? angle,
          url,
        })),
        symptoms: modalDetail.symptoms.map((s) => ({ key: s.name, label: s.name, level: s.level })),
        careTags: [
          ...modalDetail.tasks_done.map((t) => `${t.name} · ${t.done_count}회`),
          ...modalDetail.tasks_missing.map((t) => `${t.name} · ${t.done_count}/${t.times_per_day}회`),
        ],
      }
    : null;

  return (
    <HomeTheme bannerTitle="나란히">
      <HistoryTheme returnDDay={returnDDay} dateLabel={returnDateLabel}>
        <Calendar
          selectedDate={selectedDate}
          onSelect={handleSelectDate}
          checkinDates={checkinDates}
          minDate={surgeryDate}
          markedDate={surgeryDate}
        />
        <LegendRow>
          <LegendDot />
          <LegendText>체크인 기록이 있는 날</LegendText>
        </LegendRow>

        <ShadowBox>
          <PhotoTimelineBox photos={timelinePhotos} progressPercent={photoProgressPercent} />
        </ShadowBox>

        <ShadowBox>
          <SymptomFlowBox symptoms={timelineSymptoms} />
        </ShadowBox>
      </HistoryTheme>

      {modalDate && (
        <HistoryDayModal
          dDayLabel={modalDetail ? `D+${modalDetail.day}` : ""}
          dateLabel={formatDot(modalDate)}
          detail={modalLoading ? null : modalDetailForModal}
          onClose={() => setModalDate(null)}
        />
      )}
    </HomeTheme>
  );
};

export default History;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid ${COLORS.info};
  background: ${COLORS.text_green};
`;

const LegendText = styled.span`
  ${font("regbody")}
  color: ${COLORS.text_gray};
`;