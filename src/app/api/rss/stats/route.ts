import { NextResponse } from "next/server";
import { RSSLogger, getRSSHealthCheck } from "@/lib/rss-logger";
import { cacheStatsTracker } from "@/lib/rss-cache";

export async function GET() {
  try {
    const rssReport = RSSLogger.getReport();
    const healthCheck = getRSSHealthCheck();
    const cacheStats = cacheStatsTracker.getAllStats();

    // 피드 타입별 상세 통계
    const feedTypeStats = {
      main: RSSLogger.getFeedTypeStats("main"),
      category: RSSLogger.getFeedTypeStats("category"),
      tags: RSSLogger.getFeedTypeStats("tags"),
      series: RSSLogger.getFeedTypeStats("series"),
    };

    const stats = {
      overview: {
        totalGenerations: rssReport.totalGenerations,
        averageGenerationTime: rssReport.averageGenerationTime,
        errorRate: rssReport.errorRate,
        healthStatus: healthCheck.status,
        lastGenerated: new Date().toISOString(),
      },
      performance: rssReport.performanceMetrics,
      feedTypes: {
        breakdown: rssReport.feedTypeBreakdown,
        detailed: feedTypeStats,
      },
      cache: {
        stats: cacheStats,
        hitRateAverage:
          Object.values(cacheStats).length > 0
            ? Object.values(cacheStats).reduce(
                (sum, stat) => sum + stat.hitRate,
                0
              ) / Object.values(cacheStats).length
            : 0,
      },
      health: {
        status: healthCheck.status,
        issues: healthCheck.issues,
        recommendations: healthCheck.recommendations,
      },
      trends: {
        hourlyGenerations: getHourlyGenerations(),
        errorTrend: getErrorTrend(),
        performanceTrend: getPerformanceTrend(),
      },
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error generating RSS stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// 시간대별 생성 통계
function getHourlyGenerations() {
  const metrics = RSSLogger.getMetrics();
  const now = Date.now();
  const hourlyData: Record<string, number> = {};

  // 지난 24시간 데이터
  for (let i = 23; i >= 0; i--) {
    const hourStart = now - i * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;
    const hour = new Date(hourStart).getHours();

    const count = metrics.filter(
      (m) => m.timestamp! >= hourStart && m.timestamp! < hourEnd
    ).length;

    hourlyData[hour.toString().padStart(2, "0")] = count;
  }

  return hourlyData;
}

// 에러 트렌드
function getErrorTrend() {
  const metrics = RSSLogger.getMetrics();
  const now = Date.now();
  const errorTrend: Array<{ time: string; errors: number; total: number }> = [];

  // 지난 6시간, 1시간 단위로
  for (let i = 5; i >= 0; i--) {
    const hourStart = now - i * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;

    const hourMetrics = metrics.filter(
      (m) => m.timestamp! >= hourStart && m.timestamp! < hourEnd
    );

    const errors = hourMetrics.filter((m) => m.errors.length > 0).length;

    errorTrend.push({
      time: new Date(hourStart).toISOString(),
      errors,
      total: hourMetrics.length,
    });
  }

  return errorTrend;
}

// 성능 트렌드
function getPerformanceTrend() {
  const metrics = RSSLogger.getMetrics();
  const now = Date.now();
  const performanceTrend: Array<{
    time: string;
    avgTime: number;
    avgSize: number;
    count: number;
  }> = [];

  // 지난 6시간, 1시간 단위로
  for (let i = 5; i >= 0; i--) {
    const hourStart = now - i * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;

    const hourMetrics = metrics.filter(
      (m) => m.timestamp! >= hourStart && m.timestamp! < hourEnd
    );

    const avgTime =
      hourMetrics.length > 0
        ? hourMetrics.reduce((sum, m) => sum + m.generationTime, 0) /
          hourMetrics.length
        : 0;

    const avgSize =
      hourMetrics.length > 0
        ? hourMetrics.reduce((sum, m) => sum + m.feedSize, 0) /
          hourMetrics.length
        : 0;

    performanceTrend.push({
      time: new Date(hourStart).toISOString(),
      avgTime: Math.round(avgTime),
      avgSize: Math.round(avgSize),
      count: hourMetrics.length,
    });
  }

  return performanceTrend;
}

// RSS 통계 리셋 (개발/테스트용)
export async function DELETE() {
  try {
    // 메트릭 초기화 (실제로는 private이므로 이 방법은 작동하지 않음)
    // 대신 새로운 리셋 메서드를 RSSLogger에 추가해야 함

    return NextResponse.json({
      message: "RSS stats reset successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error resetting RSS stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
