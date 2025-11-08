const axios = require("axios");
const pool = require("../../configs/db");

// KakaoMap.jsx 파일에 있는 핫스팟 목록
const hotspots = [
  { name: "강남 MICE 관광특구", code: "POI001" },
  { name: "동대문 관광특구", code: "POI002" },
  { name: "명동 관광특구", code: "POI003" },
  { name: "이태원 관광특구", code: "POI004" },
  { name: "잠실 관광특구", code: "POI005" },
  { name: "종로·청계 관광특구", code: "POI006" },
  { name: "홍대 관광특구", code: "POI007" },
  { name: "경복궁", code: "POI008" },
  { name: "광화문·덕수궁", code: "POI009" },
  { name: "보신각", code: "POI010" },
  { name: "서울 암사동 유적", code: "POI011" },
  { name: "창덕궁·종묘", code: "POI012" },
  { name: "가산디지털단지역", code: "POI013" },
  { name: "강남역", code: "POI014" },
  { name: "건대입구역", code: "POI015" },
  { name: "고덕역", code: "POI016" },
  { name: "고속터미널역", code: "POI017" },
  { name: "교대역", code: "POI018" },
  { name: "구로디지털단지역", code: "POI019" },
  { name: "구로역", code: "POI020" },
  { name: "군자역", code: "POI021" },
  { name: "대림역", code: "POI023" },
  { name: "동대문역", code: "POI024" },
  { name: "뚝섬역", code: "POI025" },
  { name: "미아사거리역", code: "POI026" },
  { name: "발산역", code: "POI027" },
  { name: "사당역", code: "POI029" },
  { name: "삼각지역", code: "POI030" },
  { name: "서울대입구역", code: "POI031" },
  { name: "서울식물원·마곡나루역", code: "POI032" },
  { name: "서울역", code: "POI033" },
  { name: "선릉역", code: "POI034" },
  { name: "성신여대입구역", code: "POI035" },
  { name: "수유역", code: "POI036" },
  { name: "신논현역·논현역", code: "POI037" },
  { name: "신도림역", code: "POI038" },
  { name: "신림역", code: "POI039" },
  { name: "신촌·이대역", code: "POI040" },
  { name: "양재역", code: "POI041" },
  { name: "역삼역", code: "POI042" },
  { name: "연신내역", code: "POI043" },
  { name: "오목교역·목동운동장", code: "POI044" },
  { name: "왕십리역", code: "POI045" },
  { name: "용산역", code: "POI046" },
  { name: "이태원역", code: "POI047" },
  { name: "장지역", code: "POI048" },
  { name: "장한평역", code: "POI049" },
  { name: "천호역", code: "POI050" },
  { name: "총신대입구(이수)역", code: "POI051" },
  { name: "충정로역", code: "POI052" },
  { name: "합정역", code: "POI053" },
  { name: "혜화역", code: "POI054" },
  { name: "홍대입구역(2호선)", code: "POI055" },
  { name: "회기역", code: "POI056" },
  { name: "가락시장", code: "POI058" },
  { name: "가로수길", code: "POI059" },
  { name: "광장(전통)시장", code: "POI060" },
  { name: "김포공항", code: "POI061" },
  { name: "노량진", code: "POI063" },
  { name: "덕수궁길·정동길", code: "POI064" },
  { name: "북촌한옥마을", code: "POI066" },
  { name: "서촌", code: "POI067" },
  { name: "성수카페거리", code: "POI068" },
  { name: "쌍문역", code: "POI070" },
  { name: "압구정로데오거리", code: "POI071" },
  { name: "여의도", code: "POI072" },
  { name: "연남동", code: "POI073" },
  { name: "영등포 타임스퀘어", code: "POI074" },
  { name: "용리단길", code: "POI076" },
  { name: "이태원 앤틱가구거리", code: "POI077" },
  { name: "인사동", code: "POI078" },
  { name: "창동 신경제 중심지", code: "POI079" },
  { name: "청담동 명품거리", code: "POI080" },
  { name: "청량리 제기동 일대 전통시장", code: "POI081" },
  { name: "해방촌·경리단길", code: "POI082" },
  { name: "DDP(동대문디자인플라자)", code: "POI083" },
  { name: "DMC(디지털미디어시티)", code: "POI084" },
  { name: "강서한강공원", code: "POI085" },
  { name: "고척돔", code: "POI086" },
  { name: "광나루한강공원", code: "POI087" },
  { name: "광화문광장", code: "POI088" },
  { name: "국립중앙박물관·용산가족공원", code: "POI089" },
  { name: "난지한강공원", code: "POI090" },
  { name: "남산공원", code: "POI091" },
  { name: "노들섬", code: "POI092" },
  { name: "뚝섬한강공원", code: "POI093" },
  { name: "망원한강공원", code: "POI094" },
  { name: "반포한강공원", code: "POI095" },
  { name: "북서울꿈의숲", code: "POI096" },
  { name: "서리풀공원·몽마르뜨공원", code: "POI098" },
  { name: "서울광장", code: "POI099" },
  { name: "서울대공원", code: "POI100" },
  { name: "서울숲공원", code: "POI101" },
  { name: "아차산", code: "POI102" },
  { name: "양화한강공원", code: "POI103" },
  { name: "어린이대공원", code: "POI104" },
  { name: "여의도한강공원", code: "POI105" },
  { name: "월드컵공원", code: "POI106" },
  { name: "응봉산", code: "POI107" },
  { name: "이촌한강공원", code: "POI108" },
  { name: "잠실종합운동장", code: "POI109" },
  { name: "잠실한강공원", code: "POI110" },
  { name: "잠원한강공원", code: "POI111" },
  { name: "청계산", code: "POI112" },
  { name: "청와대", code: "POI113" },
  { name: "북창동 먹자골목", code: "POI114" },
  { name: "남대문시장", code: "POI115" },
  { name: "익선동", code: "POI116" },
  { name: "신정네거리역", code: "POI117" },
  { name: "잠실새내역", code: "POI118" },
  { name: "잠실역", code: "POI119" },
  { name: "잠실롯데타워 일대", code: "POI120" },
  { name: "송리단길·호수단길", code: "POI121" },
  { name: "신촌 스타광장", code: "POI122" },
  { name: "보라매공원", code: "POI123" },
  { name: "서대문독립공원", code: "POI124" },
  { name: "안양천", code: "POI125" },
  { name: "여의서로", code: "POI126" },
  { name: "올림픽공원", code: "POI127" },
  { name: "홍제폭포", code: "POI128" },
];

