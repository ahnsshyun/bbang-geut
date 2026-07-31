import styled from "styled-components";
import { useState } from "react";

function Guide() {

  return (
    <Wrapper>
      <AiBox>
        <AiBadge> AI가 참고하는 정보 </AiBadge>
        <PhaseText>서울피부과의원이 승인한 리쥬란 힐러 프로토콜 v2.1만 참고해요. 
          <br/>인터넷 정보·일반 상식은 사용하지 않고, 범위 밖 질문은 병원 상담으로 연결해요.</PhaseText>
      </AiBox>

      <SectionTitle>
        질문을 눌러보거나 직접 물어보세요
      </SectionTitle>

      
    </Wrapper>
  );
}

export default Guide;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 0 20px;
`;

const PhaseText = styled.div`
  font-size: 11px;
  opacity: 0.9;
  margin-top: 6px;
`;

const AiBox = styled.div`
  margin: 0 16px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: 16px;
`;

const AiBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryHover};
  margin-bottom: 6px;
`;

const SectionTitle = styled.div`
  margin: 4px 16px 0;
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSub};
`;