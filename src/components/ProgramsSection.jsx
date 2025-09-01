
import React, { useState } from "react";
import ImageCarousel from "./ImageCarousel";

// 카테고리별 데이터 정의
const programData = {
  "팀빌딩": [
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b7723a53d_20250703_171624.jpg", description: "협력과 소통을 통한 창의적 문제해결" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8c7a5acbd_20231110_111637.jpg", description: "팀원들과 함께하는 협동 액티비티" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/4078269e8_1683367375089.jpg", description: "상호 신뢰를 바탕으로 한 팀워크 강화" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/fff6897cb_1751720035182.jpg", description: "즐거운 게임을 통한 팀 결속력 향상" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/dff8e2cff_1751720034847.jpg", description: "소통과 협업을 위한 팀워크 강화 프로그램" },
  ],
  "체육대회": [
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e7cbbe26d_20250514_132648.jpg", description: "대형 풍선 슬라이드로 즐기는 신나는 체육대회" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/40e35cf8a_KakaoTalk_20250120_203654813.jpg", description: "팀워크를 통한 대형 텐트 펼치기 협동 경기" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/22c65d1e3_KakaoTalk_20250723_234615658_06.png", description: "다채로운 풍선 놀이기구가 있는 체육대회" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/49addfade_20240517_093830.jpg", description: "학교 운동장에서 펼쳐지는 대규모 체육축제" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/62e0dec64_KakaoTalk_20250120_204213024_03.jpg", description: "전문 방송 시설과 함께하는 대규모 체육대회" },
  ],
  "축제": [
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f968cca7b_20240620_190346.jpg", description: "2024 문화가 흐르는 예술섬 노들 - 생동감 넘치는 축제 현장" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cae92338c_1668079384788.jpg", description: "대학교 축제 무대 - 청춘이 만나는 특별한 순간" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/778274009_1684831615151.jpg", description: "기업 이벤트 축제 - 화려한 조명과 함께하는 성대한 무대" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/747e2ac28_1747745420388.jpg", description: "야외 음악 축제 - 자연 속에서 펼쳐지는 열정의 무대" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9ee4836fb_IMG_20221125_164821_718.jpg", description: "WE ARE ONE Festival - 하나가 되는 감동의 축제" },
  ],
  "연예인행사": [
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e98c897cc_2025-08-28170412.png", description: "인기 연예인과 함께하는 토크쇼 및 팬미팅 이벤트" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/1b5009c42_2025-08-28170439.png", description: "방송인과 함께하는 기업 행사 및 브랜드 프로모션" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d78cb2d06_2025-08-28170535.png", description: "셀럽과 함께하는 특별한 파티 및 브랜드 런칭 이벤트" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/84fdef457_2025-08-28170557.png", description: "스타와 함께하는 고급스러운 VIP 만남의 시간" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/090f6189a_2025-08-28170645.png", description: "유명 연예인과 함께하는 즐거운 토크 및 소통의 시간" },
  ],
  "기업행사": [ // Renamed from "기타행사"
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/e81e23fa3_241014_Aesthein-12631.jpg", description: "AESTHEIN 브랜드 론칭 이벤트 - 참가자들과의 특별한 소통" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/471fa004a_20230511_181546.jpg", description: "야외 무대 공연 - 대중과 함께하는 문화 행사" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7283033ce_20250228_125622.jpg", description: "EIDER CREATOR 컨퍼런스 - 크리에이터들을 위한 전문 세미나" },
    { url: "https://qtrypzzcjebvfcihiynt.co/storage/v1/object/public/base44-prod/public/65ce60098_P20211103_213830916_57291FEA-3735-4DEF-8A8D-1BBC1AB6C4BA.jpg", description: "도봉 한마음 E-Sports 대회 - 게임 토너먼트 및 방송 진행" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/482721aad_1668173608892.jpg", description: "야외 팀빌딩 활동 - 소통과 협력을 위한 그룹 액티비티" },
  ],
  "영어행사": [
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8bc78b8c6_20240830_143302.jpg", description: "베트남 부산 한국 관광 설명회 - 국제 관광 프로모션 행사" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/048a99dc2_20240906_153327.jpg", description: "UNI(Incheon) Peace Camp - 22개국 참가국과 함께하는 평화 캠프" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/01ef67076_20240928_143359.jpg", description: "우크라이나 & 몰도바 친구들 환영 행사 - 국제 문화 교류" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a1a6c1a42_20241005_155335.jpg", description: "외국인 참가자들과 함께하는 야외 국제 교류 프로그램" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/4977e2baf_1727183175710-4.jpg", description: "KDU Global Matriculation Ceremony - 국제 학생들을 위한 입학식" },
  ],
  "공식행사": [
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/62e8cdba6_20240826_184537.jpg", description: "제51기 벤처투자 전문인력 양성(V-UP) 네트워킹 디너" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/5282c3092_1703654172098.jpg", description: "2023년 대한민국 인재상 시상식 - 정부 공식 행사" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9de0408ea_KakaoTalk_20241219_141106783_01.jpg", description: "공동체문화 봉사축제 - 지역사회와 함께하는 공식 행사" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2195b33d6_.png", description: "제3회 청소년 여성능력개발원 비전 발표회 - 교육부 공식 행사" },
    { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/ce4e9d388_1.png", description: "장애인 문화예술축제 컨퍼런스 - 공공기관 주최 공식 세미나" },
  ],
};

// 요청된 순서대로 탭 배열 정의 및 "기타행사"를 "기업행사"로 변경
const tabs = ["기업행사", "연예인행사", "팀빌딩", "체육대회", "축제", "공식행사", "영어행사"];

export default function ProgramsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section id="programs" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 md:px-6">
        <div className="text-center mb-16">
          <div className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">
            OUR PROGRAMS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            모두가 주인공이 되는 특별한 경험
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            메이크원은 참여자 모두가 주인공이 되는 특별한 프로그램을 기획합니다. 
            목표와 성향에 맞는 최적의 솔루션을 만나보세요.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-200 shadow-sm'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Image Carousel Display - Mobile Optimized */}
        <div className="w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-[2/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl bg-gray-200 mx-auto">
           <ImageCarousel
              images={programData[activeTab]}
              autoPlayInterval={5000}
              className="w-full h-full"
            />
        </div>
      </div>
    </section>
  );
}
