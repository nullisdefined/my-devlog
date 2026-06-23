const https = require("https");
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://nullisdefined.my";
const RSS_ENDPOINTS = [
  "/feed.xml",
  "/feed/tags/JavaScript",
  "/feed/tags/TypeScript",
  "/feed/tags/NestJS",
];

// RSS 피드 요청 함수
function fetchRSSFeed(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${SITE_URL}${endpoint}`;
    console.log(`🔄 Updating RSS feed: ${url}`);

    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            console.log(`✅ Successfully updated: ${endpoint}`);
            resolve({ endpoint, success: true, size: data.length });
          } else {
            console.log(
              `❌ Failed to update: ${endpoint} (Status: ${res.statusCode})`
            );
            resolve({ endpoint, success: false, statusCode: res.statusCode });
          }
        });
      })
      .on("error", (err) => {
        console.log(`❌ Error updating: ${endpoint} - ${err.message}`);
        resolve({ endpoint, success: false, error: err.message });
      });
  });
}

// Bing에 RSS 피드 업데이트 알림
function notifyBing(feedUrl) {
  return new Promise((resolve, reject) => {
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(
      feedUrl
    )}`;

    https
      .get(pingUrl, (res) => {
        if (res.statusCode === 200) {
          console.log(`📡 Notified Bing about RSS update: ${feedUrl}`);
          resolve(true);
        } else {
          console.log(
            `⚠️ Failed to notify Bing: ${feedUrl} (Status: ${res.statusCode})`
          );
          resolve(false);
        }
      })
      .on("error", (err) => {
        console.log(`❌ Error notifying Bing: ${err.message}`);
        resolve(false);
      });
  });
}

// RSS 통계 업데이트
function updateRSSStats(results) {
  const stats = {
    timestamp: new Date().toISOString(),
    totalFeeds: results.length,
    successfulUpdates: results.filter((r) => r.success).length,
    failedUpdates: results.filter((r) => !r.success).length,
    totalSize: results.reduce((sum, r) => sum + (r.size || 0), 0),
    feeds: results,
  };

  const statsFile = path.join(__dirname, "../.rss-stats.json");

  try {
    let existingStats = [];
    if (fs.existsSync(statsFile)) {
      existingStats = JSON.parse(fs.readFileSync(statsFile, "utf8"));
    }

    existingStats.push(stats);

    // 최근 100개 기록만 유지
    if (existingStats.length > 100) {
      existingStats = existingStats.slice(-100);
    }

    fs.writeFileSync(statsFile, JSON.stringify(existingStats, null, 2));
    console.log(
      `📊 RSS stats updated: ${stats.successfulUpdates}/${stats.totalFeeds} feeds successful`
    );
  } catch (error) {
    console.log(`⚠️ Failed to update RSS stats: ${error.message}`);
  }

  return stats;
}

// 메인 실행 함수
async function updateAllRSSFeeds() {
  console.log("🚀 Starting RSS feed update process...\n");

  const startTime = Date.now();
  const results = [];

  // 모든 RSS 피드 업데이트
  for (const endpoint of RSS_ENDPOINTS) {
    const result = await fetchRSSFeed(endpoint);
    results.push(result);

    // 요청 간 간격 (너무 빠른 요청 방지)
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n📈 RSS Update Summary:");
  console.log(`✅ Successful: ${results.filter((r) => r.success).length}`);
  console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);
  console.log(`⏱️ Total time: ${Date.now() - startTime}ms\n`);

  // Google은 deprecated ping endpoint 대신 robots.txt/Search Console에서 sitemap을 발견한다.
  await notifyBing(`${SITE_URL}/feed.xml`);

  // 통계 업데이트
  const stats = updateRSSStats(results);

  console.log("🎉 RSS update process completed!\n");

  return stats;
}

// 스크립트 직접 실행 시
if (require.main === module) {
  updateAllRSSFeeds()
    .then((stats) => {
      process.exit(stats.failedUpdates > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error("💥 RSS update failed:", error);
      process.exit(1);
    });
}

module.exports = { updateAllRSSFeeds };
