"use client";

import { useState } from "react";
import Image from "next/image";
import { SiGithubactions, SiTerraform } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { ImageModal } from "@/components/devlog/image-modal";

const architectureImage =
  "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e8b65eb7b59f8ce60fcada778161c482.png";

export default function CloudArchitecture() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <article className="space-y-6 text-sm leading-relaxed break-words text-foreground [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:ring-1 [&_code]:ring-inset [&_code]:ring-zinc-300 dark:[&_code]:bg-muted/50 dark:[&_code]:ring-0 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:[overflow-wrap:anywhere] [&>section+section]:border-t [&>section+section]:border-border/60 [&>section+section]:pt-6">
      <header className="space-y-3">
        <h3 className="text-lg font-semibold">클라우드 아키텍처</h3>
        <p className="text-muted-foreground">
          컨테이너 실행, 네트워크, 데이터 저장과 배포의 역할을 나누고, 서버 관리
          부담을 줄이는 방향으로 AWS 인프라를 구성했습니다. Terraform으로 각
          리소스의 설정과 연결 관계를 코드로 관리했습니다.
        </p>
      </header>

      <figure>
        <button
          type="button"
          onClick={() => setIsImageOpen(true)}
          className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border/60 bg-white p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 sm:p-4"
          aria-label="클라우드 아키텍처 다이어그램 확대"
        >
          <Image
            src={architectureImage}
            alt="Public Subnet의 ALB가 Private Subnet의 ECS Fargate로 요청을 전달하고, RDS PostgreSQL과 연결되는 구조. S3와 CloudFront는 이미지 전달을 담당하며 VPC Endpoint로 ECR, CloudWatch Logs, Secrets Manager에 접근합니다."
            width={2048}
            height={1223}
            sizes="(max-width: 768px) 100vw, 1100px"
            className="h-auto max-h-[48dvh] w-full object-contain"
          />
        </button>
      </figure>
      <ImageModal
        src={architectureImage}
        alt="한땀한땀 클라우드 아키텍처"
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
      />

      <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-muted/20 px-4">
        {[
          [
            "API 요청",
            "클라이언트 → Route 53으로 도메인 조회 → ALB → ECS Fargate → RDS",
          ],
          [
            "이미지 조회",
            "클라이언트 → CloudFront → S3 (캐시 미스 시 원본 조회)",
          ],
          [
            "배포",
            "GitHub Actions → Docker 이미지 빌드 → ECR → ECS 서비스 갱신",
          ],
        ].map(([label, flow]) => (
          <div key={label} className="space-y-3 py-3">
            <p className="font-semibold text-muted-foreground">{label}</p>
            <p>{flow}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">
          왜 컨테이너를 사용했고, 가용성과 확장성을 어떻게 고려했나?
        </h4>
        <p className="text-xs text-muted-foreground">ECS · Fargate · ALB</p>
        <p>
          NestJS 애플리케이션과 실행 환경을 Docker 이미지로 묶어, 배포할 때마다
          같은 환경에서 실행할 수 있도록 했습니다. ECS의 EC2 기반 운영에서
          Fargate로 전환해 컨테이너를 실행할 EC2 인스턴스의 관리 부담을
          줄였습니다.
        </p>
        <p>
          ALB가 태스크의 IP를 대상으로 요청을 전달하고, <code>/api/health</code>
          로 상태를 확인하도록 구성했습니다. ECS 서비스에는 롤링 업데이트 정책을
          적용해 배포 시 태스크를 교체하도록 했습니다.
        </p>
        <p>
          확장은 서버를 직접 추가하는 대신 ECS 서비스의 태스크 수를 조절하는
          방식입니다. Terraform에는 CPU 사용률 70%, 메모리 사용률 80%를 목표로
          하는 자동 확장 정책을 정의했습니다. 태스크 수 범위의 기본값은
          1~3개이며, 상시 다중 태스크를 운영하는 구성과는 구분됩니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">
          왜 네트워크를 분리했고, 외부 통신은 어떻게 처리했나?
        </h4>
        <p className="text-xs text-muted-foreground">
          VPC · Public / Private Subnet · VPC Endpoint
        </p>
        <p>
          인터넷 요청을 받는 ALB는 Public Subnet에, 애플리케이션 태스크와 RDS는
          Private Subnet에 배치했습니다. 태스크에는 공인 IP를 부여하지 않고,
          애플리케이션 포트는 ALB의 보안 그룹에서 오는 요청을 허용하도록
          구성했습니다.
        </p>
        <p>
          외부에서 들어오는 API 요청은 ALB를 거치고, 태스크에서 AWS 서비스로
          나가는 통신은 VPC Endpoint로 분리했습니다. S3는 Gateway Endpoint를,
          ECR API/DKR·CloudWatch Logs·Secrets Manager는 Interface Endpoint를
          사용해 이미지 다운로드, 로그 전송, 설정 조회에 필요한 경로를
          구성했습니다.
        </p>
        <p>
          이 AWS 서비스 통신이 NAT Gateway를 경유하지 않도록 구성해 NAT 의존도를
          줄였습니다. VPC Endpoint가 지원하는 서비스로 향하는 경로와, 일반 외부
          API를 호출하기 위해 필요한 인터넷 아웃바운드 경로는 별개입니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">
          왜 데이터 저장소를 분리했고, 어떤 이점이 있었나?
        </h4>
        <p className="text-xs text-muted-foreground">
          RDS PostgreSQL · S3 · CloudFront
        </p>
        <p>
          사용자, 챌린지, 게시글처럼 관계와 정합성이 중요한 데이터는 RDS
          PostgreSQL에 저장하고, 업로드한 이미지 파일은 S3에 저장하도록 역할을
          나눴습니다. 컨테이너가 교체되어도 데이터와 파일이 컨테이너의
          생명주기에 영향을 받지 않도록 했습니다.
        </p>
        <p>
          이미지 조회는 CloudFront를 통해 제공하도록 구성했습니다. 캐시된 파일은
          애플리케이션 서버를 거치지 않고 전달할 수 있어 API 처리와 파일 전달의
          부담을 분리할 수 있습니다.
        </p>
        <p>
          S3는 퍼블릭 접근을 차단하고, CloudFront의 OAC(Origin Access Control)와
          버킷 정책으로 원본 파일에 접근하도록 구성했습니다. 저장소를 분리하면서
          데이터 조회와 이미지 전달에 각각 다른 접근 정책을 적용할 수 있도록
          했습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">
          운영 설정과 로그는 어떻게 관리했나?
        </h4>
        <p className="text-xs text-muted-foreground">
          Secrets Manager · GitHub Secrets · CloudWatch
        </p>
        <p>
          Terraform에서 RDS 접속 정보를 Secrets Manager에 저장하도록
          구성했습니다. 배포 워크플로에서는 GitHub Secrets의{" "}
          <code>SERVER_ENV</code>를 읽어 ECS 태스크 정의의 환경 변수를
          갱신했습니다. 설정값의 저장 위치와 애플리케이션에 전달하는 경로를
          구분해 관리했습니다.
        </p>
        <p>
          컨테이너 로그는 <code>awslogs</code> 드라이버로 CloudWatch Logs에
          모으고, 로그 그룹의 보관 기간은 7일로 설정했습니다. 태스크가
          교체되어도 로그를 중앙에서 조회하고, 애플리케이션 오류와 배포 이후의
          동작을 확인할 수 있도록 했습니다.
        </p>
        <p>
          ECS Container Insights를 활성화해 컨테이너 리소스 상태를 확인할 수
          있도록 하고, CloudTrail로 AWS 리소스에 대한 API 호출 이력을 추적하도록
          운영 역할을 나눴습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-semibold">
          배포 자동화는 어떻게 구현했나?
        </h4>
        <p className="text-xs text-muted-foreground">
          GitHub Actions · ECR · ECS
        </p>
        <p>
          <code>main</code> 브랜치에 코드를 푸시하거나 워크플로를 수동 실행하면
          GitHub Actions가 Docker 이미지를 빌드해 ECR로 푸시하도록 구성했습니다.
          이미지에는 커밋 SHA 태그를 붙여 어떤 코드로 빌드한 버전인지 식별할 수
          있도록 했습니다.
        </p>
        <ol className="list-decimal space-y-2 pl-5 marker:text-muted-foreground">
          <li>코드 체크아웃 및 AWS 인증, ECR 로그인</li>
          <li>Docker 이미지 빌드 후 커밋 SHA 태그로 ECR에 푸시</li>
          <li>현재 태스크 정의를 가져와 환경 변수와 새 이미지 URI 반영</li>
          <li>새 태스크 정의를 등록하고 ECS 서비스 업데이트</li>
          <li>서비스가 안정 상태에 도달할 때까지 워크플로에서 대기</li>
        </ol>
        <p>
          이미지 빌드부터 ECS 서비스 갱신까지 이어지도록 구성해, 매번 수동으로
          이미지를 교체하고 배포 명령을 실행하는 단계를 줄였습니다.
        </p>
      </section>

      <footer className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row">
        <Button variant="secondary" className="flex-1" asChild>
          <a
            href="https://github.com/SOAPFT/soapft-infra"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiTerraform className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            Terraform Code
          </a>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <a
            href="https://github.com/SOAPFT/soapft-backend/blob/main/.github/workflows/deploy.yml"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithubactions className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            deploy.yml
          </a>
        </Button>
      </footer>
    </article>
  );
}
