// 홈에서 가능,불가 등 상태 나타냄

import styled from "styled-components";

/**
 * status: "ok" (가능) | "caution" (주의) | "no" (불가)
 */
const STATUS_MAP = {
  ok: { label: "가능", bg: "#d1fae5", color: "#047857" },
  caution: { label: "주의", bg: "#fef3c7", color: "#b45309" },
  no: { label: "불가", bg: "#ffe4e6", color: "#e11d48" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] ?? STATUS_MAP.ok;
  return <Pill $bg={s.bg} $color={s.color}>{s.label}</Pill>;
};

export default StatusBadge;

const Pill = styled.span`
  font-size: 9px;
  font-weight: 800;
  border-radius: ${({ theme }) => theme.radius.badge};
  padding: 2px 8px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;
