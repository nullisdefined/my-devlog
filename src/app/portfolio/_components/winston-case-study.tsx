"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageModal } from "@/components/devlog/image-modal";

const images = [
  {
    label: "구조화 이전의 CloudWatch 로그 스트림",
    src: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/ad04a5b5f69289633c0f75d5319a4fca.png",
  },
  {
    label: "구조화 수정 후 CloudWatch 로그 스트림",
    src: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9e1f047633393eacf3afc156aff5dc31.png",
  },
  {
    label: "에러코드와 요청 URL 조건으로 조회한 CloudWatch 로그",
    src: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/8d1bde53b04c70d95243182165721d94.png",
  },
];

export default function WinstonCaseStudy() {
  const [selectedImage, setSelectedImage] = useState<
    (typeof images)[number] | null
  >(null);

  const renderImage = (image: (typeof images)[number]) => (
    <figure key={image.label} className="space-y-3">
      <button
        type="button"
        onClick={() => setSelectedImage(image)}
        aria-label={`${image.label} 이미지 확대`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--project-accent)]"
      >
        <Image
          src={image.src}
          alt={image.label}
          width={1600}
          height={900}
          sizes="(max-width: 768px) 100vw, 1100px"
          className="w-full h-auto"
        />
      </button>
      <figcaption className="text-xs text-muted-foreground">
        {image.label}
      </figcaption>
    </figure>
  );

  return (
    <article className="space-y-6 text-sm leading-relaxed break-words text-foreground [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-zinc-100 [&_:not(pre)>code]:ring-1 [&_:not(pre)>code]:ring-inset [&_:not(pre)>code]:ring-zinc-300 dark:[&_:not(pre)>code]:bg-muted/50 dark:[&_:not(pre)>code]:ring-0 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_code]:text-[0.9em] [&_code]:[overflow-wrap:anywhere] [&>section+section]:border-t [&>section+section]:border-border/60 [&>section+section]:pt-6">
      <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
        <p className="font-semibold text-muted-foreground">핵심 개선</p>
        <p className="text-[15px] font-medium leading-relaxed">
          전역 예외 필터에서 출력하는 오류 메시지와 스택 트레이스를 한 줄의 JSON으로
          기록해, Amazon CloudWatch에서 줄바꿈으로 인해 여러 로그 이벤트로
          분리되는 것을 방지했습니다.
        </p>
        <p className="text-[15px] font-medium leading-relaxed">
          또한 공통 에러코드와 요청 URL을 독립적인 JSON 필드로 구조화해, 필요한
          오류 로그를 필드 조건으로 검색할 수 있도록 변경했습니다.
        </p>
      </div>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">배경</h4>
        <p>
          백엔드에서 발생하는 오류를 일관되게 관리하기 위해 공통 에러코드와 전역 예외 필터를
          구성했습니다. 오류 발생 시 에러코드, HTTP 상태, 요청 메서드와 URL을
          기록하고, 서버 오류에는 스택 트레이스를 남겼습니다.
        </p>
        <p>
          로깅 라이브러리로는 로그 레벨과 출력 형식을 설정하고, 콘솔과 파일 등
          출력 대상에 따라 정책을 구분할 수 있는 Winston을 사용했습니다.
        </p>
        <p>
          초기에는 로컬 개발 환경을 중심으로 Nest 스타일의 텍스트 포맷을 사용했습니다.
          오류 메시지와 스택 트레이스를 여러 줄로 출력하는 방식은 터미널에서
          오류 발생 위치와 호출 경로를 파악하기에 편리했습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">문제와 고민</h4>
        <h5 className="text-[15px] font-semibold">
          하나의 오류가 여러 로그 이벤트로 분리되었다
        </h5>
        <p>
          ECS 배포 이후 CloudWatch에서 로그를 확인하면서 발생한 문제입니다.
        </p>
        <p>
          로컬 터미널에서는 하나로 읽히던 오류 메시지와 스택 트레이스가 CloudWatch에서는
          여러 로그 이벤트로 분리되었습니다. 여러 종류의 로그가 섞여 있어 같은
          오류의 내용을 연결해서 읽기 어려웠습니다.
        </p>
        <h5 className="text-[15px] font-semibold">
          공통 에러코드를 로그 검색에 활용하기 어려웠다
        </h5>
        <p>
          오류 발생 시 공통 에러코드와 요청 URL을 기록하고 있었지만, 해당 정보는
          텍스트 메시지 안에 포함되어 있었습니다.
        </p>
        <p>
          문자열 검색은 가능했지만, 특정 API에서 발생한 오류를 찾기 위해 에러코드와
          요청 URL을 각각의 필드 조건으로 지정하기는 어려웠습니다.
        </p>
        <p>
          이미 정의한 공통 에러코드를 오류 응답뿐 아니라 로그 검색에도 활용하고자 했습니다.
        </p>
        <p>
          로컬 환경에서는 사람이 읽기 편한 텍스트 출력이 유용했지만, CloudWatch에서는
          오류 메시지와 스택 트레이스를 하나의 이벤트에서 확인하고, 공통 에러코드와
          요청 URL을 기준으로 검색할 수 있는 구조가 필요하다고 판단했습니다.
        </p>
        {renderImage(images[0])}
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">해결</h4>
        <h5 className="text-[15px] font-semibold">
          1. 배포 환경의 로그를 한 줄의 JSON으로 출력
        </h5>
        <p>
          로컬 환경에서는 기존 Nest 스타일의 텍스트 포맷을 유지하고, ECS 배포
          환경에서는 Console Transport가 JSON 형식으로 로그를 출력하도록 구성했습니다.
        </p>
        <p>
          <code>winston.format.json()</code>을 적용해 <code>level</code>,{" "}
          <code>message</code>, <code>timestamp</code>와 호출부에서 전달한{" "}
          <code>context</code>를 개별 필드로 기록했습니다.
        </p>
        <p>
          JSON 직렬화 과정에서 문자열에 포함된 실제 줄바꿈은 <code>{"\\n"}</code>으로
          이스케이프됩니다. 이를 통해 스택 트레이스에 개행 문자가 포함되어 있더라도
          로그 한 건이 한 줄로 출력되도록 하였습니다.
        </p>
        <p>
          그 결과 ECS의 로그 수집 과정에서 오류 메시지와 스택 트레이스가 여러
          이벤트로 분리되는 문제를 해결할 수 있었습니다.
        </p>
        <h5 className="text-[15px] font-semibold">
          2. 문자열로 직렬화하던 오류 정보를 객체로 전달
        </h5>
        <p>
          로그 출력 형식을 JSON으로 변경한 뒤에도 에러코드와 요청 URL을 독립적인
          필드로 검색할 수 없었습니다.
        </p>
        <p>
          초기에는 오류 정보를 하나의 로그 메시지로 출력하기 위해{" "}
          <code>JSON.stringify()</code>를 사용했습니다. 객체에 담긴 에러코드,
          HTTP 상태, 요청 URL 등을 문자열로 변환하면 기존 텍스트 기반 로그에서도
          오류 정보를 한 번에 확인할 수 있었습니다.
        </p>
        <p>
          그러나 CloudWatch에서 JSON 형식으로 로그를 출력하도록 변경한 이후에는
          이러한 방식이 구조화된 검색을 제한했습니다. 최종 출력이 JSON 형식이더라도
          에러코드, HTTP 상태, 요청 URL 등이 <code>message</code> 필드 내부의
          문자열로 남아 독립적인 필드 조건으로 검색할 수 없었기 때문입니다.
        </p>
        <p>
          이를 해결하기 위해 전역 예외 필터에서 오류 정보를 문자열로 변환하지
          않고 객체 형태로 전달하도록 수정했습니다.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border/60 bg-zinc-100 p-4 dark:bg-muted/50">
          <code>
            {'// 변경 전\nthis.logger.warn(`Client Error: ${JSON.stringify(logMessage)}`);\n\n// 변경 후\nthis.logger.warn(logMessage);'}
          </code>
        </pre>
        <p>
          <code>error</code>와 <code>log</code> 호출에도 동일한 방식을 적용했습니다.
          서버 오류는 오류 정보 객체와 함께 스택 트레이스를 전달하도록 유지했습니다.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border/60 bg-zinc-100 p-4 dark:bg-muted/50">
          <code>
            {"this.logger.error(\n  logMessage,\n  exception instanceof Error ? exception.stack : undefined,\n);"}
          </code>
        </pre>
        <p>
          그 결과 에러코드, HTTP 상태, 요청 URL 등이 각각 독립적인 JSON 필드로 기록되도록 개선했습니다.
        </p>
        {renderImage(images[1])}
        <h5 className="text-[15px] font-semibold">
          3. 공통 에러코드를 검색 조건으로 활용
        </h5>
        <p>구조화된 로그를 실제 오류 검색에 활용했습니다.</p>
        <p>
          이미지 검증 상태 조회 API에서 발생한 인증 오류를 찾기 위해 공통 에러코드{" "}
          <code>AUTH_001</code>과 요청 URL을 조합한 CloudWatch Logs 필터 패턴을 사용했습니다.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border/60 bg-zinc-100 p-4 dark:bg-muted/50">
          <code>
            {'{ $.errorCode = "AUTH_001" && $.url = %/api/post/verification-status/% }'}
          </code>
        </pre>
        <p>
          에러코드가 <code>AUTH_001</code>이면서 요청 URL에{" "}
          <code>/api/post/verification-status/</code>가 포함된 로그를 조회하는 조건입니다.
        </p>
        <p>
          기존에도 문자열 검색이나 별도 파싱을 통해 로그를 찾을 수 있었지만,
          변경 후에는 에러코드와 요청 URL을 명시적인 필드 조건으로 지정할 수 있게 되었습니다.
        </p>
        {renderImage(images[2])}
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">결과</h4>
        <p>
          여러 이벤트로 분리되던 오류 메시지와 스택 트레이스를 하나의 로그
          이벤트에서 확인할 수 있도록 개선했습니다.
        </p>
        <p>
          또한 에러코드와 요청 URL을 독립적인 JSON 필드로 기록해, 특정 API에서
          발생한 오류를 필드 조건으로 조회할 수 있게 되었습니다.
        </p>
        <p>
          이를 통해 기존 공통 에러코드를 API 오류 응답뿐 아니라 로그 검색에도
          활용할 수 있도록 개선했습니다.
        </p>
      </section>
      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.label}
          isOpen={true}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </article>
  );
}