const apiKey = process.env.SEOUL_DATA_API_KEY;

// 헬퍼 함수: 데이터가 단일 객체일 경우 배열로 감싸줍니다.
const ensureDataArray = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

// API의 타임스탬프 문자열(YYYYMMDDHHMMSS)을 MySQL TIMESTAMP 형식으로 변환
const parseTimestamp = (ts) => {
  if (!ts || String(ts).length !== 14) return null; // 문자열로 변환하여 길이 체크
  try {
    const s = String(ts).replace(
      /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
      "$1-$2-$3 $4:$5:$6"
    );
    const date = new Date(s);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (e) {
    console.error(`Timestamp 파싱 오류: ${ts}`, e);
    return null;
  }
};

// 메인 함수
async function fetchAndSaveSeoulData() {
  console.log(
    `[${new Date().toLocaleString()}] 서울시 API 데이터 동기화 시작...`
  );
  if (!apiKey) {
    console.error("서울시 API 키가 .env 파일에 설정되지 않았습니다.");
    return;
  }

  let connection;
  try {
    connection = await pool.getConnection();
  } catch (connError) {
    console.error("DB 커넥션을 가져올 수 없습니다:", connError);
    return;
  }

  try {
    await connection.beginTransaction();

    for (const spot of hotspots) {
      const apiUrl = `http://openapi.seoul.go.kr:8088/${apiKey}/json/citydata/1/1/${spot.code}`;

      let cityData;
      let response; // ◀◀◀ 스코프 문제 해결

      try {
        response = await axios.get(apiUrl);

        // API 응답의 루트에 `SeoulRtd.citydata` 래퍼가 없으므로 바로 `CITYDATA`에 접근합니다.
        cityData = response.data?.CITYDATA;
      } catch (apiError) {
        console.error(
          `${spot.name}(${spot.code}) API 호출 오류:`,
          apiError.message
        );
        continue;
      }

      // cityData가 있는지 확인하고, 없다면 `response.data`의 RESULT 코드를 확인합니다.
      if (!cityData) {
        if (response && response.data?.RESULT?.["RESULT.CODE"] === "INFO-200") {
          console.warn(
            `${spot.name}(${spot.code}): API에 데이터가 없습니다. (INFO-200)`
          );
        } else {
          console.warn(
            `${spot.name}(${
              spot.code
            }): CITYDATA가 없습니다. API 응답 스킵. 응답:${JSON.stringify(
              response?.data
            )}`
          );
        }
        continue;
      }

      // --- 1. 주차장 정보 저장 (PRK_STTS) ---
      const parkingLots = ensureDataArray(cityData.PRK_STTS);

      if (parkingLots.length > 0) {
        for (const lot of parkingLots) {
          if (!lot.PRK_CD) continue;

          // 빈 문자열이 INT 컬럼으로 들어가려 할 때 발생하는 오류 수정
          const capacityVal = isNaN(parseInt(lot.CPCTY, 10))
            ? null
            : parseInt(lot.CPCTY, 10);
          const currentParkingVal = isNaN(parseInt(lot.CUR_PRK_CNT, 10))
            ? null
            : parseInt(lot.CUR_PRK_CNT, 10);
          const latVal = isNaN(parseFloat(lot.LAT))
            ? null
            : parseFloat(lot.LAT);
          const lngVal = isNaN(parseFloat(lot.LNG))
            ? null
            : parseFloat(lot.LNG);

          const parkingQuery = `
            INSERT INTO hotspot_parking_lots (
              prk_cd, area_cd, prk_name, prk_type, capacity, current_parking_count,
              updated_time, realtime_yn, pay_yn, rates, time_rates, add_rates, add_time_rates,
              road_address, address, lat, lng
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              area_cd = VALUES(area_cd), prk_name = VALUES(prk_name), prk_type = VALUES(prk_type),
              capacity = VALUES(capacity), current_parking_count = VALUES(current_parking_count),
              updated_time = VALUES(updated_time), realtime_yn = VALUES(realtime_yn), pay_yn = VALUES(pay_yn),
              rates = VALUES(rates), time_rates = VALUES(time_rates), add_rates = VALUES(add_rates),
              add_time_rates = VALUES(add_time_rates), road_address = VALUES(road_address),
              address = VALUES(address), lat = VALUES(lat), lng = VALUES(lng),
              last_synced_at = CURRENT_TIMESTAMP;
          `;

          const parkingValues = [
            lot.PRK_CD,
            spot.code,
            lot.PRK_NM || null,
            lot.PRK_TYPE || null,
            capacityVal,
            currentParkingVal,
            lot.CUR_PRK_TIME || null,
            lot.CUR_PRK_YN || "N",
            lot.PAY_YN || null,
            lot.RATES || null,
            lot.TIME_RATES || null,
            lot.ADD_RATES || null,
            lot.ADD_TIME_RATES || null,
            lot.ROAD_ADDR || null,
            lot.ADDRESS || null,
            latVal,
            lngVal,
          ];

          try {
            await connection.query(parkingQuery, parkingValues);
          } catch (queryError) {
            console.error(
              `주차장 정보 저장 오류 (PRK_CD: ${lot.PRK_CD}):`,
              queryError.message
            );
          }
        }
      }

      // --- 2. 전기차 충전소 정보 저장 (CHARGER_STTS) ---
      const chargerStations = ensureDataArray(cityData.CHARGER_STTS);

      if (chargerStations.length > 0) {
        for (const station of chargerStations) {
          const chargers = ensureDataArray(station.CHARGER_DETAILS);

          for (const charger of chargers) {
            if (!charger.CHARGER_ID || !station.STAT_ID) continue;

            const coordXVal = isNaN(parseFloat(station.STAT_X))
              ? null
              : parseFloat(station.STAT_X);
            const coordYVal = isNaN(parseFloat(station.STAT_Y))
              ? null
              : parseFloat(station.STAT_Y);

            const chargerQuery = `
              INSERT INTO hotspot_ev_chargers (
                charger_id, area_cd, station_id, station_name, address, coord_x, coord_y, use_time, parking_pay,
                limit_yn, limit_detail, kind_detail, charger_type, charger_status, status_updated_at,
                last_start_at, last_end_at, now_start_at, output_capacity, method
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
                area_cd = VALUES(area_cd), station_id = VALUES(station_id), station_name = VALUES(station_name),
                address = VALUES(address), coord_x = VALUES(coord_x), coord_y = VALUES(coord_y), use_time = VALUES(use_time),
                parking_pay = VALUES(parking_pay), limit_yn = VALUES(limit_yn), limit_detail = VALUES(limit_detail),
                kind_detail = VALUES(kind_detail), charger_type = VALUES(charger_type), charger_status = VALUES(charger_status),
                status_updated_at = VALUES(status_updated_at), last_start_at = VALUES(last_start_at),
                last_end_at = VALUES(last_end_at), now_start_at = VALUES(now_start_at),
                output_capacity = VALUES(output_capacity), method = VALUES(method),
                last_synced_at = CURRENT_TIMESTAMP;
            `;

            const chargerValues = [
              charger.CHARGER_ID,
              spot.code,
              station.STAT_ID,
              station.STAT_NM || null,
              station.STAT_ADDR || null,
              coordXVal,
              coordYVal,
              station.STAT_USETIME || null,
              station.STAT_PARKPAY || null,
              station.STAT_LIMITYN || null,
              station.STAT_LIMITDETAIL || null,
              station.STAT_KINDDETAIL || null,
              charger.CHARGER_TYPE || null,
              charger.CHARGER_STAT || null,
              parseTimestamp(charger.STATUPDDT),
              parseTimestamp(charger.LASTTSDT),
              parseTimestamp(charger.LASTTEDT),
              parseTimestamp(charger.NOWTSDT),
              charger.OUTPUT || null,
              charger.METHOD || null,
            ];

            try {
              await connection.query(chargerQuery, chargerValues);
            } catch (queryError) {
              console.error(
                `충전소 정보 저장 오류 (CHARGER_ID: ${charger.CHARGER_ID}):`,
                queryError.message
              );
            }
          }
        }
      }
    } // end of for...of(hotspots)

    await connection.commit();
    console.log(
      `[${new Date().toLocaleString()}] 서울시 API 데이터 동기화 완료.`
    );
  } catch (err) {
    if (connection) {
      console.error("트랜잭션 오류 발생, 롤백합니다.", err.message);
      await connection.rollback();
    } else {
      console.error("DB 작업 중 심각한 오류 발생:", err.message);
    }
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { fetchAndSaveSeoulData };
