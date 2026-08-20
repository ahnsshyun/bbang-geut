import React, { useEffect, useState } from "react";
import HomeTheme from "../components/Theme/HomeTheme";
import HistoryTheme from "../components/Theme/HistoryTheme";
import Calendar from "../components/Calendar";
import { PhotoTimelineBox, SymptomFlowBox } from "../components/Box/HistoryBox";
import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { ShadowBox } from "../components/Box/Box";
import { HistoryDayModal } from "../components/Modal/HistoryModal";
import { useLang, getCurrentLang } from "../hooks/useLang";
import { getStoredPatient } from "../api/auth";

import { getCalendar, getPhotoTimeline, getSymptomFlow, getDayDetail } from "../api/records";
import { getHome } from "../api/home";

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
  const { t } = useLang();

  // records/day의 photos는 { front: url, left: url, right: url } 형태.
  // 각도 키 → 모달에 보여줄 라벨
  const ANGLE_LABELS = { front: t("angleFront"), left: t("angleLeft"), right: t("angleRight") };

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

    const lang = getCurrentLang();

    Promise.all([
      getCalendar({ lang }),
      getPhotoTimeline({ lang }),
      getSymptomFlow({ days: 14, lang }),
      getHome({ lang }),
    ])
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

    const lang = getCurrentLang();

    getDayDetail({ date: formatKey(date), lang })
      .then((data) => setModalDetail(data))
      .catch(() => setModalDetail(null))
      .finally(() => setModalLoading(false));
  };

  if (loading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>{t("loadingRecord")}</p>
      </HomeTheme>
    );
  }

  if (error || !calendarData || !surgeryDate) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>{t("recordLoadFail")}</p>
      </HomeTheme>
    );
  }

  const checkinDates = calendarData.days.filter((d) => d.has_checkin).map((d) => parseISODate(d.date));

  const returnDDay = calendarData.return_box?.dn ?? 0;
  const returnDateLabel = calendarData.return_box?.date ? formatDot(parseISODate(calendarData.return_box.date)) : "";

  const photoItems = photoTimeline?.items ?? [];
  const maxDay = photoItems.length ? Math.max(...photoItems.map((i) => i.day)) : 0;
  const photoProgressPercent = maxDay > 0 ? Math.round((photoItems.length / (maxDay + 1)) * 100) : 0;

  const timelinePhotos = photoItems.map((item) => ({
    label: `D+${item.day}`,
    url: item.photos?.front,
  }));

  const timelineSymptoms = (symptomFlow?.terms ?? []).map((term) => ({
    key: term.key,
    label: term.name,
    days: term.points.map((p) => ({ label: `D+${p.day}`, level: p.level })),
  }));

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
          ...modalDetail.tasks_done.map((task) => `${task.name} · ${task.done_count}${t("timesUnit")}`),
          ...modalDetail.tasks_missing.map((task) => `${task.name} · ${task.done_count}/${task.times_per_day}${t("timesUnit")}`),
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
          <LegendText>{t("checkinLegend")}</LegendText>
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