interface RSSMetrics {
  generationTime: number;
  postCount: number;
  feedSize: number;
  errors: string[];
  timestamp?: number;
  feedType?: string;
}

export class RSSLogger {
  private static metrics: RSSMetrics[] = [];
  private static maxMetrics = 100;

  static logGeneration(metrics: Omit<RSSMetrics, "timestamp">) {
    const metricWithTimestamp = {
      ...metrics,
      timestamp: Date.now(),
    };

    this.metrics.push(metricWithTimestamp);

    // 최근 100개 기록만 유지
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // 에러가 있으면 콘솔에 출력
    if (metrics.errors.length > 0) {
      console.error("RSS Generation Errors:", metrics.errors);
    }

    // 생성 시간이 1초 이상이면 경고
    if (metrics.generationTime > 1000) {
      console.warn(`RSS 생성 시간이 길어졌습니다: ${metrics.generationTime}ms`);
    }

    // 피드 크기가 5MB 이상이면 경고
    if (metrics.feedSize > 5 * 1024 * 1024) {
      console.warn(
        `RSS 피드 크기가 큽니다: ${(metrics.feedSize / 1024 / 1024).toFixed(
          2
        )}MB`
      );
    }
  }

  static getMetrics() {
    return this.metrics;
  }

  static getAverageGenerationTime() {
    if (this.metrics.length === 0) return 0;

    const total = this.metrics.reduce((sum, m) => sum + m.generationTime, 0);
    return Math.round(total / this.metrics.length);
  }

  static getErrorRate() {
    if (this.metrics.length === 0) return 0;

    const errorCount = this.metrics.filter((m) => m.errors.length > 0).length;
    return (errorCount / this.metrics.length) * 100;
  }

  static getReport() {
    const lastHour = Date.now() - 3600000;
    const recentMetrics = this.metrics.filter((m) => m.timestamp! > lastHour);

    return {
      totalGenerations: recentMetrics.length,
      averageGenerationTime: this.getAverageGenerationTime(),
      errorRate: this.getErrorRate(),
      averageFeedSize:
        recentMetrics.reduce((sum, m) => sum + m.feedSize, 0) /
          recentMetrics.length || 0,
      averagePostCount:
        recentMetrics.reduce((sum, m) => sum + m.postCount, 0) /
          recentMetrics.length || 0,
      feedTypeBreakdown: this.getFeedTypeBreakdown(recentMetrics),
      performanceMetrics: this.getPerformanceMetrics(recentMetrics),
    };
  }

  private static getFeedTypeBreakdown(metrics: RSSMetrics[]) {
    const breakdown: Record<string, number> = {};
    metrics.forEach((m) => {
      const type = m.feedType || "unknown";
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  }

  private static getPerformanceMetrics(metrics: RSSMetrics[]) {
    if (metrics.length === 0) return null;

    const times = metrics.map((m) => m.generationTime).sort((a, b) => a - b);
    const sizes = metrics.map((m) => m.feedSize).sort((a, b) => a - b);

    return {
      generationTime: {
        min: times[0],
        max: times[times.length - 1],
        median: times[Math.floor(times.length / 2)],
        p95: times[Math.floor(times.length * 0.95)],
      },
      feedSize: {
        min: sizes[0],
        max: sizes[sizes.length - 1],
        median: sizes[Math.floor(sizes.length / 2)],
        p95: sizes[Math.floor(sizes.length * 0.95)],
      },
    };
  }

  // 특정 피드 타입의 통계
  static getFeedTypeStats(feedType: string) {
    const typeMetrics = this.metrics.filter((m) => m.feedType === feedType);

    if (typeMetrics.length === 0) return null;

    const totalTime = typeMetrics.reduce((sum, m) => sum + m.generationTime, 0);
    const totalErrors = typeMetrics.reduce(
      (sum, m) => sum + m.errors.length,
      0
    );
    const avgSize =
      typeMetrics.reduce((sum, m) => sum + m.feedSize, 0) / typeMetrics.length;

    return {
      count: typeMetrics.length,
      averageGenerationTime: Math.round(totalTime / typeMetrics.length),
      errorCount: totalErrors,
      errorRate: (totalErrors / typeMetrics.length) * 100,
      averageSize: Math.round(avgSize),
      lastGenerated: new Date(
        Math.max(...typeMetrics.map((m) => m.timestamp!))
      ),
    };
  }
}

// RSS 생성 성능 측정 래퍼
export async function measureRSSGeneration<T>(
  feedName: string,
  feedType: string,
  generatorFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  const errors: string[] = [];
  let postCount = 0;

  try {
    const result = await generatorFn();
    const generationTime = Date.now() - startTime;

    // 결과를 문자열로 변환하여 크기 측정
    const resultString = String(result);
    const feedSize = new TextEncoder().encode(resultString).length;

    // 포스트 수 추정 (XML에서 <item> 태그 개수로 계산)
    const itemMatches = resultString.match(/<item>/g);
    postCount = itemMatches ? itemMatches.length : 0;

    RSSLogger.logGeneration({
      generationTime,
      postCount,
      feedSize,
      errors,
      feedType,
    });

    return result;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));

    RSSLogger.logGeneration({
      generationTime: Date.now() - startTime,
      postCount,
      feedSize: 0,
      errors,
      feedType,
    });

    throw error;
  }
}

// RSS 생성 건강성 체크
export function getRSSHealthCheck() {
  const metrics = RSSLogger.getMetrics();
  const report = RSSLogger.getReport();

  const health = {
    status: "healthy" as "healthy" | "warning" | "critical",
    issues: [] as string[],
    recommendations: [] as string[],
    metrics: report,
  };

  // 에러율 체크
  if (report.errorRate > 10) {
    health.status = "critical";
    health.issues.push(`높은 에러율: ${report.errorRate.toFixed(1)}%`);
    health.recommendations.push("RSS 생성 로직을 점검하세요");
  } else if (report.errorRate > 5) {
    health.status = "warning";
    health.issues.push(`에러율 주의: ${report.errorRate.toFixed(1)}%`);
  }

  // 성능 체크
  if (report.averageGenerationTime > 2000) {
    health.status = health.status === "critical" ? "critical" : "warning";
    health.issues.push(`느린 생성 시간: ${report.averageGenerationTime}ms`);
    health.recommendations.push("RSS 생성 성능을 최적화하세요");
  }

  // 피드 크기 체크
  if (report.averageFeedSize > 10 * 1024 * 1024) {
    // 10MB
    health.status = health.status === "critical" ? "critical" : "warning";
    health.issues.push(
      `큰 피드 크기: ${(report.averageFeedSize / 1024 / 1024).toFixed(2)}MB`
    );
    health.recommendations.push(
      "피드 크기를 줄이거나 페이지네이션을 고려하세요"
    );
  }

  return health;
}

// 개발 환경에서 RSS 성능 모니터링
export function startRSSMonitoring() {
  if (process.env.NODE_ENV !== "development") return;

  setInterval(() => {
    const health = getRSSHealthCheck();

    if (health.status === "critical") {
      console.error("🚨 RSS 시스템 위험:", health.issues);
    } else if (health.status === "warning") {
      console.warn("⚠️ RSS 시스템 경고:", health.issues);
    }

    if (health.recommendations.length > 0) {
      console.info("💡 RSS 개선 제안:", health.recommendations);
    }
  }, 60000); // 1분마다 체크
}
