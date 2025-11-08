// parking_back/src/routes/seoulApi.js
const express = require("express");
const pool = require("../../configs/db"); // DB 설정 가져오기
const router = express.Router();
const axios = require("axios"); // 'search' 라우트를 위해 남겨둠

// 기존 /parking/:spotCode 라우트를 아래 코드로 대체
router.get("/parking/:spotCode", async (req, res) => {
  const { spotCode } = req.params;

  try {
    const connection = await pool.getConnection();

    // 프론트엔드가 기대하는 CITYDATA 객체 구조를 만듭니다.
    //
    let resultData = {
      CITYDATA: {
        AREA_CD: spotCode,
        PRK_STTS: [],
        CHARGER_STTS: [],
      },
    };

    try {
      // 1. DB에서 주차장 정보 조회
      const [parkingRows] = await connection.query(
        "SELECT * FROM hotspot_parking_lots WHERE area_cd = ?",
        [spotCode]
      );

      // DB 컬럼명(snake_case)을 API 컬럼명(UPPERCASE)으로 변환
      resultData.CITYDATA.PRK_STTS = parkingRows.map((row) => ({
        PRK_CD: row.prk_cd,
        PRK_NM: row.prk_name,
        PRK_TYPE: row.prk_type,
        CPCTY: row.capacity,
        CUR_PRK_CNT: row.current_parking_count,
        CUR_PRK_TIME: row.updated_time,
        CUR_PRK_YN: row.realtime_yn,
        PAY_YN: row.pay_yn,
        RATES: row.rates,
        TIME_RATES: row.time_rates,
        ADD_RATES: row.add_rates,
        ADD_TIME_RATES: row.add_time_rates,
        ROAD_ADDR: row.road_address,
        ADDRESS: row.address,
        LAT: row.lat, // 프론트에서 이 값을 사용합니다.
        LNG: row.lng, // 프론트에서 이 값을 사용합니다.
      }));

      // 2. DB에서 전기차 충전소 정보 조회
      const [chargerRows] = await connection.query(
        "SELECT * FROM hotspot_ev_chargers WHERE area_cd = ?",
        [spotCode]
      );

      // DB에 플랫하게 저장된 충전기 목록을 충전소(STAT_ID) 기준으로 그룹화
      const stationsMap = new Map();
      chargerRows.forEach((row) => {
        // 충전소 정보가 맵에 없으면 새로 추가
        if (!stationsMap.has(row.station_id)) {
          stationsMap.set(row.station_id, {
            STAT_ID: row.station_id,
            STAT_NM: row.station_name,
            STAT_ADDR: row.address,
            STAT_X: row.coord_x,
            STAT_Y: row.coord_y,
            STAT_USETIME: row.use_time,
            STAT_PARKPAY: row.parking_pay,
            STAT_LIMITYN: row.limit_yn,
            STAT_LIMITDETAIL: row.limit_detail,
            STAT_KINDDETAIL: row.kind_detail,
            CHARGER_DETAILS: [], // 충전기 상세 목록
          });
        }

        // 해당 충전소에 충전기 상세 정보 추가
        stationsMap.get(row.station_id).CHARGER_DETAILS.push({
          CHARGER_ID: row.charger_id,
          CHARGER_TYPE: row.charger_type,
          CHARGER_STAT: row.charger_status,
          STATUPDDT: row.status_updated_at
            ? row.status_updated_at
                .toISOString()
                .replace(/[-:T.]/g, "")
                .substring(0, 14)
            : null,
          LASTTSDT: row.last_start_at
            ? row.last_start_at
                .toISOString()
                .replace(/[-:T.]/g, "")
                .substring(0, 14)
            : null,
          LASTTEDT: row.last_end_at
            ? row.last_end_at
                .toISOString()
                .replace(/[-:T.]/g, "")
                .substring(0, 14)
            : null,
          NOWTSDT: row.now_start_at
            ? row.now_start_at
                .toISOString()
                .replace(/[-:T.]/g, "")
                .substring(0, 14)
            : null,
          OUTPUT: row.output_capacity,
          METHOD: row.method,
        });
      });

      // 맵의 값들을 배열로 변환하여 최종 결과에 할당
      resultData.CITYDATA.CHARGER_STTS = Array.from(stationsMap.values());
    } finally {
      if (connection) connection.release(); // 커넥션 반환
    }

    res.json(resultData);
  } catch (error) {
    console.error("DB 조회 또는 데이터 처리 오류:", error);
    res.status(500).json({ message: "데이터를 가져오는 데 실패했습니다." });
  }
});

// '/search' 라우트는 GetParkInfo API를 사용하므로 일단 그대로 둡니다.
router.get("/search", async (req, res) => {
  const { keyword } = req.query;
  const apiKey = process.env.SEOUL_DATA_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ message: "서울시 API 키가 서버에 설정되지 않았습니다." });
  }

  const apiUrl = `http://openapi.seoul.go.kr:8088/${apiKey}/json/GetParkInfo/1/1000/`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.GetParkInfo && data.GetParkInfo.row) {
      const parkingLots = data.GetParkInfo.row;

      if (keyword) {
        const filteredLots = parkingLots.filter((lot) => {
          const name = lot.PARKING_NAME || "";
          const address = lot.ADDR || "";
          const keywordLower = keyword.toLowerCase();
          return (
            name.toLowerCase().includes(keywordLower) ||
            address.toLowerCase().includes(keywordLower)
          );
        });
        res.json({ GetParkInfo: { row: filteredLots } });
      } else {
        res.json(data);
      }
    } else {
      res.json({ GetParkInfo: { row: [] } });
    }
  } catch (error) {
    console.error("서울시 API 호출 오류:", error);
    res
      .status(500)
      .json({ message: "서울시 API에서 데이터를 가져오는 데 실패했습니다." });
  }
});

module.exports = router;
