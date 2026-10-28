"use client";

const comparison = [
  [
    "API 응답 조건",
    "모든 이미지의 AI 분석 완료",
    "이미지 저장 · DB 기록 · SQS 발행 완료",
  ],
  [
    "AI 분석 위치",
    "API 요청 흐름 내부 (Promise.all)",
    "SQS 이벤트로 실행되는 별도 Lambda",
  ],
  ["결과 확인 방식", "업로드 요청의 응답", "postUuid를 이용한 상태 조회 API"],
  [
    "게시글 작성 판단",
    "업로드 응답의 분석 결과",
    "상태 조회 결과에서 전체 이미지 승인 확인",
  ],
];

export default function ImageVerificationCaseStudy() {
  return (
    <article className="space-y-6 text-sm leading-relaxed break-words text-foreground [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:ring-1 [&_code]:ring-inset [&_code]:ring-zinc-300 dark:[&_code]:bg-muted/50 dark:[&_code]:ring-0 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:[overflow-wrap:anywhere] [&>section+section]:border-t [&>section+section]:border-border/60 [&>section+section]:pt-6">
      <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
        <p className="text-sm font-semibold text-muted-foreground">
          핵심 개선
        </p>
        <p className="text-[15px] font-medium leading-relaxed">
          이미지 업로드와 AI 분석을 분리해, 외부 AI의 분석 완료를 기다리지 않고
          업로드 요청에 응답하도록 개선했습니다.
        </p>
        <p className="text-[15px] font-medium leading-relaxed">
          SQS와 Lambda를 이용해 AI 분석을 비동기로 처리하고, 별도의 상태 조회 API에서
          전체 이미지의 검증 상태와 게시글 작성 가능 여부를 반환하도록 구성했습니다.
        </p>
      </div>
      <section className="space-y-3">
        <h4 className="text-base font-semibold text-foreground">배경</h4>
        <p>
          챌린지 인증 게시글을 작성하기 전에, 업로드한 이미지가 챌린지 조건에
          적합한지 Amazon Bedrock으로 검증하는 기능을 구현했습니다. 조건에 맞지
          않는 이미지로 게시글이 작성되는 것을 방지하기 위한 기능입니다.
        </p>
        <p>
          초기에는 이미지 업로드와 검증 결과 확인을 하나의 요청으로 처리하도록
          설계했습니다. 사용자가 이미지를 업로드하면{" "}
          <code>POST /api/post/precheck-images</code> 요청 안에서 S3 저장과 AI
          분석을 모두 수행했습니다.
        </p>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
          <p className="mb-3 text-sm font-semibold text-muted-foreground">
            초기 처리 흐름
          </p>
          <ol className="list-decimal space-y-1 pl-5 marker:text-[var(--project-accent)]">
            <li>클라이언트가 이미지 전송</li>
            <li>API 서버가 이미지를 S3에 저장</li>
            <li>
              <code>Promise.all</code>을 이용해 이미지별 Bedrock 분석을 병렬
              실행
            </li>
            <li>모든 이미지의 분석이 완료되면 결과 응답</li>
          </ol>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold text-foreground">문제와 고민</h4>
        <div className="space-y-3">
          <h5 className="text-[15px] font-semibold text-foreground">
            병렬로 실행해도 응답은 가장 늦은 분석을 기다린다
          </h5>
          <p>
            여러 이미지의 분석을 <code>Promise.all</code>로 병렬 실행했지만,
            HTTP 응답은 모든 분석이 완료된 이후에 반환할 수 있었습니다.
          </p>
          <p>
            이미지 저장이 끝나더라도 외부 AI의 응답이 지연되면 업로드 요청도
            함께 대기하는 구조였습니다.
          </p>
        </div>
        <div className="space-y-3">
          <h5 className="text-[15px] font-semibold text-foreground">
            병렬 처리와 요청 분리는 다른 문제였다
          </h5>
          <p>
            처음에는 이미지 분석 시간을 줄이는 데 집중했습니다. 하지만 문제의
            핵심은 분석 작업의 실행 방식이 아니라 API가 모든 분석의 완료를 응답
            조건으로 삼고 있다는 점이었습니다.
          </p>
          <p>
            <code>Promise.all</code>은 여러 비동기 작업을 병렬로 진행할 수
            있지만, 모든 작업의 결과를 기다린다는 사실은 바꾸지 못합니다.
          </p>
          <p>
            또한 Node.js가 비동기 I/O를 처리하는 동안 다른 요청을 처리할 수
            있더라도, 해당 사용자의 HTTP 요청은 여전히 완료되지 않은 상태로
            남습니다.
          </p>
        </div>
        <p>
          따라서 하나의 사용자 작업을 반드시 하나의 HTTP 요청에서 완료할 필요는
          없다고 판단했습니다.
        </p>
        <p>
          이미지 저장과 분석 작업 등록은 API 서버에서 처리하고, 시간이 걸리는 AI
          분석은 별도의 백그라운드 작업으로 분리하기로 했습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold text-foreground">해결</h4>
        <p>
          API 서버는 이미지 저장과 분석 작업 등록까지만 수행한 뒤 응답하도록
          변경했습니다. 실제 AI 분석은 SQS 메시지를 통해 별도의 Lambda에서
          처리하도록 구성했습니다.
        </p>
        <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-muted/20 px-4">
          {[
            [
              "1. 이미지 업로드 및 분석 작업 등록",
              "이미지 업로드 → S3 저장 → DB에 pending 상태 기록 → SQS 메시지 발행 → processing 응답",
            ],
            [
              "2. 백그라운드 AI 분석",
              "SQS → Lambda → Bedrock 분석 → DB 상태 갱신",
            ],
            [
              "3. 검증 결과 확인",
              "postUuid로 상태 조회 → 전체 이미지 상태 집계 → 작성 가능 여부 반환",
            ],
          ].map(([label, flow]) => (
            <div key={label} className="py-3">
              <p className="text-sm font-semibold text-muted-foreground">
                {label}
              </p>
              <p className="mt-3">{flow}</p>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <section className="space-y-3">
            <h5 className="text-[15px] font-semibold text-foreground">
              1. 검증 대기 상태 기록 및 SQS 메시지 발행
            </h5>
            <p>
              이미지를 S3에 저장한 뒤, 게시글 작성 전 업로드한 이미지들을 하나의
              검증 작업으로 묶기 위해 임시 식별자인 <code>postUuid</code>를
              생성합니다.
            </p>
            <p>
              각 이미지에 대해 <code>image_verification</code> 테이블에{" "}
              <code>pending</code> 상태의 레코드를 생성하고,
              <code>verificationId</code>, <code>postUuid</code>,{" "}
              <code>imageUrl</code>, 챌린지 정보를 SQS 메시지로 발행합니다.
            </p>
            <p>이후 AI 분석 완료를 기다리지 않고 다음 정보를 응답합니다.</p>
            <ul className="list-disc space-y-1 rounded-lg border border-border/60 bg-muted/20 py-3 pl-8 pr-4 marker:text-[15px] marker:text-[var(--project-accent)]">
              <li>
                <code>overallStatus: processing</code>
              </li>
              <li>
                <code>canCreatePost: false</code>
              </li>
              <li>
                상태 조회에 사용할 <code>postUuid</code>
              </li>
            </ul>
            <p>
              이 응답은 이미지 분석이 완료되었다는 의미가 아니라, 분석 작업이
              등록되었다는 의미입니다.
            </p>
          </section>
          <section className="space-y-3">
            <h5 className="text-[15px] font-semibold text-foreground">
              2. Lambda에서 AI 분석 및 DB 상태 갱신
            </h5>
            <p>
              SQS 이벤트를 통해 실행된 <code>image-verification</code> Lambda가
              이미지 URL에서 S3 버킷과 Key를 추출하고, <code>GetObject</code>로
              이미지를 다운로드합니다.
            </p>
            <p>
              다운로드한 이미지를 Base64로 변환한 뒤, 이미지와 챌린지 조건을
              프롬프트에 포함해 Amazon Bedrock의 Claude 3.5 Sonnet에 분석을
              요청합니다.
            </p>
            <p>
              AI 응답에서 이미지 적합 여부, 신뢰도(<code>confidence</code>),
              판단 이유, 추천 행동(<code>suggested_action</code>)을 추출하고,
              다음 기준에 따라 DB 상태를 갱신합니다.
            </p>
            <div
              className="overflow-x-auto rounded-lg border border-border/60"
              role="region"
              aria-label="AI 분석 결과에 따른 상태 결정 기준"
              tabIndex={0}
            >
              <table className="w-full text-left text-[13px] leading-relaxed">
                <caption className="sr-only">
                  AI 분석 결과에 따른 상태 결정 기준
                </caption>
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    <th scope="col" className="p-3">
                      조건
                    </th>
                    <th scope="col" className="p-3">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">
                      <code>suggested_action</code>이 <code>approve</code>
                    </td>
                    <td className="p-3">
                      <code>approved</code> (승인)
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">
                      승인이 아니고 <code>confidence &gt;= 60</code>
                    </td>
                    <td className="p-3">
                      <code>review</code> (검토 필요)
                    </td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">그 외</td>
                    <td className="p-3">
                      <code>rejected</code> (반려)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              이를 통해 API 서버의 HTTP 요청 처리와 AI 분석 작업을 분리했습니다.
            </p>
          </section>
          <section className="space-y-3">
            <h5 className="text-[15px] font-semibold text-foreground">
              3. 상태 조회 API를 통한 검증 상태 및 작성 가능 여부 제공
            </h5>
            <p>
              클라이언트는{" "}
              <code className="break-all">
                GET /api/post/verification-status/:postUuid
              </code>
              를 호출해 해당 <code>postUuid</code>에 속한 이미지들의 검증 상태를
              확인합니다.
            </p>
            <p>
              이미지 중 하나라도 <code>pending</code> 상태이면 전체 검증 상태를{" "}
              <code>processing</code>으로 반환합니다.
            </p>
            <p>
              모든 이미지가 <code>approved</code> 상태일 때만{" "}
              <code>canCreatePost: true</code>를 반환하도록 구성했습니다.
            </p>
            <p>
              검증이 완료되더라도 <code>review</code> 또는 <code>rejected</code>{" "}
              상태의 이미지가 포함되어 있으면 게시글 작성을 허용하지 않습니다.
            </p>
            <p>
              이렇게 업로드 요청과 검증 결과 확인을 분리하면서도,
              전체 이미지가 승인된 경우에만 작성 가능 상태를 반환하도록 구성했습니다.
            </p>
          </section>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold text-foreground">결과</h4>
        <p>이미지 저장과 분석 작업 등록이 완료되면 업로드 API가 응답하고, AI 분석은 Lambda에서 별도로 진행하도록 변경했습니다.</p>
        <p>
          이를 통해 업로드 요청의 완료 조건에서 외부 AI 분석을 분리했습니다.
          클라이언트는 접수 응답을 받은 후 별도 API로 검증 진행 상태와 작성 가능 여부를 확인할 수 있습니다.
        </p>
        <p>
          이 변경의 목적은 AI 분석 속도 향상이 아니라, 작업 접수와 분석 결과 확인을 서로 다른 요청으로 분리하는 것입니다.
        </p>
        <p>
          사용자는 업로드 응답을 받은 뒤 별도의 API로 검증 상태를 확인할 수
          있으며, 상태 조회 응답을 통해 전체 이미지 승인 여부와 작성 가능 여부를 확인할 수 있습니다.
        </p>
        <h5 className="text-[15px] font-semibold text-foreground">변경 전후 비교</h5>
        <div
          className="overflow-x-auto rounded-lg border border-border/60"
          role="region"
          aria-label="이미지 검증 구조 변경 전후 비교"
          tabIndex={0}
        >
          <table className="w-full min-w-[540px] text-left text-[13px] leading-relaxed">
            <caption className="sr-only">
              AI 이미지 검증의 요청과 분석 분리 전후 비교
            </caption>
            <thead className="bg-muted/30 text-muted-foreground">
              <tr>
                <th scope="col" className="p-3">
                  구분
                </th>
                <th scope="col" className="p-3">
                  변경 전 (단일 요청 처리)
                </th>
                <th scope="col" className="p-3">
                  변경 후 (비동기 분석 구조)
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([label, before, after]) => (
                <tr key={label} className="border-t border-border align-top">
                  <th scope="row" className="p-3 font-medium">
                    {label}
                  </th>
                  <td className="p-3">{before}</td>
                  <td className="p-3">{after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
